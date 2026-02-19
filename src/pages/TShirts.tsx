import { useState } from 'react';
import { tshirtProducts } from '@/data/products';
import { TShirtCard } from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categories = ['All', 'Oversized', 'Baggy', 'Regular Fit'] as const;
type Category = typeof categories[number];

const TShirts = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filtered = activeCategory === 'All'
    ? tshirtProducts
    : tshirtProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4 animate-fade-in">
            Print on Demand
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-foreground tracking-wider animate-fade-in-up">
            PREMIUM
            <span className="block gold-gradient-text">T-SHIRTS</span>
          </h1>
          <p className="text-muted-foreground text-sm tracking-wider max-w-md mx-auto mt-4 animate-fade-in delay-200">
            Crafted for those who dress with intention. Premium fabrics, flawless silhouettes.
          </p>
          <div className="flex items-center gap-4 justify-center mt-6 animate-fade-in delay-300">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold text-[10px] tracking-[0.4em] uppercase">
              {tshirtProducts.length} Products
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-sm text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? 'btn-gold'
                    : 'btn-outline-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <TShirtCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TShirts;
