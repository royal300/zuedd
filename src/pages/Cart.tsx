import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductImage } from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center py-20">
            <ShoppingBag size={64} className="text-muted-foreground mx-auto mb-6 opacity-30" />
            <h1 className="font-display text-4xl text-foreground tracking-wider mb-4">YOUR CART IS EMPTY</h1>
            <p className="text-muted-foreground text-sm mb-8">Discover our premium collections and add items to your cart.</p>
            <Link to="/" className="btn-gold px-8 py-3 rounded-sm text-sm inline-block">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl text-foreground tracking-wider mb-8">SHOPPING CART</h1>

          <div className="space-y-4 mb-8">
            {items.map((item) => {
              const key = `${item.productId}-${item.size || ''}-${item.color || ''}`;
              return (
                <div key={key} className="glass-card rounded-sm p-4 flex gap-4 items-center">
                  <img
                    src={getProductImage(item.image)}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-foreground tracking-wider truncate">{item.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.size && <span className="text-muted-foreground text-xs">Size: {item.size}</span>}
                      {item.gsm && <span className="text-muted-foreground text-xs">· {item.gsm}</span>}
                      {item.color && <span className="text-muted-foreground text-xs">· {item.color}</span>}
                    </div>
                    <p className="text-gold font-semibold text-sm mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}
                      className="w-8 h-8 rounded-sm bg-secondary border border-border flex items-center justify-center text-foreground/70 hover:border-gold/50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-foreground text-sm w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}
                      className="w-8 h-8 rounded-sm bg-secondary border border-border flex items-center justify-center text-foreground/70 hover:border-gold/50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="glass-card rounded-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground text-sm uppercase tracking-wider">Subtotal</span>
              <span className="text-foreground font-display text-2xl">₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground text-sm uppercase tracking-wider">Shipping</span>
              <span className="text-gold text-sm font-semibold">FREE</span>
            </div>
            <div className="h-px bg-gradient-to-r from-gold/30 to-transparent mb-6" />
            <div className="flex justify-between items-center mb-6">
              <span className="text-foreground font-semibold text-sm uppercase tracking-wider">Total</span>
              <span className="gold-gradient-text font-display text-3xl">₹{totalPrice.toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              className="btn-gold flex items-center justify-center gap-3 py-4 rounded-sm text-sm w-full"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
