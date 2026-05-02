import { useState, useMemo } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { 
  useGetOrder, 
  useUpdateOrder,
  useDeleteOrder,
  useConfirmOrder,
  useUpdateOrderItem,
  getGetOrderQueryKey,
  getListOrdersQueryKey,
  getGetDashboardSummaryQueryKey,
  OrderSummaryStatus,
  ConfirmOrderBodyItemsItemAvailability
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, CheckCircle2, Clock, Send, Trash2, Edit2, Info, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function OrderDetail() {
  const [, params] = useRoute("/orders/:id");
  const orderId = params?.id ? parseInt(params.id) : 0;
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: getGetOrderQueryKey(orderId) }
  });

  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const confirmOrder = useConfirmOrder();

  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmData, setConfirmData] = useState<Record<number, { 
    availability: ConfirmOrderBodyItemsItemAvailability; 
    quantityConfirmed?: number; 
    notes?: string;
  }>>({});

  const handleStartConfirming = () => {
    if (!order) return;
    const initialData: typeof confirmData = {};
    order.items.forEach(item => {
      initialData[item.id] = {
        availability: (item.availability as ConfirmOrderBodyItemsItemAvailability) || "available",
        quantityConfirmed: item.quantityConfirmed ?? item.quantityOrdered,
        notes: item.notes || ""
      };
    });
    setConfirmData(initialData);
    setIsConfirming(true);
  };

  const handleCancelConfirming = () => {
    setIsConfirming(false);
    setConfirmData({});
  };

  const handleConfirmItemChange = (itemId: number, field: string, value: any) => {
    setConfirmData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleSubmitConfirmation = () => {
    const items = Object.entries(confirmData).map(([idStr, data]) => ({
      itemId: parseInt(idStr),
      availability: data.availability,
      quantityConfirmed: data.availability === 'unavailable' ? 0 : data.quantityConfirmed,
      notes: data.notes || null
    }));

    confirmOrder.mutate({
      orderId,
      data: { items }
    }, {
      onSuccess: () => {
        toast({ title: "Order Confirmed", description: "Vendor confirmations have been saved." });
        setIsConfirming(false);
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      },
      onError: (err) => {
        toast({ title: "Error", description: "Failed to save confirmations.", variant: "destructive" });
        console.error(err);
      }
    });
  };

  const handleMarkAsSent = () => {
    updateOrder.mutate({
      orderId,
      data: { status: "sent" }
    }, {
      onSuccess: () => {
        toast({ title: "Order Sent", description: "Order status updated to sent." });
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      }
    });
  };

  const handleDelete = () => {
    deleteOrder.mutate({ orderId }, {
      onSuccess: () => {
        toast({ title: "Order Deleted", description: "Draft order has been deleted." });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        setLocation("/orders");
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to delete order.", variant: "destructive" });
      }
    });
  };

  if (!orderId) return null;

  const renderStatusBadge = (status: OrderSummaryStatus) => {
    const styles = {
      draft: "bg-secondary text-secondary-foreground",
      sent: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      confirmed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      partial: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    };
    return <Badge className={styles[status]} variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const renderAvailabilityBadge = (avail: string | null | undefined) => {
    if (!avail || avail === "pending") return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
    if (avail === "available") return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Available</Badge>;
    if (avail === "unavailable") return <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">Unavailable</Badge>;
    if (avail === "partial") return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Partial</Badge>;
    return null;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground" onClick={() => setLocation("/orders")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-48 col-span-2" />
            <Skeleton className="h-48 col-span-1" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : order ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">PO #{order.id}</h1>
                {renderStatusBadge(order.status)}
              </div>
              <p className="text-muted-foreground mt-1">
                Created on {format(new Date(order.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {order.status === "draft" && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Draft
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this draft purchase order? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          {deleteOrder.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button 
                    onClick={handleMarkAsSent}
                    disabled={updateOrder.isPending}
                    data-testid="button-mark-sent"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Mark as Sent
                  </Button>
                </>
              )}
              
              {(order.status === "sent" || order.status === "partial") && !isConfirming && (
                <Button onClick={handleStartConfirming} data-testid="button-enter-confirmations">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Enter Vendor Confirmations
                </Button>
              )}

              {isConfirming && (
                <>
                  <Button variant="outline" onClick={handleCancelConfirming}>Cancel</Button>
                  <Button 
                    onClick={handleSubmitConfirmation}
                    disabled={confirmOrder.isPending}
                    className="bg-green-700 hover:bg-green-800 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {confirmOrder.isPending ? "Saving..." : "Save Confirmations"}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                  <div>
                    <dt className="text-muted-foreground mb-1">Vendor</dt>
                    <dd className="font-medium text-base">
                      <Link href={`/vendors/${order.vendorId}`} className="hover:underline text-primary">
                        {order.vendorName}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Ship Date (Week of)</dt>
                    <dd className="font-medium text-base">{order.weekDate}</dd>
                  </div>
                  {order.notes && (
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground mb-1">Order Notes</dt>
                      <dd className="bg-muted/30 p-3 rounded-md border text-foreground/80">{order.notes}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Total Line Items</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Total Quantity Ordered</span>
                  <span className="font-medium">{order.items.reduce((acc, item) => acc + item.quantityOrdered, 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Quantity Confirmed</span>
                  <span className="font-medium text-green-700 dark:text-green-500">
                    {order.items.reduce((acc, item) => acc + (item.quantityConfirmed || 0), 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                Order Items
                <Badge variant="secondary" className="ml-2 font-normal">{order.items.length}</Badge>
              </CardTitle>
              {isConfirming && (
                <CardDescription className="text-amber-700 dark:text-amber-500 flex items-center gap-1 mt-1 font-medium bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md inline-flex w-fit">
                  <Info className="h-4 w-4" />
                  Confirmation Mode Active. Update quantities and availability below.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Product</TableHead>
                    <TableHead>Pack Size</TableHead>
                    <TableHead className="text-right">Ordered</TableHead>
                    {order.status !== "draft" && (
                      <>
                        <TableHead className="text-right">Confirmed</TableHead>
                        <TableHead>Availability</TableHead>
                        {isConfirming && <TableHead>Notes</TableHead>}
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => {
                    const confirmRow = confirmData[item.id];
                    const isRowConfirming = isConfirming && confirmRow;

                    return (
                      <TableRow key={item.id} className={isRowConfirming && confirmRow.availability === "unavailable" ? "opacity-70 bg-muted/30" : ""}>
                        <TableCell className="font-medium">
                          {item.productName}
                          {item.notes && !isRowConfirming && order.status !== "draft" && (
                            <p className="text-xs text-muted-foreground mt-1 block max-w-xs truncate" title={item.notes}>
                              Note: {item.notes}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.packSize || "N/A"}</TableCell>
                        <TableCell className="text-right font-medium">{item.quantityOrdered}</TableCell>
                        
                        {order.status !== "draft" && (
                          <>
                            <TableCell className="text-right">
                              {isRowConfirming ? (
                                <Input 
                                  type="number"
                                  min="0"
                                  disabled={confirmRow.availability === "unavailable"}
                                  value={confirmRow.availability === "unavailable" ? 0 : (confirmRow.quantityConfirmed || "")}
                                  onChange={(e) => handleConfirmItemChange(item.id, "quantityConfirmed", parseInt(e.target.value) || 0)}
                                  className={`w-20 ml-auto text-right h-8 ${confirmRow.availability === "partial" && confirmRow.quantityConfirmed !== item.quantityOrdered ? "border-amber-400" : ""}`}
                                />
                              ) : (
                                <span className={
                                  item.quantityConfirmed !== null && item.quantityConfirmed < item.quantityOrdered 
                                    ? "text-amber-600 dark:text-amber-500 font-semibold" 
                                    : "text-green-700 dark:text-green-500"
                                }>
                                  {item.availability === "pending" ? "-" : (item.quantityConfirmed || 0)}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isRowConfirming ? (
                                <Select 
                                  value={confirmRow.availability} 
                                  onValueChange={(val) => {
                                    handleConfirmItemChange(item.id, "availability", val);
                                    if (val === "available") handleConfirmItemChange(item.id, "quantityConfirmed", item.quantityOrdered);
                                    if (val === "unavailable") handleConfirmItemChange(item.id, "quantityConfirmed", 0);
                                  }}
                                >
                                  <SelectTrigger className={`h-8 ${
                                    confirmRow.availability === "available" ? "border-green-200 text-green-700 bg-green-50" :
                                    confirmRow.availability === "unavailable" ? "border-red-200 text-red-700 bg-red-50" :
                                    confirmRow.availability === "partial" ? "border-amber-200 text-amber-700 bg-amber-50" : ""
                                  }`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                renderAvailabilityBadge(item.availability)
                              )}
                            </TableCell>
                            {isConfirming && (
                              <TableCell>
                                <Input 
                                  placeholder="Reason..." 
                                  value={confirmRow.notes || ""} 
                                  onChange={(e) => handleConfirmItemChange(item.id, "notes", e.target.value)}
                                  className="h-8 max-w-[150px]"
                                />
                              </TableCell>
                            )}
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}