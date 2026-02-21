import { useEffect, useState } from 'react';
import { adminFetch } from '@/context/AdminAuthContext';
import { TrendingUp, ShoppingBag, Shirt, Gem, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const load = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        const res = await adminFetch(`/api/admin/dashboard?${params}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const statusColors: Record<string, string> = {
        pending: 'text-yellow-400', confirmed: 'text-blue-400',
        shipped: 'text-purple-400', delivered: 'text-green-400', cancelled: 'text-red-400',
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl text-foreground tracking-widest">DASHBOARD</h1>
                <div className="flex gap-2 items-center flex-wrap">
                    <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                        className="bg-secondary border border-border rounded-sm px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold/60" />
                    <span className="text-muted-foreground text-xs">to</span>
                    <input type="date" value={to} onChange={e => setTo(e.target.value)}
                        className="bg-secondary border border-border rounded-sm px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold/60" />
                    <button onClick={load} className="btn-gold px-4 py-1.5 rounded-sm text-xs">Filter</button>
                    <button onClick={() => { setFrom(''); setTo(''); setTimeout(load, 0); }} className="border border-border text-muted-foreground px-3 py-1.5 rounded-sm text-xs hover:text-foreground transition-colors">Reset</button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64"><Loader2 size={28} className="animate-spin text-gold" /></div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {[
                            { label: 'Total Orders', count: data.total.count, revenue: data.total.revenue, icon: TrendingUp, color: 'text-gold' },
                            { label: 'T-Shirt Orders', count: data.tshirt.count, revenue: data.tshirt.revenue, icon: Shirt, color: 'text-blue-400' },
                            { label: 'Jewellery Orders', count: data.jewellery.count, revenue: data.jewellery.revenue, icon: Gem, color: 'text-purple-400' },
                        ].map(stat => (
                            <div key={stat.label} className="glass-card rounded-sm p-5 border border-border/60">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider">{stat.label}</p>
                                    <stat.icon size={16} className={stat.color} />
                                </div>
                                <p className="font-display text-3xl text-foreground mb-1">{stat.count}</p>
                                <p className={`text-sm font-semibold ${stat.color}`}>₹{Number(stat.revenue).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Status Breakdown */}
                        <div className="glass-card rounded-sm p-5 border border-border/60">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Order Status</h2>
                            <div className="space-y-2">
                                {data.statusBreakdown.map((s: any) => (
                                    <div key={s.status} className="flex justify-between items-center">
                                        <span className={`text-sm capitalize ${statusColors[s.status] || 'text-foreground'}`}>{s.status}</span>
                                        <span className="text-foreground font-semibold text-sm">{s.count}</span>
                                    </div>
                                ))}
                                {!data.statusBreakdown.length && <p className="text-muted-foreground text-xs">No orders yet</p>}
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="glass-card rounded-sm p-5 border border-border/60">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Recent Orders</h2>
                            <div className="space-y-3">
                                {data.recentOrders.map((o: any) => (
                                    <div key={o.id} className="flex justify-between items-center border-b border-border/40 pb-2">
                                        <div>
                                            <p className="text-sm text-foreground">{o.customer_name || '—'}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{o.product_type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gold">₹{Number(o.total).toLocaleString()}</p>
                                            <p className={`text-xs capitalize ${statusColors[o.status] || ''}`}>{o.status}</p>
                                        </div>
                                    </div>
                                ))}
                                {!data.recentOrders.length && <p className="text-muted-foreground text-xs">No recent orders</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
