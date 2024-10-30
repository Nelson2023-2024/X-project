import { configDotenv } from 'dotenv';
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';

import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/user.routes.js';

import { connectMongoDB } from './db/connect.MongoDB.js';
import { postRoutes } from './routes/postRoutes.js';
import { notificationsRoutes } from './routes/notifications.Route.js';

configDotenv(); // configure the dotenv'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectMongoDB();
});
