import { useState, useEffect } from 'react';
import { tshirtProducts } from '@/data/products';
import { TShirtCard } from '@/components/ProductCard';
import ApiProductCard from '@/components/ApiProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TShirts = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);

  // Hardcoded fallback categories
  const staticCats = ['All', 'Oversized', 'Baggy', 'Regular Fit'];

  useEffect(() => {
    // Fetch API products (t-shirts)
    fetch('/api/products?type=tshirt')
      .then(r => r.ok ? r.json() : [])
      .then(d => setApiProducts(Array.isArray(d) ? d : []))
      .catch(() => { });

    // Fetch categories from API
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(d => setApiCategories(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  // Build category list: static + any from API that aren't already included
  const apiCatNames = apiCategories
    .filter(c => c.product_type === 'tshirt' || c.product_type === 'all')
    .map(c => c.name);
  const extraCats = apiCatNames.filter(n => !staticCats.includes(n));
  const allCategories = [...staticCats, ...extraCats];

  // Filter hardcoded products
  const filteredStatic = activeCategory === 'All'
    ? tshirtProducts
    : tshirtProducts.filter(p => p.category === activeCategory);

  // Filter API products by category name
  const filteredApi = apiProducts.filter(p => {
    if (activeCategory === 'All') return true;
    return p.category_name === activeCategory;
  });

  const totalCount = tshirtProducts.length + apiProducts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center">
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
            <span className="text-gold text-[10px] tracking-[0.4em] uppercase">{totalCount} Products</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 mb-10">
        <div className="max-w-6xl mx-auto">
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Hardcoded products */}
            {filteredStatic.map((product, i) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <TShirtCard product={product} />
              </div>
            ))}
            {/* API products */}
            {filteredApi.map((product, i) => (
              <div key={`api-${product.id}`} className="animate-fade-in-up" style={{ animationDelay: `${(filteredStatic.length + i) * 0.08}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <ApiProductCard product={product} type="tshirt" />
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

export default TShirts;
