import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, ShoppingCart, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Purchase Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Users,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
  },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold tracking-tight text-lg text-primary flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">V</div>
          Vickery Wholesale
        </span>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {sidebarNavItems.map((item) => {
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
      <div className="p-4 border-t">
        <Link href="/orders/new" className="w-full">
          <span className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm" data-testid="button-sidebar-new-order">
            <PlusCircle className="h-4 w-4" />
            New Order
          </span>
        </Link>
      </div>
    </div>
  );
}
