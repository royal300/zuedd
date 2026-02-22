import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'T-Shirts', to: '/tshirts' },
    { label: 'Jewellery', to: '/jewellery' },
    { label: 'Contact', to: '#contact' },
  ];

  const isActive = (to: string) => location.pathname === to;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/zued-logo.png"
              alt="ZUED - Wear The Difference"
              className="h-20 sm:h-24 lg:h-32 w-auto object-contain object-center transition-transform duration-300 group-hover:scale-105"
              width={340}
              height={170}
              fetchPriority="high"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`relative text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 group ${isActive(link.to)
                  ? 'text-gold'
                  : 'text-foreground/70 hover:text-foreground'
                  }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-300 ${isActive(link.to) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right side: Cart + Auth */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 btn-gold px-4 py-2 rounded-sm text-xs"
            >
              <ShoppingCart size={14} />
              <span className="hidden md:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth button */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 text-xs text-foreground/80 hover:text-gold border border-border hover:border-gold/40 px-3 py-2 rounded-sm transition-all duration-300"
                >
                  <User size={13} />
                  <span className="max-w-[100px] truncate">{user?.name || user?.email}</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border rounded-sm shadow-xl animate-fade-in">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm text-foreground truncate mt-0.5">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-xs text-foreground/70 hover:text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut size={13} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 text-xs text-foreground/70 hover:text-gold border border-border hover:border-gold/40 px-3 py-2 rounded-sm transition-all duration-300"
              >
                <User size={13} />
                Sign In
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-foreground/80 hover:text-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
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
                className={`block text-sm font-semibold tracking-[0.2em] uppercase py-2 border-b border-border/50 transition-colors ${isActive(link.to) ? 'text-gold' : 'text-foreground/70 hover:text-gold'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-destructive py-2 transition-colors w-full"
              >
                <LogOut size={14} />
                Sign Out ({user?.name || user?.email})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold py-2 transition-colors"
              >
                <User size={14} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
