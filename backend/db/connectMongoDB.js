import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB подключен: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Ошибка подключения к mongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectMongoDB;