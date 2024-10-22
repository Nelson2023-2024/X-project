import { configDotenv } from "dotenv";
import express from "express";
import { authRoutes } from "./routes/authRoutes.js";
configDotenv(); // configure the dotenv

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
