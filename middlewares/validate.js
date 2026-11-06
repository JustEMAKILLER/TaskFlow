const { validationResult } = require('express-validator');

function collectValidationErrors(req, res, next) {
  req.validationErrors = validationResult(req).array();
  next();
}

module.exports = { collectValidationErrors };
