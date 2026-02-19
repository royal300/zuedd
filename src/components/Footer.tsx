import { Link } from 'react-router-dom';
import { MessageCircle, Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer id="contact" className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <img src={logo} alt="UED" className="h-12 w-auto object-contain" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium print-on-demand tees & luxury jewellery. Crafted for those who refuse to blend in.
            </p>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-semibold">
              Wear The Difference.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-foreground font-display text-xl tracking-widest">Navigate</h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'T-Shirts', to: '/tshirts' },
                { label: 'Jewellery', to: '/jewellery' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-muted-foreground hover:text-gold text-sm tracking-wider uppercase transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-foreground font-display text-xl tracking-widest">Connect</h4>
            <a
              href="https://wa.me/918617201731"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-sm gradient-gold-bg flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_hsl(43,74%,49%,0.5)] transition-all duration-300">
                <MessageCircle size={18} className="text-background" />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">WhatsApp</p>
                <p className="text-muted-foreground text-xs">+91 86172 01731</p>
              </div>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-sm bg-secondary border border-border flex items-center justify-center flex-shrink-0 group-hover:border-gold group-hover:shadow-[0_0_15px_hsl(43,74%,49%,0.3)] transition-all duration-300">
                <Instagram size={18} className="text-foreground/70 group-hover:text-gold transition-colors" />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">Instagram</p>
                <p className="text-muted-foreground text-xs">@ued.official</p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs tracking-wider">
            © 2025 UED. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs tracking-wider">
            Premium Fashion · Made to Order
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
