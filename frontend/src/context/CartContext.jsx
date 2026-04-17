import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as addToCartAPI,
  updateCartItem,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
} from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // ✅ FIXED: match backend structure
  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Normalize response safely
  const formatCart = (data) => ({
    items: data?.items || [],
    totalPrice: data?.totalPrice || 0,
  });

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();

      const data = res.data?.data || res.data;

      setCart(formatCart(data));
    } catch {
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [], totalPrice: 0 });
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await addToCartAPI(productId, quantity);
    const data = res.data?.data || res.data;
    setCart(formatCart(data));
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await updateCartItem(productId, quantity);
    const data = res.data?.data || res.data;
    setCart(formatCart(data));
  };

  const removeFromCart = async (productId) => {
    const res = await removeFromCartAPI(productId);
    const data = res.data?.data || res.data;
    setCart(formatCart(data));
  };

  const clearCart = async () => {
    await clearCartAPI();
    setCart({ items: [], totalPrice: 0 });
  };

  const cartCount =
    cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;