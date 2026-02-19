import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'T-Shirts', to: '/tshirts' },
    { label: 'Jewellery', to: '/jewellery' },
    { label: 'Contact', to: '#contact' },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="UED"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`relative text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 group ${
                  isActive(link.to)
                    ? 'text-gold'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-300 ${
                    isActive(link.to) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/918617201731"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 btn-gold px-4 py-2 rounded-sm text-xs"
          >
            <MessageCircle size={14} />
            WhatsApp Us
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground/80 hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-semibold tracking-[0.2em] uppercase py-2 border-b border-border/50 transition-colors ${
                  isActive(link.to) ? 'text-gold' : 'text-foreground/70 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/918617201731"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 btn-gold px-4 py-3 rounded-sm w-full text-xs mt-4"
            >
              <MessageCircle size={14} />
              WhatsApp Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
