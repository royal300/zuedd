import { useEffect, useState } from 'react';
import { adminFetch } from '@/context/AdminAuthContext';
import { Plus, Trash2, Loader2, ChevronRight } from 'lucide-react';

const CategoryManagement = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState('');
    const [productType, setProductType] = useState('all');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        const res = await adminFetch('/api/admin/categories');
        const json = await res.json();
        setCategories(Array.isArray(json) ? json : []);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const mainCats = categories.filter(c => !c.parent_id);
    const subCats = categories.filter(c => c.parent_id);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        const res = await adminFetch('/api/admin/categories', {
            method: 'POST',
            body: JSON.stringify({ name, parent_id: parentId || null, product_type: productType }),
        });
        const json = await res.json();
        if (!res.ok) setError(json.error || 'Error');
        else { setName(''); setParentId(''); setProductType('all'); await load(); }
        setSaving(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this category? Sub-categories will also be deleted.')) return;
        await adminFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
        await load();
    };

    return (
        <div className="p-6 min-h-screen">
            <h1 className="font-display text-2xl text-foreground tracking-widest mb-6">CATEGORIES</h1>

            {/* Add Form */}
            <div className="glass-card rounded-sm p-6 border border-border/60 mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Add Category</h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60 col-span-1"
                    />
                    <select
                        value={parentId}
                        onChange={e => setParentId(e.target.value)}
                        className="bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60"
                    >
                        <option value="">— Main Category —</option>
                        {mainCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select
                        value={productType}
                        onChange={e => setProductType(e.target.value)}
                        className="bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60"
                    >
                        <option value="all">All</option>
                        <option value="tshirt">T-Shirt</option>
                        <option value="jewellery">Jewellery</option>
                    </select>
                    <button type="submit" disabled={saving} className="btn-gold rounded-sm py-2 text-sm flex items-center justify-center gap-2">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                        Add
                    </button>
                </form>
                {error && <p className="text-destructive text-xs mt-2">{error}</p>}
            </div>

            {/* Category Tree */}
            {loading ? (
                <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-gold" /></div>
            ) : (
                <div className="glass-card rounded-sm border border-border/60 overflow-hidden">
                    {mainCats.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-10">No categories yet. Add one above.</p>
                    ) : (
                        mainCats.map(main => (
                            <div key={main.id} className="border-b border-border/40 last:border-0">
                                <div className="flex items-center justify-between px-5 py-3 bg-secondary/20">
                                    <div className="flex items-center gap-2">
                                        <span className="text-foreground font-semibold text-sm">{main.name}</span>
                                        <span className="text-xs text-muted-foreground bg-secondary border border-border px-2 py-0.5 rounded-sm">{main.product_type}</span>
                                    </div>
                                    <button onClick={() => handleDelete(main.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                {subCats.filter(s => s.parent_id === main.id).map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between px-5 py-2.5 pl-10 border-t border-border/30">
                                        <div className="flex items-center gap-2">
                                            <ChevronRight size={12} className="text-muted-foreground" />
                                            <span className="text-sm text-foreground/80">{sub.name}</span>
                                            <span className="text-xs text-muted-foreground bg-secondary border border-border px-2 py-0.5 rounded-sm">{sub.product_type}</span>
                                        </div>
                                        <button onClick={() => handleDelete(sub.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
