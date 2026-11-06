const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const { collectValidationErrors } = require('../middlewares/validate');

const router = express.Router();

const taskRules = [
  body('title').trim().notEmpty().withMessage('El titulo es obligatorio.').isLength({ min: 2, max: 100 }).withMessage('El titulo debe tener entre 2 y 100 caracteres.'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }).withMessage('La descripcion no puede superar los 1000 caracteres.'),
  body('category').optional({ values: 'falsy' }).trim().isLength({ max: 50 }).withMessage('La categoria no puede superar los 50 caracteres.'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Selecciona un estado valido.'),
  body('dueDate').optional({ values: 'falsy' }).isISO8601().withMessage('La fecha limite no es valida.')
];

router.use(protect);
router.get('/', taskController.index);
router.get('/new', taskController.showCreate);
router.post('/', taskRules, collectValidationErrors, taskController.create);
router.get('/:id/edit', taskController.showEdit);
router.get('/:id', taskController.showDetail);
router.put('/:id', taskRules, collectValidationErrors, taskController.update);
router.delete('/:id', taskController.remove);

module.exports = router;
