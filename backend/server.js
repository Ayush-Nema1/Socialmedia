import express from 'express';

import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(postRoutes);
app.use(userRoutes);
// app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 9000; 
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });

  } catch (error) {
    console.error("DB CONNECTION FAILED");
    console.error(error);
    process.exit(1);
  }
};
start();
// mongodb+srv://nemaayush22_db_user:<db_password>@socailmediareplica.5itzp4q.mongodb.net/?appName=socailmediareplica