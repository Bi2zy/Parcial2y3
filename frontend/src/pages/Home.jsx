import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { autenticado } = useAuth();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="home-eyebrow">
            Sistema de Gestion de Inventario
          </div>
          <h1>
            Controla tu inventario<br />
            <span>de forma profesional</span>
          </h1>
          <p className="home-lead">
            Plataforma Full Stack con React y API REST propia. Autenticacion segura con JWT,
            roles de usuario y operaciones CRUD completas en tiempo real.
          </p>
          <div className="home-actions">
            {autenticado ? (
              <Link to="/dashboard" className="btn-hero-primary">
                Ir al panel →
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-hero-primary">
                  Iniciar sesion →
                </Link>
                <Link to="/register" className="btn-hero-ghost">
                  Crear cuenta gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="home-stats">
        <div className="home-stats-inner">
          <div className="home-stat">
            <div className="home-stat-number">JWT</div>
            <div className="home-stat-label">Autenticacion segura</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-number">CRUD</div>
            <div className="home-stat-label">Operaciones completas</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-number">REST</div>
            <div className="home-stat-label">API propia</div>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Autenticacion segura</h3>
          <p>
            Inicio de sesion protegido con tokens JWT almacenados y enviados
            automaticamente en cada peticion a la API.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Rutas protegidas</h3>
          <p>
            Control de acceso por roles. Solo los administradores pueden
            crear, editar y eliminar productos del inventario.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Panel completo</h3>
          <p>
            Visualiza tu inventario en vista de tarjetas o tabla. Estadisticas
            en tiempo real: total de productos, stock bajo y valor del inventario.
          </p>
        </div>
      </div>
    </div>
  );
}
