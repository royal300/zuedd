import { Link } from 'react-router-dom';
import { TShirtProduct, JewelleryProduct } from '@/data/products';

// T-shirt product images
import tshirt1 from '@/assets/tshirt-1.jpg';
import tshirt2 from '@/assets/tshirt-2.jpg';
import tshirt3 from '@/assets/tshirt-3.jpg';
import tshirt4 from '@/assets/tshirt-4.jpg';
import tshirt5 from '@/assets/tshirt-5.jpg';
import jewellery1 from '@/assets/jewellery-1.jpg';
import jewellery2 from '@/assets/jewellery-2.jpg';
import jewellery3 from '@/assets/jewellery-3.jpg';
import jewellery4 from '@/assets/jewellery-4.jpg';
import jewellery5 from '@/assets/jewellery-5.jpg';

const tshirtImages: Record<string, string> = {
  '/tshirt-images/1': tshirt1,
  '/tshirt-images/2': tshirt2,
  '/tshirt-images/3': tshirt3,
  '/tshirt-images/4': tshirt4,
  '/tshirt-images/5': tshirt5,
};

const jewelleryImages: Record<string, string> = {
  '/jewellery-images/1': jewellery1,
  '/jewellery-images/2': jewellery2,
  '/jewellery-images/3': jewellery3,
  '/jewellery-images/4': jewellery4,
  '/jewellery-images/5': jewellery5,
};

export const getProductImage = (imagePath: string): string => {
  return tshirtImages[imagePath] || jewelleryImages[imagePath] || tshirt1;
};

interface TShirtCardProps {
  product: TShirtProduct;
}

interface JewelleryCardProps {
  product: JewelleryProduct;
}

export const TShirtCard = ({ product }: TShirtCardProps) => {
  return (
    <Link
      to={`/tshirts/${product.id}`}
      className="group block bg-card rounded-sm overflow-hidden product-card-hover gold-border-glow"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={getProductImage(product.image)}
          alt={product.name}
          className="w-full h-full object-cover product-img"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 gradient-gold-bg text-background text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-sm">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="btn-gold px-4 py-2 rounded-sm text-[11px]">View Details</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-1">{product.category}</p>
        <h3 className="font-display text-lg tracking-wider text-foreground group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gold font-semibold text-sm mt-1">{product.price}</p>
      </div>
    </Link>
  );
};

export const JewelleryCard = ({ product }: JewelleryCardProps) => {
  return (
    <Link
      to={`/jewellery/${product.id}`}
      className="group block bg-card rounded-sm overflow-hidden product-card-hover gold-border-glow"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={getProductImage(product.image)}
          alt={product.name}
          className="w-full h-full object-cover product-img"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 gradient-gold-bg text-background text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-sm">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="btn-gold px-4 py-2 rounded-sm text-[11px]">View Details</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-1">{product.category}</p>
        <h3 className="font-display text-lg tracking-wider text-foreground group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gold font-semibold text-sm mt-1">{product.price}</p>
      </div>
    </Link>
  );
};
