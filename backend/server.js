import { configDotenv } from "dotenv";
import express from "express";
import { authRoutes } from "./routes/authRoutes.js";
import { connectMongoDB } from "./db/connect.MongoDB.js";
import cookieParser from "cookie-parser";
configDotenv(); // configure the dotenv

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectMongoDB();
});
