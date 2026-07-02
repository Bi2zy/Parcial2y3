import { useState, useEffect } from 'react';
import { productoService } from '../services/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProductoForm from '../components/ProductoForm.jsx';
import Alert from '../components/Alert.jsx';
import Loading from '../components/Loading.jsx';

export default function Dashboard() {
  const { esAdmin } = useAuth();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  // Cargar productos desde el API
  async function cargarProductos() {
    setCargando(true);
    setError('');
    try {
      const data = await productoService.listar();
      setProductos(data);
    } catch (err) {
      setError('No se pudieron cargar los productos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function abrirCrear() {
    setProductoEditar(null);
    setMostrarForm(true);
  }

  function abrirEditar(producto) {
    setProductoEditar(producto);
    setMostrarForm(true);
  }

  function cerrarForm() {
    setMostrarForm(false);
    setProductoEditar(null);
  }

  // Crear o actualizar segun corresponda
  async function guardarProducto(datos) {
    setError('');
    try {
      if (productoEditar) {
        await productoService.actualizar(productoEditar._id, datos);
        setExito('Producto actualizado correctamente');
      } else {
        await productoService.crear(datos);
        setExito('Producto creado correctamente');
      }
      cerrarForm();
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el producto');
    }
    setTimeout(() => setExito(''), 3000);
  }

  async function eliminarProducto(id) {
    if (!window.confirm('Seguro que deseas eliminar este producto?')) return;
    setError('');
    try {
      await productoService.eliminar(id);
      setExito('Producto eliminado');
      cargarProductos();
    } catch (err) {
      setError('Error al eliminar el producto');
    }
    setTimeout(() => setExito(''), 3000);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Productos</h1>
          <p className="muted">{productos.length} registros en inventario</p>
        </div>
        {esAdmin && (
          <button className="btn btn-primary" onClick={abrirCrear}>+ Nuevo producto</button>
        )}
      </div>

      {!esAdmin && (
        <Alert tipo="exito" mensaje="Tienes acceso de solo lectura. Solo un administrador puede crear, editar o eliminar productos." />
      )}

      <Alert tipo="error" mensaje={error} onCerrar={() => setError('')} />
      <Alert tipo="exito" mensaje={exito} />

      {mostrarForm && (
        <div className="card form-card">
          <h2>{productoEditar ? 'Editar producto' : 'Nuevo producto'}</h2>
          <ProductoForm
            productoInicial={productoEditar}
            onGuardar={guardarProducto}
            onCancelar={cerrarForm}
          />
        </div>
      )}

      {cargando ? (
        <Loading texto="Cargando productos..." />
      ) : productos.length === 0 ? (
        <div className="empty">
          <p>Aun no hay productos. Crea el primero con el boton de arriba.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoria</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p._id}>
                  <td className="muted">{String(p._id).slice(-6)}</td>
                  <td className="td-nombre">{p.nombre}</td>
                  <td className="muted">{p.descripcion || '-'}</td>
                  <td>${Number(p.precio).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.stock <= 5 ? 'badge-low' : ''}`}>{p.stock}</span>
                  </td>
                  <td>{p.categoria || '-'}</td>
                  {esAdmin && (
                    <td className="td-acciones">
                      <button className="btn btn-sm btn-ghost" onClick={() => abrirEditar(p)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(p._id)}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
