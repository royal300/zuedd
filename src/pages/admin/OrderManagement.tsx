import { useEffect, useState } from 'react';
import { adminFetch } from '@/context/AdminAuthContext';
import { Loader2, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
    confirmed: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
    shipped: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
    delivered: 'bg-green-400/10 text-green-400 border-green-400/30',
    cancelled: 'bg-red-400/10 text-red-400 border-red-400/30',
};

const OrderManagement = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [updating, setUpdating] = useState<number | null>(null);

    const load = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (typeFilter) params.append('type', typeFilter);
        if (statusFilter) params.append('status', statusFilter);
        const res = await adminFetch(`/api/admin/orders?${params}`);
        const json = await res.json();
        setOrders(Array.isArray(json) ? json : []);
        setLoading(false);
    };

    useEffect(() => { load(); }, [typeFilter, statusFilter]);

    const updateStatus = async (id: number, status: string) => {
        setUpdating(id);
        await adminFetch(`/api/admin/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        await load();
        setUpdating(null);
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h1 className="font-display text-2xl text-foreground tracking-widest">ORDERS</h1>
                <div className="flex gap-2 flex-wrap">
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                        className="bg-secondary border border-border rounded-sm px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold/60">
                        <option value="">All Types</option>
                        <option value="tshirt">T-Shirts</option>
                        <option value="jewellery">Jewellery</option>
                        <option value="mixed">Mixed</option>
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-secondary border border-border rounded-sm px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold/60">
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={load} className="border border-border text-muted-foreground p-1.5 rounded-sm hover:text-foreground transition-colors">
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64"><Loader2 size={28} className="animate-spin text-gold" /></div>
            ) : (
                <div className="space-y-3">
                    {orders.length === 0 && <p className="text-muted-foreground text-sm text-center py-16">No orders found</p>}
                    {orders.map(order => {
                        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                        return (
                            <div key={order.id} className="glass-card rounded-sm border border-border/60 overflow-hidden">
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/30 transition-colors"
                                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                >
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <span className="text-xs text-muted-foreground font-mono">#{order.id}</span>
                                        <span className="text-sm text-foreground font-semibold">{order.customer_name || 'Guest'}</span>
                                        <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                        <span className="text-xs capitalize text-muted-foreground bg-secondary border border-border px-2 py-0.5 rounded-sm">{order.product_type}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-gold text-sm">₹{Number(order.total).toLocaleString()}</span>
                                        <span className={`text-xs border rounded-sm px-2 py-0.5 capitalize ${statusColors[order.status] || ''}`}>{order.status}</span>
                                        <span className="text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {expandedId === order.id && (
                                    <div className="border-t border-border/40 p-4 bg-secondary/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Customer Info</p>
                                                <p className="text-sm text-foreground">{order.customer_name}</p>
                                                <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                                                {order.customer_phone && <p className="text-xs text-muted-foreground">{order.customer_phone}</p>}
                                                {order.customer_address && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{order.customer_address}</p>}
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Order Summary</p>
                                                <p className="text-xs text-foreground">Subtotal: ₹{Number(order.subtotal).toLocaleString()}</p>
                                                {order.discount > 0 && <p className="text-xs text-green-400">Discount: -₹{Number(order.discount).toLocaleString()} {order.promo_code && `(${order.promo_code})`}</p>}
                                                <p className="text-sm font-semibold text-gold mt-1">Total: ₹{Number(order.total).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                                            <div className="space-y-1">
                                                {items.map((item: any, i: number) => (
                                                    <div key={i} className="flex justify-between text-xs">
                                                        <span className="text-foreground">{item.name} {item.size && `- ${item.size}`} {item.color && `/ ${item.color}`} {item.gsm && `/ ${item.gsm}`} × {item.quantity}</span>
                                                        <span className="text-gold">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Update Status</p>
                                            <div className="flex flex-wrap gap-2">
                                                {STATUS_OPTIONS.map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => updateStatus(order.id, s)}
                                                        disabled={updating === order.id || order.status === s}
                                                        className={`text-xs px-3 py-1.5 rounded-sm border transition-all capitalize disabled:opacity-40 ${order.status === s ? 'bg-gold/10 text-gold border-gold/30' : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                                                            }`}
                                                    >
                                                        {updating === order.id ? <Loader2 size={12} className="animate-spin inline" /> : s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
