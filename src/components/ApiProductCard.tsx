import { Link } from 'react-router-dom';

interface Props {
    product: {
        id: number;
        name: string;
        sale_price: number;
        original_price?: number;
        images?: string[];
        badge?: string;
        category_name?: string;
    };
    type: 'tshirt' | 'jewellery';
}

const ApiProductCard = ({ product, type }: Props) => {
    const href = type === 'tshirt' ? `/tshirts/api-${product.id}` : `/jewellery/api-${product.id}`;
    const imageUrl = product.images?.[0]
        ? product.images[0].startsWith('http') || product.images[0].startsWith('/uploads')
            ? product.images[0]
            : `/uploads/${product.images[0]}`
        : null;

    const hasSale = product.original_price && product.original_price > product.sale_price;
    const discountPct = hasSale
        ? Math.round((1 - product.sale_price / product.original_price!) * 100)
        : 0;

    return (
        <Link to={href} className="group block bg-card rounded-sm overflow-hidden product-card-hover gold-border-glow">
            <div className="relative aspect-square overflow-hidden bg-secondary">
                {imageUrl ? (
                    <img src={imageUrl} alt={product.name} className="w-full h-full object-cover product-img" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
                )}
                {product.badge && (
                    <span className="absolute top-3 left-3 gradient-gold-bg text-background text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-sm">
                        {product.badge}
                    </span>
                )}
                {hasSale && (
                    <span className="absolute top-3 right-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm">
                        -{discountPct}%
                    </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="btn-gold px-4 py-2 rounded-sm text-[11px]">View Details</span>
                </div>
            </div>
            <div className="p-4">
                {product.category_name && (
                    <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-1">{product.category_name}</p>
                )}
                <h3 className="font-display text-lg tracking-wider text-foreground group-hover:text-gold transition-colors duration-300">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-gold font-semibold text-sm">₹{product.sale_price.toLocaleString()}</p>
                    {hasSale && (
                        <p className="text-muted-foreground text-xs line-through">₹{product.original_price!.toLocaleString()}</p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ApiProductCard;
