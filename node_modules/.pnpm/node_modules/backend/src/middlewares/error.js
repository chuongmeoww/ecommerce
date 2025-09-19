// 404
export function notFound(req, res) {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found' });
}

// Chuẩn hóa mọi lỗi về 1 dạng JSON:
// { code, message, details?, stack? (dev) }
export function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== 'production';

  // Mongoose duplicate key
  if (err?.code === 11000) {
    return res.status(409).json({
      code: 'DUPLICATE_KEY',
      message: 'Duplicate key error',
      details: err.keyValue
    });
  }

  // Mongoose validation
  if (err?.name === 'ValidationError') {
    return res.status(400).json({
      code: 'MONGOOSE_VALIDATION_ERROR',
      message: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  const status = err.status || 500;
  const payload = {
    code: err.code || 'ERROR',
    message: err.message || 'Internal Server Error'
  };

  if (err.details) payload.details = err.details;
  if (isDev && err.stack) payload.stack = err.stack;

  console.error('[error]', err);
  res.status(status).json(payload);
}
