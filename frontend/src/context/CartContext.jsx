import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

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

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  const totalPrecio = carrito.reduce(
    (acc, i) => acc + Number(i.producto.precio) * i.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{ carrito, agregarAlCarrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, totalItems, totalPrecio }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
