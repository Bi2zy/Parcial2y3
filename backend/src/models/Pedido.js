import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    items: [
      {
        productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
        nombre: String,
        precio: Number,
        cantidad: Number,
        imagen: String,
      },
    ],
    total: { type: Number, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'completado', 'cancelado'],
      default: 'completado',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Pedido', pedidoSchema);
