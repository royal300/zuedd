import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminFetch } from '@/context/AdminAuthContext';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ProductManagement = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const res = await adminFetch(`/api/admin/products?type=${type === 'tshirts' ? 'tshirt' : 'jewellery'}`);
        const json = await res.json();
        setProducts(Array.isArray(json) ? json : []);
        setLoading(false);
    };

    useEffect(() => { load(); }, [type]);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        toast.success('Deleted');
        await load();
    };

    const addRoute = type === 'tshirts' ? '/admin/products/tshirts/add' : '/admin/products/jewellery/add';
    const editRoute = (id: number) => type === 'tshirts' ? `/admin/products/tshirts/edit/${id}` : `/admin/products/jewellery/edit/${id}`;

    return (
        <div className="p-6 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl text-foreground tracking-widest">{type === 'tshirts' ? 'T-SHIRTS' : 'JEWELLERY'}</h1>
                <button onClick={() => navigate(addRoute)} className="btn-gold px-4 py-2 rounded-sm text-sm flex items-center gap-2">
                    <Plus size={14} /> Add Product
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-gold" /></div>
            ) : (
                <div className="glass-card rounded-sm border border-border/60 overflow-hidden">
                    {products.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-16">No products yet. Add your first one!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/40 bg-secondary/30">
                                        {['Image', 'Name', 'Category', 'Price', 'Stock', 'Badge', 'Status', ''].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => {
                                        const imgs = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
                                        const discountPct = p.sale_price ? Math.round((1 - p.sale_price / p.original_price) * 100) : 0;
                                        return (
                                            <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/10 transition-colors">
                                                <td className="px-4 py-3">
                                                    {imgs[0] ? <img src={imgs[0]} className="w-12 h-12 object-cover rounded-sm border border-border" /> : <div className="w-12 h-12 bg-secondary rounded-sm border border-border" />}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-foreground font-medium">{p.name}</p>
                                                    {p.is_variable && <span className="text-xs text-gold">Variable</span>}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">{p.category_name || '—'}</td>
                                                <td className="px-4 py-3">
                                                    {p.sale_price ? (
                                                        <div>
                                                            <span className="text-xs text-muted-foreground line-through">₹{Number(p.original_price).toLocaleString()}</span>
                                                            <span className="text-sm text-gold font-semibold ml-1">₹{Number(p.sale_price).toLocaleString()}</span>
                                                            <span className="ml-1 text-[10px] text-green-400">{discountPct}% off</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-foreground">₹{Number(p.original_price).toLocaleString()}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-foreground">{p.stock}</td>
                                                <td className="px-4 py-3">
                                                    {p.badge && <span className="text-[10px] bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded-sm">{p.badge}</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-sm border ${p.active ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-muted-foreground bg-secondary border-border'}`}>
                                                        {p.active ? 'Active' : 'Hidden'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => navigate(editRoute(p.id))} className="text-muted-foreground hover:text-gold transition-colors p-1">
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
