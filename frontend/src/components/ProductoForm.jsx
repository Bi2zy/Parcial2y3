import { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const CATEGORIAS = [
  'Electronica', 'Ropa', 'Calzado', 'Hogar', 'Deportes',
  'Juguetes', 'Libros', 'Belleza', 'Alimentos', 'Otros',
];

export default function ProductoForm({ productoInicial, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', categoria: '',
  });
  const [errores, setErrores] = useState({});
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (productoInicial) {
      setForm({
        nombre: productoInicial.nombre || '',
        descripcion: productoInicial.descripcion || '',
        precio: productoInicial.precio ?? '',
        stock: productoInicial.stock ?? '',
        categoria: productoInicial.categoria || '',
      });
      if (productoInicial.imagen) {
        setImagenPreview(`${API_BASE}${productoInicial.imagen}`);
      }
    }
  }, [productoInicial]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrores((prev) => ({ ...prev, imagen: 'La imagen no debe superar 5 MB' }));
      return;
    }
    setErrores((prev) => ({ ...prev, imagen: '' }));
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  }

  function quitarImagen() {
    setImagenFile(null);
    setImagenPreview('');
    if (fileRef.current) fileRef.current.value = '';
  }

  function validar() {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (form.precio === '' || isNaN(Number(form.precio)) || Number(form.precio) < 0) {
      e.precio = 'Ingresa un precio valido (>= 0)';
    }
    if (form.stock !== '' && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) {
      e.stock = 'El stock debe ser un numero valido';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validar()) return;
    const fd = new FormData();
    fd.append('nombre', form.nombre.trim());
    fd.append('descripcion', form.descripcion.trim());
    fd.append('precio', Number(form.precio));
    fd.append('stock', Number(form.stock) || 0);
    fd.append('categoria', form.categoria.trim());
    if (imagenFile) fd.append('imagen', imagenFile);
    onGuardar(fd);
  }

  return (
    <div className="form">
      <div className="form-group">
        <label>Imagen del producto</label>
        <div className="imagen-upload-area" onClick={() => fileRef.current?.click()}>
          {imagenPreview ? (
            <div className="imagen-preview-wrap">
              <img src={imagenPreview} alt="preview" className="imagen-preview" />
              <button
                type="button"
                className="imagen-quitar"
                onClick={(e) => { e.stopPropagation(); quitarImagen(); }}
              >
                ×
              </button>
            </div>
          ) : (
            <div className="imagen-placeholder">
              <span className="imagen-upload-icon">🖼️</span>
              <span>Haz clic para subir imagen</span>
              <span className="imagen-hint">PNG, JPG, WEBP · Maximo 5 MB</span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        {errores.imagen && <small className="form-error">{errores.imagen}</small>}
      </div>

      <div className="form-group">
        <label>Nombre *</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Zapatillas Air Max" />
        {errores.nombre && <small className="form-error">{errores.nombre}</small>}
      </div>

      <div className="form-group">
        <label>Descripcion</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Describe el producto..."
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Precio *</label>
          <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} placeholder="0.00" />
          {errores.precio && <small className="form-error">{errores.precio}</small>}
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
          {errores.stock && <small className="form-error">{errores.stock}</small>}
        </div>
      </div>

      <div className="form-group">
        <label>Categoria</label>
        <select name="categoria" value={form.categoria} onChange={handleChange}>
          <option value="">Seleccionar categoria...</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button className="btn btn-accent" onClick={handleSubmit}>
          {productoInicial ? 'Actualizar producto' : 'Crear producto'}
        </button>
        {onCancelar && <button className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>}
      </div>
    </div>
  );
}
