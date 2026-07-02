import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { autenticado } = useAuth();

  return (
    <div className="home">
      <div className="home-hero">
        <p className="eyebrow">Sistema de gestion</p>
        <h1>Controla tu inventario de productos en un solo lugar</h1>
        <p className="home-lead">
          Aplicacion Full Stack construida con React y un API REST propio.
          Autenticacion con token, rutas protegidas y operaciones CRUD completas.
        </p>
        <div className="home-actions">
          {autenticado ? (
            <Link to="/dashboard" className="btn btn-primary">Ir al panel</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Iniciar sesion</Link>
              <Link to="/register" className="btn btn-ghost">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>

      <div className="home-features">
        <div className="feature">
          <h3>Autenticacion segura</h3>
          <p>Inicio de sesion con token JWT almacenado y enviado en cada peticion protegida.</p>
        </div>
        <div className="feature">
          <h3>Rutas protegidas</h3>
          <p>Solo los usuarios autenticados acceden al panel y a la gestion de productos.</p>
        </div>
        <div className="feature">
          <h3>CRUD completo</h3>
          <p>Crea, lista, edita y elimina productos consumiendo directamente el API REST.</p>
        </div>
      </div>
    </div>
  );
}
