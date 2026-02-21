import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminFetch } from '@/context/AdminAuthContext';
import VariantBuilder from '@/components/admin/VariantBuilder';
import AddJewellery from './AddJewellery';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AddTshirt = () => {
    const { id, type } = useParams<{ id?: string; type?: string }>();
    const navigate = useNavigate();

    // Dispatch to jewellery form if type is 'jewellery'
    if (type === 'jewellery') return <AddJewellery />;

    const isEdit = !!id;

    const [categories, setCategories] = useState<any[]>([]);
    const [form, setForm] = useState({
        name: '', description: '', category_id: '', original_price: '',
        sale_price: '', stock: '', badge: '', is_variable: false,
    });
    const [images, setImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        adminFetch('/api/admin/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []));
        if (isEdit) {
            adminFetch(`/api/admin/products`).then(r => r.json()).then(d => {
                const p = d.find((x: any) => String(x.id) === id);
                if (p) {
                    setForm({ name: p.name, description: p.description || '', category_id: p.category_id || '', original_price: p.original_price, sale_price: p.sale_price || '', stock: p.stock, badge: p.badge || '', is_variable: !!p.is_variable });
                    setImages(typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []));
                    if (p.is_variable && p.variants) setVariants(p.variants);
                }
            });
        }
    }, [id]);

    const discountPct = form.original_price && form.sale_price
        ? Math.round((1 - Number(form.sale_price) / Number(form.original_price)) * 100) : 0;

    const uploadImage = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('zued_admin_token');
        const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        const json = await res.json();
        if (json.url) setImages(prev => [...prev, json.url]);
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const body = { ...form, product_type: 'tshirt', images, variants: form.is_variable ? variants : undefined };
        const res = await adminFetch(isEdit ? `/api/admin/products/${id}` : '/api/admin/products', {
            method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(body),
        });
        if (res.ok) { toast.success(isEdit ? 'Updated!' : 'Product created!'); navigate('/admin/products/tshirts'); }
        else { const d = await res.json(); toast.error(d.error || 'Error'); }
        setSaving(false);
    };

    const f = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

    return (
        <div className="p-6 min-h-screen">
            <button onClick={() => navigate('/admin/products/tshirts')} className="flex items-center gap-2 text-muted-foreground hover:text-gold text-xs mb-6 transition-colors">
                <ArrowLeft size={14} /> Back to Products
            </button>
            <h1 className="font-display text-2xl text-foreground tracking-widest mb-6">{isEdit ? 'EDIT' : 'ADD'} T-SHIRT</h1>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
                {/* Basic Info */}
                <div className="glass-card rounded-sm p-5 border border-border/60 space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic Info</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Product Name *</label>
                            <input value={form.name} onChange={e => f('name', e.target.value)} required
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60" />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Category</label>
                            <select value={form.category_id} onChange={e => f('category_id', e.target.value)}
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60">
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.parent_id ? '  └ ' : ''}{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Description</label>
                        <textarea value={form.description} onChange={e => f('description', e.target.value)} rows={3}
                            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60 resize-none" />
                    </div>
                </div>

                {/* Pricing */}
                <div className="glass-card rounded-sm p-5 border border-border/60 space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pricing & Stock</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Original Price (₹) *</label>
                            <input type="number" value={form.original_price} onChange={e => f('original_price', e.target.value)} required
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60" />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Sale Price (₹)</label>
                            <input type="number" value={form.sale_price} onChange={e => f('sale_price', e.target.value)}
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60" />
                        </div>
                        <div className="flex flex-col justify-end">
                            {discountPct > 0 && (
                                <span className="inline-flex items-center gap-1 px-3 py-2 rounded-sm bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold">
                                    {discountPct}% OFF
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Stock</label>
                            <input type="number" value={form.stock} onChange={e => f('stock', e.target.value)} disabled={form.is_variable}
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60 disabled:opacity-40" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Badge (optional, e.g. NEW, HOT)</label>
                        <input value={form.badge} onChange={e => f('badge', e.target.value)} placeholder="e.g. BESTSELLER"
                            className="w-full sm:w-48 bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60" />
                    </div>
                </div>

                {/* Images */}
                <div className="glass-card rounded-sm p-5 border border-border/60 space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Images</h2>
                    <div className="flex flex-wrap gap-3">
                        {images.map((img, i) => (
                            <div key={i} className="relative group">
                                <img src={img} className="w-20 h-20 object-cover rounded-sm border border-border" />
                                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive rounded-full text-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    ×
                                </button>
                            </div>
                        ))}
                        <label className="w-20 h-20 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 transition-colors text-muted-foreground hover:text-gold">
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <><Upload size={16} /><span className="text-[10px] mt-1">Upload</span></>}
                            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && uploadImage(e.target.files[0])} />
                        </label>
                    </div>
                </div>

                {/* Variable Product */}
                <div className="glass-card rounded-sm p-5 border border-border/60 space-y-4">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="variable" checked={form.is_variable} onChange={e => f('is_variable', e.target.checked)}
                            className="accent-gold w-4 h-4" />
                        <label htmlFor="variable" className="text-sm text-foreground font-semibold cursor-pointer">Variable Product (multiple colors/sizes/GSM)</label>
                    </div>
                    {form.is_variable && <VariantBuilder variants={variants} onChange={setVariants} />}
                </div>

                <button type="submit" disabled={saving} className="btn-gold px-8 py-3 rounded-sm text-sm flex items-center gap-2">
                    {saving && <Loader2 size={15} className="animate-spin" />}
                    {isEdit ? 'Save Changes' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default AddTshirt;
