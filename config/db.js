import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://mihir:92201703191@cluster0.b0v4j8c.mongodb.net/leetcode", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); 
    }
};

export default  connectDB;
