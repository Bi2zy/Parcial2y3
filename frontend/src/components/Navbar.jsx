import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { usuario, autenticado, logout } = useAuth();
  const { totalItems, saldo } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <Link to="/">
            <div className="navbar-logo-icon">🛍️</div>
            Shop<span>UTP</span>
          </Link>
        </div>

        {autenticado && (
          <div className="navbar-links">
            <Link to="/dashboard">Tienda</Link>
            <Link to="/perfil">Mi Perfil</Link>
          </div>
        )}

        <div className="navbar-right">
          {autenticado ? (
            <>
              <div className="navbar-saldo">
                💰 ${saldo.toFixed(2)}
              </div>
              <Link to="/carrito" className="navbar-cart-btn">
                🛒
                {totalItems > 0 && (
                  <span className="navbar-cart-badge">{totalItems}</span>
                )}
              </Link>
              <div className="navbar-user-chip">
                <div className="navbar-avatar">
                  {usuario?.nombre?.charAt(0).toUpperCase()}
                </div>
                {usuario?.nombre}
                <span className={`rol-badge rol-${usuario?.rol}`}>{usuario?.rol}</span>
              </div>
              <button className="btn-nav-logout" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500', padding: '8px 14px' }}>
                Iniciar sesion
              </Link>
              <Link to="/register" className="btn-nav-register">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
