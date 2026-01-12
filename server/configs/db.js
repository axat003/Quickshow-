import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        const msg = 'MONGODB_URI is not defined. Set it in environment variables.';
        console.error(msg);
        throw new Error(msg);
    }

    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'));
        await mongoose.connect(`${uri}/quickshow`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Mongoose connected')
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error && error.message ? error.message : error);
        throw error;
    }
}

export default connectDB;
