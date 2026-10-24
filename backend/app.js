require('dotenv').config();
const express = require('express');
const { errorHandler } = require('./middleware/errorHandler');
const symptomRoutes = require('./routes/symptoms');
const chatRouter = require('./routes/chat');
const authRouter = require('./routes/auth');
const consultationRouter = require('./routes/consultation');
const imageToTextRouter = require('./routes/imageToText');
const cors = require("cors");
const corsConfig = require("./cors/corsConfig");
const path = require('path');

const app = express();

// Middlewares
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Root & Health Check Endpoints
app.get('/', (req, res) => {
    res.json({ message: 'SwaRakshaAI API Server is running!' });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'SwaRakshaAI Backend'
    });
});

// API Routes
app.use('/api/symptoms', symptomRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/auth', authRouter);
app.use('/api/consultation', consultationRouter);
app.use('/api/image-to-text', imageToTextRouter);

// Error handling middleware
app.use(errorHandler);

module.exports = app;