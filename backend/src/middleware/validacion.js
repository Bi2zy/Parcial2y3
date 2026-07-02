import { validationResult } from 'express-validator';

// Revisa los errores de validacion de express-validator
export function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      mensaje: 'Error de validacion',
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
}

// Manejador central de errores (se registra al final en server.js)
export function manejadorErrores(err, req, res, next) {
  console.error(err);

  // Error de clave duplicada de Mongo (por ejemplo email repetido)
  if (err.code === 11000) {
    return res.status(409).json({ mensaje: 'El registro ya existe (dato duplicado)' });
  }

  // Errores de validacion de Mongoose
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: 'Error de validacion', errores: mensajes });
  }

  // ID con formato invalido
  if (err.name === 'CastError') {
    return res.status(400).json({ mensaje: 'ID invalido' });
  }

  return res.status(500).json({ mensaje: 'Error interno del servidor' });
}
