import { createContext, useContext, useState, useEffect } from "react";
import { authFetch, getAccessToken } from "../utils/auth";
const CartContext = createContext();

export const Cartprovider = ({ children }) => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch Cart from BE 
  const fetchCart = async () => {
    try{
      const res = await authFetch(`${BASEURL}/api/cart`)  
      const data = await res.json();
      setCartItems(data.items || [] );
      setTotal(data.total || 0);
    }
    catch(error)
    {
      console.error("Error fetching Cart : ", error);
    } 
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const addtocart = async (productId) => {
    try{
      await authFetch(`${BASEURL}/api/cart/add/`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({product_id : productId}),
      });
      fetchCart();
    }catch (error){
      console.error("Error Adding to cart : ", error);
    }
  };

  const removeFromCart = async(itemId) => {
    try{
      await authFetch(`${BASEURL}/api/cart/remove/`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({item_id : itemId}),
      });
      fetchCart();
    }
    catch(error){
      console.error("Error Removing from cart: ", error);
    }
  }

  const updateQuantity = async(itemId, quantity) => {
    if(quantity < 1){
      await removeFromCart(itemId);
      return; 
    }
    try{
      await authFetch(`${BASEURL}/api/cart/update/`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({item_id : itemId, quantity}),
      });
      fetchCart();
    }
    catch (error)
    {
      console.error("Error updating quantity:", error);
    }
  };

  const Clearcart = () => {
    setCartItems([]);
    setTotal(0);
  }

  return(
    <CartContext.Provider
      value={{cartItems, total, addtocart, removeFromCart, updateQuantity, Clearcart}}>
        {children}
    </CartContext.Provider>
  )
};

export const useCart = () => useContext(CartContext);