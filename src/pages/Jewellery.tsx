import { useState, useEffect } from 'react';
import { jewelleryProducts } from '@/data/products';
import { JewelleryCard } from '@/components/ProductCard';
import ApiProductCard from '@/components/ApiProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Jewellery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);

  const staticCats = ['All', 'Earrings', 'Rings', 'Chains', 'Pendants'];

  useEffect(() => {
    fetch('/api/products?type=jewellery')
      .then(r => r.ok ? r.json() : [])
      .then(d => setApiProducts(Array.isArray(d) ? d : []))
      .catch(() => { });

    fetch('/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(d => setApiCategories(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const apiCatNames = apiCategories
    .filter(c => c.product_type === 'jewellery' || c.product_type === 'all')
    .map(c => c.name);
  const extraCats = apiCatNames.filter(n => !staticCats.includes(n));
  const allCategories = [...staticCats, ...extraCats];

  const filteredStatic = activeCategory === 'All'
    ? jewelleryProducts
    : jewelleryProducts.filter(p => p.category === activeCategory);

  const filteredApi = apiProducts.filter(p => {
    if (activeCategory === 'All') return true;
    return p.category_name === activeCategory;
  });

  const totalCount = jewelleryProducts.length + apiProducts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-gold/8 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4 animate-fade-in">
            Luxury Collection
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-foreground tracking-wider animate-fade-in-up">
            ANTI TARNISH
            <span className="block gold-gradient-text">JEWELLERY</span>
          </h1>
          <p className="text-muted-foreground text-sm tracking-wider max-w-md mx-auto mt-4 animate-fade-in delay-200">
            Adorn yourself in luxury. Each piece is a statement of your excellence.
          </p>
          <div className="flex items-center gap-4 justify-center mt-6 animate-fade-in delay-300">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold text-[10px] tracking-[0.4em] uppercase">{totalCount} Pieces</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-sm text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${activeCategory === cat ? 'btn-gold' : 'btn-outline-gold'
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
            {filteredStatic.map((product, i) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <JewelleryCard product={product} />
              </div>
            ))}
            {filteredApi.map((product, i) => (
              <div key={`api-${product.id}`} className="animate-fade-in-up" style={{ animationDelay: `${(filteredStatic.length + i) * 0.08}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <ApiProductCard product={product} type="jewellery" />
              </div>
            ))}
          </div>
          {filteredStatic.length === 0 && filteredApi.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-16">No products in this category.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jewellery;
