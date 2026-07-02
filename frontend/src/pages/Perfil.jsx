import { useAuth } from '../context/AuthContext.jsx';

export default function Perfil() {
  const { usuario } = useAuth();

  return (
    <div className="perfil">
      <h1>Mi perfil</h1>
      <div className="card">
        <div className="perfil-avatar">{usuario?.nombre?.charAt(0).toUpperCase()}</div>
        <div className="perfil-datos">
          <div className="perfil-fila">
            <span className="muted">Nombre</span>
            <strong>{usuario?.nombre}</strong>
          </div>
          <div className="perfil-fila">
            <span className="muted">Correo</span>
            <strong>{usuario?.email}</strong>
          </div>
          <div className="perfil-fila">
            <span className="muted">ID de usuario</span>
            <strong>{usuario?.id}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
