import { Link } from 'react-router-dom';
import tshirtHero from '@/assets/tshirt-hero.jpg';
import jewelleryHero from '@/assets/jewellery-hero.jpg';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden noise-texture">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="text-center mb-12 lg:mb-16 animate-fade-in-up px-4">
        <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase mb-4">
          Premium Collections
        </p>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl gold-gradient-text leading-none">
          ZUED
        </h1>
        <p className="text-foreground/60 text-sm tracking-[0.3em] uppercase mt-4">
          Wear The Difference.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 px-4 sm:px-6 w-full max-w-4xl xl:max-w-5xl">
        {/* T-Shirts Card */}
        <Link
          to="/tshirts"
          className="group relative flex-1 rounded-lg overflow-hidden cursor-pointer animate-fade-in-up delay-200"
          style={{ minHeight: '420px' }}
        >
          <img src={tshirtHero} alt="T-Shirts" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 border border-foreground/10 rounded-lg transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_0_40px_hsl(43,74%,49%,0.3),inset_0_0_40px_hsl(43,74%,49%,0.05)]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="glass-card rounded-sm p-5 lg:p-6 transform transition-all duration-500 group-hover:-translate-y-2">
              <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">Premium Collection</p>
              <h2 className="font-display text-4xl lg:text-5xl text-foreground tracking-wider leading-none mb-3 group-hover:gold-gradient-text transition-all duration-300">T-SHIRTS</h2>
              <p className="text-muted-foreground text-xs tracking-wider mb-4">Oversized · Baggy · Regular Fit</p>
              <span className="btn-gold px-5 py-2.5 rounded-sm text-xs inline-flex items-center gap-2">
                Explore Collection
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Jewellery Card */}
        <Link
          to="/jewellery"
          className="group relative flex-1 rounded-lg overflow-hidden cursor-pointer animate-fade-in-up delay-400"
          style={{ minHeight: '420px' }}
        >
          <img src={jewelleryHero} alt="Jewellery" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 border border-foreground/10 rounded-lg transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_0_40px_hsl(43,74%,49%,0.3),inset_0_0_40px_hsl(43,74%,49%,0.05)]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="glass-card rounded-sm p-5 lg:p-6 transform transition-all duration-500 group-hover:-translate-y-2">
              <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">Luxury Collection</p>
              <h2 className="font-display text-4xl lg:text-5xl text-foreground tracking-wider leading-none mb-3">JEWELLERY</h2>
              <p className="text-muted-foreground text-xs tracking-wider mb-4">Earrings · Rings · Chains · Pendants</p>
              <span className="btn-gold px-5 py-2.5 rounded-sm text-xs inline-flex items-center gap-2">
                Explore Collection
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-12 text-center animate-fade-in delay-500 px-4">
        <div className="flex items-center gap-4 justify-center">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
          <p className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">Premium · Authentic · Exclusive</p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
