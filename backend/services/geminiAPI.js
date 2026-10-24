const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../config/logger');
const symptomDataset = require("../data/symptomDataset");

const isKeyConfigured = (key) => {
    return key && typeof key === 'string' && key.trim().length > 10 && !key.includes('your_') && !key.includes('here');
};

let genAI = null;
if (isKeyConfigured(process.env.GEMINI_API_KEY)) {
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    } catch (e) {
        logger.warn('Failed to initialize GoogleGenerativeAI client:', e.message);
    }
}

// Intelligent rule-based expansion based on disease-symptom co-occurrence
const datasetBasedExpansion = (symptom) => {
    const normalizedInput = symptom.toLowerCase().trim().replace(/\s+/g, '_');
    
    // Find all matching diseases and co-occurring symptoms
    const coOccurringCounts = {};
    let matchedDiseaseCount = 0;

    for (const [disease, symptoms] of Object.entries(symptomDataset)) {
        const hasSymptom = symptoms.some(s => 
            s.toLowerCase().includes(normalizedInput) || normalizedInput.includes(s.toLowerCase())
        );

        if (hasSymptom) {
            matchedDiseaseCount++;
            for (const s of symptoms) {
                const normS = s.toLowerCase();
                if (!normS.includes(normalizedInput) && !normalizedInput.includes(normS)) {
                    coOccurringCounts[s] = (coOccurringCounts[s] || 0) + 1;
                }
            }
        }
    }

    // Sort by frequency
    const sortedSymptoms = Object.entries(coOccurringCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([sym]) => sym);

    let options = sortedSymptoms.slice(0, 4);

    // Fallback common symptoms if no direct matches found
    if (options.length === 0) {
        const commonSymptoms = ["fatigue", "high_fever", "headache", "nausea", "cough", "body_pain"];
        options = commonSymptoms.filter(s => !s.includes(normalizedInput)).slice(0, 4);
    }

    // Format display friendly names
    const readableInput = symptom.replace(/_/g, ' ');
    const question = `Are you also experiencing any of these symptoms related to ${readableInput}?`;

    return {
        type: "multiple_choice",
        question: question,
        options: options
    };
};

exports.expandSymptom = async (symptom) => {
    if (!symptom) {
        return datasetBasedExpansion("general");
    }

    // If Gemini API is configured, try it
    if (genAI && isKeyConfigured(process.env.GEMINI_API_KEY)) {
        try {
            logger.info(`Expanding symptom with Gemini AI: ${symptom}`);
            const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME || "gemini-1.5-pro" });

            const prompt = `
You are a medical AI assistant with access to a comprehensive symptom dataset that maps diseases to their associated symptoms.
Given the initial symptom "${symptom}", use this dataset to identify related symptoms and potential diseases.
Provide a list of related symptoms or follow-up questions to narrow down the possible conditions. 
Format your response as a JSON object with the following structure:

{
  "type": "multiple_choice",
  "question": "The question to ask the user about related symptoms or to narrow down the condition",
  "options": ["related_symptom_1", "related_symptom_2", "related_symptom_3", "related_symptom_4"]
}

Ensure that your options are lowercase with underscores (e.g., "high_fever", "headache", "cough", "nausea") so they match medical feature names.
Do not include any explanatory text or markdown code fences. Only provide the raw JSON object.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
            const parsedResponse = JSON.parse(cleanedText);
            if (parsedResponse && parsedResponse.options && Array.isArray(parsedResponse.options)) {
                logger.info(`Symptom expanded successfully via Gemini: ${symptom}`);
                return parsedResponse;
            }
        } catch (error) {
            logger.warn(`Gemini API expansion failed (${error.message}). Falling back to medical dataset.`);
        }
    }

    // Fallback to dataset
    logger.info(`Using clinical dataset expansion for: ${symptom}`);
    return datasetBasedExpansion(symptom);
};

exports.checkApiHealth = async () => {
    if (!genAI || !isKeyConfigured(process.env.GEMINI_API_KEY)) {
        return false;
    }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await model.generateContent("ping");
        return true;
    } catch (error) {
        logger.debug(`Gemini health check inactive: ${error.message}`);
        return false;
    }
};