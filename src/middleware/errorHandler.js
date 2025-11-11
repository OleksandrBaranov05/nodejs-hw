import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
 
  req.log?.error(err);

  if (createHttpError.isHttpError(err)) {
    const status = err.status ?? err.statusCode ?? 500;
    const message = err.message || err.name || 'Error';
    return res.status(status).json({ message });
  }

  
  const message = err.message || err.name || 'Internal Server Error';
  return res.status(500).json({ message });
};
