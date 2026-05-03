import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout/layout";

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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/confirm/:token" component={VendorConfirm} />
      <Route path="/shop" component={ShopPage} />
      <Route>
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
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
