import { configDotenv } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/user.routes.js";

import { connectMongoDB } from "./db/connect.MongoDB.js";

configDotenv(); // configure the dotenv

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectMongoDB();
});
