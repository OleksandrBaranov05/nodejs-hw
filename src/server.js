const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
require('dotenv').config();

const app = express();

// HTTP-логування (pino-http)
app.use(
  pinoHttp({
    // корисно бачити id запиту
    genReqId: (req) => req.id || undefined,
    // лаконічніший формат у проді/деві
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { translateTime: 'SYS:standard' } }
        : undefined
  })
);

// Стандартні middleware
app.use(cors());
app.use(express.json());

// --- РОУТИ ---

// GET /notes — повертає всі нотатки
app.get('/notes', (req, res) => {
  req.log.info('Retrieving all notes');
  return res.status(200).json({ message: 'Retrieved all notes' });
});

// GET /notes/:noteId — повертає нотатку за ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  req.log.info({ noteId }, 'Retrieving note by id');
  return res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// GET /test-error — імітація помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// --- 404 middleware ---
app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

// --- Error handler 500 ---
/* eslint-disable no-unused-vars */
app.use((err, req, res, _next) => {
  // лог помилки
  if (req?.log?.error) {
    req.log.error({ err }, 'Unhandled error');
  } else {
    // fallback
    // eslint-disable-next-line no-console
    console.error(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ message });
});
/* eslint-enable no-unused-vars */

// --- Старт сервера ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
