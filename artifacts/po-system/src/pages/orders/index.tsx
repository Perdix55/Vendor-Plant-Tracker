import { useListOrders, OrderSummaryStatus } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Filter, ShoppingCart } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function Orders() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<OrderSummaryStatus | "all">("all");
  const { data: orders, isLoading } = useListOrders(
    statusFilter !== "all" ? { status: statusFilter } : undefined
  );
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (!search) return orders;
    const lowerSearch = search.toLowerCase();
    return orders.filter(o => 
      o.vendorName.toLowerCase().includes(lowerSearch) || 
      o.id.toString().includes(lowerSearch) ||
      o.weekDate.toLowerCase().includes(lowerSearch)
    );
  }, [orders, search]);

  const StatusBadge = ({ status }: { status: OrderSummaryStatus }) => {
    const styles: Record<string, string> = {
      draft: "bg-secondary text-secondary-foreground hover:bg-secondary",
      submitted: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
      sent: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      confirmed: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      partial: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    };
    const label = status === "submitted" ? "Created" : status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <Badge variant="outline" className={styles[status] ?? "bg-secondary text-secondary-foreground"}>
        {label}
      </Badge>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your plant orders.</p>
        </div>
        <Link href="/orders/new">
          <Button data-testid="button-new-order">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by vendor, PO #, or date..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-orders"
          />
        </div>
        <div className="w-full sm:w-48 flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={statusFilter} 
            onValueChange={(val) => setStatusFilter(val as OrderSummaryStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Created</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Ship Date</TableHead>
                <TableHead>Arrive Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="border rounded-md bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">PO #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Ship Date</TableHead>
                <TableHead>Arrive Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Qty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow key={order.id} data-testid={`row-order-${order.id}`} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/orders/${order.id}`)}>
                  <TableCell className="font-medium text-foreground">#{order.id}</TableCell>
                  <TableCell className="font-medium">{order.vendorName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.weekDate}</span>
                      {order.shipDate && (
                        <span className="text-xs text-muted-foreground mt-0.5">
                          Ship: {format(new Date(order.shipDate), 'MM/dd')}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.arriveDate ? (
                      <span className="text-sm">{format(new Date(order.arriveDate), 'MM/dd/yyyy')}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.status === 'confirmed' || order.status === 'partial' ? (
                      <span className="text-sm">
                        <span className={order.confirmedItems < order.totalItems ? "text-amber-600 dark:text-amber-500 font-medium" : "text-green-600 dark:text-green-500 font-medium"}>
                          {order.confirmedItems}
                        </span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span>{order.totalItems}</span>
                      </span>
                    ) : (
                      <span>{order.totalItems}</span>
                    )}
                  </TableCell>
                  <TableCell>{order.totalQuantity}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-card text-muted-foreground shadow-sm">
          <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No orders found</h3>
          <p>
            {search || statusFilter !== "all" 
              ? "Try adjusting your search or filters." 
              : "You haven't created any purchase orders yet."}
          </p>
          {(!search && statusFilter === "all") && (
            <Link href="/orders/new">
              <Button className="mt-4" variant="outline">Create First Order</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}