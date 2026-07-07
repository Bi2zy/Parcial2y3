import Producto from '../models/Producto.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function rutaArchivo(filename) {
  return path.join(__dirname, '../../uploads', filename);
}

export async function listar(req, res, next) {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    return res.json(productos);
  } catch (error) {
    next(error);
  }
}

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

export async function crear(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : '';
    const producto = await Producto.create({
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock) || 0,
      categoria,
      imagen,
      creadoPor: req.usuario._id,
    });
    return res.status(201).json({ mensaje: 'Producto creado', producto });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const actualizacion = { nombre, descripcion, precio: Number(precio), stock: Number(stock) || 0, categoria };

    if (req.file) {
      const existente = await Producto.findById(req.params.id);
      if (existente?.imagen) {
        const oldFile = rutaArchivo(path.basename(existente.imagen));
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }
      actualizacion.imagen = `/uploads/${req.file.filename}`;
    }

    const producto = await Producto.findByIdAndUpdate(req.params.id, actualizacion, {
      new: true,
      runValidators: true,
    });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    return res.json({ mensaje: 'Producto actualizado', producto });
  } catch (error) {
    next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    if (producto.imagen) {
      const file = rutaArchivo(path.basename(producto.imagen));
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    return res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}
