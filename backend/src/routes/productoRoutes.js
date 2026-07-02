import { Router } from 'express';
import { body } from 'express-validator';
import { listar, obtener, crear, actualizar, eliminar } from '../controllers/productoController.js';
import { proteger, autorizar } from '../middleware/auth.js';
import { validar } from '../middleware/validacion.js';

const router = Router();

// Validaciones reutilizables para crear/actualizar
const validacionesProducto = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un numero mayor o igual a 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un entero mayor o igual a 0'),
];

// Todas requieren autenticacion
router.use(proteger);

// Lectura: cualquier usuario autenticado (admin o usuario)
router.get('/', listar);
router.get('/:id', obtener);

// Escritura: solo admin (autorizacion por roles)
router.post('/', autorizar('admin'), validacionesProducto, validar, crear);
router.put('/:id', autorizar('admin'), validacionesProducto, validar, actualizar);
router.delete('/:id', autorizar('admin'), eliminar);

export default router;
