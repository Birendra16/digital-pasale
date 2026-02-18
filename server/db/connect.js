import mongoose from "mongoose";

async function Connect(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB Successfully")
    } catch(error){
        console.error("Error connecting to MongoDB:", error)
        process.exit(1);
    }
}

export default Connect;