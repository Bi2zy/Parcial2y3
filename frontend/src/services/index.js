import api from './api.js';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  async register(nombre, email, password) {
    const { data } = await api.post('/auth/register', { nombre, email, password });
    return data;
  },
};

export const productoService = {
  async listar() {
    const { data } = await api.get('/productos');
    return data;
  },
  async crear(formData) {
    const { data } = await api.post('/productos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  async actualizar(id, formData) {
    const { data } = await api.put(`/productos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  async eliminar(id) {
    const { data } = await api.delete(`/productos/${id}`);
    return data;
  },
};

export const pedidoService = {
  async crear(items, total) {
    const { data } = await api.post('/pedidos', { items, total });
    return data;
  },
  async misPedidos() {
    const { data } = await api.get('/pedidos/mis-pedidos');
    return data;
  },
};
