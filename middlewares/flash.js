function flashMiddleware(req, res, next) {
  // Guardar un mensaje firmado en una cookie temporal para el siguiente render.
  res.flash = (type, message) => {
    res.cookie('flash', { type, message }, {
      signed: true,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10000,
      path: '/'
    });
  };

  const message = req.signedCookies?.flash;
  res.locals.flash = message || null;

  if (message) {
    res.clearCookie('flash', { path: '/' });
  }

  next();
}

module.exports = flashMiddleware;
