import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

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

export default function Carrito() {
  const { carrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, totalItems, totalPrecio } = useCart();

  if (carrito.length === 0) {
    return (
      <div className="carrito-page">
        <div className="carrito-header">
          <h1>Mi Carrito</h1>
        </div>
        <div className="carrito-empty">
          <div className="carrito-empty-icon">🛒</div>
          <h3>Tu carrito esta vacio</h3>
          <p>Agrega productos desde el inventario para comenzar.</p>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Ver inventario →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <div className="carrito-header">
        <div>
          <h1>Mi Carrito</h1>
          <p className="muted">{totalItems} {totalItems === 1 ? 'articulo' : 'articulos'}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={vaciarCarrito}>
          🗑 Vaciar carrito
        </button>
      </div>

      <div className="carrito-layout">
        <div className="carrito-items">
          {carrito.map(({ producto, cantidad }) => (
            <div className="carrito-item" key={producto._id}>
              <div className="carrito-item-img">
                {categoriaIcon(producto.categoria)}
              </div>

              <div className="carrito-item-info">
                {producto.categoria && (
                  <span className="carrito-item-cat">{producto.categoria}</span>
                )}
                <div className="carrito-item-name">{producto.nombre}</div>
                {producto.descripcion && (
                  <div className="carrito-item-desc">{producto.descripcion}</div>
                )}
                <div className="carrito-item-unit">
                  ${Number(producto.precio).toFixed(2)} c/u
                </div>
              </div>

              <div className="carrito-item-controls">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => cambiarCantidad(producto._id, cantidad - 1)}
                    disabled={cantidad <= 1}
                  >
                    −
                  </button>
                  <span className="qty-value">{cantidad}</span>
                  <button
                    className="qty-btn"
                    onClick={() => cambiarCantidad(producto._id, cantidad + 1)}
                    disabled={cantidad >= producto.stock}
                  >
                    +
                  </button>
                </div>

                <div className="carrito-item-subtotal">
                  ${(Number(producto.precio) * cantidad).toFixed(2)}
                </div>

                <button
                  className="carrito-item-remove"
                  onClick={() => quitarDelCarrito(producto._id)}
                  title="Quitar del carrito"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="carrito-resumen">
          <h2>Resumen del pedido</h2>

          <div className="resumen-lineas">
            {carrito.map(({ producto, cantidad }) => (
              <div className="resumen-linea" key={producto._id}>
                <span className="resumen-linea-nombre">
                  {producto.nombre}
                  <span className="resumen-linea-qty"> ×{cantidad}</span>
                </span>
                <span>${(Number(producto.precio) * cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="resumen-divider" />

          <div className="resumen-total-row">
            <span>Articulos</span>
            <span>{totalItems}</span>
          </div>
          <div className="resumen-total-row resumen-total-main">
            <span>Total</span>
            <span>${totalPrecio.toFixed(2)}</span>
          </div>

          <button className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>
            Proceder al pago
          </button>
          <Link to="/dashboard" className="btn btn-ghost btn-block" style={{ marginTop: '10px', textAlign: 'center' }}>
            ← Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
