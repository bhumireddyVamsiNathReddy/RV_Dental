import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

async function testConnection() {
    try {
        console.log('🔍 Testing database connection...');

        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env.local');
        }

        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });

        console.log('✅ Database connection successful!');
        console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'N/A'}`);
        console.log(`🔗 Host: ${mongoose.connection.host}`);

        await mongoose.connection.close();
        console.log('👋 Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error);
        process.exit(1);
    }
}

testConnection();
