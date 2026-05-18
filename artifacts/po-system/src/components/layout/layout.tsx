import { useLocation } from "wouter";
import { Sidebar } from "./sidebar";
import { useAuth } from "@/contexts/auth-context";
import type { SafeUser } from "@/contexts/auth-context";
import { ShieldOff } from "lucide-react";

function checkPermission(user: SafeUser, path: string): boolean {
  if (user.isAdmin) return true;
  if (path.startsWith("/orders")) return user.canOrders;
  if (path.startsWith("/inventory")) return user.canInventory;
  if (path.startsWith("/vendors")) return user.canVendors;
  if (path.startsWith("/sales-orders")) return user.canSalesOrders;
  if (path.startsWith("/admin")) return false;
  return true;
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
      <ShieldOff className="h-12 w-12 opacity-30" />
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">Access Restricted</p>
        <p className="text-sm mt-1">You don't have permission to view this section.</p>
        <p className="text-xs mt-1">Contact your administrator if you need access.</p>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();

  const allowed = !user || checkPermission(user, location);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {allowed ? children : <AccessDenied />}
      </main>
    </div>
  );
}
