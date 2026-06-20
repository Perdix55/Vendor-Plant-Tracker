import { useState, useCallback, useMemo } from "react";
import { buildPlantLabel, printZpl, printLabelNative } from "@/lib/zebra-print";
import { useRoute, useLocation, Link } from "wouter";
import { 
  useGetOrder, 
  useUpdateOrder,
  useDeleteOrder,
  useConfirmOrder,
  useSendOrderEmail,
  useUpdateOrderItem,
  useDeleteOrderItem,
  useAddOrderItem,
  useListVendorProducts,
  useListInventoryTransactions,
  getListInventoryTransactionsQueryKey,
  getGetOrderQueryKey,
  getListOrdersQueryKey,
  getGetDashboardSummaryQueryKey,
  getListVendorProductsQueryKey,
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
import { ArrowLeft, Check, CheckCircle2, Send, Trash2, Info, Mail, Pencil, X, PackageCheck, Printer, Plus, Search, Package, ChevronUp, Sparkles, ArrowLeftRight, ThumbsUp, ThumbsDown } from "lucide-react";
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
  const sendEmail = useSendOrderEmail();
  const updateOrderItem = useUpdateOrderItem();
  const deleteOrderItem = useDeleteOrderItem();

  const { data: receiveTransactions } = useListInventoryTransactions(
    { orderId, limit: 200 },
    { query: { enabled: !!orderId, queryKey: getListInventoryTransactionsQueryKey({ orderId, limit: 200 }) } }
  );
  const receivedProductIds = new Set(
    (receiveTransactions ?? [])
      .filter((t) => t.type === "receive")
      .map((t) => t.productId)
  );

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingQty, setEditingQty] = useState<number>(1);
  const [labelQtys, setLabelQtys] = useState<Record<number, number>>({});
  const [printingItemId, setPrintingItemId] = useState<number | null>(null);

  // Per-item notes overrides for draft editing (auto-saved on blur)
  const [notesOverrides, setNotesOverrides] = useState<Record<number, string>>({});

  const [showAddProducts, setShowAddProducts] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addQuantities, setAddQuantities] = useState<Record<number, number>>({});
  const [addNotes, setAddNotes] = useState<Record<number, string>>({});

  const addOrderItem = useAddOrderItem();

  const vendorId = order?.vendorId ?? 0;
  const { data: vendorProducts } = useListVendorProducts(vendorId, {
    query: { enabled: showAddProducts && !!vendorId, queryKey: getListVendorProductsQueryKey(vendorId) }
  });

  const existingProductIds = useMemo(
    () => new Set((order?.items ?? []).map(i => i.productId)),
    [order?.items]
  );

  const filteredAddProducts = useMemo(() => {
    if (!vendorProducts) return [];
    const active = vendorProducts.filter(p => p.isActive && !existingProductIds.has(p.id));
    if (!addSearch) return active;
    const lower = addSearch.toLowerCase();
    return active.filter(p => p.name.toLowerCase().includes(lower) || (p.packSize ?? "").toLowerCase().includes(lower));
  }, [vendorProducts, existingProductIds, addSearch]);

  const addTotalItems = Object.keys(addQuantities).filter(id => (addQuantities[parseInt(id)] ?? 0) > 0).length;

  const handleAddQtyChange = (productId: number, val: string) => {
    const qty = parseInt(val, 10);
    setAddQuantities(prev => {
      const next = { ...prev };
      if (isNaN(qty) || qty <= 0) delete next[productId];
      else next[productId] = qty;
      return next;
    });
  };

  const handleAddProducts = async () => {
    const toAdd = Object.entries(addQuantities).filter(([, qty]) => qty > 0);
    if (!toAdd.length) return;
    try {
      for (const [idStr, qty] of toAdd) {
        const productId = parseInt(idStr);
        await addOrderItem.mutateAsync({
          orderId,
          data: { productId, quantityOrdered: qty, notes: addNotes[productId] || null }
        });
      }
      toast({ title: `Added ${toAdd.length} item${toAdd.length !== 1 ? "s" : ""} to order` });
      setAddQuantities({});
      setAddNotes({});
      setAddSearch("");
      setShowAddProducts(false);
      queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
      queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
    } catch {
      toast({ title: "Error", description: "Failed to add some items.", variant: "destructive" });
    }
  };

  const handleNoteSave = (itemId: number, note: string) => {
    const item = order?.items.find(i => i.id === itemId);
    if (note === (item?.notes ?? "")) return;
    updateOrderItem.mutate(
      { orderId, itemId, data: { notes: note || null } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) }) }
    );
  };

  const printBarcodeLabels = useCallback(async (
    productName: string,
    productId: number,
    vendorName: string,
    packSize: string | null | undefined,
    qty: number,
    itemId: number,
  ) => {
    setPrintingItemId(itemId);
    const zpl = buildPlantLabel({ productName, productId, vendorName, packSize, qty });
    const result = await printZpl(zpl);
    setPrintingItemId(null);

    if (result.ok) {
      toast({ title: `Sent ${qty} label${qty !== 1 ? "s" : ""} to Zebra printer` });
    } else {
      // Browser Print unavailable for any reason — fall back to native browser print dialog
      printLabelNative({ productName, productId, vendorName, packSize, qty });
      toast({
        title: "Opening browser print dialog",
        description:
          result.reason === "cert_error"
            ? "Browser Print certificate not trusted — using browser print instead. Select your Zebra printer in the dialog."
            : result.reason === "not_installed"
            ? "Zebra Browser Print not found — using browser print instead."
            : "Browser Print unavailable — using browser print instead.",
        duration: 6000,
      });
    }
  }, [toast]);

  const startEditItem = (itemId: number, currentQty: number) => {
    setEditingItemId(itemId);
    setEditingQty(currentQty);
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditingQty(1);
  };

  const saveEditItem = (itemId: number) => {
    if (editingQty < 1) return;
    updateOrderItem.mutate(
      { orderId, itemId, data: { quantityOrdered: editingQty } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
          setEditingItemId(null);
        },
        onError: () => toast({ title: "Error", description: "Failed to update quantity.", variant: "destructive" }),
      }
    );
  };

  const handleDeleteItem = (itemId: number) => {
    deleteOrderItem.mutate(
      { orderId, itemId },
      {
        onSuccess: () => {
          toast({ title: "Item removed" });
          queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        },
        onError: () => toast({ title: "Error", description: "Failed to remove item.", variant: "destructive" }),
      }
    );
  };

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
      data: { status: "submitted" }
    }, {
      onSuccess: () => {
        toast({ title: "Order Submitted", description: "Order submitted. Send the vendor an email to request confirmation." });
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      }
    });
  };

  const handleSendEmail = () => {
    sendEmail.mutate({ orderId }, {
      onSuccess: () => {
        toast({ title: "Email Sent", description: "A confirmation link has been emailed to the vendor." });
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error ?? "Failed to send email. Check that this vendor has an email address set in Admin.";
        toast({ title: "Email Failed", description: msg, variant: "destructive" });
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
    const styles: Record<string, string> = {
      draft: "bg-secondary text-secondary-foreground",
      submitted: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
      sent: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      confirmed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      partial: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      substitution: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      received: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
    };
    const label = status === "submitted" ? "Created" : status.charAt(0).toUpperCase() + status.slice(1);
    return <Badge className={styles[status] ?? "bg-secondary text-secondary-foreground"} variant="outline">{label}</Badge>;
  };

  const renderAvailabilityBadge = (avail: string | null | undefined, productId?: number) => {
    if (productId && receivedProductIds.has(productId)) {
      return <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400">Received</Badge>;
    }
    if (!avail || avail === "pending") return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
    if (avail === "available") return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Available</Badge>;
    if (avail === "unavailable") return <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">Unavailable</Badge>;
    if (avail === "partial") return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Partial</Badge>;
    if (avail === "substitution") return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 gap-1"><ArrowLeftRight className="h-3 w-3" />Substitution</Badge>;
    return null;
  };

  const handleApproveSubstitution = (itemId: number, quantityOrdered: number) => {
    updateOrderItem.mutate(
      { orderId, itemId, data: { availability: "available", quantityConfirmed: quantityOrdered } },
      { onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
      }}
    );
  };

  const handleRejectSubstitution = (itemId: number) => {
    updateOrderItem.mutate(
      { orderId, itemId, data: { availability: "unavailable", quantityConfirmed: 0 } },
      { onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
      }}
    );
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
                    {updateOrder.isPending ? "Submitting..." : "Submit Order"}
                  </Button>
                </>
              )}
              
              {(order.status === "submitted" || order.status === "sent" || order.status === "partial") && !isConfirming && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSendEmail}
                    disabled={sendEmail.isPending}
                    data-testid="button-send-email"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {sendEmail.isPending ? "Sending..." : order.emailSentAt ? "Resend Email" : "Send Email"}
                  </Button>
                  <Button onClick={handleStartConfirming} data-testid="button-enter-confirmations">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Enter Vendor Confirmations
                  </Button>
                </>
              )}

              {order.status === "substitution" && !isConfirming && (
                <Button
                  variant="outline"
                  onClick={handleSendEmail}
                  disabled={sendEmail.isPending}
                  data-testid="button-send-email"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {sendEmail.isPending ? "Sending..." : "Resend Email"}
                </Button>
              )}

              {(order.status === "confirmed" || order.status === "partial") && !isConfirming && receivedProductIds.size === 0 && (
                <Link href={`/orders/${order.id}/receive`}>
                  <Button className="bg-green-700 hover:bg-green-800 text-white" data-testid="button-receive-shipment">
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Receive Shipment
                  </Button>
                </Link>
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
                {order.items.some(i => i.unitCost != null) && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Est. Order Total</span>
                      <span className="font-semibold tabular-nums">
                        ${order.items.reduce((acc, item) => acc + (item.unitCost ?? 0) * item.quantityOrdered, 0).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  Order Items
                  <Badge variant="secondary" className="ml-2 font-normal">{order.items.length}</Badge>
                </CardTitle>
                {order.status === "draft" && (
                  <Button
                    variant={showAddProducts ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => { setShowAddProducts(v => !v); setAddQuantities({}); setAddSearch(""); }}
                    data-testid="button-toggle-add-products"
                  >
                    {showAddProducts ? (
                      <><ChevronUp className="mr-1.5 h-4 w-4" />Hide Catalog</>
                    ) : (
                      <><Plus className="mr-1.5 h-4 w-4" />Add Products</>
                    )}
                  </Button>
                )}
              </div>
              {isConfirming && (
                <CardDescription className="text-amber-700 dark:text-amber-500 flex items-center gap-1 mt-1 font-medium bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md inline-flex w-fit">
                  <Info className="h-4 w-4" />
                  Confirmation Mode Active. Update quantities and availability below.
                </CardDescription>
              )}
              {order.status === "substitution" && !isConfirming && (
                <CardDescription className="text-purple-700 dark:text-purple-400 flex items-center gap-2 mt-2 font-medium bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3 rounded-md w-full">
                  <ArrowLeftRight className="h-4 w-4 shrink-0" />
                  The vendor has proposed substitutions for some out-of-stock items. Review and approve or reject each one below.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[260px]">Product</TableHead>
                    <TableHead>Pack Size</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Ordered</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                    <TableHead className="w-[200px]">Notes</TableHead>
                    {order.status !== "draft" && (
                      <>
                        <TableHead className="text-right">Confirmed</TableHead>
                        <TableHead>Availability</TableHead>
                        {receivedProductIds.size > 0 && !isConfirming && (
                          <TableHead className="text-right">Labels</TableHead>
                        )}
                      </>
                    )}
                    {order.status === "draft" && (
                      <TableHead className="w-[100px]" />
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => {
                    const confirmRow = confirmData[item.id];
                    const isRowConfirming = isConfirming && confirmRow;
                    const isEditingThisItem = editingItemId === item.id;

                    return (
                      <TableRow key={item.id} className={isRowConfirming && confirmRow.availability === "unavailable" ? "opacity-70 bg-muted/30" : isEditingThisItem ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          {(item as any).substitutionName && item.availability === "available" ? (
                            <div>
                              <span>{(item as any).substitutionName}</span>
                              <p className="text-xs text-muted-foreground font-normal mt-0.5 line-through">{item.productName}</p>
                            </div>
                          ) : (item as any).substitutionName && item.availability === "unavailable" ? (
                            <div>
                              <span>{item.productName}</span>
                              <p className="text-xs text-muted-foreground font-normal mt-0.5">Sub rejected: {(item as any).substitutionName}</p>
                            </div>
                          ) : item.productName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.packSize || "N/A"}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {item.unitCost != null ? `$${item.unitCost.toFixed(2)}` : "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {isEditingThisItem ? (
                            <Input
                              type="number"
                              min="1"
                              autoFocus
                              value={editingQty}
                              onChange={(e) => setEditingQty(parseInt(e.target.value) || 1)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditItem(item.id);
                                if (e.key === "Escape") cancelEditItem();
                              }}
                              className="w-20 ml-auto text-right h-8"
                              data-testid={`input-edit-qty-${item.id}`}
                            />
                          ) : (
                            item.quantityOrdered
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {item.unitCost != null
                            ? `$${(item.unitCost * item.quantityOrdered).toFixed(2)}`
                            : "—"}
                        </TableCell>

                        {/* Notes column — editable in draft, read-only otherwise */}
                        <TableCell>
                          {order.status === "draft" ? (
                            <Input
                              type="text"
                              className="h-8 text-sm w-full"
                              placeholder="—"
                              value={notesOverrides[item.id] ?? (item.notes || "")}
                              onChange={(e) => setNotesOverrides(prev => ({ ...prev, [item.id]: e.target.value }))}
                              onBlur={(e) => handleNoteSave(item.id, e.target.value)}
                            />
                          ) : isRowConfirming ? (
                            <Input
                              placeholder="Reason..."
                              value={confirmRow.notes || ""}
                              onChange={(e) => handleConfirmItemChange(item.id, "notes", e.target.value)}
                              className="h-8 text-sm w-full"
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">{item.notes || "—"}</span>
                          )}
                        </TableCell>

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
                                  item.quantityConfirmed != null && item.quantityConfirmed < item.quantityOrdered 
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
                              ) : item.availability === "substitution" && !isConfirming ? (
                                <div className="space-y-1.5">
                                  {renderAvailabilityBadge(item.availability, item.productId)}
                                  {(item as any).substitutionName && (
                                    <p className="text-xs text-purple-700 font-medium">
                                      Sub: {(item as any).substitutionName}
                                    </p>
                                  )}
                                  {(item as any).substitutionNotes && (
                                    <p className="text-xs text-muted-foreground">{(item as any).substitutionNotes}</p>
                                  )}
                                  <div className="flex items-center gap-1 pt-0.5">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50 gap-1"
                                      disabled={updateOrderItem.isPending}
                                      onClick={() => handleApproveSubstitution(item.id, item.quantityOrdered)}
                                    >
                                      <ThumbsUp className="h-3 w-3" /> Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50 gap-1"
                                      disabled={updateOrderItem.isPending}
                                      onClick={() => handleRejectSubstitution(item.id)}
                                    >
                                      <ThumbsDown className="h-3 w-3" /> Reject
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                renderAvailabilityBadge(item.availability, item.productId)
                              )}
                            </TableCell>
                            {receivedProductIds.size > 0 && !isConfirming && (
                              <TableCell className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={labelQtys[item.id] ?? (item.packSize ? parseInt(String(item.packSize)) || 1 : 1)}
                                    onChange={(e) => setLabelQtys(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 1 }))}
                                    className="w-16 text-right h-8"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2"
                                    disabled={printingItemId === item.id}
                                    onClick={() => printBarcodeLabels(
                                      item.productName,
                                      item.productId,
                                      order.vendorName,
                                      item.packSize ? String(item.packSize) : null,
                                      labelQtys[item.id] ?? (item.packSize ? parseInt(String(item.packSize)) || 1 : 1),
                                      item.id,
                                    )}
                                  >
                                    <Printer className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </>
                        )}

                        {order.status === "draft" && (
                          <TableCell>
                            {isEditingThisItem ? (
                              <div className="flex items-center gap-1 justify-end">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-green-700 hover:text-green-800 hover:bg-green-50"
                                  onClick={() => saveEditItem(item.id)}
                                  disabled={updateOrderItem.isPending}
                                  data-testid={`button-save-item-${item.id}`}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  onClick={cancelEditItem}
                                  data-testid={`button-cancel-item-${item.id}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 justify-end">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                                  onClick={() => startEditItem(item.id, item.quantityOrdered)}
                                  data-testid={`button-edit-item-${item.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                      data-testid={`button-delete-item-${item.id}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove Line Item?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Remove <strong>{item.productName}</strong> from this order? This cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Remove
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {showAddProducts && (
                <div className="border-t bg-muted/20">
                  <div className="flex items-center justify-between px-6 py-3 border-b bg-background">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      Add from {order.vendorName} catalog
                      {filteredAddProducts.length > 0 && !addSearch && (
                        <span className="text-muted-foreground font-normal">· {filteredAddProducts.length} available</span>
                      )}
                    </div>
                    <div className="relative w-56">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search catalog..."
                        className="pl-8 h-8 text-sm"
                        value={addSearch}
                        onChange={(e) => setAddSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-[380px] overflow-y-auto">
                  {!vendorProducts ? (
                    <div className="p-6 space-y-3">
                      {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                  ) : filteredAddProducts.length === 0 ? (
                    <div className="py-10 text-center text-muted-foreground text-sm">
                      {addSearch ? "No products match your search." : "All catalog products are already on this order."}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-muted/30 sticky top-0 z-10">
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="w-[140px]">Pack Size</TableHead>
                          <TableHead className="w-[110px] text-right">Quantity</TableHead>
                          <TableHead className="w-[200px]">Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAddProducts.map(product => (
                          <TableRow
                            key={product.id}
                            className={(addQuantities[product.id] ?? 0) > 0 ? "bg-primary/5" : ""}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {product.name}
                                {product.isNew && (
                                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0 gap-0.5 hover:bg-amber-100">
                                    <Sparkles className="h-2.5 w-2.5" />New
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{product.packSize || "N/A"}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                className="w-20 ml-auto text-right h-8"
                                value={addQuantities[product.id] || ""}
                                onChange={(e) => handleAddQtyChange(product.id, e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                className="h-8 text-sm w-full"
                                placeholder="—"
                                value={addNotes[product.id] || ""}
                                onChange={(e) => setAddNotes(prev => {
                                  const next = { ...prev };
                                  if (e.target.value) next[product.id] = e.target.value;
                                  else delete next[product.id];
                                  return next;
                                })}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  </div>

                  <div className="flex items-center justify-between px-6 py-3 border-t bg-background">
                    <span className="text-sm text-muted-foreground">
                      {addTotalItems > 0 ? `${addTotalItems} product${addTotalItems !== 1 ? "s" : ""} selected` : "Enter quantities above"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setShowAddProducts(false); setAddQuantities({}); setAddSearch(""); }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={addTotalItems === 0 || addOrderItem.isPending}
                        onClick={handleAddProducts}
                        data-testid="button-add-products-confirm"
                      >
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        {addOrderItem.isPending ? "Adding..." : `Add ${addTotalItems > 0 ? addTotalItems : ""} Item${addTotalItems !== 1 ? "s" : ""}`}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}