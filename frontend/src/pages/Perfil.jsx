import { useAuth } from '../context/AuthContext.jsx';

export default function Perfil() {
  const { usuario } = useAuth();

  return (
    <div className="perfil-page">
      <h1>Mi Perfil</h1>
      <div className="perfil-card">
        <div className="perfil-banner" />
        <div className="perfil-body">
          <div className="perfil-avatar">
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="perfil-nombre">{usuario?.nombre}</div>
          <span className={`rol-badge rol-${usuario?.rol}`} style={{ fontSize: '12px', padding: '4px 12px' }}>
            {usuario?.rol}
          </span>

          <div className="perfil-grid">
            <div className="perfil-field">
              <div className="perfil-field-label">Nombre</div>
              <div className="perfil-field-value">{usuario?.nombre}</div>
            </div>
            <div className="perfil-field">
              <div className="perfil-field-label">Correo electronico</div>
              <div className="perfil-field-value">{usuario?.email}</div>
            </div>
            <div className="perfil-field">
              <div className="perfil-field-label">Rol</div>
              <div className="perfil-field-value" style={{ textTransform: 'capitalize' }}>{usuario?.rol}</div>
            </div>
            <div className="perfil-field">
              <div className="perfil-field-label">ID de usuario</div>
              <div className="perfil-field-value" style={{ fontFamily: 'monospace', fontSize: '13px' }}>{usuario?.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
