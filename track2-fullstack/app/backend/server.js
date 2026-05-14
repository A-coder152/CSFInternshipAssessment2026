const express = require('express');
const path = require('path');
const { initDb } = require('./db');
const animalsRouter = require('./routes/animals');
const paddocksRouter = require('./routes/paddocks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/animals', animalsRouter);
app.use('/api/paddocks', paddocksRouter);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging purposes

  // Default error message and status code
  let statusCode = 500;
  let message = 'An unexpected error occurred.';
  let errors = [];

  // If it's an Express error, it might have a status code
  if (err.statusCode) {
    statusCode = err.statusCode;
  }
  if (err.message) {
    message = err.message;
  }
  // If the error object has an 'errors' array (e.g., from validation)
  if (err.errors && Array.isArray(err.errors)) {
    errors = err.errors;
  }

  res.status(statusCode).json({ message, errors });
});

initDb();

function start(port = PORT) {
  const server = app.listen(port, () => {
    const address = server.address();
    const resolvedPort = address && typeof address === 'object' ? address.port : port;
    console.log(`FarmTracker running at http://localhost:${resolvedPort}`);
  });
  return server;
}

if (require.main === module) {
  start();
}

module.exports = app;
module.exports.start = start;
