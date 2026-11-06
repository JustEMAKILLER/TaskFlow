const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.flash('info', 'Inicia sesion para continuar.');
    return res.redirect('/login');
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.clearCookie('token', { path: '/' });
    res.flash('error', 'La sesion no es valida o ha expirado. Vuelve a iniciar sesion.');
    return res.redirect('/login');
  }

  // Consultar a la base de datos para conocer el rol actual y comprobar que la cuenta existe.
  const user = await User.findById(payload.sub);
  if (!user) {
    res.clearCookie('token', { path: '/' });
    res.flash('error', 'La cuenta asociada a la sesion ya no existe.');
    return res.redirect('/login');
  }

  req.user = user;
  res.locals.currentUser = user;
  return next();
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('errors/error', {
      title: 'Acceso denegado',
      statusCode: 403,
      message: 'Esta seccion solo esta disponible para administradores.'
    });
  }
  return next();
}

module.exports = { protect, adminOnly };
