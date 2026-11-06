const express = require('express');
const { body } = require('express-validator');
const { rateLimit } = require('express-rate-limit');
const authController = require('../controllers/authController');
const { collectValidationErrors } = require('../middlewares/validate');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.'
});

const registerRules = [
  body('email').trim().isEmail().withMessage('Introduce un correo electronico valido.').normalizeEmail(),
  body('password').isLength({ min: 8, max: 72 }).withMessage('La contrasena debe tener entre 8 y 72 caracteres.')
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Introduce un correo electronico valido.').normalizeEmail(),
  body('password').notEmpty().withMessage('Escribe tu contrasena.')
];

router.get('/register', authController.showRegister);
router.post('/register', authLimiter, registerRules, collectValidationErrors, authController.register);
router.get('/login', authController.showLogin);
router.post('/login', authLimiter, loginRules, collectValidationErrors, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
