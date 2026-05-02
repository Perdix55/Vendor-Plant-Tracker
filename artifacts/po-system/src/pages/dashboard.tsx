import { useGetDashboardSummary, useGetVendorActivity, useGetRecentOrders } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { FileText, Send, CheckCircle2, Clock, ShoppingCart, Users, Calendar } from "lucide-react";

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: vendorActivity, isLoading: isLoadingActivity } = useGetVendorActivity();
  const { data: recentOrders, isLoading: isLoadingRecent } = useGetRecentOrders();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your purchasing activity.</p>
      </div>

      {isLoadingSummary ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : summary ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-orders">{summary.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.currentWeekOrders} this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft & Sent</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-pending-orders">{summary.draftOrders + summary.sentOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.draftOrders} draft, {summary.sentOrders} sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed / Partial</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-confirmed-orders">{summary.confirmedOrders + summary.partialOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.confirmedOrders} full, {summary.partialOrders} partial</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-vendors">{summary.totalVendors}</div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest purchasing activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <Link href={`/orders/${order.id}`}>
                        <span className="font-medium hover:underline cursor-pointer" data-testid={`link-recent-order-${order.id}`}>
                          PO #{order.id} - {order.vendorName}
                        </span>
                      </Link>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {order.weekDate}
                      </div>
                    </div>
                    <Badge 
                      variant={order.status === 'draft' ? 'secondary' : order.status === 'sent' ? 'default' : order.status === 'confirmed' ? 'outline' : 'destructive'}
                      className={
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                        order.status === 'partial' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                        order.status === 'sent' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                        ''
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No recent orders found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Vendor Activity</CardTitle>
            <CardDescription>Vendors with recent purchases</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingActivity ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : vendorActivity && vendorActivity.length > 0 ? (
              <div className="space-y-4">
                {vendorActivity.map(activity => (
                  <div key={activity.vendorId} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <Link href={`/vendors/${activity.vendorId}`}>
                        <span className="font-medium hover:underline cursor-pointer" data-testid={`link-vendor-activity-${activity.vendorId}`}>
                          {activity.vendorName}
                        </span>
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        {activity.totalOrders} total orders
                      </div>
                    </div>
                    {activity.lastOrderDate && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(activity.lastOrderDate), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No vendor activity found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}