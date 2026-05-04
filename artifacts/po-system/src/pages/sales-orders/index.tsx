import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useListSalesOrders, useDeleteSalesOrder, useCreateSalesOrder, getListSalesOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { QrCode, Search, Trash2, ShoppingBag, ExternalLink, Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
// @ts-ignore
import { QRCodeSVG } from "qrcode.react";

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function SalesOrdersPage() {
  const [search, setSearch] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const { data: orders, isLoading } = useListSalesOrders();
  const deleteOrder = useDeleteSalesOrder();
  const createOrder = useCreateSalesOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const shopUrl = `${window.location.origin}${import.meta.env.BASE_URL}shop`;

  const handleNewOrder = async () => {
    if (!newCustomerName.trim()) return;
    try {
      const order = await createOrder.mutateAsync({ data: { customerName: newCustomerName.trim() } });
      queryClient.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
      setShowNewOrder(false);
      setNewCustomerName("");
      navigate(`/sales-orders/${order.id}`);
    } catch {
      toast({ title: "Failed to create order", variant: "destructive" });
    }
  };

  const filtered = (orders ?? []).filter((o) =>
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Delete this sales order?")) return;
    await deleteOrder.mutateAsync({ salesOrderId: id });
    queryClient.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
    toast({ title: "Order deleted" });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales Orders</h1>
          <p className="text-muted-foreground mt-1">Customer orders placed via barcode scanning.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowQr(true)} className="gap-2">
            <QrCode className="h-4 w-4" />
            Customer QR Code
          </Button>
          <Button onClick={() => { setShowNewOrder(true); setTimeout(() => nameInputRef.current?.focus(), 50); }} className="gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Orders</CardTitle>
              <CardDescription>Click a row to view or edit the order.</CardDescription>
            </div>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <ShoppingBag className="h-10 w-10 opacity-30" />
              <p className="text-sm">
                {search ? "No orders matching that search." : "No sales orders yet. Share the QR code with customers."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/sales-orders/${order.id}`} className="contents">
                        <span className="font-mono text-sm text-muted-foreground">#{order.id}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/sales-orders/${order.id}`} className="contents">
                        <span className="font-medium">{order.customerName}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/sales-orders/${order.id}`} className="contents">
                        <span className="text-sm">{order.itemCount} item{order.itemCount !== 1 ? "s" : ""}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/sales-orders/${order.id}`} className="contents">
                        <Badge variant="outline" className={statusColors[order.status] ?? ""}>
                          {order.status}
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/sales-orders/${order.id}`} className="contents">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => handleDelete(order.id, e)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showNewOrder} onOpenChange={(open) => { setShowNewOrder(open); if (!open) setNewCustomerName(""); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Sales Order</DialogTitle>
            <DialogDescription>Enter the customer's name to create an order. You can add items on the next screen.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="new-customer-name">Customer Name</Label>
              <Input
                id="new-customer-name"
                ref={nameInputRef}
                placeholder="e.g. John Smith"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewOrder()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewOrder(false)}>Cancel</Button>
              <Button
                onClick={handleNewOrder}
                disabled={!newCustomerName.trim() || createOrder.isPending}
              >
                {createOrder.isPending ? "Creating…" : "Create & Open"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQr} onOpenChange={setShowQr}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>Customer Ordering Page</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="border rounded-xl p-4 bg-white">
              <QRCodeSVG value={shopUrl} size={200} />
            </div>
            <p className="text-sm text-muted-foreground px-4">
              Customers scan this code to open the ordering page on their phone. They enter their name, then scan product barcodes.
            </p>
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Open ordering page
            </a>
            <p className="text-xs text-muted-foreground font-mono break-all px-2">{shopUrl}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
