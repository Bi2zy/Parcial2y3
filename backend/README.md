# Inventario API - Backend (Parcial API REST con MongoDB, JWT y Roles)

API REST para gestion de inventario de productos. Incluye autenticacion con JWT, autorizacion por roles (admin / usuario), validacion de datos, manejo centralizado de errores y buenas practicas de seguridad. Construido con Node.js, Express y MongoDB (Mongoose).

## Definicion del tema, alcance y entidades

- **Tema:** sistema de gestion de inventario de productos.
- **Alcance:** registro e inicio de sesion de usuarios, control de acceso por roles, y administracion de productos (CRUD).
- **Entidades:**
  - **Usuario**: nombre, email, password (hasheada), rol (admin | usuario).
  - **Producto**: nombre, descripcion, precio, stock, categoria, creadoPor (referencia a Usuario).

## Tecnologias utilizadas

- Node.js (ES Modules)
- Express
- MongoDB + Mongoose
- JSON Web Token (jsonwebtoken)
- bcryptjs (hash de contrasenas)
- express-validator (validacion de datos)
- helmet (cabeceras de seguridad)
- express-rate-limit (limite de peticiones)
- CORS, dotenv

## Estructura del proyecto

```
backend/
 └── src/
      ├── config/       -> conexion a MongoDB (db.js)
      ├── models/       -> modelos Mongoose (Usuario, Producto)
      ├── controllers/  -> logica de auth y productos
      ├── middleware/   -> auth (JWT + roles) y validacion/errores
      ├── routes/       -> endpoints
      ├── seed.js       -> crea usuarios y productos de prueba
      └── server.js     -> punto de entrada
```

## Instalacion y ejecucion

```bash
cd backend
npm install
# 1. Configura la base de datos (ver Variables de entorno)
# 2. Crea los usuarios de prueba:
npm run seed
# 3. Arranca el servidor:
npm start
```

El servidor corre en `http://localhost:4000`.

## Variables de entorno

Copia `.env.example` a `.env` y completa:

```
PORT=4000
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/inventario?retryWrites=true&w=majority
JWT_SECRET=clave_secreta_parcial_2026
JWT_EXPIRES=2h
```

### Como obtener MONGODB_URI (MongoDB Atlas, gratis)

1. Crea una cuenta en https://www.mongodb.com/atlas y un cluster gratuito (M0).
2. En **Database Access**, crea un usuario con contrasena.
3. En **Network Access**, agrega la IP `0.0.0.0/0` (permite acceso desde cualquier lugar; necesario para Render).
4. En **Connect > Drivers**, copia la cadena de conexion y reemplaza usuario, password y el nombre de la base (`inventario`).

## Credenciales de prueba (tras ejecutar `npm run seed`)

- **admin@demo.com** / 123456  -> rol **admin** (puede crear, editar, eliminar)
- **usuario@demo.com** / 123456 -> rol **usuario** (solo lectura)

## Endpoints

### Autenticacion

| Metodo | Ruta               | Acceso   | Descripcion                    |
|--------|--------------------|----------|--------------------------------|
| POST   | /api/auth/register | Publico  | Registrar usuario (rol usuario)|
| POST   | /api/auth/login    | Publico  | Iniciar sesion, devuelve token |
| GET    | /api/auth/perfil   | Token    | Datos del usuario autenticado  |

### Productos

| Metodo | Ruta               | Acceso        | Descripcion         |
|--------|--------------------|---------------|---------------------|
| GET    | /api/productos     | Token         | Listar productos    |
| GET    | /api/productos/:id | Token         | Obtener un producto |
| POST   | /api/productos     | Token + admin | Crear producto      |
| PUT    | /api/productos/:id | Token + admin | Actualizar producto |
| DELETE | /api/productos/:id | Token + admin | Eliminar producto   |

Las rutas con token requieren el header `Authorization: Bearer <token>`.

## Autorizacion por roles

- La lectura de productos esta permitida a cualquier usuario autenticado.
- La escritura (crear, actualizar, eliminar) esta restringida al rol **admin** mediante el middleware `autorizar('admin')`. Un usuario normal que intente escribir recibe **403 Forbidden**.
- Por seguridad, el registro publico no permite auto-asignarse el rol admin: siempre se crea como `usuario`.

## Buenas practicas de seguridad aplicadas

- Contrasenas hasheadas con bcrypt; nunca se devuelven en las respuestas (`select: false`).
- Autenticacion con JWT firmado y con expiracion.
- Autorizacion por roles en las rutas sensibles.
- `helmet` para cabeceras HTTP seguras.
- `express-rate-limit` para mitigar fuerza bruta y abuso.
- Validacion de entrada con `express-validator` y validaciones a nivel de esquema en Mongoose.
- Limite de tamano del body y manejo centralizado de errores (sin filtrar detalles internos).

## Documentacion y pruebas

Las pruebas manuales se realizan con la coleccion de Postman incluida en la raiz del proyecto (`Inventario_API.postman_collection.json`). Ver el README principal para el paso a paso.
