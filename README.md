# 📦 ShopUTP

> Aplicación web Full Stack para la gestión de inventario de productos, con autenticación por token y control de acceso basado en roles.

![React](https://img.shields.io/badge/React-18-14B8A6?style=flat&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-14B8A6?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-14B8A6?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-14B8A6?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-14B8A6?style=flat&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-MongoDB-14B8A6?style=flat&logo=docker&logoColor=white)

---

## 📖 Descripción

**InventarioUTP** es una aplicación web que permite administrar un inventario de productos. Los usuarios inician sesión con su correo y contraseña, y acceden a un panel protegido donde pueden consultar o gestionar los productos registrados según su rol.

El proyecto está dividido en dos aplicaciones independientes que se comunican por HTTP:

- **Backend** → un API REST construido con Node.js, Express y MongoDB.
- **Frontend** → una interfaz en React que consume ese API.

### Roles del sistema

| Rol | Permisos |
|-----|----------|
| 👑 **admin** | Ver, crear, editar y eliminar productos |
| 👤 **usuario** | Solo ver productos (acceso de lectura) |

La restricción se aplica en **dos capas**: el frontend oculta los botones de escritura, y el backend rechaza con `403 Forbidden` cualquier intento no autorizado. La seguridad real vive en el servidor.

---

## ✨ Características

- 🔐 Autenticación con **JSON Web Token (JWT)** y expiración de sesión
- 🛡️ **Autorización por roles** (admin / usuario)
- 🚧 **Rutas públicas y privadas** con redirección automática al login
- 📝 **CRUD completo** de productos desde la interfaz
- ✅ **Validación de datos** en el cliente y en el servidor
- 🔒 Contraseñas cifradas con **bcrypt** (nunca se almacenan en texto plano)
- 🚦 **Rate limiting** y cabeceras seguras con Helmet
- 💬 Mensajes de éxito y error, e indicadores de carga
- 🌙 Interfaz con tema oscuro y diseño adaptable (responsive)

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Uso |
|-----------|-----|
| React 18 | Construcción de la interfaz con componentes |
| Vite | Herramienta de build y servidor de desarrollo |
| React Router DOM | Navegación y rutas protegidas |
| Axios | Peticiones HTTP al API |
| Context API | Estado global de la sesión |
| CSS puro | Estilos y tema visual |

### Backend
| Tecnología | Uso |
|-----------|-----|
| Node.js + Express | Servidor y API REST |
| MongoDB + Mongoose | Base de datos y modelado |
| jsonwebtoken | Generación y verificación de tokens |
| bcryptjs | Cifrado de contraseñas |
| express-validator | Validación de datos de entrada |
| helmet + express-rate-limit | Seguridad HTTP |
| Docker | Contenedor para MongoDB en local |

---

## 📁 Estructura del proyecto

```
.
├── backend/                 # API REST
│   └── src/
│       ├── config/          # Conexión a MongoDB
│       ├── models/          # Esquemas Mongoose (Usuario, Producto)
│       ├── controllers/     # Lógica de negocio
│       ├── middleware/      # JWT, roles, validación, errores
│       ├── routes/          # Definición de endpoints
│       ├── seed.js          # Datos de prueba
│       └── server.js        # Punto de entrada
│
├── frontend/                # Aplicación React
│   └── src/
│       ├── components/      # Navbar, ProtectedRoute, Alert, Loading, ProductoForm
│       ├── pages/           # Home, Login, Register, Dashboard, Perfil
│       ├── services/        # Consumo del API (Axios)
│       ├── routes/          # Rutas públicas y privadas
│       ├── context/         # AuthContext (sesión global)
│       └── App.jsx
│
├── Inventario_API.postman_collection.json   # Colección de pruebas
└── README.md
```

---

## 🚀 Instalación y ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [Docker](https://www.docker.com/) (para la base de datos)

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

### 2️⃣ Levantar MongoDB con Docker

```bash
docker run -d --name mongodb-local -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=123456 \
  mongo:latest
```

> Verifica que esté corriendo con `docker ps`

### 3️⃣ Configurar y arrancar el backend

```bash
cd backend
npm install
```

Crea un archivo `.env` dentro de `backend/` con el siguiente contenido:

```env
PORT=4000
MONGODB_URI=mongodb://admin:123456@localhost:27017/inventario?authSource=admin
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES=2h
```

Carga los datos de prueba y arranca el servidor:

```bash
npm run seed     # Crea usuarios y productos de ejemplo
npm run dev      # Servidor en http://localhost:4000
```

### 4️⃣ Configurar y arrancar el frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crea un archivo `.env` dentro de `frontend/`:

```env
VITE_API_URL=http://localhost:4000/api
```

Arranca la aplicación:

```bash
npm run dev      # Aplicación en http://localhost:5173
```

---

## 🔑 Credenciales de prueba

Disponibles tras ejecutar `npm run seed`:

| Correo | Contraseña | Rol | Permisos |
|--------|-----------|-----|----------|
| `admin@demo.com` | `123456` | admin | CRUD completo |
| `usuario@demo.com` | `123456` | usuario | Solo lectura |

---

## ⚙️ Variables de entorno

### `backend/.env`

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `4000` |
| `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb://admin:123456@localhost:27017/inventario?authSource=admin` |
| `JWT_SECRET` | Clave para firmar los tokens | `una_clave_larga_y_secreta` |
| `JWT_EXPIRES` | Tiempo de validez del token | `2h` |

### `frontend/.env`

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del API | `http://localhost:4000/api` |

> ⚠️ Los archivos `.env` están en el `.gitignore` y **no deben subirse al repositorio**.

---

## 🔌 Endpoints del API

Base: `http://localhost:4000/api`

### Autenticación

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Público | Registrar un nuevo usuario |
| `POST` | `/auth/login` | Público | Iniciar sesión y obtener token |
| `GET` | `/auth/perfil` | Token | Datos del usuario autenticado |

### Productos

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| `GET` | `/productos` | Token | Listar todos los productos |
| `GET` | `/productos/:id` | Token | Obtener un producto |
| `POST` | `/productos` | Token + **admin** | Crear producto |
| `PUT` | `/productos/:id` | Token + **admin** | Actualizar producto |
| `DELETE` | `/productos/:id` | Token + **admin** | Eliminar producto |

Las rutas protegidas requieren la cabecera:

```
Authorization: Bearer <token>
```

---

## 🧪 Pruebas con Postman

1. Abre Postman → **Import** → selecciona `Inventario_API.postman_collection.json`
2. Ejecuta **Auth → Login ADMIN**. El token se guarda automáticamente en la variable `{{token}}`
3. Prueba las operaciones de **Productos**: listar, crear, actualizar, eliminar
4. Al crear un producto, copia el `_id` de la respuesta y pégalo en las URLs de actualizar y eliminar

### Verificar la autorización por roles

1. Ejecuta **Auth → Login USUARIO** (sobrescribe el token con uno de rol `usuario`)
2. Intenta **Crear producto**
3. ✅ Debe responder **`403 Forbidden`** — esto confirma que la autorización funciona

---

## 🔒 Rutas públicas y privadas

| Tipo | Rutas | Comportamiento |
|------|-------|----------------|
| **Públicas** | `/`, `/login`, `/register` | Accesibles sin iniciar sesión |
| **Privadas** | `/dashboard`, `/perfil` | Requieren sesión activa |

Las rutas privadas están envueltas por el componente `ProtectedRoute`, que consulta el contexto de autenticación. Si no hay sesión, redirige automáticamente a `/login`. Cuando el token expira, un interceptor de Axios detecta el `401`, limpia la sesión y devuelve al usuario al login.

---

## 🌐 Despliegue

> ⚠️ **Nota importante:** MongoDB corre localmente en Docker. Para desplegar en producción necesitas una base de datos accesible desde internet, como [MongoDB Atlas](https://www.mongodb.com/atlas), y actualizar la variable `MONGODB_URI`.

### Backend (Render)

1. Crea un **Web Service** conectado a este repositorio
2. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Añade las variables de entorno: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES`

### Frontend (Vercel)

1. Importa el repositorio como nuevo proyecto
2. Configura:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
3. Añade la variable: `VITE_API_URL` con la URL del backend desplegado + `/api`

---

## 🔗 Enlaces del proyecto

| Recurso | Enlace |
|---------|--------|
| 🖥️ Frontend desplegado | `[Pegar enlace]` |
| ⚙️ API desplegado | `[Pegar enlace]` |
| 📦 Repositorio | `[Pegar enlace]` |

---

## 👤 Autor

**[Tu nombre completo]**
Universidad Tecnológica de Panamá — Centro Regional de Veraguas

---

## 📄 Licencia

Proyecto desarrollado con fines académicos.
