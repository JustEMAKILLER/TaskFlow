require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const flashMiddleware = require('./middlewares/flash');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Reconocer HTTPS en producción.
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// Configuración del motor EJS y del layout común a todas las páginas.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middlewares generales
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser(process.env.COOKIE_SECRET || 'solo-desarrollo-cambiar-secreto'));
app.use(flashMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

// Variables para plantillas.
app.use((req, res, next) => {
  res.locals.currentUser = null;
  res.locals.appName = 'TaskFlow';
  res.locals.formatDate = (value) => {
    if (!value) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(value));
  };
  next();
});

// Rutas
app.use('/', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/admin', adminRoutes);
app.get('/', (req, res) => res.redirect('/tasks'));

// Otros middlewares
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  const requiredVariables = ['DATABASE_URL', 'JWT_SECRET', 'COOKIE_SECRET'];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);

  if (missingVariables.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missingVariables.join(', ')}. Revisa el archivo .env.`);
  }

  await connectDB();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`TaskFlow esta funcionando en http://localhost:${port}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Importar app desde otros archivos sin iniciar otro servidor.
if (require.main === module) {
  startServer().catch((error) => {
    console.error('No se pudo iniciar TaskFlow:', error.message);
    process.exit(1);
  });
}

module.exports = app;
