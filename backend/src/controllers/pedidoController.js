import Pedido from '../models/Pedido.js';

export async function crear(req, res, next) {
  try {
    const { items, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: 'El pedido debe tener al menos un item' });
    }
    const pedido = await Pedido.create({ usuario: req.usuario._id, items, total });
    return res.status(201).json({ mensaje: 'Pedido registrado', pedido });
  } catch (error) {
    next(error);
  }
}

export async function misPedidos(req, res, next) {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuario._id }).sort({ createdAt: -1 });
    return res.json(pedidos);
  } catch (error) {
    next(error);
  }
}

export async function todos(req, res, next) {
  try {
    const pedidos = await Pedido.find().populate('usuario', 'nombre email').sort({ createdAt: -1 });
    return res.json(pedidos);
  } catch (error) {
    next(error);
  }
}
