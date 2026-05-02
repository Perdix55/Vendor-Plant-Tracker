import { useState, useMemo } from "react";
import {
  useListInventory,
  useAdjustInventory,
  useListInventoryTransactions,
  getListInventoryQueryKey,
  InventoryItem,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch, Search, MinusCircle, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Inventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: inventory, isLoading } = useListInventory();
  const adjustInventory = useAdjustInventory();
  const { data: transactions, isLoading: txLoading } = useListInventoryTransactions({ limit: 50 });

  const [search, setSearch] = useState("");
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustType, setAdjustType] = useState<"sale" | "adjustment" | "write_off">("sale");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const filtered = useMemo(() => {
    if (!inventory) return [];
    if (!search) return inventory;
    const q = search.toLowerCase();
    return inventory.filter(
      (i) =>
        i.productName.toLowerCase().includes(q) ||
        i.vendorName.toLowerCase().includes(q)
    );
  }, [inventory, search]);

  const totalOnHand = useMemo(
    () => (inventory ?? []).reduce((sum, i) => sum + i.quantityOnHand, 0),
    [inventory]
  );

  const handleAdjustOpen = (item: InventoryItem) => {
    setAdjustItem(item);
    setAdjustQty("");
    setAdjustType("sale");
    setAdjustNotes("");
  };

  const handleAdjustSubmit = async () => {
    if (!adjustItem) return;
    const qty = parseInt(adjustQty);
    if (!qty || qty <= 0) {
      toast({ title: "Enter a valid quantity", variant: "destructive" });
      return;
    }
    try {
      await adjustInventory.mutateAsync({
        data: {
          productId: adjustItem.productId,
          vendorId: adjustItem.vendorId,
          quantity: qty,
          type: adjustType,
          notes: adjustNotes || null,
        },
      });
      await queryClient.invalidateQueries({ queryKey: getListInventoryQueryKey() });
      toast({ title: "Inventory updated" });
      setAdjustItem(null);
    } catch {
      toast({ title: "Failed to adjust inventory", variant: "destructive" });
    }
  };

  const txTypeLabel: Record<string, string> = {
    receive: "Received",
    sale: "Sale",
    adjustment: "Adjustment",
    write_off: "Write-Off",
  };

  const txTypeBadge: Record<string, string> = {
    receive: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
    sale: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    adjustment: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
    write_off: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <PackageSearch className="h-8 w-8 text-green-700" />
            Inventory
          </h1>
          <p className="text-muted-foreground mt-1">Current stock levels from received shipments.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHistory(true)}
          data-testid="button-inventory-history"
        >
          <History className="mr-2 h-4 w-4" />
          View History
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inventory?.length ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Units on Hand</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOnHand}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">
              {(inventory ?? []).filter((i) => i.quantityOnHand === 0).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products or vendors..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-inventory"
        />
      </div>

      {/* Inventory table */}
      {isLoading ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Pack</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-center">On Hand</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : filtered.length > 0 ? (
        <div className="border rounded-md bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Pack</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-center">On Hand</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} data-testid={`row-inventory-${item.id}`}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.packSize ?? "—"}</TableCell>
                  <TableCell>{item.vendorName}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        item.quantityOnHand === 0
                          ? "text-amber-600 font-semibold"
                          : "font-semibold text-green-700"
                      }
                    >
                      {item.quantityOnHand}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(item.updatedAt), "MM/dd/yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAdjustOpen(item)}
                      data-testid={`button-adjust-${item.id}`}
                    >
                      <MinusCircle className="mr-1 h-4 w-4" />
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-card text-muted-foreground shadow-sm">
          <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No inventory yet</h3>
          <p>
            {search
              ? "No items match your search."
              : "Receive a shipment on a confirmed order to start tracking inventory."}
          </p>
        </div>
      )}

      {/* Adjust dialog */}
      <Dialog open={!!adjustItem} onOpenChange={(open) => !open && setAdjustItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
          </DialogHeader>
          {adjustItem && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{adjustItem.productName}</span>
                {adjustItem.packSize && ` (${adjustItem.packSize})`} · {adjustItem.vendorName}
              </p>
              <p className="text-sm">
                Current stock: <span className="font-semibold">{adjustItem.quantityOnHand}</span>
              </p>
              <div className="space-y-1.5">
                <Label>Adjustment Type</Label>
                <Select value={adjustType} onValueChange={(v) => setAdjustType(v as typeof adjustType)}>
                  <SelectTrigger data-testid="select-adjust-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale (deduct)</SelectItem>
                    <SelectItem value="write_off">Write-Off (deduct)</SelectItem>
                    <SelectItem value="adjustment">Manual Adjustment (add)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  data-testid="input-adjust-qty"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Notes (optional)</Label>
                <Input
                  placeholder="Reason or reference"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustItem(null)}>Cancel</Button>
            <Button
              onClick={handleAdjustSubmit}
              disabled={adjustInventory.isPending}
              data-testid="button-submit-adjust"
            >
              {adjustInventory.isPending ? "Saving..." : "Save Adjustment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction history dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inventory History</DialogTitle>
          </DialogHeader>
          {txLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (transactions ?? []).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transactions ?? []).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(tx.createdAt), "MM/dd/yy")}
                    </TableCell>
                    <TableCell className="font-medium">{tx.productName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{tx.vendorName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={txTypeBadge[tx.type] ?? ""}>
                        {txTypeLabel[tx.type] ?? tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      <span className={tx.quantity > 0 ? "text-green-700" : "text-red-600"}>
                        {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{tx.notes ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
