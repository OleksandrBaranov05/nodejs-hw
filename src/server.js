import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors as celebrateErrors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
app.use(logger);
app.use(cors());
app.use(express.json());

app.use(notesRoutes);

// 404
app.use(notFoundHandler);

// помилки celebrate (валідація)
app.use(celebrateErrors());

// загальний error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const start = async () => {
  await connectMongoDB();
  app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
};
start();
