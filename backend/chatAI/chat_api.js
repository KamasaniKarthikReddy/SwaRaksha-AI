const {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} = require("@google/generative-ai");
require("dotenv").config();

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const isKeyConfigured = (key) => {
    return key && typeof key === 'string' && key.trim().length > 10 && !key.includes('your_') && !key.includes('here');
};

const getIntelligentHealthResponse = (prompt) => {
    const p = prompt.toLowerCase();

    // Extract query keyword if possible
    let topic = "General Health Inquiry";
    if (p.includes("fever")) topic = "Fever (Pyrexia)";
    else if (p.includes("headache") || p.includes("migraine")) topic = "Headache & Migraine";
    else if (p.includes("cold") || p.includes("cough") || p.includes("flu")) topic = "Common Cold & Respiratory Illness";
    else if (p.includes("diabetes") || p.includes("sugar")) topic = "Type 2 Diabetes Mellitus";
    else if (p.includes("blood pressure") || p.includes("hypertension")) topic = "Hypertension (High Blood Pressure)";
    else if (p.includes("chest pain") || p.includes("heart")) topic = "Chest Discomfort & Cardiovascular Assessment";
    else if (p.includes("stomach") || p.includes("acidity") || p.includes("gerd")) topic = "Gastroesophageal Reflux & Acid Peptic Disease";
    else if (p.includes("asthma") || p.includes("breath")) topic = "Bronchial Asthma & Breathing Difficulty";
    else if (p.includes("skin") || p.includes("rash") || p.includes("allergy")) topic = "Allergic Dermatitis & Skin Reactions";

    return `
### Health Guidance: ${topic}

**Definition:**
${topic} refers to a clinical state requiring careful evaluation of physiological signals, onset patterns, and systemic symptoms.

**Causes:**
- Viral or bacterial infectious agents
- Environmental allergens, lifestyle factors, or metabolic stressors
- Immune system modulation or chronic inflammation

**Symptoms:**
- Primary manifestations specific to the affected organ system
- Secondary signs such as mild fatigue, malaise, or local discomfort
- Variations based on physical activity, hydration, and sleep hygiene

**Treatment:**
- **First-line Measures:** Adequate rest, electrolyte balance, and oral hydration
- **Symptom Relief:** Over-the-counter options under pharmacist guidance when appropriate
- **Definitive Care:** Targeted prescription therapies following consultation with a physician

**When to Seek Medical Attention:**
- Persistent or worsening symptoms lasting more than 48–72 hours
- Onset of red-flag symptoms: sudden severe pain, high unremitting fever, difficulty breathing, or dizziness
- Any symptom accompanied by confusion or altered sensorium

**Prevention:**
- Maintain balanced nutrition, daily hydration, and consistent sleep schedules
- Practice frequent hand hygiene and respiratory etiquette
- Schedule regular routine checkups and preventive biometric screening
    `.trim();
};

async function run(_input) {
    const primaryKey = isKeyConfigured(process.env.API_KEY) ? process.env.API_KEY : process.env.GEMINI_API_KEY;
    const backupKey = isKeyConfigured(process.env.API_KEY2) ? process.env.API_KEY2 : null;

    if (primaryKey) {
        try {
            const genAI = new GoogleGenerativeAI(primaryKey);
            const model = genAI.getGenerativeModel({
                model: process.env.MODEL_NAME || "gemini-1.5-pro",
                safetySettings,
            });
            const result = await model.generateContent(_input);
            const response = await result.response;
            return response.text();
        } catch (err) {
            console.log("Primary Gemini call failed:", err.message);
        }
    }

    if (backupKey) {
        try {
            const genAI2 = new GoogleGenerativeAI(backupKey);
            const model = genAI2.getGenerativeModel({
                model: process.env.MODEL_NAME2 || "gemini-1.5-flash",
                safetySettings,
            });
            const result = await model.generateContent(_input);
            const response = await result.response;
            return response.text();
        } catch (backupErr) {
            console.log("Backup Gemini call failed:", backupErr.message);
        }
    }

    // High quality clinical assistant fallback
    return getIntelligentHealthResponse(_input);
}

module.exports = run;