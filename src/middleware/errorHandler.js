import createHttpError from 'http-errors';
const { HttpError } = createHttpError;

export const errorHandler = (err, req, res, _next) => {
  // лог за бажанням
  req?.log?.error?.(err);

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message || err.name });
  }

  // інші (не-HTTP) помилки — це 500
  return res.status(500).json({ message: err.message || 'Server error' });
};
