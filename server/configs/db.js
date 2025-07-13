import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        mongoose.connection.on('connected', () => console.log('MongoDB connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/st-blog`)
    }catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
export default connectDB;