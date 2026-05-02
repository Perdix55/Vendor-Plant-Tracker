import { useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { 
  useListVendors, 
  useListVendorProducts, 
  useCreateOrder,
  getListOrdersQueryKey,
  getGetDashboardSummaryQueryKey,
  getListVendorProductsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Save, Search, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

export default function NewOrder() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialVendorId = params.get("vendorId");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [vendorId, setVendorId] = useState<string>(initialVendorId || "");
  const [weekDate, setWeekDate] = useState<string>(format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [notes, setNotes] = useState<string>("");
  const [searchProduct, setSearchProduct] = useState("");
  
  // Product quantities state: Record<productId, quantity>
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const { data: vendors, isLoading: isLoadingVendors } = useListVendors();
  
  const selectedVendorIdNum = vendorId ? parseInt(vendorId) : 0;
  const { data: products, isLoading: isLoadingProducts } = useListVendorProducts(
    selectedVendorIdNum, 
    { query: { enabled: !!selectedVendorIdNum, queryKey: getListVendorProductsQueryKey(selectedVendorIdNum) } }
  );

  const createOrder = useCreateOrder();

  const handleQuantityChange = (productId: number, qtyStr: string) => {
    const qty = parseInt(qtyStr, 10);
    setQuantities(prev => {
      const next = { ...prev };
      if (isNaN(qty) || qty <= 0) {
        delete next[productId];
      } else {
        next[productId] = qty;
      }
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const activeProducts = products.filter(p => p.isActive);
    if (!searchProduct) return activeProducts;
    const lower = searchProduct.toLowerCase();
    return activeProducts.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      (p.packSize && p.packSize.toLowerCase().includes(lower))
    );
  }, [products, searchProduct]);

  const totalItems = Object.keys(quantities).length;
  const totalQuantity = Object.values(quantities).reduce((acc, val) => acc + val, 0);

  const handleSubmit = () => {
    if (!vendorId) {
      toast({ title: "Error", description: "Please select a vendor.", variant: "destructive" });
      return;
    }
    if (!weekDate) {
      toast({ title: "Error", description: "Please select a week date (ship date).", variant: "destructive" });
      return;
    }
    
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({
        productId: parseInt(id),
        quantityOrdered: qty
      }));

    if (items.length === 0) {
      toast({ title: "Error", description: "Please add at least one product to the order.", variant: "destructive" });
      return;
    }

    createOrder.mutate({
      data: {
        vendorId: selectedVendorIdNum,
        weekDate: format(new Date(weekDate), "MM/dd/yyyy"), // "SHIP MM/dd/yyyy" format or similar? Just date for now
        notes: notes || null,
        items
      }
    }, {
      onSuccess: (order) => {
        toast({ title: "Success", description: "Purchase order created as draft." });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        setLocation(`/orders/${order.id}`);
      },
      onError: (err) => {
        toast({ title: "Error", description: "Failed to create order.", variant: "destructive" });
        console.error(err);
      }
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground" onClick={() => setLocation("/orders")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">New Purchase Order</h1>
        <p className="text-muted-foreground mt-1">Create a new draft order for a vendor.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                {isLoadingVendors ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={vendorId} onValueChange={(val) => { setVendorId(val); setQuantities({}); }}>
                    <SelectTrigger id="vendor">
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors?.map(v => (
                        <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekDate">Ship Date (Week Date)</Label>
                <Input 
                  id="weekDate" 
                  type="date" 
                  value={weekDate} 
                  onChange={(e) => setWeekDate(e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Delivery instructions, special requests..." 
                  className="min-h-[100px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unique Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Quantity:</span>
                <span className="font-medium">{totalQuantity}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSubmit}
                disabled={createOrder.isPending || totalItems === 0 || !vendorId || !weekDate}
                data-testid="button-submit-order"
              >
                {createOrder.isPending ? "Creating..." : "Create Draft Order"}
                {!createOrder.isPending && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Vendor Catalog
                  </CardTitle>
                  <CardDescription>Select quantities for items to order.</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search catalog..."
                    className="pl-9"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    disabled={!vendorId || isLoadingProducts}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              {!vendorId ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border-t p-6 text-center">
                  Select a vendor from the left to view their product catalog.
                </div>
              ) : isLoadingProducts ? (
                <div className="p-4 space-y-4 border-t">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : filteredProducts.length > 0 ? (
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10 border-t">
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[120px]">Pack Size</TableHead>
                      <TableHead className="w-[120px] text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(product => (
                      <TableRow key={product.id} className={quantities[product.id] > 0 ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{product.packSize || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            min="0" 
                            className="w-20 ml-auto text-right"
                            placeholder="0"
                            value={quantities[product.id] || ""}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            data-testid={`input-qty-${product.id}`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border-t p-6 text-center">
                  {searchProduct ? "No products match your search." : "No active products found for this vendor."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}