require('dotenv').config();

const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const logger = require('./config/logger');
const symptomService = require('./services/symptomService');
const geminiAPI = require('./services/geminiAPI');
const corsConfig = require('./cors/corsConfig');
const { connectDB } = require('./config/database');

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: corsConfig.origin,
        credentials: true,
        methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
});

const MAX_ITERATIONS = 7;

// Initialize Database Connection
connectDB();

// Optional background health check (only active if key exists)
const healthTimer = setInterval(async () => {
    try {
        await geminiAPI.checkApiHealth();
    } catch (e) {
        // silent check
    }
}, 10 * 60 * 1000);
if (healthTimer.unref) healthTimer.unref();

io.on('connection', async (socket) => {
    logger.info('New client connected to socket');

    let currentIteration = 0;
    let collectedSymptoms = [];

    // Register new client and get clientId
    let clientId;
    try {
        clientId = await symptomService.registerClient();
        logger.info(`New client registered with ID: ${clientId}`);
        socket.emit('registered', { clientId });
    } catch (regErr) {
        logger.warn('Failed to register client model, using temporary ID:', regErr.message);
        clientId = `client-${Date.now()}`;
        socket.emit('registered', { clientId });
    }

    const processSymptom = async (symptom) => {
        try {
            if (!symptom || typeof symptom !== 'string') return;
            const cleanSymptom = symptom.trim().toLowerCase();

            // Add initial symptom
            const addResult = await symptomService.addInitialSymptom(clientId, cleanSymptom);
            if (!collectedSymptoms.includes(cleanSymptom)) {
                collectedSymptoms.push(cleanSymptom);
            }

            // Expand symptom
            const expandResult = await symptomService.expandSymptom(clientId, cleanSymptom);

            // Check if we should continue
            currentIteration++;
            const shouldContinue = currentIteration < MAX_ITERATIONS && collectedSymptoms.length < 5;

            socket.emit('symptomProcessed', {
                addedSymptom: addResult?.data || { name: cleanSymptom },
                expandedSymptoms: expandResult?.data?.expanded || {
                    type: "multiple_choice",
                    question: `Are you experiencing any other symptoms related to ${cleanSymptom}?`,
                    options: ["fever", "fatigue", "nausea", "headache"]
                },
                currentIteration,
                collectedSymptoms,
                shouldContinue
            });

            if (!shouldContinue) {
                const finalResult = await symptomService.checkFurtherSymptoms(clientId);
                socket.emit('processComplete', finalResult);
            }
        } catch (error) {
            logger.error(`Error processing symptom: ${error.message}`);
            // Send fallback data instead of hard error so UI proceeds smoothly
            socket.emit('symptomProcessed', {
                addedSymptom: { name: symptom },
                expandedSymptoms: {
                    type: "multiple_choice",
                    question: `Are you also experiencing any of these common symptoms?`,
                    options: ["chills", "fatigue", "headache", "cough"]
                },
                currentIteration: currentIteration + 1,
                collectedSymptoms: [...collectedSymptoms, symptom],
                shouldContinue: false
            });
        }
    };

    socket.on('submitSymptom', processSymptom);

    socket.on('selectSymptoms', async (selectedSymptoms) => {
        try {
            if (Array.isArray(selectedSymptoms) && selectedSymptoms.length > 0) {
                await symptomService.selectSymptoms(clientId, selectedSymptoms);
                for (const s of selectedSymptoms) {
                    if (!collectedSymptoms.includes(s)) {
                        collectedSymptoms.push(s);
                    }
                }
                processSymptom(selectedSymptoms[selectedSymptoms.length - 1]);
            }
        } catch (error) {
            logger.error(`Error selecting symptoms: ${error.message}`);
            socket.emit('error', error.message);
        }
    });

    socket.on('resetProcess', () => {
        currentIteration = 0;
        collectedSymptoms = [];
        logger.info(`Process reset for client ${clientId}`);
        socket.emit('processReset');
    });

    socket.on('disconnect', () => {
        logger.info('Client disconnected from socket');
    });
});

server.listen(port, () => {
    logger.info(`SwaRaksha Backend Server running on http://localhost:${port}`);
});