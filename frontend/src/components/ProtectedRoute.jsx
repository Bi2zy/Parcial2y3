import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from './Loading.jsx';

// Envuelve rutas privadas: si no hay sesion, redirige a /login
export default function ProtectedRoute({ children }) {
  const { autenticado, cargando } = useAuth();

  if (cargando) {
    return <Loading />;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
