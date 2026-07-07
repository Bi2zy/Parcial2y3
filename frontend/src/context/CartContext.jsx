import { createContext, useContext, useState } from 'react';
import { pedidoService } from '../services/index.js';

const CartContext = createContext(null);

const SALDO_INICIAL = 5000;

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [saldo, setSaldo] = useState(SALDO_INICIAL);
  const [pedidos, setPedidos] = useState([]);

  function agregarAlCarrito(producto) {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.producto._id === producto._id);
      if (existe) {
        return prev.map((i) =>
          i.producto._id === producto._id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  }

  function quitarDelCarrito(id) {
    setCarrito((prev) => prev.filter((i) => i.producto._id !== id));
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) return;
    setCarrito((prev) =>
      prev.map((i) => (i.producto._id === id ? { ...i, cantidad } : i))
    );
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  async function realizarCompra() {
    const total = carrito.reduce(
      (acc, i) => acc + Number(i.producto.precio) * i.cantidad,
      0
    );
    if (total > saldo) {
      throw new Error('Saldo insuficiente');
    }
    const items = carrito.map(({ producto, cantidad }) => ({
      productoId: producto._id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      cantidad,
      imagen: producto.imagen || '',
    }));

    const data = await pedidoService.crear(items, total);
    setSaldo((prev) => parseFloat((prev - total).toFixed(2)));
    setPedidos((prev) => [data.pedido, ...prev]);
    setCarrito([]);
    return data.pedido;
  }

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  const totalPrecio = carrito.reduce(
    (acc, i) => acc + Number(i.producto.precio) * i.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        saldo,
        pedidos,
        agregarAlCarrito,
        quitarDelCarrito,
        cambiarCantidad,
        vaciarCarrito,
        realizarCompra,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
