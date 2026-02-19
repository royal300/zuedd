import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Star } from 'lucide-react';
import { jewelleryProducts } from '@/data/products';
import { getProductImage } from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const JewelleryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = jewelleryProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link to="/jewellery" className="btn-gold px-6 py-3 rounded-sm text-sm">
            Back to Jewellery
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in this Jewellery item.\n\nProduct: ${product.name}\nCategory: ${product.category}\nPrice: ${product.price}\n\nPlease share more details. Thank you!`
  );

  const whatsappUrl = `https://wa.me/918617201731?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate('/jewellery')}
            className="flex items-center gap-2 text-muted-foreground hover:text-gold text-xs tracking-wider uppercase mb-8 transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Jewellery
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
              {/* Gold shimmer effect overlay */}
              <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-transparent via-gold/5 to-transparent pointer-events-none" />
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

              {/* Features */}
              <div className="glass-card rounded-sm p-5 space-y-3">
                {[
                  '18K Gold Plating — Premium finish that lasts',
                  'Hypoallergenic Materials — Safe for all skin types',
                  'Handcrafted Quality — Each piece inspected individually',
                  'Luxury Packaging — Gift-ready presentation',
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Star size={12} className="text-gold mt-0.5 flex-shrink-0" fill="currentColor" />
                    <p className="text-muted-foreground text-xs leading-relaxed">{feature}</p>
                  </div>
                ))}
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
                Enquire on WhatsApp
              </a>

              <p className="text-muted-foreground text-xs text-center tracking-wider">
                Limited stock available · Enquire to confirm availability
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JewelleryDetail;
