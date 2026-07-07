import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { autenticado } = useAuth();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="home-eyebrow">
            🛍️ Tienda Online ShopUTP
          </div>
          <h1>
            Compra lo que amas<br />
            <span>al mejor precio</span>
          </h1>
          <p className="home-lead">
            Descubre miles de productos con envio rapido, pagos seguros
            y la mejor experiencia de compra online. Tu tienda favorita te espera.
          </p>
          <div className="home-actions">
            {autenticado ? (
              <Link to="/dashboard" className="btn-hero-primary">
                Ir a la tienda →
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-hero-primary">
                  Empezar a comprar →
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
            <div className="home-stat-number">10K+</div>
            <div className="home-stat-label">Productos disponibles</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-number">24/7</div>
            <div className="home-stat-label">Atencion al cliente</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-number">100%</div>
            <div className="home-stat-label">Pagos seguros</div>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Envio rapido</h3>
          <p>
            Recibe tus productos en tiempo record. Enviamos a todo el pais
            con seguimiento en tiempo real de tu pedido.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Compras seguras</h3>
          <p>
            Tus datos y pagos estan protegidos con cifrado de nivel bancario.
            Compra con total tranquilidad.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">↩️</div>
          <h3>Devoluciones faciles</h3>
          <p>
            30 dias para devolver tu compra sin preguntas. Reembolso
            garantizado si no estas satisfecho.
          </p>
        </div>
      </div>
    </div>
  );
}
