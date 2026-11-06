const mongoose = require('mongoose');

async function connectDB() {
  const connection = await mongoose.connect(process.env.DATABASE_URL);
  console.log(`MongoDB conectado: ${connection.connection.host}`);
  return connection;
}

module.exports = connectDB;
