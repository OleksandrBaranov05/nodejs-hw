import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();

// middleware
app.use(logger);
app.use(cors());
app.use(express.json());

// РОУТИ (без префікса у server.js)
app.use(notesRoutes);

// 404 та помилки
app.use(notFoundHandler);
app.use(errorHandler);

// спочатку конект до БД, потім стартуємо сервер
const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

start();
