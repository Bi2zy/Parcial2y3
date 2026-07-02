export default function Loading({ texto = 'Cargando...' }) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>{texto}</p>
    </div>
  );
}
