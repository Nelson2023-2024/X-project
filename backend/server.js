import { configDotenv } from "dotenv";
import express from "express";
<<<<<<< HEAD
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";

=======
>>>>>>> parent of 7f3ea18 (Finished the user profile route)
import { authRoutes } from "./routes/authRoutes.js";
import { connectMongoDB } from "./db/connect.MongoDB.js";
<<<<<<< HEAD
import { postRoutes } from "./routes/postRoutes.js";

configDotenv(); // configure the dotenv'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
=======
import cookieParser from "cookie-parser";
configDotenv(); // configure the dotenv
>>>>>>> parent of 7f3ea18 (Finished the user profile route)

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
<<<<<<< HEAD
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
=======
>>>>>>> parent of 7f3ea18 (Finished the user profile route)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectMongoDB();
});
