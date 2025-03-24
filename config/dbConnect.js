import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        mongoose.set("strictQuery",false);
        const connected = await mongoose.connect(
            "mongodb://localhost:27017/E-commerce"
        );
        console.log(`✅ MongoDB Connected: ${connected.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default dbConnect;
