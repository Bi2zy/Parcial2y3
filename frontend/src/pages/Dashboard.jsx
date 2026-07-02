import { useState, useEffect } from 'react';
import { productoService } from '../services/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import ProductoForm from '../components/ProductoForm.jsx';
import Alert from '../components/Alert.jsx';
import Loading from '../components/Loading.jsx';

function stockBadge(stock) {
  if (stock <= 0) return <span className="badge badge-low">Sin stock</span>;
  if (stock <= 5) return <span className="badge badge-warn">{stock} bajo</span>;
  return <span className="badge badge-ok">{stock}</span>;
}

function categoriaIcon(cat) {
  const map = {
    auriculares: '🎧', audifonos: '🎧', audio: '🔊', celular: '📱',
    telefono: '📱', laptop: '💻', computadora: '🖥️', camara: '📷',
    televisor: '📺', tv: '📺', periferico: '⌨️', accesorio: '🔌',
  };
  const key = (cat || '').toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v;
  }
  return '📦';
}

export default function Dashboard() {
  const { esAdmin } = useAuth();
  const { carrito, agregarAlCarrito } = useCart();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [vista, setVista] = useState('tarjetas');
  const [agregado, setAgregado] = useState(null);

  async function cargarProductos() {
    setCargando(true);
    setError('');
    try {
      const data = await productoService.listar();
      setProductos(data);
    } catch {
      setError('No se pudieron cargar los productos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargarProductos(); }, []);

  function abrirCrear() { setProductoEditar(null); setMostrarForm(true); }
  function abrirEditar(p) { setProductoEditar(p); setMostrarForm(true); }
  function cerrarForm() { setMostrarForm(false); setProductoEditar(null); }

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
    } catch {
      setError('Error al eliminar el producto');
    }
    setTimeout(() => setExito(''), 3000);
  }

  function handleAgregarCarrito(producto) {
    if (producto.stock <= 0) return;
    agregarAlCarrito(producto);
    setAgregado(producto._id);
    setTimeout(() => setAgregado(null), 1500);
  }

  function enCarrito(id) {
    return carrito.some((i) => i.producto._id === id);
  }

  const stockBajo = productos.filter((p) => p.stock <= 5).length;
  const valorTotal = productos.reduce((acc, p) => acc + Number(p.precio) * Number(p.stock), 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Inventario de Productos</h1>
          <p>{productos.length} productos registrados</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="view-toggle">
            <button
              className={`view-btn ${vista === 'tarjetas' ? 'active' : ''}`}
              onClick={() => setVista('tarjetas')}
            >
              ▦ Tarjetas
            </button>
            <button
              className={`view-btn ${vista === 'tabla' ? 'active' : ''}`}
              onClick={() => setVista('tabla')}
            >
              ≡ Tabla
            </button>
          </div>
          {esAdmin && (
            <button className="btn btn-primary" onClick={abrirCrear}>
              + Nuevo producto
            </button>
          )}
        </div>
      </div>

      {esAdmin && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">📦</div>
            <div className="stat-info">
              <div className="stat-value">{productos.length}</div>
              <div className="stat-label">Total productos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-yellow">⚠️</div>
            <div className="stat-info">
              <div className="stat-value">{stockBajo}</div>
              <div className="stat-label">Stock bajo (≤5)</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">💰</div>
            <div className="stat-info">
              <div className="stat-value">${valorTotal.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="stat-label">Valor total</div>
            </div>
          </div>
        </div>
      )}

      {!esAdmin && (
        <Alert tipo="exito" mensaje="Tienes acceso de solo lectura. Contacta a un administrador para gestionar productos." />
      )}
      <Alert tipo="error" mensaje={error} onCerrar={() => setError('')} />
      <Alert tipo="exito" mensaje={exito} />

      {mostrarForm && (
        <div className="form-card">
          <div className="form-card-header">
            <h2>{productoEditar ? 'Editar producto' : 'Nuevo producto'}</h2>
            <button className="form-close-btn" onClick={cerrarForm}>×</button>
          </div>
          <div className="form-card-body">
            <ProductoForm
              productoInicial={productoEditar}
              onGuardar={guardarProducto}
              onCancelar={cerrarForm}
            />
          </div>
        </div>
      )}

      {cargando ? (
        <Loading texto="Cargando productos..." />
      ) : productos.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>Sin productos aun</h3>
          <p>Crea el primer producto con el boton de arriba.</p>
        </div>
      ) : vista === 'tarjetas' ? (
        <div className="productos-grid">
          {productos.map((p) => (
            <div className={`producto-card ${enCarrito(p._id) ? 'producto-card--en-carrito' : ''}`} key={p._id}>
              <div className="producto-card-img">
                {categoriaIcon(p.categoria)}
                {enCarrito(p._id) && (
                  <div className="producto-card-carrito-tag">En carrito</div>
                )}
              </div>
              <div className="producto-card-body">
                {p.categoria && (
                  <div className="producto-card-cat">{p.categoria}</div>
                )}
                <div className="producto-card-name">{p.nombre}</div>
                {p.descripcion && (
                  <div className="producto-card-desc">{p.descripcion}</div>
                )}
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  {stockBadge(p.stock)}
                </div>
              </div>
              <div className="producto-card-footer">
                <div className="producto-card-price">
                  ${Number(p.precio).toFixed(2)}
                </div>
                <div className="producto-card-actions">
                  <button
                    className={`btn btn-sm ${agregado === p._id ? 'btn-success-flash' : 'btn-carrito'}`}
                    onClick={() => handleAgregarCarrito(p)}
                    disabled={p.stock <= 0}
                    title={p.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
                  >
                    {agregado === p._id ? '✓ Agregado' : '🛒'}
                  </button>
                  {esAdmin && (
                    <>
                      <button className="btn btn-sm btn-ghost" onClick={() => abrirEditar(p)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(p._id)}>Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
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
                  <th>Carrito</th>
                  {esAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p._id}>
                    <td className="muted" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                      #{String(p._id).slice(-6)}
                    </td>
                    <td className="td-nombre">{p.nombre}</td>
                    <td className="muted">{p.descripcion || '—'}</td>
                    <td style={{ fontWeight: 700 }}>${Number(p.precio).toFixed(2)}</td>
                    <td>{stockBadge(p.stock)}</td>
                    <td>{p.categoria || '—'}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${enCarrito(p._id) ? 'btn-carrito-active' : 'btn-carrito'}`}
                        onClick={() => handleAgregarCarrito(p)}
                        disabled={p.stock <= 0}
                      >
                        {enCarrito(p._id) ? '✓ En carrito' : '🛒 Agregar'}
                      </button>
                    </td>
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
        </div>
      )}
    </div>
  );
}
