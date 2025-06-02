import mongoose from "mongoose";

const { MONGODB_CONNECTION_STRING } = process.env;

export function connectDatabase() {

    try {
        mongoose.connect(MONGODB_CONNECTION_STRING || "");
        console.log("Successfully connected to MongoDB!");
    }
    
    catch (err) {
        console.error("Error connecting to MongoDB: " + err);
    }

}