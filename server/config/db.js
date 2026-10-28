const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flexi_store';
    
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if MongoDB is not running
    });

    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('\n============================================================');
    console.error(' [ERROR] FAILED TO CONNECT TO MONGODB!');
    console.error(` Error Details: ${error.message}`);
    console.error('------------------------------------------------------------');
    console.error(' Please verify that MongoDB is installed and running locally.');
    console.error(' 1. Start MongoDB Windows Service or run "mongod" in a terminal.');
    console.error(' 2. Verify connection string in server/.env (e.g. mongodb://127.0.0.1:27017/flexi_store).');
    console.error(' 3. Open MongoDB Compass and connect to mongodb://127.0.0.1:27017 to confirm.');
    console.error('============================================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;
