import { Router } from 'express';
import { body } from 'express-validator';
import { registrar, login, perfil } from '../controllers/authController.js';
import { proteger } from '../middleware/auth.js';
import { validar } from '../middleware/validacion.js';

const router = Router();

router.post(
  '/register',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
  ],
  validar,
  registrar
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contrasena es obligatoria'),
  ],
  validar,
  login
);

router.get('/perfil', proteger, perfil);

export default router;
