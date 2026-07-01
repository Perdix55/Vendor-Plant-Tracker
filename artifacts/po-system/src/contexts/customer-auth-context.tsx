import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type SafeCustomerSession = {
  id: number;
  customerNumber: number | null;
  name: string;
  email: string | null;
};

type CustomerAuthContextType = {
  customer: SafeCustomerSession | null;
  isLoading: boolean;
  setCustomer: (c: SafeCustomerSession | null) => void;
  logout: () => Promise<void>;
  refetch: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthContextType>({
  customer: null,
  isLoading: true,
  setCustomer: () => {},
  logout: async () => {},
  refetch: () => {},
});

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<SafeCustomerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const r = await fetch("/api/customer-auth/me");
      if (r.ok) {
        setCustomer(await r.json());
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    await fetch("/api/customer-auth/logout", { method: "POST" });
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, isLoading, setCustomer, logout, refetch: checkAuth }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
