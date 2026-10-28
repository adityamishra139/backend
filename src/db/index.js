import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();

// const connectDB = async () => {
//     try {

//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log (`MongoDB connected: DB HOST: ${connectionInstance.connection.host} `)

//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         process.exit(1)
//     }
// }


// export default connectDB




const connectDB = async() => {
    try{
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDb connection establishedL: Host: ${conn.connection.host}`)
    } catch (error){
        console.log(`Error connecting to MongoDB: ${error.message}`)
        process.exit(1)
    }
        
}
export default connectDB





