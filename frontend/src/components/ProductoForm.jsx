import { useState, useEffect } from 'react';

// Formulario para crear o editar un producto, con validaciones basicas
export default function ProductoForm({ productoInicial, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', categoria: '',
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (productoInicial) {
      setForm({
        nombre: productoInicial.nombre || '',
        descripcion: productoInicial.descripcion || '',
        precio: productoInicial.precio ?? '',
        stock: productoInicial.stock ?? '',
        categoria: productoInicial.categoria || '',
      });
    }
  }, [productoInicial]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (form.precio === '' || isNaN(Number(form.precio)) || Number(form.precio) < 0) {
      nuevosErrores.precio = 'Ingresa un precio valido (numero >= 0)';
    }
    if (form.stock !== '' && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) {
      nuevosErrores.stock = 'El stock debe ser un numero valido';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleSubmit() {
    if (!validar()) return;
    onGuardar({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock) || 0,
      categoria: form.categoria.trim(),
    });
  }

  return (
    <div className="form">
      <div className="form-group">
        <label>Nombre *</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Teclado mecanico" />
        {errores.nombre && <small className="form-error">{errores.nombre}</small>}
      </div>

      <div className="form-group">
        <label>Descripcion</label>
        <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Detalle del producto" />
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
        <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ej: Perifericos" />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
        {onCancelar && <button className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>}
      </div>
    </div>
  );
}
