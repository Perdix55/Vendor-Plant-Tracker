import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, ShoppingCart, PlusCircle, Settings, PackageSearch, ShoppingBag, LogOut, UserCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import type { SafeUser } from "@/contexts/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { HelpModal } from "@/components/help/HelpModal";
import { useGetSettings } from "@workspace/api-client-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  permission: ((u: SafeUser) => boolean) | null;
};

const sidebarNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    title: "Purchase Orders",
    href: "/orders",
    icon: ShoppingCart,
    permission: (u) => u.isAdmin || u.canOrders,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: PackageSearch,
    permission: (u) => u.isAdmin || u.canInventory,
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Users,
    permission: (u) => u.isAdmin || u.canVendors,
  },
  {
    title: "Sales Orders",
    href: "/sales-orders",
    icon: ShoppingBag,
    permission: (u) => u.isAdmin || u.canSalesOrders,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
    permission: (u) => u.isAdmin,
  },
];

export function Sidebar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [helpOpen, setHelpOpen] = useState(false);
  const { data: settings } = useGetSettings();
  const logoUrl = settings?.logoUrl ?? null;

  const visibleItems = user
    ? sidebarNavItems.filter((item) => item.permission === null || item.permission(user))
    : sidebarNavItems;

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-20 items-center border-b px-4">
        {logoUrl ? (
          <img
            src={`/api/storage${logoUrl}`}
            alt="Logo"
            className="max-h-[72px] max-w-[320px] object-contain"
          />
        ) : (
          <span className="font-semibold tracking-tight text-lg text-primary flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">V</div>
            Vickery Wholesale
          </span>
        )}
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {visibleItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="w-full">
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
                  )}
                  data-testid={`link-sidebar-${item.title.toLowerCase().replace(" ", "-")}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t">
        {user && (
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                {user.name && <p className="text-sm font-medium truncate">{user.name}</p>}
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <div className="p-3 space-y-2">
          <Link href="/orders/new" className="w-full">
            <span className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm" data-testid="button-sidebar-new-order">
              <PlusCircle className="h-4 w-4" />
              New Order
            </span>
          </Link>
          <button
            onClick={() => setHelpOpen(true)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            data-testid="button-sidebar-logout"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
      <HelpModal open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
