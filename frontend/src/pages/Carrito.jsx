import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

export default function Carrito() {
  const { carrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, totalItems, totalPrecio, saldo, realizarCompra } = useCart();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [comprando, setComprando] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState(null);
  const [errorPago, setErrorPago] = useState('');

  async function handleConfirmarCompra() {
    setComprando(true);
    setErrorPago('');
    try {
      const pedido = await realizarCompra();
      setPedidoExitoso(pedido);
    } catch (err) {
      setErrorPago(err.message || 'Error al procesar el pago');
    } finally {
      setComprando(false);
    }
  }

  function cerrarModal() {
    setModalAbierto(false);
    setPedidoExitoso(null);
    setErrorPago('');
  }

  if (carrito.length === 0 && !pedidoExitoso) {
    return (
      <div className="carrito-page">
        <div className="carrito-header">
          <h1>Mi Carrito</h1>
        </div>
        <div className="carrito-empty">
          <div className="carrito-empty-icon">🛒</div>
          <h3>Tu carrito esta vacio</h3>
          <p>Agrega productos desde la tienda para comenzar.</p>
          <Link to="/dashboard" className="btn btn-accent" style={{ marginTop: '20px' }}>
            Ir a la tienda →
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
                {producto.imagen ? (
                  <img src={`${API_BASE}${producto.imagen}`} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                ) : (
                  <span style={{ fontSize: '28px' }}>🛍️</span>
                )}
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

          <div className="saldo-disponible">
            <span>Tu saldo</span>
            <span className={totalPrecio > saldo ? 'saldo-insuficiente' : 'saldo-ok'}>
              ${saldo.toFixed(2)}
            </span>
          </div>

          {totalPrecio > saldo && (
            <p className="saldo-warning">⚠️ Saldo insuficiente para esta compra</p>
          )}

          <button
            className="btn btn-accent btn-block"
            style={{ marginTop: '16px' }}
            onClick={() => setModalAbierto(true)}
            disabled={totalPrecio > saldo}
          >
            Proceder al pago →
          </button>
          <Link to="/dashboard" className="btn btn-ghost btn-block" style={{ marginTop: '10px', textAlign: 'center' }}>
            ← Seguir comprando
          </Link>
        </div>
      </div>

      {modalAbierto && (
        <div className="checkout-overlay" onClick={cerrarModal}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            {pedidoExitoso ? (
              <div className="checkout-exito">
                <div className="checkout-exito-icon">✅</div>
                <h2>Compra completada</h2>
                <p>Tu pedido ha sido registrado exitosamente.</p>
                <div className="checkout-exito-detalle">
                  <span>Total cobrado:</span>
                  <strong>${pedidoExitoso.total.toFixed(2)}</strong>
                </div>
                <div className="checkout-exito-detalle">
                  <span>Saldo restante:</span>
                  <strong>${saldo.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <Link to="/dashboard" className="btn btn-accent" onClick={cerrarModal}>
                    Seguir comprando
                  </Link>
                  <button className="btn btn-ghost" onClick={cerrarModal}>Cerrar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="checkout-modal-header">
                  <h2>Confirmar pago</h2>
                  <button className="form-close-btn" onClick={cerrarModal}>×</button>
                </div>

                <div className="checkout-modal-body">
                  <div className="checkout-items-list">
                    {carrito.map(({ producto, cantidad }) => (
                      <div className="checkout-item" key={producto._id}>
                        <span>{producto.nombre} ×{cantidad}</span>
                        <span>${(Number(producto.precio) * cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="resumen-divider" />

                  <div className="checkout-totales">
                    <div className="checkout-total-row">
                      <span>Total a pagar</span>
                      <strong className="checkout-total-monto">${totalPrecio.toFixed(2)}</strong>
                    </div>
                    <div className="checkout-total-row">
                      <span>Saldo disponible</span>
                      <span className="saldo-ok">${saldo.toFixed(2)}</span>
                    </div>
                    <div className="checkout-total-row">
                      <span>Saldo despues del pago</span>
                      <strong>${(saldo - totalPrecio).toFixed(2)}</strong>
                    </div>
                  </div>

                  {errorPago && (
                    <p className="saldo-warning" style={{ marginTop: '12px' }}>⚠️ {errorPago}</p>
                  )}
                </div>

                <div className="checkout-modal-footer">
                  <button
                    className="btn btn-accent"
                    onClick={handleConfirmarCompra}
                    disabled={comprando}
                  >
                    {comprando ? 'Procesando...' : '💳 Confirmar pago'}
                  </button>
                  <button className="btn btn-ghost" onClick={cerrarModal} disabled={comprando}>
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
