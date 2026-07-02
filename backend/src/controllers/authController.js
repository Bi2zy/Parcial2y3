import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '2h' }
  );
}

// POST /api/auth/register
export async function registrar(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(409).json({ mensaje: 'El email ya esta registrado' });
    }

    // Por seguridad: el rol admin no se puede asignar libremente desde el registro publico.
    // Solo se permite 'usuario'. Los admins se crean con el seed o por otro admin.
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      rol: rol === 'admin' ? 'usuario' : (rol || 'usuario'),
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Incluimos el password explicitamente porque el modelo lo oculta por defecto
    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = generarToken(usuario);

    return res.json({
      mensaje: 'Inicio de sesion exitoso',
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/perfil (protegida)
export async function perfil(req, res) {
  const u = req.usuario;
  return res.json({
    usuario: { id: u._id, nombre: u.nombre, email: u.email, rol: u.rol },
  });
}
