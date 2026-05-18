import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout/layout";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

import Dashboard from "@/pages/dashboard";
import Vendors from "@/pages/vendors/index";
import VendorDetail from "@/pages/vendors/detail";
import Orders from "@/pages/orders/index";
import NewOrder from "@/pages/orders/new";
import OrderDetail from "@/pages/orders/detail";
import ReceiveOrder from "@/pages/orders/receive";
import Inventory from "@/pages/inventory/index";
import AdminVendors from "@/pages/admin/index";
import VendorConfirm from "@/pages/confirm/index";
import ShopPage from "@/pages/shop/index";
import SalesOrders from "@/pages/sales-orders/index";
import SalesOrderDetail from "@/pages/sales-orders/detail";
import LoginPage from "@/pages/login";
import SetupPage from "@/pages/setup";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, needsSetup } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (needsSetup) navigate("/setup");
      else if (!user) navigate("/login");
    }
  }, [user, isLoading, needsSetup, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || needsSetup) return null;

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/setup" component={SetupPage} />
      <Route path="/confirm/:token" component={VendorConfirm} />
      <Route path="/shop" component={ShopPage} />
      <Route>
        <AuthGuard>
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/vendors" component={Vendors} />
              <Route path="/vendors/:id" component={VendorDetail} />
              <Route path="/orders" component={Orders} />
              <Route path="/orders/new" component={NewOrder} />
              <Route path="/orders/:id/receive" component={ReceiveOrder} />
              <Route path="/orders/:id" component={OrderDetail} />
              <Route path="/inventory" component={Inventory} />
              <Route path="/admin" component={AdminVendors} />
              <Route path="/sales-orders" component={SalesOrders} />
              <Route path="/sales-orders/:id" component={SalesOrderDetail} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </AuthGuard>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
