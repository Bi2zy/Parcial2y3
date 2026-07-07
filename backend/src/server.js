import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { conectarDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import { manejadorErrores } from './middleware/validacion.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limitador = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { mensaje: 'Demasiadas peticiones, intenta mas tarde' },
});
app.use('/api', limitador);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de la tienda funcionando correctamente' });
});
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use(manejadorErrores);

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
