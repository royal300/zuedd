import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, User, Mail, Lock } from 'lucide-react';
import logo from '@/assets/logo.png';

const Login = () => {
    const [tab, setTab] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'login') {
                await login(email, password);
            } else {
                await signup(name, email, password);
            }
            navigate(from, { replace: true });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link to="/">
                        <img src={logo} alt="ZUED" className="h-16 object-contain" />
                    </Link>
                </div>

                <div className="glass-card rounded-sm p-8 border border-border/60">
                    {/* Tabs */}
                    <div className="flex mb-8 border-b border-border">
                        <button
                            onClick={() => { setTab('login'); setError(''); }}
                            className={`flex-1 pb-3 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${tab === 'login' ? 'text-gold border-b-2 border-gold -mb-px' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setTab('signup'); setError(''); }}
                            className={`flex-1 pb-3 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${tab === 'signup' ? 'text-gold border-b-2 border-gold -mb-px' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Create Account
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name field — signup only */}
                        {tab === 'signup' && (
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-sm pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-secondary border border-border rounded-sm pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-secondary border border-border rounded-sm pl-9 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-sm px-3 py-2">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full py-3 rounded-sm text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                            {tab === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-muted-foreground text-xs mt-6">
                        {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}
                            className="text-gold hover:underline"
                        >
                            {tab === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>

                <p className="text-center mt-6">
                    <Link to="/" className="text-muted-foreground text-xs hover:text-foreground transition-colors tracking-wider">
                        ← Back to Store
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
