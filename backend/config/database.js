const mongoose = require('mongoose');
const logger = require('./logger');
const User = require('../database/user');
const { v4: uuid } = require('uuid');

mongoose.set('strictQuery', false);

const seedInitialDoctors = async () => {
    try {
        const doctorCount = await User.countDocuments({ role: 'doctor' });
        if (doctorCount === 0) {
            logger.info('Seeding initial verified doctors into MongoDB...');
            const sampleDoctors = [
                {
                    role: 'doctor',
                    email: 'dr.ananya.sharma@swaraksha.org',
                    name: 'Dr. Ananya Sharma',
                    specialty: 'Cardiologist',
                    uuid: uuid(),
                    picture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
                    ip: '127.0.0.1'
                },
                {
                    role: 'doctor',
                    email: 'dr.rajesh.kumar@swaraksha.org',
                    name: 'Dr. Rajesh Kumar',
                    specialty: 'Pulmonologist & Chest Specialist',
                    uuid: uuid(),
                    picture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
                    ip: '127.0.0.1'
                },
                {
                    role: 'doctor',
                    email: 'dr.priya.patel@swaraksha.org',
                    name: 'Dr. Priya Patel',
                    specialty: 'General Physician & Internist',
                    uuid: uuid(),
                    picture: 'https://images.unsplash.com/photo-1594824813575-58532f7a0767?auto=format&fit=crop&q=80&w=300',
                    ip: '127.0.0.1'
                },
                {
                    role: 'doctor',
                    email: 'dr.vikram.verma@swaraksha.org',
                    name: 'Dr. Vikram Verma',
                    specialty: 'Neurologist',
                    uuid: uuid(),
                    picture: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
                    ip: '127.0.0.1'
                }
            ];

            await User.insertMany(sampleDoctors);
            logger.info(`Successfully seeded ${sampleDoctors.length} doctors into database.`);
        }
    } catch (seedError) {
        logger.warn('Initial doctor seeding warning:', seedError.message);
    }
};

let isConnected = false;

exports.connectDB = async () => {
    if (isConnected) return;
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/swaraksha';
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        logger.info(`Connected to MongoDB at ${mongoUri}`);
        await seedInitialDoctors();
    } catch (error) {
        logger.error('MongoDB connection error:', error.message);
    }
};