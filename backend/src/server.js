import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { conectarDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import { manejadorErrores } from './middleware/validacion.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ---- Seguridad ----
app.use(helmet()); // cabeceras HTTP seguras
app.use(cors());   // permite el consumo desde el frontend
app.use(express.json({ limit: '10kb' })); // limita el tamano del body

// Limitador de peticiones para prevenir abuso / fuerza bruta
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // maximo de peticiones por IP en la ventana
  message: { mensaje: 'Demasiadas peticiones, intenta mas tarde' },
});
app.use('/api', limitador);

// ---- Rutas ----
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Inventario funcionando correctamente' });
});
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador central de errores (siempre al final)
app.use(manejadorErrores);

// ---- Arranque ----
conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
