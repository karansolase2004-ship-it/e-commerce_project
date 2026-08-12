import { createContext, useContext, useState } from "react";
const CartContext = createContext();

export const Cartprovider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addtocart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      console.log("Product Already Exist");
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      console.log("Adding new product");
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  return(
    <CartContext.Provider
      value={{cartItems, addtocart, removeFromCart, updateQuantity}}>
        {children}
    </CartContext.Provider>
  )
};

export const useCart = () => useContext(CartContext);