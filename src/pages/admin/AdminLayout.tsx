import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { LayoutDashboard, Package, ShoppingBag, Tag, Ticket, LogOut, Shirt, Gem, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/categories', icon: Tag, label: 'Categories' },
    { to: '/admin/products/tshirts', icon: Shirt, label: 'T-Shirts' },
    { to: '/admin/products/jewellery', icon: Gem, label: 'Jewellery' },
    { to: '/admin/promos', icon: Ticket, label: 'Promo Codes' },
];

const AdminLayout = () => {
    const { logout } = useAdminAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => { logout(); navigate('/admin/login'); };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-56' : 'w-14'} transition-all duration-300 bg-background border-r border-border flex flex-col flex-shrink-0`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                    {sidebarOpen && <span className="font-display text-gold tracking-widest text-sm">ZUED ADMIN</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground transition-colors ml-auto">
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
                <nav className="flex-1 py-4 space-y-1 px-2">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-medium transition-all duration-200 group ${isActive ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                }`
                            }
                        >
                            <Icon size={16} className="flex-shrink-0" />
                            {sidebarOpen && <span className="tracking-wide">{label}</span>}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-2 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all w-full"
                    >
                        <LogOut size={16} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>
            {/* Main */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
