import { useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import {
  useGetSalesOrder,
  useUpdateSalesOrder,
  useUpdateSalesOrderItem,
  useDeleteSalesOrderItem,
  useDeleteSalesOrder,
  getGetSalesOrderQueryKey,
  getListSalesOrdersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Pencil, Check, X, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function SalesOrderDetail() {
  const [, params] = useRoute("/sales-orders/:id");
  const salesOrderId = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useGetSalesOrder(salesOrderId, {
    query: { enabled: !!salesOrderId, queryKey: getGetSalesOrderQueryKey(salesOrderId) },
  });

  const updateOrder = useUpdateSalesOrder();
  const updateItem = useUpdateSalesOrderItem();
  const deleteItem = useDeleteSalesOrderItem();
  const deleteOrder = useDeleteSalesOrder();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editingNeededBy, setEditingNeededBy] = useState(false);
  const [neededByInput, setNeededByInput] = useState("");
  const [editingQty, setEditingQty] = useState<number | null>(null);
  const [qtyInput, setQtyInput] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetSalesOrderQueryKey(salesOrderId) });
    queryClient.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
  };

  const handleStatusChange = async (status: string) => {
    await updateOrder.mutateAsync({ salesOrderId, data: { status } });
    invalidate();
    toast({ title: "Status updated" });
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    await updateOrder.mutateAsync({ salesOrderId, data: { customerName: nameInput.trim() } });
    invalidate();
    setEditingName(false);
    toast({ title: "Name updated" });
  };

  const handleSaveNeededBy = async () => {
    await updateOrder.mutateAsync({ salesOrderId, data: { neededBy: neededByInput || null } });
    invalidate();
    setEditingNeededBy(false);
    toast({ title: "Date updated" });
  };

  const handleQtyChange = async (itemId: number, delta: number, current: number) => {
    const newQty = Math.max(1, current + delta);
    await updateItem.mutateAsync({ salesOrderId, itemId, data: { quantity: newQty } });
    invalidate();
  };

  const handleQtyInputSave = async (itemId: number) => {
    const qty = parseInt(qtyInput);
    if (!isNaN(qty) && qty >= 1) {
      await updateItem.mutateAsync({ salesOrderId, itemId, data: { quantity: qty } });
      invalidate();
    }
    setEditingQty(null);
    setQtyInput("");
  };

  const handleDeleteItem = async (itemId: number) => {
    await deleteItem.mutateAsync({ salesOrderId, itemId });
    invalidate();
    toast({ title: "Item removed" });
  };

  const handleDeleteOrder = async () => {
    if (!confirm("Delete this entire sales order?")) return;
    await deleteOrder.mutateAsync({ salesOrderId });
    queryClient.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
    setLocation("/sales-orders");
    toast({ title: "Order deleted" });
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Sales order not found.</p>
        <Link href="/sales-orders"><Button variant="link">Back to Sales Orders</Button></Link>
      </div>
    );
  }

  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/sales-orders">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Order #{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive"
            onClick={handleDeleteOrder}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Customer</CardDescription>
          </CardHeader>
          <CardContent>
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  autoFocus
                  className="h-8 text-sm"
                />
                <button onClick={handleSaveName} className="text-green-600 hover:text-green-700">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditingName(false)} className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">{order.customerName}</p>
                <button
                  onClick={() => { setNameInput(order.customerName); setEditingName(true); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Needed By</CardDescription>
          </CardHeader>
          <CardContent>
            {editingNeededBy ? (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={neededByInput}
                  onChange={(e) => setNeededByInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNeededBy()}
                  autoFocus
                  className="h-8 text-sm"
                />
                <button onClick={handleSaveNeededBy} className="text-green-600 hover:text-green-700">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditingNeededBy(false)} className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {order.neededBy ? (
                  <p className="font-semibold text-lg text-orange-700">
                    {format(new Date(order.neededBy + "T00:00:00"), "MMM d, yyyy")}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">Not set</p>
                )}
                <button
                  onClick={() => { setNeededByInput(order.neededBy ?? ""); setEditingNeededBy(true); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              <p className="font-semibold text-lg">{totalItems} unit{totalItems !== 1 ? "s" : ""}</p>
              <p className="text-sm text-muted-foreground">({order.items.length} SKU{order.items.length !== 1 ? "s" : ""})</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Line Items</CardTitle>
          <CardDescription>Adjust quantities or remove items as needed.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {order.items.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground text-sm gap-2">
              <ShoppingBag className="h-8 w-8 opacity-30" />
              <p>No items in this order.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Pack Size</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.vendorName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.packSize ?? "—"}</TableCell>
                    <TableCell>
                      {editingQty === item.id ? (
                        <div className="flex items-center gap-1 justify-center">
                          <Input
                            type="number"
                            value={qtyInput}
                            onChange={(e) => setQtyInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleQtyInputSave(item.id); if (e.key === "Escape") { setEditingQty(null); } }}
                            className="h-7 w-16 text-center text-sm"
                            autoFocus
                          />
                          <button onClick={() => handleQtyInputSave(item.id)} className="text-green-600"><Check className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setEditingQty(null)} className="text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 justify-center">
                          <button
                            onClick={() => handleQtyChange(item.id, -1, item.quantity)}
                            className="h-6 w-6 rounded border flex items-center justify-center hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => { setEditingQty(item.id); setQtyInput(String(item.quantity)); }}
                            className="w-8 text-center font-medium text-sm hover:underline cursor-pointer"
                          >
                            {item.quantity}
                          </button>
                          <button
                            onClick={() => handleQtyChange(item.id, 1, item.quantity)}
                            className="h-6 w-6 rounded border flex items-center justify-center hover:bg-muted"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
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
    </div>
  );
}
