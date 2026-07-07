import { useState, useEffect, useMemo } from 'react';
import { productoService } from '../services/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import ProductoForm from '../components/ProductoForm.jsx';
import Alert from '../components/Alert.jsx';
import Loading from '../components/Loading.jsx';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const TODAS = 'Todas';

function stockBadge(stock) {
  if (stock <= 0) return <span className="badge badge-low">Sin stock</span>;
  if (stock <= 5) return <span className="badge badge-warn">{stock} bajo</span>;
  return <span className="badge badge-ok">{stock} en stock</span>;
}

function ProductoImg({ imagen, nombre }) {
  if (imagen) {
    return (
      <img
        src={`${API_BASE}${imagen}`}
        alt={nombre}
        className="producto-card-real-img"
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
    );
  }
  return null;
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
  const [agregado, setAgregado] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState(TODAS);
  const [ordenPrecio, setOrdenPrecio] = useState('');

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

  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
    return [TODAS, ...cats.sort()];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    let lista = [...productos];
    if (categoriaActiva !== TODAS) {
      lista = lista.filter((p) => p.categoria === categoriaActiva);
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion || '').toLowerCase().includes(q) ||
          (p.categoria || '').toLowerCase().includes(q)
      );
    }
    if (ordenPrecio === 'asc') lista.sort((a, b) => a.precio - b.precio);
    if (ordenPrecio === 'desc') lista.sort((a, b) => b.precio - a.precio);
    return lista;
  }, [productos, busqueda, categoriaActiva, ordenPrecio]);

  function abrirCrear() { setProductoEditar(null); setMostrarForm(true); }
  function abrirEditar(p) { setProductoEditar(p); setMostrarForm(true); }
  function cerrarForm() { setMostrarForm(false); setProductoEditar(null); }

  async function guardarProducto(formData) {
    setError('');
    try {
      if (productoEditar) {
        await productoService.actualizar(productoEditar._id, formData);
        setExito('Producto actualizado correctamente');
      } else {
        await productoService.crear(formData);
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
    <div className="shop-page">
      {esAdmin && (
        <div className="stats-row" style={{ marginBottom: '24px' }}>
          <div className="stat-card">
            <div className="stat-icon stat-icon-teal">📦</div>
            <div className="stat-info">
              <div className="stat-value">{productos.length}</div>
              <div className="stat-label">Total productos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-yellow">⚠️</div>
            <div className="stat-info">
              <div className="stat-value">{stockBajo}</div>
              <div className="stat-label">Stock bajo</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">💰</div>
            <div className="stat-info">
              <div className="stat-value">${valorTotal.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="stat-label">Valor total inventario</div>
            </div>
          </div>
        </div>
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

      <div className="shop-toolbar">
        <div className="shop-search-wrap">
          <span className="shop-search-icon">🔍</span>
          <input
            className="shop-search"
            type="text"
            placeholder="Buscar productos, categorias..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="shop-search-clear" onClick={() => setBusqueda('')}>×</button>
          )}
        </div>

        <div className="shop-controls">
          <select
            className="shop-order-select"
            value={ordenPrecio}
            onChange={(e) => setOrdenPrecio(e.target.value)}
          >
            <option value="">Ordenar por...</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
          </select>

          {esAdmin && (
            <button className="btn btn-accent" onClick={abrirCrear}>
              + Nuevo producto
            </button>
          )}
        </div>
      </div>

      <div className="category-tabs">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${categoriaActiva === cat ? 'active' : ''}`}
            onClick={() => setCategoriaActiva(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="shop-results-info">
        {!cargando && (
          <span>{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {cargando ? (
        <Loading texto="Cargando productos..." />
      ) : productosFiltrados.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>Sin resultados</h3>
          <p>Prueba con otra busqueda o categoria.</p>
        </div>
      ) : (
        <div className="productos-grid">
          {productosFiltrados.map((p) => (
            <div
              className={`producto-card ${enCarrito(p._id) ? 'producto-card--en-carrito' : ''}`}
              key={p._id}
            >
              <div className="producto-card-img">
                {p.imagen ? (
                  <img
                    src={`${API_BASE}${p.imagen}`}
                    alt={p.nombre}
                    className="producto-card-real-img"
                  />
                ) : (
                  <span className="producto-card-emoji">🛍️</span>
                )}
                {enCarrito(p._id) && (
                  <div className="producto-card-carrito-tag">En carrito</div>
                )}
                {p.stock <= 0 && (
                  <div className="producto-card-agotado-tag">Agotado</div>
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
                    className={`btn btn-sm ${agregado === p._id ? 'btn-success-flash' : enCarrito(p._id) ? 'btn-carrito-active' : 'btn-accent'}`}
                    onClick={() => handleAgregarCarrito(p)}
                    disabled={p.stock <= 0}
                    title={p.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
                  >
                    {agregado === p._id ? '✓' : enCarrito(p._id) ? '✓ En carrito' : '🛒 Agregar'}
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
      )}
    </div>
  );
}
