import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });

  if (items.length === 0 && step !== 'success') {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = () => {
    setStep('success');
    clearCart();
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full gradient-gold-bg flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-background" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-foreground tracking-wider mb-4">ORDER PLACED!</h1>
            <p className="text-muted-foreground text-sm mb-2">Thank you for your order. Your order has been placed successfully.</p>
            <p className="text-muted-foreground text-xs mb-8">Order ID: #ZUED-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            <button onClick={() => navigate('/')} className="btn-gold px-8 py-3 rounded-sm text-sm">
              Continue Shopping
            </button>
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
          <h1 className="font-display text-4xl sm:text-5xl text-foreground tracking-wider mb-8">CHECKOUT</h1>

          {/* Steps indicator */}
          <div className="flex items-center gap-4 mb-8">
            {['Details', 'Payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  (i === 0 && step === 'details') || (i === 1 && step === 'payment')
                    ? 'gradient-gold-bg text-background'
                    : i === 0 && step === 'payment'
                      ? 'gradient-gold-bg text-background'
                      : 'bg-secondary text-muted-foreground border border-border'
                }`}>
                  {i === 0 && step === 'payment' ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-xs tracking-wider uppercase text-muted-foreground">{s}</span>
                {i < 1 && <div className="w-12 h-px bg-border" />}
              </div>
            ))}
          </div>

          {step === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="font-display text-xl text-foreground tracking-wider mb-4">SHIPPING DETAILS</h2>
                {[
                  { label: 'Full Name', key: 'name', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Phone', key: 'phone', type: 'tel' },
                  { label: 'Address', key: 'address', type: 'text' },
                  { label: 'City', key: 'city', type: 'text' },
                  { label: 'Pincode', key: 'pincode', type: 'text' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-muted-foreground text-xs tracking-wider uppercase mb-1 block">{field.label}</label>
                    <input
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground text-sm focus:border-gold/50 focus:outline-none transition-colors"
                      placeholder={field.label}
                    />
                  </div>
                ))}
                <button
                  onClick={() => setStep('payment')}
                  className="btn-gold w-full py-3 rounded-sm text-sm mt-4"
                >
                  Continue to Payment
                </button>
              </div>
              {/* Order summary */}
              <div className="glass-card rounded-sm p-6 h-fit">
                <h3 className="font-display text-lg text-foreground tracking-wider mb-4">ORDER SUMMARY</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate max-w-[200px]">
                        {item.name} × {item.quantity}
                        {item.size && ` (${item.size})`}
                      </span>
                      <span className="text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-gradient-to-r from-gold/30 to-transparent my-4" />
                <div className="flex justify-between">
                  <span className="text-foreground font-semibold text-sm">Total</span>
                  <span className="gold-gradient-text font-display text-2xl">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="max-w-lg">
              <h2 className="font-display text-xl text-foreground tracking-wider mb-6">PAYMENT</h2>
              <div className="glass-card rounded-sm p-6 space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-sm border border-gold/30">
                  <div className="w-4 h-4 rounded-full gradient-gold-bg" />
                  <span className="text-foreground text-sm">Cash on Delivery (COD)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-sm border border-border opacity-50">
                  <div className="w-4 h-4 rounded-full bg-secondary border border-border" />
                  <span className="text-muted-foreground text-sm">UPI / Online Payment (Coming Soon)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-sm border border-border opacity-50">
                  <div className="w-4 h-4 rounded-full bg-secondary border border-border" />
                  <span className="text-muted-foreground text-sm">Credit / Debit Card (Coming Soon)</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-foreground font-semibold text-sm uppercase tracking-wider">Total Payable</span>
                <span className="gold-gradient-text font-display text-3xl">₹{totalPrice.toLocaleString()}</span>
              </div>
              <button onClick={handlePlaceOrder} className="btn-gold w-full py-4 rounded-sm text-sm">
                Place Order — ₹{totalPrice.toLocaleString()}
              </button>
              <button onClick={() => setStep('details')} className="text-muted-foreground text-xs text-center w-full mt-4 hover:text-gold transition-colors">
                ← Back to Details
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
