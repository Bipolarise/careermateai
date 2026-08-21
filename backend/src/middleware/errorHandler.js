export function errorHandler(err, _req, res, _next) {
  if (err) {
    return res.status(500).json({ error: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}
