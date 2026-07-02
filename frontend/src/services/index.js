import api from './api.js';

// ---- Autenticacion ----
export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { mensaje, token, usuario }
  },
  async register(nombre, email, password) {
    const { data } = await api.post('/auth/register', { nombre, email, password });
    return data;
  },
};

// ---- Productos (CRUD) ----
export const productoService = {
  async listar() {
    const { data } = await api.get('/productos');
    return data;
  },
  async crear(producto) {
    const { data } = await api.post('/productos', producto);
    return data;
  },
  async actualizar(id, producto) {
    const { data } = await api.put(`/productos/${id}`, producto);
    return data;
  },
  async eliminar(id) {
    const { data } = await api.delete(`/productos/${id}`);
    return data;
  },
};
