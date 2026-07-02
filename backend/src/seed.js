import 'dotenv/config';
import mongoose from 'mongoose';
import { conectarDB } from './config/db.js';
import Usuario from './models/Usuario.js';
import Producto from './models/Producto.js';

// Ejecuta: npm run seed
// Crea un admin, un usuario normal y algunos productos de ejemplo.
async function seed() {
  await conectarDB();

  // Limpiar datos previos
  await Usuario.deleteMany({});
  await Producto.deleteMany({});

  const admin = await Usuario.create({
    nombre: 'Administrador',
    email: 'admin@demo.com',
    password: '123456',
    rol: 'admin',
  });

  await Usuario.create({
    nombre: 'Usuario Normal',
    email: 'usuario@demo.com',
    password: '123456',
    rol: 'usuario',
  });

  await Producto.insertMany([
    { nombre: 'Teclado mecanico', descripcion: 'Teclado RGB switch azul', precio: 45.99, stock: 20, categoria: 'Perifericos', creadoPor: admin._id },
    { nombre: 'Mouse inalambrico', descripcion: 'Mouse ergonomico 2.4GHz', precio: 19.5, stock: 35, categoria: 'Perifericos', creadoPor: admin._id },
    { nombre: 'Monitor 24"', descripcion: 'Monitor Full HD 75Hz', precio: 129.0, stock: 10, categoria: 'Monitores', creadoPor: admin._id },
  ]);

  console.log('Seed completado:');
  console.log('  admin@demo.com / 123456   (rol: admin)');
  console.log('  usuario@demo.com / 123456 (rol: usuario)');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
