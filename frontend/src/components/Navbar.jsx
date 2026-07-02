import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { usuario, autenticado, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Inventario<span>UTP</span></Link>
      </div>
      <div className="navbar-links">
        {autenticado ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/perfil">Perfil</Link>
            <span className="navbar-user">
              {usuario?.nombre}
              <span className={`rol-badge rol-${usuario?.rol}`}>{usuario?.rol}</span>
            </span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesion</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
