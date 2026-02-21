import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingCart, Play, Loader2 } from 'lucide-react';
import { tshirtProducts } from '@/data/products';
import { getProductImage } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import tshirtVideo from '@/assets/tshirt-video.mp4';

const colorSwatches: Record<string, string> = {
  Black: '#0a0a0a', White: '#f5f5f5', Red: '#c0392b',
  Blue: '#2c3e50', Beige: '#d2b48c', Grey: '#888', Navy: '#1a1a4e',
};

// Helper — resolve an image to a displayable URL
const resolveImage = (img: string): string => {
  if (!img) return '';
  if (img.startsWith('http') || img.startsWith('/uploads')) return img;
  // Hardcoded asset map
  return getProductImage(img);
};

const TShirtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Is this an API product?
  const isApi = id?.startsWith('api-');
  const apiId = isApi ? id!.replace('api-', '') : null;

  // Hardcoded product
  const staticProduct = !isApi ? tshirtProducts.find((p) => p.id === id) : undefined;

  // API product state
  const [apiProduct, setApiProduct] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(isApi);

  useEffect(() => {
    if (!isApi || !apiId) return;
    fetch(`/api/products/${apiId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setApiProduct(d); setApiLoading(false); })
      .catch(() => setApiLoading(false));
  }, [apiId, isApi]);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedGsm, setSelectedGsm] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Set defaults once api product loads
  useEffect(() => {
    if (!apiProduct) return;
    const imgs = typeof apiProduct.images === 'string' ? JSON.parse(apiProduct.images) : (apiProduct.images || []);
    const variants: any[] = typeof apiProduct.variants === 'string' ? JSON.parse(apiProduct.variants) : (apiProduct.variants || []);
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
      if (variants[0].color) setSelectedColor(variants[0].color);
      if (variants[0].size) setSelectedSize(variants[0].size);
      if (variants[0].gsm) setSelectedGsm(variants[0].gsm);
    }
  }, [apiProduct]);

  // Loading state
  if (apiLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  // Product not found
  if (!staticProduct && !apiProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link to="/tshirts" className="btn-gold px-6 py-3 rounded-sm text-sm">Back to T-Shirts</Link>
        </div>
      </div>
    );
  }

  // === STATIC PRODUCT UI ===
  if (staticProduct) {
    const product = staticProduct;
    const isDynamic = !!product.dynamicPricing;
    const currentPrice = isDynamic && product.dynamicPricing?.[selectedGsm]?.[selectedSize]
      ? product.dynamicPricing[selectedGsm][selectedSize]
      : parseInt(product.price.replace(/[₹,]/g, ''));
    const currentMainImage = isDynamic && product.colorImages?.[selectedColor]
      ? product.colorImages[selectedColor]
      : product.gallery[activeImage] || product.image;
    const galleryImages = isDynamic && product.colorImages?.[selectedColor]
      ? [product.colorImages[selectedColor], ...product.gallery.filter(g => g !== product.colorImages![selectedColor]).slice(0, 2)]
      : product.gallery;

    const handleAddToCart = () => {
      addToCart({ productId: product.id, productType: 'tshirt', name: product.name, price: currentPrice, image: currentMainImage, quantity: 1, size: selectedSize, gsm: selectedGsm, color: selectedColor });
      toast.success(`${product.name} added to cart!`);
    };

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate('/tshirts')} className="flex items-center gap-2 text-muted-foreground hover:text-gold text-xs tracking-wider uppercase mb-8 transition-colors group">
              <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />Back to T-Shirts
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              <div className="space-y-3">
                <div className="relative aspect-square rounded-sm overflow-hidden gold-border-glow">
                  {showVideo ? (
                    <video src={tshirtVideo} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  ) : (
                    <img src={getProductImage(activeImage === 0 ? currentMainImage : galleryImages[activeImage])} alt={product.name} className="w-full h-full object-cover animate-scale-in" />
                  )}
                  {product.badge && <div className="absolute top-4 left-4 gradient-gold-bg text-background text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm">{product.badge}</div>}
                </div>
                <div className="flex gap-2">
                  {galleryImages.map((img, i) => (
                    <button key={i} onClick={() => { setActiveImage(i); setShowVideo(false); }}
                      className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${!showVideo && activeImage === i ? 'border-gold shadow-[0_0_10px_hsl(43,74%,49%,0.4)]' : 'border-border hover:border-gold/50'}`}>
                      <img src={getProductImage(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <button onClick={() => setShowVideo(true)} className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all relative bg-secondary flex items-center justify-center ${showVideo ? 'border-gold' : 'border-border hover:border-gold/50'}`}>
                    <Play size={20} className="text-gold" fill="currentColor" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div>
                  <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">{product.category}</p>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-wider leading-none mb-3">{product.name.toUpperCase()}</h1>
                  <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                </div>
                <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />
                <div>
                  <p className="text-muted-foreground text-xs tracking-wider uppercase mb-1">Price</p>
                  <p className="gold-gradient-text font-display text-3xl">₹{currentPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-2">Size: <span className="text-foreground">{selectedSize}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`w-11 h-11 rounded-sm text-sm font-semibold tracking-wider transition-all duration-200 ${selectedSize === size ? 'gradient-gold-bg text-background shadow-[0_0_15px_hsl(43,74%,49%,0.4)]' : 'bg-secondary border border-border text-foreground/70 hover:border-gold/50'}`}>{size}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-2">GSM: <span className="text-foreground">{selectedGsm}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.gsm.map(g => (
                      <button key={g} onClick={() => setSelectedGsm(g)} className={`px-4 py-2 rounded-sm text-xs font-semibold tracking-wider transition-all duration-200 ${selectedGsm === g ? 'gradient-gold-bg text-background' : 'bg-secondary border border-border text-foreground/70 hover:border-gold/50'}`}>{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-2">Color: <span className="text-foreground">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button key={color} onClick={() => { setSelectedColor(color); setActiveImage(0); setShowVideo(false); }} title={color}
                        className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 ${selectedColor === color ? 'border-gold shadow-[0_0_12px_hsl(43,74%,49%,0.6)] scale-110' : 'border-border hover:border-gold/50 hover:scale-105'}`}
                        style={{ backgroundColor: colorSwatches[color] || '#888' }}>
                        {selectedColor === color && <Check size={14} className={`absolute inset-0 m-auto ${color === 'White' ? 'text-background' : 'text-foreground'}`} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />
                <button onClick={handleAddToCart} className="btn-gold flex items-center justify-center gap-3 py-4 rounded-sm text-sm w-full">
                  <ShoppingCart size={18} /> Add to Cart — ₹{currentPrice.toLocaleString()}
                </button>
                <p className="text-muted-foreground text-xs text-center tracking-wider">Made to order · Ships in 5–7 business days</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // === API PRODUCT UI ===
  const p = apiProduct;
  const images: string[] = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
  const variants: any[] = typeof p.variants === 'string' ? JSON.parse(p.variants) : (p.variants || []);
  const isVariable = p.is_variable && variants.length > 0;

  // Unique attribute options
  const colors = [...new Set(variants.map((v: any) => v.color).filter(Boolean))] as string[];
  const sizes = [...new Set(variants.map((v: any) => v.size).filter(Boolean))] as string[];
  const gsms = [...new Set(variants.map((v: any) => v.gsm).filter(Boolean))] as string[];

  // Current variant & price
  const currentVariant = isVariable
    ? variants.find((v: any) =>
      (!selectedColor || v.color === selectedColor) &&
      (!selectedSize || v.size === selectedSize) &&
      (!selectedGsm || v.gsm === selectedGsm)
    ) || variants[0]
    : null;

  const displayPrice = currentVariant?.price
    ? Number(currentVariant.price)
    : Number(p.sale_price || p.original_price);

  const displayImage = currentVariant?.image
    ? resolveImage(currentVariant.image)
    : images[activeImage]
      ? resolveImage(images[activeImage])
      : '';

  const hasSale = p.original_price && p.sale_price && Number(p.original_price) > Number(p.sale_price);

  const handleAddApiToCart = () => {
    addToCart({
      productId: `api-${p.id}`,
      productType: 'tshirt',
      name: p.name,
      price: displayPrice,
      image: displayImage,
      quantity: 1,
      size: selectedSize || undefined,
      gsm: selectedGsm || undefined,
      color: selectedColor || undefined,
    });
    toast.success(`${p.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/tshirts')} className="flex items-center gap-2 text-muted-foreground hover:text-gold text-xs tracking-wider uppercase mb-8 transition-colors group">
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />Back to T-Shirts
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-sm overflow-hidden gold-border-glow bg-secondary">
                {displayImage ? (
                  <img src={displayImage} alt={p.name} className="w-full h-full object-cover animate-scale-in" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
                )}
                {p.badge && <div className="absolute top-4 left-4 gradient-gold-bg text-background text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm">{p.badge}</div>}
                {hasSale && <div className="absolute top-4 right-4 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm">SALE</div>}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${activeImage === i ? 'border-gold shadow-[0_0_10px_hsl(43,74%,49%,0.4)]' : 'border-border hover:border-gold/50'}`}>
                      <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5 animate-fade-in-up">
              <div>
                {p.category_name && <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">{p.category_name}</p>}
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-wider leading-none mb-3">{p.name.toUpperCase()}</h1>
                {p.description && <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>}
              </div>

              <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />

              <div>
                <p className="text-muted-foreground text-xs tracking-wider uppercase mb-1">Price</p>
                <div className="flex items-end gap-3">
                  <p className="gold-gradient-text font-display text-3xl">₹{displayPrice.toLocaleString()}</p>
                  {hasSale && <p className="text-muted-foreground text-sm line-through mb-1">₹{Number(p.original_price).toLocaleString()}</p>}
                </div>
              </div>

              {/* Variant selectors */}
              {isVariable && (
                <>
                  {colors.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-2">Color: <span className="text-foreground">{selectedColor}</span></p>
                      <div className="flex flex-wrap gap-3">
                        {colors.map(color => (
                          <button key={color} onClick={() => setSelectedColor(color)} title={color}
                            className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 ${selectedColor === color ? 'border-gold shadow-[0_0_12px_hsl(43,74%,49%,0.6)] scale-110' : 'border-border hover:border-gold/50 hover:scale-105'}`}
                            style={{ backgroundColor: colorSwatches[color] || '#888' }}>
                            {selectedColor === color && <Check size={14} className="absolute inset-0 m-auto text-foreground" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {sizes.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-2">Size: <span className="text-foreground">{selectedSize}</span></p>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                          <button key={size} onClick={() => setSelectedSize(size)}
                            className={`w-11 h-11 rounded-sm text-sm font-semibold tracking-wider transition-all duration-200 ${selectedSize === size ? 'gradient-gold-bg text-background' : 'bg-secondary border border-border text-foreground/70 hover:border-gold/50'}`}>{size}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {gsms.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-2">GSM: <span className="text-foreground">{selectedGsm}</span></p>
                      <div className="flex flex-wrap gap-2">
                        {gsms.map(g => (
                          <button key={g} onClick={() => setSelectedGsm(g)}
                            className={`px-4 py-2 rounded-sm text-xs font-semibold tracking-wider transition-all duration-200 ${selectedGsm === g ? 'gradient-gold-bg text-background' : 'bg-secondary border border-border text-foreground/70 hover:border-gold/50'}`}>{g}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />

              <button onClick={handleAddApiToCart} className="btn-gold flex items-center justify-center gap-3 py-4 rounded-sm text-sm w-full">
                <ShoppingCart size={18} /> Add to Cart — ₹{displayPrice.toLocaleString()}
              </button>
              <p className="text-muted-foreground text-xs text-center tracking-wider">Made to order · Ships in 5–7 business days</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TShirtDetail;
