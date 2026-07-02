import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/index.js';
import Alert from '../components/Alert.jsx';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    setError('');
    setExito('');

    if (!nombre || !email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      setError('Ingresa un correo con formato valido');
      return;
    }
    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);
    try {
      await authService.register(nombre, email, password);
      setExito('Cuenta creada correctamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">Registrate para gestionar el inventario</p>

        <Alert tipo="error" mensaje={error} onCerrar={() => setError('')} />
        <Alert tipo="exito" mensaje={exito} />

        <div className="form-group">
          <label>Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
        </div>

        <div className="form-group">
          <label>Correo electronico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
        </div>

        <div className="form-group">
          <label>Contrasena</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 6 caracteres" />
        </div>

        <button className="btn btn-primary btn-block" onClick={handleSubmit} disabled={cargando}>
          {cargando ? 'Creando...' : 'Registrarme'}
        </button>

        <p className="auth-footer">
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </div>
    </div>
  );
}
