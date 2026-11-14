'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { authApi } from '@/services/api';

interface StoredAccount extends User {
  passwordHash: string;
}

// Pre-seeded fallback accounts: 1 Admin + 2 Customers
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr-admin-01',
    username: 'admin',
    passwordHash: 'admin123',
    role: 'admin',
    name: 'VL Store Administrator',
    email: 'admin@vldesigns.com',
    phone: '9876543210',
    createdAt: '2026-01-01',
  },
  {
    id: 'usr-cust-01',
    username: 'kavya',
    passwordHash: 'user123',
    role: 'customer',
    name: 'Kavya Kadali',
    email: 'kavya@example.com',
    phone: '9876543210',
    address: {
      addressLine1: 'Flat 402, Lotus Greens, Anna Nagar',
      addressLine2: 'Near Roundtana',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
    },
    createdAt: '2026-02-15',
  },
  {
    id: 'usr-cust-02',
    username: 'priya',
    passwordHash: 'user123',
    role: 'customer',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9845012345',
    address: {
      addressLine1: 'Villa 12, Palm Meadows, Whitefield',
      addressLine2: 'Phase 2 Main Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
    createdAt: '2026-03-10',
  },
];

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => void;
  signup: (data: {
    username: string;
    password: string;
    name: string;
    email: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => void;
  isAuthModalOpen: boolean;
  authModalTab: 'customer' | 'admin' | 'signup';
  openAuthModal: (defaultTab?: 'customer' | 'admin' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'customer' | 'admin' | 'signup') => void;
  demoAccounts: { username: string; role: string; label: string; pass: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'customer' | 'admin' | 'signup'>('customer');
  const [accounts, setAccounts] = useState<StoredAccount[]>(DEFAULT_ACCOUNTS);

  // Initialize and load persisted session & registered accounts
  useEffect(() => {
    try {
      // 1. Load accounts from localStorage
      const storedAccs = localStorage.getItem('vl_registered_accounts');
      if (storedAccs) {
        const parsed = JSON.parse(storedAccs);
        const merged = [...DEFAULT_ACCOUNTS];
        parsed.forEach((p: StoredAccount) => {
          if (!merged.some(m => m.username.toLowerCase() === p.username.toLowerCase())) {
            merged.push(p);
          }
        });
        setAccounts(merged);
      } else {
        localStorage.setItem('vl_registered_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
      }

      // 2. Load stored token & user session
      const storedToken = localStorage.getItem('vl_token');
      if (storedToken) {
        setToken(storedToken);
        // Verify with backend
        authApi.getMe(storedToken).then((res) => {
          if (res.success && res.data?.user) {
            const dbUser = res.data.user;
            setUser((prev) => ({
              id: String(dbUser.id),
              username: prev?.username || dbUser.email.split('@')[0],
              name: dbUser.name,
              email: dbUser.email,
              role: (dbUser.role?.toLowerCase() as UserRole) || 'customer',
              phone: prev?.phone,
              address: prev?.address,
              createdAt: dbUser.createdAt,
            }));
          }
        }).catch(() => {
          // Ignore network errors, use cached session
        });
      }

      const storedSession = localStorage.getItem('vl_current_user');
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: 'Please enter both username/email and password' };
    }

    // --- STEP 1: Attempt Login with Backend DB API ---
    try {
      const apiRes = await authApi.login(cleanUser, cleanPass);
      if (apiRes.success && apiRes.data?.token && apiRes.data?.user) {
        const dbUser = apiRes.data.user;
        const authToken = apiRes.data.token;
        const role = (dbUser.role?.toLowerCase() as UserRole) || 'customer';

        // Check if we have additional address/phone info in local accounts
        const localMatch = accounts.find(
          acc => acc.email.toLowerCase() === dbUser.email.toLowerCase() ||
                 acc.username.toLowerCase() === cleanUser
        );

        const safeUser: User = {
          id: String(dbUser.id),
          username: localMatch?.username || cleanUser,
          name: dbUser.name,
          email: dbUser.email,
          role,
          phone: localMatch?.phone || '',
          address: localMatch?.address,
          createdAt: dbUser.createdAt,
        };

        setToken(authToken);
        setUser(safeUser);
        try {
          localStorage.setItem('vl_token', authToken);
          localStorage.setItem('vl_current_user', JSON.stringify(safeUser));
        } catch {
          // ignore
        }

        setIsAuthModalOpen(false);
        return { success: true, role };
      }
    } catch (err) {
      console.warn('Backend login unavailable or returned error, attempting fallback:', err);
    }

    // --- STEP 2: Fallback to Local Accounts if Backend fails or is empty ---
    const found = accounts.find(
      acc => acc.username.toLowerCase() === cleanUser || acc.email.toLowerCase() === cleanUser
    );

    if (!found) {
      return { success: false, error: 'User not found. Check username or create a new account.' };
    }

    if (found.passwordHash !== cleanPass) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const { passwordHash, ...safeUser } = found;
    setUser(safeUser);
    try {
      localStorage.setItem('vl_current_user', JSON.stringify(safeUser));
    } catch {
      // Ignore
    }

    setIsAuthModalOpen(false);
    return { success: true, role: safeUser.role };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('vl_current_user');
      localStorage.removeItem('vl_token');
    } catch {
      // Ignore
    }
  };

  const signup = async (data: {
    username: string;
    password: string;
    name: string;
    email: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = data.username.trim().toLowerCase();
    const cleanPass = data.password.trim();

    if (!cleanUser || cleanUser.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long' };
    }
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    if (!data.name.trim()) {
      return { success: false, error: 'Please enter your full name' };
    }
    if (!data.email.trim() || !data.email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // --- STEP 1: Attempt Signup with Backend DB API ---
    try {
      const apiRes = await authApi.signup({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: cleanPass,
        role: 'CUSTOMER',
      });

      if (apiRes.success) {
        // Automatically log in to get JWT token
        const loginRes = await authApi.login(data.email.trim().toLowerCase(), cleanPass);
        if (loginRes.success && loginRes.data?.token) {
          const dbUser = loginRes.data.user;
          const safeUser: User = {
            id: String(dbUser.id),
            username: cleanUser,
            name: dbUser.name,
            email: dbUser.email,
            role: 'customer',
            phone: data.phone?.trim() || '',
            createdAt: dbUser.createdAt,
          };

          setToken(loginRes.data.token);
          setUser(safeUser);
          try {
            localStorage.setItem('vl_token', loginRes.data.token);
            localStorage.setItem('vl_current_user', JSON.stringify(safeUser));
          } catch {
            // ignore
          }

          setIsAuthModalOpen(false);
          return { success: true };
        }
      }
    } catch (err) {
      console.warn('Backend signup error, falling back to local storage:', err);
    }

    // --- STEP 2: Fallback to Local Storage Signup ---
    if (accounts.some(acc => acc.username.toLowerCase() === cleanUser)) {
      return { success: false, error: 'Username is already taken. Please pick another.' };
    }
    if (accounts.some(acc => acc.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists. Try logging in.' };
    }

    const newAccount: StoredAccount = {
      id: `usr-cust-${Date.now()}`,
      username: cleanUser,
      passwordHash: cleanPass,
      role: 'customer',
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...accounts, newAccount];
    setAccounts(updated);
    try {
      localStorage.setItem('vl_registered_accounts', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    const { passwordHash, ...safeUser } = newAccount;
    setUser(safeUser);
    try {
      localStorage.setItem('vl_current_user', JSON.stringify(safeUser));
    } catch {
      // Ignore
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem('vl_current_user', JSON.stringify(updated));
      const updatedAccounts = accounts.map(acc => (acc.id === user.id ? { ...acc, ...data } : acc));
      setAccounts(updatedAccounts);
      localStorage.setItem('vl_registered_accounts', JSON.stringify(updatedAccounts));
    } catch {
      // Ignore
    }
  };

  const openAuthModal = (defaultTab: 'customer' | 'admin' | 'signup' = 'customer') => {
    setAuthModalTab(defaultTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const demoAccounts = [
    { username: 'admin', pass: 'admin123', role: 'admin', label: '👑 Admin (Store Manager)' },
    { username: 'kavya', pass: 'user123', role: 'customer', label: '👤 User 1 (Kavya Kadali)' },
    { username: 'priya', pass: 'user123', role: 'customer', label: '👤 User 2 (Priya Sharma)' },
  ];

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        signup,
        updateProfile,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        demoAccounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
