const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

async function registerUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError('Ya existe una cuenta registrada con ese correo.', 409);
  }

  // Generar hash con salt
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email: normalizedEmail, password: passwordHash });

  return { user, token: createToken(user) };
}

async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    throw new AppError('Correo o contrasena incorrectos.', 401);
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    throw new AppError('Correo o contrasena incorrectos.', 401);
  }

  return { user, token: createToken(user) };
}

module.exports = { registerUser, loginUser };
