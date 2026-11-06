const Task = require('../models/Task');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const escapeRegex = require('../utils/escapeRegex');

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];

function cleanTaskData(data) {
  return {
    title: data.title.trim(),
    description: (data.description || '').trim(),
    category: (data.category || 'General').trim() || 'General',
    status: data.status || 'pending',
    dueDate: data.dueDate ? new Date(data.dueDate) : null
  };
}

async function listTasks({ user, query }) {
  const requestedPage = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 8, 1), 50);
  const search = String(query.q || '').trim().slice(0, 60);
  const status = VALID_STATUSES.includes(query.status) ? query.status : '';
  const category = String(query.category || '').trim().slice(0, 50);

  const filter = {};

  if (user.role !== 'admin') {
    filter.owner = user._id;
  }

  if (search) {
    const safeSearch = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: safeSearch }, { description: safeSearch }];
  }

  if (status) filter.status = status;
  if (category) filter.category = new RegExp(escapeRegex(category), 'i');

  const total = await Task.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(requestedPage, pages);

  const tasks = await Task.find(filter)
    .populate('owner', 'email role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return { tasks, total, page, pages, limit, search, status, category };
}

async function getTaskById(id, user) {
  const task = await Task.findById(id).populate('owner', 'email role');
  if (!task) throw new AppError('No se encontro la tarea solicitada.', 404);

  const ownerId = task.owner?._id?.toString();
  if (user.role !== 'admin' && ownerId !== user._id.toString()) {
    throw new AppError('No tienes permiso para acceder a esta tarea.', 403);
  }

  return task;
}

async function createTask(data, user) {
  const taskData = cleanTaskData(data);
  return Task.create({ ...taskData, owner: user._id });
}

async function updateTask(id, data, user) {
  const task = await getTaskById(id, user);
  task.set(cleanTaskData(data));
  await task.save();
  return task;
}

async function deleteTask(id, user) {
  const task = await getTaskById(id, user);
  await task.deleteOne();
  return task;
}

async function getAdminDashboard() {
  const [usersCount, tasksCount, latestTasks] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.find().populate('owner', 'email').sort({ createdAt: -1 }).limit(5)
  ]);

  return { usersCount, tasksCount, latestTasks };
}

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getAdminDashboard
};
