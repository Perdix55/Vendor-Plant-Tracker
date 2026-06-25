import { useListOrders, useListVendors, OrderSummaryStatus } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Filter, ShoppingCart, Download, CalendarDays } from "lucide-react";
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
import { format, parse, parseISO, startOfDay, endOfDay, isValid } from "date-fns";
import * as XLSX from "xlsx";

export default function Orders() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<OrderSummaryStatus | "all">("all");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: orders, isLoading } = useListOrders(
    statusFilter !== "all" ? { status: statusFilter } : undefined
  );
  const { data: vendors } = useListVendors();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      if (vendorFilter !== "all" && String(o.vendorId) !== vendorFilter) return false;

      if (search) {
        const q = search.toLowerCase();
        if (
          !o.vendorName.toLowerCase().includes(q) &&
          !o.id.toString().includes(q) &&
          !o.weekDate.toLowerCase().includes(q)
        ) return false;
      }

      if (dateFrom || dateTo) {
        const dateStr = o.shipDate ?? o.weekDate;
        if (!dateStr) return false;
        // weekDate is stored as MM/dd/yyyy; shipDate may be ISO or MM/dd/yyyy
        let d = parse(dateStr, "MM/dd/yyyy", new Date());
        if (!isValid(d)) d = parseISO(dateStr);
        if (!isValid(d)) return false;
        d = startOfDay(d);
        if (dateFrom && d < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && d > endOfDay(parseISO(dateTo))) return false;
      }

      return true;
    });
  }, [orders, search, vendorFilter, dateFrom, dateTo]);

  const hasFilters = search || vendorFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo;

  const handleExport = () => {
    if (!filteredOrders.length) return;

    const rows = filteredOrders.map((o) => ({
      "PO #": `#${o.id}`,
      Vendor: o.vendorName,
      "Order Date": o.weekDate,
      "Ship Date": o.shipDate ? (() => { const d = parse(o.shipDate, "MM/dd/yyyy", new Date()); return isValid(d) ? format(d, "MM/dd/yyyy") : o.shipDate; })() : "",
      "Arrive Date": o.arriveDate ? (() => { const d = parse(o.arriveDate, "MM/dd/yyyy", new Date()); return isValid(d) ? format(d, "MM/dd/yyyy") : o.arriveDate; })() : "",
      Status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
      "Total Items": o.totalItems,
      "Confirmed Items": o.confirmedItems,
      "Ordered Qty": o.totalQuantity,
      "Received Qty": o.receivedQuantity,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-width columns
    const colWidths = Object.keys(rows[0] ?? {}).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String(r[key as keyof typeof r] ?? "").length)) + 2,
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();

    const vendorName =
      vendorFilter !== "all"
        ? vendors?.find((v) => String(v.id) === vendorFilter)?.name ?? "Vendor"
        : "All Vendors";

    XLSX.utils.book_append_sheet(wb, ws, vendorName.slice(0, 31));

    const dateTag = dateFrom && dateTo
      ? `_${dateFrom}_to_${dateTo}`
      : dateFrom
      ? `_from_${dateFrom}`
      : dateTo
      ? `_to_${dateTo}`
      : "";

    XLSX.writeFile(wb, `purchase-orders_${vendorName.replace(/\s+/g, "-")}${dateTag}.xlsx`);
  };

  const StatusBadge = ({ status }: { status: OrderSummaryStatus }) => {
    const styles: Record<string, string> = {
      draft: "bg-secondary text-secondary-foreground hover:bg-secondary",
      submitted: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
      sent: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      confirmed: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      partial: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      substitution: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      received: "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredOrders.length === 0}
            title="Export to Excel"
          >
            <Download className="mr-2 h-4 w-4" />
            Export{filteredOrders.length > 0 ? ` (${filteredOrders.length})` : ""}
          </Button>
          <Link href="/orders/new">
            <Button data-testid="button-new-order">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-card p-4 rounded-lg border shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text search */}
          <div className="relative flex-1">
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

          {/* Vendor filter */}
          <div className="flex items-center gap-2 sm:w-52">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors?.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className="sm:w-44">
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val as OrderSummaryStatus | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Created</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="substitution">Substitution</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date range */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
            <CalendarDays className="h-4 w-4" />
            <span>Ship date range:</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="sm:w-44 text-sm"
              placeholder="From"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="sm:w-44 text-sm"
              placeholder="To"
            />
            {(dateFrom || dateTo) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground text-xs h-8 px-2"
                onClick={() => { setDateFrom(""); setDateTo(""); }}
              >
                Clear
              </Button>
            )}
          </div>
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
                <TableHead>Ordered Qty</TableHead>
                <TableHead>Received Qty</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
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
                <TableHead>Ordered Qty</TableHead>
                <TableHead>Received Qty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow
                  key={order.id}
                  data-testid={`row-order-${order.id}`}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell className="font-medium text-foreground">#{order.id}</TableCell>
                  <TableCell className="font-medium">{order.vendorName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.weekDate}</span>
                      {order.shipDate && (
                        <span className="text-xs text-muted-foreground mt-0.5">
                          Ship: {order.shipDate}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.arriveDate ? (
                      <span className="text-sm">{order.arriveDate}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.status === "confirmed" || order.status === "partial" ? (
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
                    {order.receivedQuantity > 0 ? (
                      <span className={`font-medium ${order.receivedQuantity < order.totalQuantity ? "text-amber-600 dark:text-amber-500" : "text-teal-700 dark:text-teal-400"}`}>
                        {order.receivedQuantity}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
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
            {hasFilters
              ? "Try adjusting your search, date range, or filters."
              : "You haven't created any purchase orders yet."}
          </p>
          {!hasFilters && (
            <Link href="/orders/new">
              <Button className="mt-4" variant="outline">Create First Order</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
