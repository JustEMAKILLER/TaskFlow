# TaskFlow

TaskFlow es una aplicación web de gestión de tareas desarrollada con Node.js, Express 5, MongoDB/Mongoose, EJS y autenticación JWT. Su estructura separa modelos, vistas, controladores, rutas, middlewares y servicios.

## Funcionalidades

- Registro e inicio de sesión con correo y contraseña.
- Hash de contraseñas con bcryptjs (algoritmo bcrypt).
- JWT almacenado en una cookie HttpOnly y verificado en rutas privadas.
- Roles `user` y `admin`.
- CRUD de tareas. Los usuarios normales solo acceden a sus tareas; el administrador puede consultar y eliminar tareas de todos.
- Vistas dinámicas EJS, layout común y partials de cabecera, pie y mensajes flash.
- Persistencia real en MongoDB.
- Paginación, búsqueda por texto y filtros por estado/categoria.
- Validación de formularios, Helmet, límite de intentos de autenticación y middleware global de errores.
- Panel de administración con resumen de usuarios y tareas.

## Tecnologías

- Node.js 24.
- Express 5, Mongoose 9, EJS.
- MongoDB Atlas o MongoDB local.
- JWT (`jsonwebtoken`) y bcrypt (`bcryptjs`).
- Helmet, express-validator, express-rate-limit.

## Requisitos previos

1. Instalar Node.js 24 LTS o una versión compatible superior.
2. Tener una base de datos MongoDB Atlas o local.
3. Tener una terminal (PowerShell en Windows sirve).

## Instalación local

```bash
npm install
```

Copia `.env.example` y crea un archivo llamado `.env` en la raíz. Completa `DATABASE_URL` y genera dos secretos diferentes para `JWT_SECRET` y `COOKIE_SECRET`.

Para generar un secreto en la terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Ejecuta el comando dos veces y copia cada resultado en una variable distinta del `.env`.

Ejemplo de variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb+srv://USUARIO:CONTRASENA@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=secreto_aleatorio_1
COOKIE_SECRET=secreto_aleatorio_2
JWT_EXPIRES_IN=1d
```

Inicia la aplicación:

```bash
npm start
```

Abre `http://localhost:3000` en el navegador. Para desarrollo con reinicio automático:

```bash
npm run dev
```

## Crear el administrador

1. Registra una cuenta desde la pagina `/register`.
2. Deten el servidor si lo tienes abierto (Ctrl + C).
3. Ejecuta el siguiente comando reemplazando el correo:

```bash
npm run make-admin -- correo@ejemplo.com
```

4. Inicia de nuevo la aplicación e inicia sesión con esa cuenta.

El formulario público nunca permite escoger el rol `admin`. Solo este comando, ejecutado por quien controla el proyecto, puede elevar el rol.

## Rutas principales

| Metodo | Ruta | Función |
|---|---|---|
| GET | `/register` | Formulario de registro |
| POST | `/register` | Crear cuenta |
| GET | `/login` | Formulario de acceso |
| POST | `/login` | Iniciar sesión y emitir JWT |
| POST | `/logout` | Cerrar sesión |
| GET | `/tasks` | Listado, paginación y filtros |
| GET | `/tasks/new` | Formulario de creación |
| POST | `/tasks` | Crear tarea |
| GET | `/tasks/:id` | Ver detalle |
| GET | `/tasks/:id/edit` | Formulario de edición |
| PUT | `/tasks/:id` | Actualizar tarea |
| DELETE | `/tasks/:id` | Eliminar tarea |
| GET | `/admin` | Panel exclusivo de administradores |

Las operaciones PUT y DELETE se envian desde formularios HTML mediante `method-override`.

## Despliegue

1. Clona el repositorio.
2. Conecta el repositorio con el servicio de despliegue.
3. Usa `npm install` como Build Command y `npm start` como Start Command.
4. Configura `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `NODE_ENV=production` y, si deseas, `JWT_EXPIRES_IN=1d` como variables de entorno.
5. Comprueba que la base de datos permite conexiones desde el servicio desplegado.
6. Despliega y abre el enlace generado.

## Estructura del proyecto

```text
TaskFlow/
├── config/             # Conexión a MongoDB
├── controllers/        # Reciben peticiones y preparan respuestas
├── middlewares/        # Autenticación, validación, flash y errores
├── models/             # Esquemas User y Task
├── routes/             # URLs y metodos HTTP
├── services/           # Reglas de negocio y acceso a modelos
├── utils/              # AppError y utilidades
├── views/              # Plantillas EJS y partials
├── public/css/         # Estilos
├── scripts/            # Herramienta para promover un administrador
├── app.js              # Configura Express y arranca el servidor
├── package.json        # Dependencias y comandos npm
├── .env.example        # Plantilla de configuración
└── README.md
```
