import mongoose from "mongoose";

const { DEV, MONGODB_CONNECTION_STRING_DEV, MONGODB_CONNECTION_STRING_PROD } = process.env;

export function connectDatabase() {

    const mongoDBConnectionString = DEV == "0" ? MONGODB_CONNECTION_STRING_PROD : MONGODB_CONNECTION_STRING_DEV;

    try {
        mongoose.connect(mongoDBConnectionString || "");
        console.log(`Successfully connected to MongoDB ${DEV == "0" ? "production" : "development"} database!`);
    }
    
    catch (err) {
        console.error("Error connecting to MongoDB: " + err);
    }

}