# Proyecto Full Stack - Inventario (Parciales Backend API REST + Frontend React)

Aplicacion web completa que cubre ambos parciales: un **API REST** (backend con MongoDB, JWT y roles) y una **aplicacion frontend en React** que lo consume. Tema: gestion de inventario de productos con autenticacion y control de acceso por roles.

## Contenido del repositorio

```
proyecto/
 ├── backend/                                 -> API REST (Node + Express + MongoDB + JWT + roles)
 ├── frontend/                                -> Aplicacion React (Vite)
 └── Inventario_API.postman_collection.json   -> Coleccion de pruebas para Postman
```

## Tema, alcance y entidades

- **Tema:** sistema de gestion de inventario de productos.
- **Roles:** `admin` (CRUD completo) y `usuario` (solo lectura).
- **Entidades:** Usuario (nombre, email, password, rol) y Producto (nombre, descripcion, precio, stock, categoria).

---

## Puesta en marcha local

Necesitas una base de datos MongoDB (se recomienda MongoDB Atlas gratis; ver backend/README.md).

**Terminal 1 - Backend:**
```bash
cd backend
npm install
# copia .env.example a .env y completa MONGODB_URI y JWT_SECRET
npm run seed     # crea usuarios y productos de prueba
npm start        # http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
# copia .env.example a .env (VITE_API_URL=http://localhost:4000/api)
npm run dev      # http://localhost:5173
```

**Credenciales de prueba:**
- admin@demo.com / 123456 (rol admin, CRUD completo)
- usuario@demo.com / 123456 (rol usuario, solo lectura)

---

## Pruebas con Postman

1. Abre Postman > **Import** > selecciona `Inventario_API.postman_collection.json`.
2. Ejecuta **Auth > Login ADMIN**. El token se guarda solo en la variable `{{token}}`.
3. Ejecuta las peticiones de **Productos**: Listar, Crear, Actualizar, Eliminar.
4. Para comprobar la **autorizacion por roles**: ejecuta **Auth > Login USUARIO** (esto sobrescribe el token con el de un usuario normal) y luego intenta **Crear producto**. Debe responder **403 Forbidden**.
5. Para probar contra el backend desplegado, cambia la variable `base_url` por la URL de Render + `/api`.

---

## Despliegue en linea

### 1. Base de datos: MongoDB Atlas

1. Crea un cluster gratuito M0 en https://www.mongodb.com/atlas.
2. Crea un usuario de base de datos (Database Access) con su contrasena.
3. En Network Access, permite la IP `0.0.0.0/0`.
4. Copia la cadena de conexion (Connect > Drivers) para usarla como `MONGODB_URI`.

### 2. Subir el codigo a GitHub

```bash
cd proyecto
git init
git add .
git commit -m "Proyecto full stack inventario con MongoDB, JWT y roles"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 3. Backend en Render

1. https://render.com > New > Web Service > conecta tu repo.
2. Configuracion:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Environment (variables):
   - `MONGODB_URI` = tu cadena de Atlas
   - `JWT_SECRET` = una clave secreta
   - `JWT_EXPIRES` = `2h`
4. Deploy. Obtienes una URL como `https://inventario-api.onrender.com`.
5. Para crear los usuarios de prueba en la base de Atlas, ejecuta el seed una vez. Puedes hacerlo localmente con el `MONGODB_URI` de Atlas en tu `.env`:
   ```bash
   cd backend
   npm run seed
   ```

### 4. Frontend en Vercel

1. https://vercel.com > Add New > Project > conecta tu repo.
2. Configuracion:
   - Root Directory: `frontend`
   - Framework Preset: Vite (automatico)
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Environment Variables:
   - `VITE_API_URL` = `https://inventario-api.onrender.com/api` (tu URL de Render + `/api`)
4. Deploy. Obtienes una URL como `https://inventario-utp.vercel.app`.

### 5. Verificacion final

1. Abre la URL del frontend.
2. Inicia sesion como admin y prueba crear/editar/eliminar productos.
3. Cierra sesion e inicia como usuario normal: veras el inventario en modo solo lectura, sin botones de accion.

---

## Como se cubren los criterios de evaluacion

### Frontend (Parcial React)

| Criterio                                       | Donde se evidencia                              |
|------------------------------------------------|-------------------------------------------------|
| Configuracion y estructura del proyecto React  | `frontend/src` (components, pages, services...) |
| Consumo correcto del API REST                  | `frontend/src/services/`                        |
| Autenticacion de usuarios                      | `AuthContext`, `Login`, token JWT               |
| Rutas publicas y privadas                      | `AppRoutes`, `ProtectedRoute`                   |
| Manejo de estado                               | Context API + useState/useEffect                |
| Formularios, validaciones y mensajes           | `ProductoForm`, `Login`, `Register`, `Alert`    |
| CRUD desde la interfaz                          | `Dashboard`                                     |
| Despliegue funcional del frontend              | Vercel                                          |
| README y orden del repositorio                 | Este archivo y READMEs por carpeta              |

### Backend (Parcial API REST)

| Criterio                                    | Donde se evidencia                          |
|---------------------------------------------|---------------------------------------------|
| Definicion del tema, alcance y entidades    | backend/README.md                           |
| Estructura del proyecto y organizacion      | `backend/src` por capas                     |
| Modelado con MongoDB/Mongoose               | `backend/src/models`                        |
| Rutas y operaciones CRUD                    | `backend/src/routes`, `controllers`         |
| Autenticacion con JWT                       | `middleware/auth.js`, `authController`      |
| Autorizacion por roles                      | `autorizar('admin')` en rutas de productos  |
| Validacion de datos y manejo de errores     | `express-validator`, `manejadorErrores`     |
| Buenas practicas de seguridad               | helmet, rate-limit, bcrypt, select:false    |
| Documentacion y pruebas                     | READMEs + coleccion Postman                 |
| Despliegue funcional                        | Render (API) + Atlas (BD)                   |
| Repositorio en GitHub                       | Instrucciones arriba                        |
