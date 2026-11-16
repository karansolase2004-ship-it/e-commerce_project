
import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../../utils/auth";

const CartContext = createContext();

export const Cartprovider = ({ children }) => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch Cart from Backend
  const fetchCart = async () => {
    try {
      const res = await authFetch(`${BASEURL}/api/cart/`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch cart");
      }

      setCartItems(data.items || []);
      setTotal(Number(data.total) || 0);

      return { success: true };
    }
    catch (error) {
      console.error("Error fetching Cart:", error);
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add Product to Cart
  const addtocart = async (productId) => {
    try {
      const res = await authFetch(`${BASEURL}/api/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to add product");
      }

      await fetchCart();

      return {
        success: true,
        message: data.message,
        available_stock : data.available_stock
      };
    }
    catch (error) {
      console.error("Error Adding to cart:", error);

      return {
        success: false,
        message: error.message
      };
    }
  };

  // Remove Product from Cart
  const removeFromCart = async (itemId) => {
    try {
      const res = await authFetch(`${BASEURL}/api/cart/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to remove product");
      }

      await fetchCart();

      return {
        success: true,
        message: data.message
      };
    }
    catch (error) {
      console.error("Error Removing from cart:", error);

      return {
        success: false,
        message: error.message
      };
    }
  };

  // Update Cart Quantity
  const updateQuantity = async (itemId, quantity) => {

    if (quantity < 1) {
      return {
        success: false,
        message: "Minimum quantity is 1. Use Remove to delete the product."
      };
    }

    try {
      const res = await authFetch(`${BASEURL}/api/cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: itemId,
          quantity: quantity
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to update quantity");
      }

      await fetchCart();

      return {
        success: true,
        message: data.message
      };
    }
    catch (error) {
      console.error("Error updating quantity:", error);

      return {
        success: false,
        message: error.message
      };
    }
  };

  // Clear Cart after successful order
  const Clearcart = () => {
    setCartItems([]);
    setTotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addtocart,
        removeFromCart,
        updateQuantity,
        Clearcart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

