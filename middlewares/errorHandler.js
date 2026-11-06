const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`La direccion ${req.originalUrl} no existe.`, 404));
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || 'Ha ocurrido un error inesperado.';

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Ya existe un registro con esos datos.';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'El identificador proporcionado no tiene un formato valido.';
  } else if (error.name === 'ValidationError') {
    statusCode = 422;
    message = 'Los datos no cumplen las reglas definidas para guardar el registro.';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return res.status(statusCode).render('errors/error', {
    title: statusCode >= 500 ? 'Error del servidor' : 'No se pudo completar la solicitud',
    statusCode,
    message: statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Ocurrio un problema interno. Intentalo de nuevo mas tarde.'
      : message
  });
}

module.exports = { notFound, errorHandler };
