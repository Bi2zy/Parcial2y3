import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit() {
    setError('');
    if (!email || !password) { setError('Completa el correo y la contrasena'); return; }
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) { setError('Ingresa un correo con formato valido'); return; }

    setCargando(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-logo-area">
          <h2>Inventario<span>UTP</span></h2>
          <p>Sistema de gestion de inventario</p>
        </div>

        <div className="auth-card">
          <h1>Bienvenido de nuevo</h1>
          <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

          <Alert tipo="error" mensaje={error} onCerrar={() => setError('')} />

          <div className="form-group">
            <label>Correo electronico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label>Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={handleSubmit}
            disabled={cargando}
            style={{ marginTop: '8px' }}
          >
            {cargando ? 'Ingresando...' : 'Iniciar sesion →'}
          </button>

          <p className="auth-footer">
            No tienes cuenta?{' '}
            <Link to="/register">Registrate gratis</Link>
          </p>

          <div className="auth-hint">
            <strong>Credenciales de prueba</strong><br />
            admin@demo.com / 123456 — Administrador<br />
            usuario@demo.com / 123456 — Solo lectura
          </div>
        </div>
      </div>
    </div>
  );
}
