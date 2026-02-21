import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const ADMIN_TOKEN_KEY = 'zued_admin_token';
const API_BASE = '/api/admin';

interface AdminAuthContextType {
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return ctx;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
    const [loading, setLoading] = useState(false);

    const login = useCallback(async (username: string, password: string) => {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setToken(data.token);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken(null);
    }, []);

    return (
        <AdminAuthContext.Provider value={{ token, loading, login, logout, isAdmin: !!token }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const adminFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
};
