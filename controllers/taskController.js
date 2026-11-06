const taskService = require('../services/taskService');

async function index(req, res) {
  const result = await taskService.listTasks({ user: req.user, query: req.query });
  const filtersQuery = new URLSearchParams({
    q: result.search,
    status: result.status,
    category: result.category,
    limit: String(result.limit)
  }).toString();

  return res.render('tasks/index', {
    title: req.user.role === 'admin' ? 'Todas las tareas' : 'Mis tareas',
    ...result,
    filtersQuery
  });
}

function showCreate(req, res) {
  return res.render('tasks/new', { title: 'Nueva tarea', errors: [], task: {} });
}

async function create(req, res) {
  if (req.validationErrors.length) {
    return res.status(422).render('tasks/new', {
      title: 'Nueva tarea', errors: req.validationErrors, task: req.body
    });
  }

  const task = await taskService.createTask(req.body, req.user);
  res.flash('success', 'La tarea se creo correctamente.');
  return res.redirect(`/tasks/${task._id}`);
}

async function showDetail(req, res) {
  const task = await taskService.getTaskById(req.params.id, req.user);
  return res.render('tasks/show', { title: task.title, task });
}

async function showEdit(req, res) {
  const task = await taskService.getTaskById(req.params.id, req.user);
  return res.render('tasks/edit', { title: 'Editar tarea', task, errors: [] });
}

async function update(req, res) {
  if (req.validationErrors.length) {
    const task = await taskService.getTaskById(req.params.id, req.user);
    return res.status(422).render('tasks/edit', {
      title: 'Editar tarea', task, errors: req.validationErrors, formData: req.body
    });
  }

  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  res.flash('success', 'Los cambios se guardaron correctamente.');
  return res.redirect(`/tasks/${task._id}`);
}

async function remove(req, res) {
  await taskService.deleteTask(req.params.id, req.user);
  res.flash('success', 'La tarea se elimino correctamente.');
  return res.redirect('/tasks');
}

async function adminDashboard(req, res) {
  const summary = await taskService.getAdminDashboard();
  return res.render('admin/index', { title: 'Panel de administracion', ...summary });
}

module.exports = { index, showCreate, create, showDetail, showEdit, update, remove, adminDashboard };
