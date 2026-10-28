require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(` [FLEXI Server] Running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(` [FLEXI Server] Listening on port: http://localhost:${PORT}`);
  console.log(` [FLEXI Server] API Base: http://localhost:${PORT}/api`);
  console.log(`============================================================\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
