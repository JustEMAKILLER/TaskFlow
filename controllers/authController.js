const authService = require('../services/authService');

function setTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  });
}

function showRegister(req, res) {
  res.render('auth/register', { title: 'Crear cuenta', errors: [], formData: {} });
}

function showLogin(req, res) {
  res.render('auth/login', { title: 'Iniciar sesion', errors: [], formData: {} });
}

async function register(req, res) {
  if (req.validationErrors.length) {
    return res.status(422).render('auth/register', {
      title: 'Crear cuenta',
      errors: req.validationErrors,
      formData: { email: req.body.email }
    });
  }

  const { user, token } = await authService.registerUser(req.body);
  setTokenCookie(res, token);
  res.flash('success', `Cuenta creada. Bienvenido, ${user.email}.`);
  return res.redirect('/tasks');
}

async function login(req, res) {
  if (req.validationErrors.length) {
    return res.status(422).render('auth/login', {
      title: 'Iniciar sesion',
      errors: req.validationErrors,
      formData: { email: req.body.email }
    });
  }

  const { user, token } = await authService.loginUser(req.body);
  setTokenCookie(res, token);
  res.flash('success', 'Has iniciado sesion correctamente.');
  return res.redirect('/tasks');
}

function logout(req, res) {
  res.clearCookie('token', { path: '/' });
  res.flash('success', 'Sesion cerrada.');
  return res.redirect('/login');
}

module.exports = { showRegister, showLogin, register, login, logout };
