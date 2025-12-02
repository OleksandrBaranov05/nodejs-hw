import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors as celebrateErrors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// ----- global middleware -----
app.use(logger);
app.use(cors({
  origin: true,          // якщо треба, щоб кукі працювали з фронтом
  credentials: true,     // дозволяємо кукі
}));
app.use(express.json());
app.use(cookieParser());

// ----- routes -----
app.use(authRoutes);
app.use(notesRoutes);
app.use(userRoutes);

// ----- celebrate validation errors -----
app.use(celebrateErrors());

// ----- 404 & global error handler -----
app.use(notFoundHandler);
app.use(errorHandler);

// ----- start server only after DB connect -----
const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectMongoDB(); // всередині бере MONGO_URL з env
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

start();
