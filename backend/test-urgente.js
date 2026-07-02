// test-docker.js
import mongoose from 'mongoose';

const URI = 'mongodb://admin:123456@localhost:27017/inventario?authSource=admin';

console.log('🔄 Probando conexión a MongoDB con Docker...');

try {
  await mongoose.connect(URI);
  console.log('✅ ¡Conectado a MongoDB con Docker!');
  console.log('📊 Base de datos:', mongoose.connection.name);
  await mongoose.disconnect();
  console.log('✅ Desconectado');
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}