require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function promoteAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error('Uso: npm run make-admin -- correo@ejemplo.com');
    process.exitCode = 1;
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('Falta DATABASE_URL en el archivo .env.');
  }

  await mongoose.connect(process.env.DATABASE_URL);
  try {
    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { role: 'admin' },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.error('No existe una cuenta con ese correo. Registrala primero desde la aplicacion.');
      process.exitCode = 1;
      return;
    }

    console.log(`${user.email} ahora tiene el rol admin.`);
  } finally {
    await mongoose.disconnect();
  }
}

promoteAdmin().catch(async (error) => {
  console.error('No se pudo cambiar el rol:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
