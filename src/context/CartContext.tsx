import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem } from '@/data/products';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

const getKey = (item: { productId: string; size?: string; color?: string }) =>
  `${item.productId}-${item.size || ''}-${item.color || ''}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = getKey(item);
      const existing = prev.find((i) => getKey(i) === key);
      if (existing) {
        return prev.map((i) => getKey(i) === key ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size?: string, color?: string) => {
    const key = getKey({ productId, size, color });
    setItems((prev) => prev.filter((i) => getKey(i) !== key));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string, color?: string) => {
    const key = getKey({ productId, size, color });
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => getKey(i) !== key));
    } else {
      setItems((prev) => prev.map((i) => getKey(i) === key ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
