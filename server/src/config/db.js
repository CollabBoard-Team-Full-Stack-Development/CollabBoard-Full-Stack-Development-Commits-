const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error(
                'MONGODB_URI is not defined in the environment variables.'
            );
        }

        const conn = await mongoose.connect(mongoURI);

        console.log(
            `MongoDB connected successfully: ${conn.connection.host}`
        );

        return conn;
    } catch (error) {
        console.error(
            'MongoDB connection failed:',
            error.message
        );

        throw error;
    }
};

module.exports = connectDB;