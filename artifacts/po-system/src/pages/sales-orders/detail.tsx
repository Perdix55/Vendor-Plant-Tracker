import { useState, useRef, useEffect, useCallback } from "react";
import { useRoute, useLocation, Link } from "wouter";
import {
  useGetSalesOrder,
  useUpdateSalesOrder,
  useUpdateSalesOrderItem,
  useDeleteSalesOrderItem,
  useDeleteSalesOrder,
  useAddSalesOrderItem,
  getGetSalesOrderQueryKey,
  getListSalesOrdersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Pencil, Check, X, Trash2, Minus, Plus, ShoppingBag, Search, Loader2, Package, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type CatalogItem = {
  shopListingId: number;
  productName: string;
  price: string | null;
  status: string;
  category: string | null;
};

type CatalogEntry = { cartItemId: number; qty: number };

type InventorySuggestion = {
  id: number;
  productId: number;
  productName: string;
  vendorName: string;
  packSize: string | null;
  quantityOnHand: number;
};

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
  const addItem = useAddSalesOrderItem();
  const updateItem = useUpdateSalesOrderItem();
  const deleteItem = useDeleteSalesOrderItem();
  const deleteOrder = useDeleteSalesOrder();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editingNeededBy, setEditingNeededBy] = useState(false);
  const [neededByInput, setNeededByInput] = useState("");
  const [editingShippingAddress, setEditingShippingAddress] = useState(false);
  const [shippingAddressInput, setShippingAddressInput] = useState("");
  const [editingQty, setEditingQty] = useState<number | null>(null);
  const [qtyInput, setQtyInput] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<InventorySuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isAdding, setIsAdding] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Catalog state ────────────────────────────────────────────────────────
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogCart, setCatalogCart] = useState<Record<number, CatalogEntry>>({});
  const [catalogCategory, setCatalogCategory] = useState<string>("all");
  const [catalogEditingId, setCatalogEditingId] = useState<number | null>(null);
  const [catalogEditDraft, setCatalogEditDraft] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogSuggestions, setCatalogSuggestions] = useState<CatalogItem[]>([]);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);
  const [catalogHighlight, setCatalogHighlight] = useState(-1);
  const catalogRef = useRef<CatalogItem[]>([]);
  const catalogCartRef = useRef<Record<number, CatalogEntry>>({});
  const catalogSearchRef = useRef<HTMLInputElement>(null);
  const catalogSearchWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => { catalogRef.current = catalog; }, [catalog]);
  useEffect(() => { catalogCartRef.current = catalogCart; }, [catalogCart]);

  // Fetch catalog when panel opens
  useEffect(() => {
    if (!showCatalog || catalog.length > 0) return;
    setCatalogLoading(true);
    fetch("/api/shop-availability/catalog")
      .then((r) => r.json())
      .then((data: CatalogItem[]) => setCatalog(data))
      .catch(() => setCatalog([]))
      .finally(() => setCatalogLoading(false));
  }, [showCatalog]);

  // Sync catalogCart from order's existing shop items
  useEffect(() => {
    if (!order) return;
    const cart: Record<number, CatalogEntry> = {};
    for (const raw of order.items) {
      const item = raw as unknown as { id: number; quantity: number; _source?: string; shopListingId?: number | null };
      if (item._source === "shop" && item.shopListingId) {
        cart[item.shopListingId] = { cartItemId: item.id, qty: item.quantity };
      }
    }
    setCatalogCart(cart);
  }, [order]);

  // Filter catalog for search dropdown
  useEffect(() => {
    const q = catalogSearch.trim().toLowerCase();
    if (q.length < 2) { setCatalogSuggestions([]); setShowCatalogDropdown(false); return; }
    const matches = catalogRef.current.filter((i) => i.productName.toLowerCase().includes(q)).slice(0, 8);
    setCatalogSuggestions(matches);
    setShowCatalogDropdown(matches.length > 0);
    setCatalogHighlight(-1);
  }, [catalogSearch, catalog]);

  // Close catalog dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catalogSearchWrapperRef.current && !catalogSearchWrapperRef.current.contains(e.target as Node)) {
        setShowCatalogDropdown(false); setCatalogHighlight(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Catalog derived ─────────────────────────────────────────────────────
  const catalogCategories = Array.from(new Set(catalog.map((i) => i.category).filter(Boolean))) as string[];
  const filteredCatalog = catalogCategory === "all" ? catalog : catalog.filter((i) => i.category === catalogCategory);

  // ── Catalog API helpers ──────────────────────────────────────────────────
  const catalogApiAdd = async (item: CatalogItem, qty: number): Promise<CatalogEntry> => {
    const res = await fetch(`/api/sales-orders/${salesOrderId}/shop-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopListingId: item.shopListingId, productName: item.productName, price: item.price, quantity: qty }),
    });
    if (!res.ok) throw new Error("Failed to add item");
    const data = await res.json();
    return { cartItemId: data.id, qty };
  };

  const catalogApiUpdate = async (cartItemId: number, qty: number) => {
    await fetch(`/api/sales-orders/${salesOrderId}/shop-items/${cartItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
  };

  const catalogApiDelete = async (cartItemId: number) => {
    await fetch(`/api/sales-orders/${salesOrderId}/shop-items/${cartItemId}`, { method: "DELETE" });
  };

  const catalogSetQty = useCallback(async (item: CatalogItem, newQty: number) => {
    const entry = catalogCartRef.current[item.shopListingId];
    const q = Math.max(0, newQty);
    if (q === 0 && entry) {
      await catalogApiDelete(entry.cartItemId);
      setCatalogCart((prev) => { const n = { ...prev }; delete n[item.shopListingId]; return n; });
    } else if (q > 0 && !entry) {
      const newEntry = await catalogApiAdd(item, q);
      setCatalogCart((prev) => ({ ...prev, [item.shopListingId]: newEntry }));
    } else if (entry && q !== entry.qty) {
      await catalogApiUpdate(entry.cartItemId, q);
      setCatalogCart((prev) => ({ ...prev, [item.shopListingId]: { ...entry, qty: q } }));
    }
    invalidate();
  }, [salesOrderId]);

  const catalogDelta = (item: CatalogItem, d: number) => {
    const cur = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    catalogSetQty(item, cur + d).catch(() => toast({ title: "Error updating quantity", variant: "destructive" }));
  };

  const catalogStartEdit = (item: CatalogItem) => {
    const cur = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    setCatalogEditingId(item.shopListingId);
    setCatalogEditDraft(cur > 0 ? String(cur) : "");
  };

  const catalogConfirmEdit = async (item: CatalogItem) => {
    const qty = parseInt(catalogEditDraft, 10);
    setCatalogEditingId(null);
    setCatalogEditDraft("");
    if (!isNaN(qty)) await catalogSetQty(item, qty).catch(() => toast({ title: "Error updating quantity", variant: "destructive" }));
  };

  const catalogSelectSuggestion = async (item: CatalogItem) => {
    setShowCatalogDropdown(false);
    setCatalogSuggestions([]);
    setCatalogSearch("");
    setCatalogHighlight(-1);
    const cur = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    await catalogSetQty(item, cur + 1).catch(() => toast({ title: "Error adding item", variant: "destructive" }));
    setTimeout(() => catalogSearchRef.current?.focus(), 50);
  };

  const catalogSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showCatalogDropdown || catalogSuggestions.length === 0) {
      if (e.key === "Enter" && catalogSearch.trim()) {
        setShowCatalogDropdown(false);
        const q = catalogSearch.trim().toLowerCase();
        setCatalogSearch("");
        const match = catalogRef.current.find((i) => i.productName.toLowerCase().includes(q));
        if (match) {
          const cur = catalogCartRef.current[match.shopListingId]?.qty ?? 0;
          catalogSetQty(match, cur + 1).catch(() => {});
        }
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setCatalogHighlight((i) => Math.min(i + 1, catalogSuggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCatalogHighlight((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (catalogHighlight >= 0 && catalogSuggestions[catalogHighlight]) catalogSelectSuggestion(catalogSuggestions[catalogHighlight]);
    } else if (e.key === "Escape") { setShowCatalogDropdown(false); setCatalogHighlight(-1); }
  };

  useEffect(() => {
    const q = searchInput.trim();
    if (q.length < 2) { setSuggestions([]); setShowDropdown(false); setHighlightedIndex(-1); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(`/api/inventory/lookup?q=${encodeURIComponent(q)}`);
        const rows: InventorySuggestion[] = await resp.json();
        setSuggestions(rows.slice(0, 8));
        setShowDropdown(rows.length > 0);
        setHighlightedIndex(-1);
      } catch { /* ignore */ }
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false); setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetSalesOrderQueryKey(salesOrderId) });
    queryClient.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
  };

  const handleStatusChange = async (status: string) => {
    await updateOrder.mutateAsync({ salesOrderId, data: { status } });
    invalidate();
    toast({ title: "Status updated" });
    if (status === "completed") {
      window.open(`${import.meta.env.BASE_URL}sales-orders/${salesOrderId}/print`, "_blank");
    }
  };

  const selectSuggestion = async (inv: InventorySuggestion) => {
    setShowDropdown(false);
    setSuggestions([]);
    setSearchInput("");
    setHighlightedIndex(-1);
    setIsAdding(true);
    try {
      const existing = order?.items.find((i) => i.inventoryItemId === inv.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        await updateItem.mutateAsync({ salesOrderId, itemId: existing.id, data: { quantity: newQty } });
        toast({ title: `+1 → ${inv.productName}` });
      } else {
        await addItem.mutateAsync({ salesOrderId, data: { inventoryItemId: inv.id, quantity: 1 } });
        toast({ title: `Added: ${inv.productName}` });
      }
      invalidate();
    } catch {
      toast({ title: "Failed to add item", variant: "destructive" });
    }
    setIsAdding(false);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) selectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") { setShowDropdown(false); setHighlightedIndex(-1); }
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

  const handleSaveShippingAddress = async () => {
    await updateOrder.mutateAsync({ salesOrderId, data: { shippingAddress: shippingAddressInput.trim() || null } });
    invalidate();
    setEditingShippingAddress(false);
    toast({ title: "Shipping address updated" });
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
        <CardHeader className="pb-2">
          <CardDescription>Shipping Address</CardDescription>
        </CardHeader>
        <CardContent>
          {editingShippingAddress ? (
            <div className="flex flex-col gap-2 max-w-md">
              <Textarea
                value={shippingAddressInput}
                onChange={(e) => setShippingAddressInput(e.target.value)}
                placeholder={"123 Main St\nDallas, TX 75201"}
                rows={3}
                autoFocus
                className="text-sm"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSaveShippingAddress}>
                  <Check className="h-3.5 w-3.5 mr-1" /> Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingShippingAddress(false)}>
                  <X className="h-3.5 w-3.5 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              {order.shippingAddress ? (
                <p className="text-sm whitespace-pre-line">{order.shippingAddress}</p>
              ) : (
                <p className="text-muted-foreground text-sm">Not set</p>
              )}
              <button
                onClick={() => { setShippingAddressInput(order.shippingAddress ?? ""); setEditingShippingAddress(true); }}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Line Items</CardTitle>
              <CardDescription>Search for a product to add it to the order.</CardDescription>
            </div>
            <div ref={searchWrapperRef} className="relative w-72 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search products or scan barcode…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-9 pr-8 h-9"
                  disabled={isAdding}
                />
                {isAdding && (
                  <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button
                      key={s.id}
                      className={`w-full text-left px-3 py-2 text-sm flex items-start gap-2 hover:bg-muted transition-colors ${i === highlightedIndex ? "bg-muted" : ""}`}
                      onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
                      onMouseEnter={() => setHighlightedIndex(i)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{s.productName}</div>
                        <div className="text-muted-foreground text-xs truncate">
                          {s.vendorName}{s.packSize ? ` · ${s.packSize}` : ""}
                        </div>
                      </div>
                      <span className={`text-xs shrink-0 mt-0.5 font-medium ${s.quantityOnHand > 0 ? "text-green-700" : "text-muted-foreground"}`}>
                        {s.quantityOnHand} on hand
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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

      {/* ── Availability Catalog (open orders only) ─────────────────────── */}
      {order.status === "open" && (
        <Card>
          <CardHeader className="pb-3">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowCatalog((v) => !v)}
            >
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Add from Availability Catalog</CardTitle>
                {Object.keys(catalogCart).length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(catalogCart).reduce((s, e) => s + e.qty, 0)} added
                  </Badge>
                )}
              </div>
              {showCatalog ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
          </CardHeader>

          {showCatalog && (
            <CardContent className="pt-0">
              {/* Category filter + Search bar */}
              <div className="flex items-center gap-3 mb-4">
                {catalogCategories.length > 0 && (
                  <Select value={catalogCategory} onValueChange={(v) => { setCatalogCategory(v); setCatalogSearch(""); }}>
                    <SelectTrigger className="h-9 w-52 text-sm shrink-0">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {catalogCategories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div className="flex-1" />
              </div>
              <div ref={catalogSearchWrapperRef} className="relative mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    ref={catalogSearchRef}
                    placeholder="Search catalog…"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    onKeyDown={catalogSearchKeyDown}
                    className="pl-9 h-9"
                  />
                </div>
                {showCatalogDropdown && catalogSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 overflow-hidden">
                    {catalogSuggestions.map((item, i) => (
                      <button
                        key={item.shopListingId}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors ${i === catalogHighlight ? "bg-muted" : ""}`}
                        onMouseDown={(e) => { e.preventDefault(); catalogSelectSuggestion(item); }}
                        onMouseEnter={() => setCatalogHighlight(i)}
                      >
                        <span className="flex-1 font-medium truncate">{item.productName}</span>
                        {item.price && <span className="text-muted-foreground text-xs shrink-0">${item.price}</span>}
                        {catalogCart[item.shopListingId] && (
                          <span className="text-blue-600 font-semibold text-xs shrink-0">× {catalogCart[item.shopListingId].qty}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Catalog list */}
              {catalogLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : filteredCatalog.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  {catalog.length === 0 ? "No catalog items available." : "No products in this category."}
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-center w-36">Qty</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCatalog.map((item) => {
                        const entry = catalogCart[item.shopListingId];
                        const qty = entry?.qty ?? 0;
                        const isEditing = catalogEditingId === item.shopListingId;
                        return (
                          <TableRow key={item.shopListingId} className={qty > 0 ? "bg-blue-50/40" : ""}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {item.price ? `$${item.price}` : "—"}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <div className="flex items-center gap-1 justify-center">
                                  <Input
                                    type="number"
                                    value={catalogEditDraft}
                                    onChange={(e) => setCatalogEditDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") catalogConfirmEdit(item);
                                      if (e.key === "Escape") { setCatalogEditingId(null); setCatalogEditDraft(""); }
                                    }}
                                    className="h-7 w-16 text-center text-sm"
                                    autoFocus
                                  />
                                  <button onClick={() => catalogConfirmEdit(item)} className="text-green-600"><Check className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => { setCatalogEditingId(null); setCatalogEditDraft(""); }} className="text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 justify-center">
                                  <button
                                    onClick={() => catalogDelta(item, -1)}
                                    className="h-6 w-6 rounded border flex items-center justify-center hover:bg-muted"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => catalogStartEdit(item)}
                                    className={`w-8 text-center font-medium text-sm hover:underline cursor-pointer ${qty > 0 ? "text-blue-700" : "text-muted-foreground"}`}
                                  >
                                    {qty}
                                  </button>
                                  <button
                                    onClick={() => catalogDelta(item, 1)}
                                    className="h-6 w-6 rounded border flex items-center justify-center hover:bg-muted"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
