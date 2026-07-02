import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Verifica el token y adjunta el usuario a la peticion
export async function proteger(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado: token no proporcionado' });
  }

  const token = header.split(' ')[1];

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    // Buscamos el usuario actual (por si fue eliminado o cambio de rol)
    const usuario = await Usuario.findById(decodificado.id);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'El usuario ya no existe' });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token invalido o expirado' });
  }
}

// Restringe el acceso segun el rol. Uso: autorizar('admin')
export function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: 'Acceso denegado: no tienes permisos para esta accion',
      });
    }
    next();
  };
}
