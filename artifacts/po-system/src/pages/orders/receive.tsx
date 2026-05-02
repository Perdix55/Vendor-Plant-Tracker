import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import {
  useGetOrder,
  useReceiveOrder,
  getGetOrderQueryKey,
  getListInventoryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, PackageCheck, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ReceiveOrder() {
  const [, params] = useRoute("/orders/:id/receive");
  const orderId = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: getGetOrderQueryKey(orderId) },
  });

  const receiveOrder = useReceiveOrder();

  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (order && !initialized) {
      const defaults: Record<number, string> = {};
      for (const item of order.items ?? []) {
        if (item.availability !== "unavailable") {
          defaults[item.productId] = String(item.quantityConfirmed ?? item.quantityOrdered);
        }
      }
      setQuantities(defaults);
      setInitialized(true);
    }
  }, [order, initialized]);

  const handleQtyChange = (productId: number, val: string) => {
    setQuantities((prev) => ({ ...prev, [productId]: val }));
  };

  const handleNotesChange = (productId: number, val: string) => {
    setNotes((prev) => ({ ...prev, [productId]: val }));
  };

  const handleSubmit = async () => {
    if (!order) return;

    const items = (order.items ?? [])
      .filter((item) => item.availability !== "unavailable")
      .map((item) => {
        const raw = quantities[item.productId];
        const qty = raw !== undefined && raw !== "" ? parseInt(raw, 10) : 0;
        return {
          productId: item.productId,
          quantityReceived: isNaN(qty) ? 0 : qty,
          notes: notes[item.productId] ?? null,
        };
      })
      .filter((item) => item.quantityReceived > 0);

    if (items.length === 0) {
      toast({ title: "No quantities entered", description: "Enter at least one received quantity.", variant: "destructive" });
      return;
    }

    try {
      await receiveOrder.mutateAsync({ orderId, data: { items } });
      await queryClient.invalidateQueries({ queryKey: getListInventoryQueryKey() });
      toast({ title: "Shipment received!", description: `${items.length} item(s) added to inventory.` });
      setLocation(`/orders/${orderId}`);
    } catch {
      toast({ title: "Failed to receive shipment", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground" onClick={() => setLocation(`/orders/${orderId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Order
      </Button>

      <div className="flex items-center gap-3">
        <Truck className="h-7 w-7 text-green-700" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receive Shipment</h1>
          {order && (
            <p className="text-muted-foreground mt-1">
              PO #{order.id} · {order.vendorName}
              {order.arriveDate && ` · Arrive: ${format(new Date(order.arriveDate), "MM/dd/yyyy")}`}
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : order ? (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Enter Received Quantities</CardTitle>
              <CardDescription>
                Quantities are pre-filled from vendor confirmations. Adjust any that differ from what actually arrived, or set to 0 to skip an item.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Pack</TableHead>
                    <TableHead className="text-center">Ordered</TableHead>
                    <TableHead className="text-center">Confirmed</TableHead>
                    <TableHead className="w-32 text-center">Received</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(order.items ?? []).map((item) => {
                    const unavailable = item.availability === "unavailable";
                    return (
                      <TableRow key={item.id} className={unavailable ? "opacity-40" : ""}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.packSize ?? "—"}</TableCell>
                        <TableCell className="text-center">{item.quantityOrdered}</TableCell>
                        <TableCell className="text-center">
                          {item.quantityConfirmed ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {unavailable ? (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          ) : (
                            <Input
                              type="number"
                              min="0"
                              className="w-24 mx-auto text-center h-8"
                              value={quantities[item.productId] ?? ""}
                              onChange={(e) => handleQtyChange(item.productId, e.target.value)}
                              data-testid={`input-received-${item.productId}`}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {!unavailable && (
                            <Input
                              className="h-8 text-sm"
                              placeholder="Optional note"
                              value={notes[item.productId] ?? ""}
                              onChange={(e) => handleNotesChange(item.productId, e.target.value)}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setLocation(`/orders/${orderId}`)}>
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={handleSubmit}
              disabled={receiveOrder.isPending}
              data-testid="button-confirm-receive"
            >
              <PackageCheck className="mr-2 h-4 w-4" />
              {receiveOrder.isPending ? "Saving..." : "Confirm Receipt & Add to Inventory"}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">Order not found.</p>
      )}
    </div>
  );
}
