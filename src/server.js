import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// auth
app.use(authRoutes);
// notes
app.use(notesRoutes);

// celebrate помилки
app.use(errors());

// 404 та 500
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

start();
