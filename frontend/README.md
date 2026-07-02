# Inventario UTP - Frontend (Parcial React + API REST)

Aplicacion web construida en React que consume el API REST de inventario del parcial anterior. Implementa autenticacion de usuarios, rutas publicas y privadas, manejo de estado, formularios con validacion y operaciones CRUD sobre productos.

## Descripcion breve

El frontend permite iniciar sesion, navegar por rutas protegidas y administrar productos (listar, crear, editar y eliminar) consumiendo directamente los endpoints del backend. El token se almacena en `localStorage` y se envia automaticamente en cada peticion protegida.

## Tecnologias utilizadas

- React 18
- Vite
- React Router DOM (rutas publicas y privadas)
- Axios (consumo del API)
- Context API (manejo de estado global de autenticacion)
- CSS puro

## Estructura del proyecto

```
frontend/
 └── src/
      ├── components/   -> Navbar, ProtectedRoute, Alert, Loading, ProductoForm
      ├── pages/        -> Home, Login, Register, Dashboard, Perfil
      ├── services/     -> api.js (axios) y services (auth, productos)
      ├── routes/       -> AppRoutes.jsx (rutas publicas/privadas)
      ├── context/      -> AuthContext.jsx (sesion global)
      ├── App.jsx
      └── main.jsx
```

## Instalacion y ejecucion

```bash
cd frontend
npm install
npm run dev
```

La aplicacion corre en `http://localhost:5173`.

Para generar la version de produccion:

```bash
npm run build
npm run preview
```

## Variables de entorno

Copia `.env.example` a `.env`:

```
VITE_API_URL=http://localhost:4000/api
```

En produccion (por ejemplo Vercel), esta variable debe apuntar a la URL del backend desplegado, por ejemplo:

```
VITE_API_URL=https://inventario-api.onrender.com/api
```

## Credenciales de prueba

- **admin@demo.com** / 123456 -> rol admin (puede crear, editar y eliminar)
- **usuario@demo.com** / 123456 -> rol usuario (solo lectura)

## Control de acceso por rol en la interfaz

El frontend adapta la interfaz segun el rol del usuario autenticado (leido desde el token/sesion):
el rol se muestra en la barra de navegacion, y los botones de crear, editar y eliminar productos
solo aparecen para el rol admin. Un usuario normal ve el inventario en modo solo lectura. Esto
complementa la autorizacion del backend, que rechaza con 403 cualquier intento de escritura sin el rol adecuado.

## Rutas

### Publicas (accesibles sin sesion)

- `/` - Pagina de inicio
- `/login` - Inicio de sesion
- `/register` - Registro

### Privadas (requieren sesion iniciada)

- `/dashboard` - Gestion de productos (CRUD)
- `/perfil` - Datos del usuario

## Como se manejan las rutas publicas y privadas

Las rutas privadas estan envueltas por el componente `ProtectedRoute`. Este componente consulta el contexto de autenticacion (`AuthContext`): si el usuario no tiene una sesion activa, es redirigido automaticamente a `/login`. La sesion se determina por la presencia del token y los datos del usuario en `localStorage`, que se cargan al iniciar la aplicacion. Cuando el token expira o es invalido (respuesta 401 del API), un interceptor de axios limpia la sesion y redirige al login.

## Evidencia de consumo del API

Todo el consumo del API se centraliza en `src/services/`:

- `api.js` crea una instancia de axios con la URL base y un interceptor que agrega el token a cada peticion.
- `services/index.js` define las funciones `authService` (login, register) y `productoService` (listar, crear, actualizar, eliminar), que corresponden a los endpoints GET, POST, PUT y DELETE del backend.
