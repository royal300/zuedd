import { useEffect, useState } from 'react';
import { adminFetch } from '@/context/AdminAuthContext';
import { Plus, Loader2, ToggleLeft, ToggleRight, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

const PromoManagement = () => {
    const [promos, setPromos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ code: '', discount_type: 'percent', discount_value: '', min_order: '', max_uses: '', expires_at: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        const res = await adminFetch('/api/admin/promos');
        const json = await res.json();
        setPromos(Array.isArray(json) ? json : []);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        const res = await adminFetch('/api/admin/promos', { method: 'POST', body: JSON.stringify(form) });
        const json = await res.json();
        if (!res.ok) setError(json.error || 'Error');
        else { setForm({ code: '', discount_type: 'percent', discount_value: '', min_order: '', max_uses: '', expires_at: '' }); await load(); toast.success('Promo code created!'); }
        setSaving(false);
    };

    const toggle = async (id: number, active: boolean) => {
        await adminFetch(`/api/admin/promos/${id}`, { method: 'PATCH', body: JSON.stringify({ active }) });
        await load();
    };

    const deletePromo = async (id: number) => {
        if (!confirm('Delete this promo code?')) return;
        await adminFetch(`/api/admin/promos/${id}`, { method: 'DELETE' });
        await load();
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        setForm(p => ({ ...p, code }));
    };

    const f = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

    return (
        <div className="p-6 min-h-screen">
            <h1 className="font-display text-2xl text-foreground tracking-widest mb-6">PROMO CODES</h1>

            {/* Create Form */}
            <div className="glass-card rounded-sm p-6 border border-border/60 mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Create Promo Code</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Code *</label>
                            <div className="flex gap-2">
                                <input value={form.code} onChange={e => f('code', e.target.value.toUpperCase())} required placeholder="SUMMER20"
                                    className="flex-1 bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60 font-mono" />
                                <button type="button" onClick={generateCode} className="border border-border text-xs text-muted-foreground px-2 py-1 rounded-sm hover:text-gold hover:border-gold/40 transition-colors whitespace-nowrap">Auto</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Discount Type *</label>
                            <select value={form.discount_type} onChange={e => f('discount_type', e.target.value)}
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60">
                                <option value="percent">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Discount Value *</label>
                            <input type="number" value={form.discount_value} onChange={e => f('discount_value', e.target.value)} required
                                placeholder={form.discount_type === 'percent' ? 'e.g. 15' : 'e.g. 200'}
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Min Order Amount (₹)</label>
                            <input type="number" value={form.min_order} onChange={e => f('min_order', e.target.value)}
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60" />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Max Uses (blank = unlimited)</label>
                            <input type="number" value={form.max_uses} onChange={e => f('max_uses', e.target.value)}
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60" />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Expires On</label>
                            <input type="date" value={form.expires_at} onChange={e => f('expires_at', e.target.value)}
                                className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60" />
                        </div>
                    </div>
                    {error && <p className="text-destructive text-xs">{error}</p>}
                    <button type="submit" disabled={saving} className="btn-gold px-5 py-2 rounded-sm text-sm flex items-center gap-2">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Code
                    </button>
                </form>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-gold" /></div>
            ) : (
                <div className="glass-card rounded-sm border border-border/60 overflow-hidden">
                    {promos.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-10">No promo codes yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/40 bg-secondary/30">
                                        {['Code', 'Discount', 'Min Order', 'Uses', 'Expires', 'Status', ''].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {promos.map(p => (
                                        <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/10">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm text-gold font-bold">{p.code}</span>
                                                    <button onClick={() => { navigator.clipboard.writeText(p.code); toast.success('Copied!'); }} className="text-muted-foreground hover:text-foreground transition-colors">
                                                        <Copy size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground">
                                                {p.discount_type === 'percent' ? `${p.discount_value}%` : `₹${p.discount_value}`}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{p.min_order > 0 ? `₹${p.min_order}` : '—'}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {p.used_count}{p.max_uses ? ` / ${p.max_uses}` : ' (∞)'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{p.expires_at ? new Date(p.expires_at).toLocaleDateString() : '—'}</td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => toggle(p.id, !p.active)} className="transition-colors">
                                                    {p.active ? <ToggleRight size={20} className="text-gold" /> : <ToggleLeft size={20} className="text-muted-foreground" />}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => deletePromo(p.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PromoManagement;
