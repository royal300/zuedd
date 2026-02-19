import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Check } from 'lucide-react';
import { tshirtProducts } from '@/data/products';
import { getProductImage } from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const colorSwatches: Record<string, string> = {
  Black: '#0a0a0a',
  White: '#f5f5f5',
  Red: '#c0392b',
  Blue: '#2c3e50',
  Beige: '#d2b48c',
};

const TShirtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = tshirtProducts.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedGsm, setSelectedGsm] = useState('240 GSM');
  const [selectedColor, setSelectedColor] = useState('Black');

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link to="/tshirts" className="btn-gold px-6 py-3 rounded-sm text-sm">
            Back to T-Shirts
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I want to book this T-Shirt.\n\nProduct: ${product.name}\nSize: ${selectedSize}\nGSM: ${selectedGsm}\nColor: ${selectedColor}\n\nPlease confirm availability and pricing. Thank you!`
  );

  const whatsappUrl = `https://wa.me/918617201731?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate('/tshirts')}
            className="flex items-center gap-2 text-muted-foreground hover:text-gold text-xs tracking-wider uppercase mb-8 transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to T-Shirts
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-sm overflow-hidden gold-border-glow">
                <img
                  src={getProductImage(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover animate-scale-in"
                />
              </div>
              {product.badge && (
                <div className="absolute top-4 left-4 gradient-gold-bg text-background text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div>
                <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">{product.category}</p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-wider leading-none mb-3">
                  {product.name.toUpperCase()}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
              </div>

              <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />

              {/* Price */}
              <div>
                <p className="text-muted-foreground text-xs tracking-wider uppercase mb-1">Price</p>
                <p className="gold-gradient-text font-display text-3xl">{product.price}</p>
              </div>

              {/* Size */}
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-3">
                  Size: <span className="text-foreground">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-sm text-sm font-semibold tracking-wider transition-all duration-200 ${
                        selectedSize === size
                          ? 'gradient-gold-bg text-background shadow-[0_0_15px_hsl(43,74%,49%,0.4)]'
                          : 'bg-secondary border border-border text-foreground/70 hover:border-gold/50 hover:text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* GSM */}
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-3">
                  GSM: <span className="text-foreground">{selectedGsm}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.gsm.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGsm(g)}
                      className={`px-4 py-2 rounded-sm text-xs font-semibold tracking-wider transition-all duration-200 ${
                        selectedGsm === g
                          ? 'gradient-gold-bg text-background shadow-[0_0_15px_hsl(43,74%,49%,0.4)]'
                          : 'bg-secondary border border-border text-foreground/70 hover:border-gold/50 hover:text-foreground'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-3">
                  Color: <span className="text-foreground">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-gold shadow-[0_0_12px_hsl(43,74%,49%,0.6)] scale-110'
                          : 'border-border hover:border-gold/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorSwatches[color] || '#888' }}
                    >
                      {selectedColor === color && (
                        <Check
                          size={14}
                          className={`absolute inset-0 m-auto ${color === 'White' ? 'text-background' : 'text-foreground'}`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />

              {/* CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center justify-center gap-3 py-4 rounded-sm text-sm w-full"
              >
                <MessageCircle size={18} />
                Book Now on WhatsApp
              </a>

              <p className="text-muted-foreground text-xs text-center tracking-wider">
                Made to order · Ships in 5–7 business days
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TShirtDetail;
