// Muestra mensajes de exito o error. tipo: 'exito' | 'error'
export default function Alert({ tipo = 'error', mensaje, onCerrar }) {
  if (!mensaje) return null;
  return (
    <div className={`alert alert-${tipo}`}>
      <span>{mensaje}</span>
      {onCerrar && (
        <button className="alert-close" onClick={onCerrar} aria-label="Cerrar">
          &times;
        </button>
      )}
    </div>
  );
}
