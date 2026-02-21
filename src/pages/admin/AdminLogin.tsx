import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Loader2, Shield } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/admin/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                        <Shield size={24} className="text-gold" />
                    </div>
                    <h1 className="font-display text-2xl text-foreground tracking-widest">ADMIN PANEL</h1>
                    <p className="text-muted-foreground text-xs mt-1">ZUED Management Console</p>
                </div>
                <div className="glass-card rounded-sm p-8 border border-border/60">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/60 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/60 transition-colors"
                            />
                        </div>
                        {error && <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-sm px-3 py-2">{error}</p>}
                        <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                            {loading && <Loader2 size={15} className="animate-spin" />}
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
