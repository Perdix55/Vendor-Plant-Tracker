import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type SafeUser = {
  id: number;
  email: string;
  name: string | null;
  isAdmin: boolean;
  canOrders: boolean;
  canInventory: boolean;
  canVendors: boolean;
  canSalesOrders: boolean;
  createdAt: string;
};

type AuthContextType = {
  user: SafeUser | null;
  isLoading: boolean;
  needsSetup: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  needsSetup: false,
  login: async () => {},
  logout: async () => {},
  refetch: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me");
      if (r.ok) {
        setUser(await r.json());
        setNeedsSetup(false);
      } else {
        const data = await r.json().catch(() => ({}));
        setUser(null);
        setNeedsSetup(data.needsSetup === true);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      throw new Error(data.error || "Login failed");
    }
    setUser(await r.json());
    setNeedsSetup(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, needsSetup, login, logout, refetch: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
