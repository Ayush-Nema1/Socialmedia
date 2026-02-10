import express from 'express';

import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";


// dotenv.config();

const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(postRoutes);
app.use(userRoutes);
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 9000; 
const start = async()=>{
    const connectDB  = await mongoose.connect("mongodb+srv://nemaayush22_db_user:asdfghjkl@socailmediareplica.5itzp4q.mongodb.net/?appName=socailmediareplica");

    app.listen(PORT,()=>{
        console.log("server is running on port 90000");
    })
}
start();
// mongodb+srv://nemaayush22_db_user:<db_password>@socailmediareplica.5itzp4q.mongodb.net/?appName=socailmediareplica