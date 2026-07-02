import Producto from '../models/Producto.js';

// GET /api/productos -> listar todos (cualquier usuario autenticado)
export async function listar(req, res, next) {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    return res.json(productos);
  } catch (error) {
    next(error);
  }
}

// GET /api/productos/:id -> obtener uno
export async function obtener(req, res, next) {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    return res.json(producto);
  } catch (error) {
    next(error);
  }
}

// POST /api/productos -> crear (solo admin)
export async function crear(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      creadoPor: req.usuario._id,
    });
    return res.status(201).json({ mensaje: 'Producto creado', producto });
  } catch (error) {
    next(error);
  }
}

// PUT /api/productos/:id -> actualizar (solo admin)
export async function actualizar(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, precio, stock, categoria },
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    return res.json({ mensaje: 'Producto actualizado', producto });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/productos/:id -> eliminar (solo admin)
export async function eliminar(req, res, next) {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    return res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}
