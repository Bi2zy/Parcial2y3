import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      default: '',
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
    },
    categoria: {
      type: String,
      default: '',
      trim: true,
    },
    imagen: {
      type: String,
      default: '',
    },
    // Referencia al usuario que creo el producto
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Producto', productoSchema);
