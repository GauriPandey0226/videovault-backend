import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI); // Debug log
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
     
    });
    console.log(
      `MongoDB connected successfully DB Host: ${connectionInstance.connection.host}, DB Name: ${DB_NAME}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;