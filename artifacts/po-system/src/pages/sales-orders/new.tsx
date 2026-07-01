import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateSalesOrder, useUpdateSalesOrder, useListCustomers, getListSalesOrdersQueryKey } from "@workspace/api-client-react";
import type { Customer } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Minus, Plus, Pencil, Package, Search, ShoppingCart, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CatalogItem = {
  shopListingId: number;
  productName: string;
  price: string | null;
  status: string;
  category: string | null;
};

type CatalogEntry = { cartItemId: number; qty: number };

export default function NewSalesOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createSalesOrder = useCreateSalesOrder();
  const updateSalesOrder = useUpdateSalesOrder();

  // Track saved values to detect unsaved changes
  const [savedName, setSavedName] = useState("");
  const [savedNeededBy, setSavedNeededBy] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Order creation state
  const [customerName, setCustomerName] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [neededBy, setNeededBy] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  // Customer lookup state
  const { data: customers = [] } = useListCustomers();
  const [customerSuggestions, setCustomerSuggestions] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerHighlightedIndex, setCustomerHighlightedIndex] = useState(-1);
  const customerSearchWrapperRef = useRef<HTMLDivElement>(null);

  // Catalog state
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogCart, setCatalogCart] = useState<Record<number, CatalogEntry>>({});
  const [editingListingId, setEditingListingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CatalogItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<CatalogItem[]>([]);
  const catalogCartRef = useRef<Record<number, CatalogEntry>>({});
  const orderIdRef = useRef<number | null>(null);

  useEffect(() => { catalogRef.current = catalog; }, [catalog]);
  useEffect(() => { catalogCartRef.current = catalogCart; }, [catalogCart]);
  useEffect(() => { orderIdRef.current = orderId; }, [orderId]);

  // Fetch catalog once order is created
  useEffect(() => {
    if (!orderId) return;
    setCatalogLoading(true);
    fetch("/api/shop-availability/catalog")
      .then((r) => r.json())
      .then((data: CatalogItem[]) => setCatalog(data))
      .catch(() => setCatalog([]))
      .finally(() => setCatalogLoading(false));
  }, [orderId]);

  // Filter catalog for search dropdown
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) { setSuggestions([]); setShowDropdown(false); return; }
    const matches = catalogRef.current.filter((i) => i.productName.toLowerCase().includes(q)).slice(0, 8);
    setSuggestions(matches);
    setShowDropdown(matches.length > 0);
    setHighlightedIndex(-1);
  }, [searchQuery, catalog]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false); setHighlightedIndex(-1);
      }
      if (customerSearchWrapperRef.current && !customerSearchWrapperRef.current.contains(e.target as Node)) {
        setShowCustomerDropdown(false); setCustomerHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter customers for lookup dropdown
  useEffect(() => {
    const q = customerName.trim().toLowerCase();
    if (q.length < 1) { setCustomerSuggestions([]); setShowCustomerDropdown(false); return; }
    const matches = customers
      .filter((c) => c.name.toLowerCase().includes(q) || String(c.customerNumber ?? "").includes(q))
      .slice(0, 8);
    setCustomerSuggestions(matches);
    setShowCustomerDropdown(matches.length > 0);
    setCustomerHighlightedIndex(-1);
  }, [customerName, customers, orderId]);

  const selectCustomer = (c: Customer) => {
    setCustomerName(c.name);
    setSelectedCustomerId(c.id);
    setShowCustomerDropdown(false);
    setCustomerSuggestions([]);
    setCustomerHighlightedIndex(-1);
  };

  const handleCustomerNameChange = (value: string) => {
    setCustomerName(value);
    // Any manual edit invalidates a previously selected customer match
    if (selectedCustomerId !== null) setSelectedCustomerId(null);
  };

  const handleCustomerSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showCustomerDropdown || customerSuggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setCustomerHighlightedIndex((i) => Math.min(i + 1, customerSuggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCustomerHighlightedIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      if (customerHighlightedIndex >= 0 && customerSuggestions[customerHighlightedIndex]) {
        e.preventDefault();
        selectCustomer(customerSuggestions[customerHighlightedIndex]);
      }
    } else if (e.key === "Escape") { setShowCustomerDropdown(false); setCustomerHighlightedIndex(-1); }
  };

  // ── API helpers ─────────────────────────────────────────────────────────────

  const apiAdd = async (oid: number, item: CatalogItem, qty: number): Promise<CatalogEntry> => {
    const res = await fetch(`/api/sales-orders/${oid}/shop-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopListingId: item.shopListingId, productName: item.productName, price: item.price, quantity: qty }),
    });
    if (!res.ok) throw new Error("Failed to add item");
    const data = await res.json();
    return { cartItemId: data.id, qty };
  };

  const apiUpdate = async (oid: number, cartItemId: number, qty: number) => {
    await fetch(`/api/sales-orders/${oid}/shop-items/${cartItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
  };

  const apiDelete = async (oid: number, cartItemId: number) => {
    await fetch(`/api/sales-orders/${oid}/shop-items/${cartItemId}`, { method: "DELETE" });
  };

  const setQty = useCallback(async (item: CatalogItem, newQty: number) => {
    const oid = orderIdRef.current;
    if (!oid) return;
    const entry = catalogCartRef.current[item.shopListingId];
    const q = Math.max(0, newQty);
    if (q === 0 && entry) {
      await apiDelete(oid, entry.cartItemId);
      setCatalogCart((prev) => { const n = { ...prev }; delete n[item.shopListingId]; return n; });
    } else if (q > 0 && !entry) {
      const newEntry = await apiAdd(oid, item, q);
      setCatalogCart((prev) => ({ ...prev, [item.shopListingId]: newEntry }));
    } else if (entry && q !== entry.qty) {
      await apiUpdate(oid, entry.cartItemId, q);
      setCatalogCart((prev) => ({ ...prev, [item.shopListingId]: { ...entry, qty: q } }));
    }
  }, []);

  const delta = (item: CatalogItem, d: number) => {
    const cur = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    setQty(item, cur + d).catch(() => toast({ title: "Error updating quantity", variant: "destructive" }));
  };

  const startEdit = (item: CatalogItem) => {
    const cur = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    setEditingListingId(item.shopListingId);
    setEditDraft(cur > 0 ? String(cur) : "");
  };

  const confirmEdit = async (item: CatalogItem) => {
    const qty = parseInt(editDraft, 10);
    setEditingListingId(null);
    setEditDraft("");
    if (!isNaN(qty)) await setQty(item, qty).catch(() => toast({ title: "Error updating quantity", variant: "destructive" }));
  };

  const selectSuggestion = async (item: CatalogItem) => {
    setShowDropdown(false);
    setSuggestions([]);
    setSearchQuery("");
    setHighlightedIndex(-1);
    const cur = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    await setQty(item, cur + 1).catch(() => toast({ title: "Error adding item", variant: "destructive" }));
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter" && searchQuery.trim()) {
        setShowDropdown(false);
        const q = searchQuery.trim().toLowerCase();
        setSearchQuery("");
        const match = catalogRef.current.find((i) => i.productName.toLowerCase().includes(q));
        if (match) {
          const cur = catalogCartRef.current[match.shopListingId]?.qty ?? 0;
          setQty(match, cur + 1).catch(() => {});
        }
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) selectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") { setShowDropdown(false); setHighlightedIndex(-1); }
  };

  // ── Create order ─────────────────────────────────────────────────────────────

  const handleStart = async () => {
    if (!customerName.trim()) return;
    setCreating(true);
    try {
      const order = await createSalesOrder.mutateAsync({
        data: { customerName: customerName.trim(), customerId: selectedCustomerId, neededBy: neededBy || null },
      });
      setOrderId(order.id);
      setSavedName(customerName.trim());
      setSavedNeededBy(neededBy);
      setShowCustomerDropdown(false);
      setTimeout(() => searchRef.current?.focus(), 150);
    } catch {
      toast({ title: "Failed to create order", variant: "destructive" });
    }
    setCreating(false);
  };

  const handleSaveDetails = async () => {
    if (!orderId || !customerName.trim()) return;
    setSaving(true);
    try {
      await updateSalesOrder.mutateAsync({
        salesOrderId: orderId,
        data: { customerName: customerName.trim(), customerId: selectedCustomerId, neededBy: neededBy || null },
      });
      setSavedName(customerName.trim());
      setSavedNeededBy(neededBy);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch {
      toast({ title: "Failed to save changes", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDone = () => {
    queryClient.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
    navigate(`/sales-orders/${orderId}`);
  };

  // ── Stats & derived ──────────────────────────────────────────────────────────

  const totalUnits = Object.values(catalogCart).reduce((s, e) => s + e.qty, 0);
  const inCartCount = Object.values(catalogCart).filter((e) => e.qty > 0).length;

  const categories = Array.from(new Set(catalog.map((i) => i.category).filter(Boolean))) as string[];
  const filteredCatalog = selectedCategory === "all" ? catalog : catalog.filter((i) => i.category === selectedCategory);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/sales-orders">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Sales Order</h1>
          <p className="text-sm text-muted-foreground">
            {orderId ? `Order #${orderId} · add items from the availability list below` : "Enter customer details to get started"}
          </p>
        </div>
        {orderId && (
          <div className="ml-auto flex items-center gap-3">
            <Badge variant="secondary" className="gap-1.5 text-sm px-3 py-1">
              <ShoppingCart className="h-3.5 w-3.5" />
              {inCartCount > 0 ? `${inCartCount} SKU${inCartCount !== 1 ? "s" : ""} · ${totalUnits} units` : "No items yet"}
            </Badge>
            <Button onClick={handleDone} className="bg-green-700 hover:bg-green-800 text-white">
              Done
            </Button>
          </div>
        )}
      </div>

      {/* Customer info card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div ref={customerSearchWrapperRef} className="space-y-1.5 flex-1 max-w-xs relative">
              <Label htmlFor="customer-name">Customer Name</Label>
              <div className="relative">
                <Input
                  id="customer-name"
                  placeholder="Search or type a customer name"
                  value={customerName}
                  autoComplete="off"
                  onChange={(e) => handleCustomerNameChange(e.target.value)}
                  onFocus={() => { if (customerSuggestions.length > 0) setShowCustomerDropdown(true); }}
                  onKeyDown={(e) => {
                    if (showCustomerDropdown && customerSuggestions.length > 0) {
                      handleCustomerSearchKeyDown(e);
                      return;
                    }
                    if (e.key === "Enter") {
                      if (!orderId) handleStart();
                      else handleSaveDetails();
                    }
                  }}
                />
                {selectedCustomerId !== null && (
                  <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs gap-1">
                    <Check className="h-3 w-3" /> Matched
                  </Badge>
                )}
              </div>
              {showCustomerDropdown && customerSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border bg-popover shadow-lg overflow-hidden">
                  {customerSuggestions.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); selectCustomer(c); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${idx === customerHighlightedIndex ? "bg-accent" : "hover:bg-muted"}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        {c.customerNumber != null && (
                          <p className="text-xs text-muted-foreground">#{c.customerNumber}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1.5 w-44">
              <Label htmlFor="needed-by">
                Needed By <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="needed-by"
                type="date"
                value={neededBy}
                onChange={(e) => setNeededBy(e.target.value)}
              />
            </div>
            {!orderId && (
              <Button
                onClick={handleStart}
                disabled={!customerName.trim() || creating}
                className="shrink-0"
              >
                {creating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Starting…</> : "Start Order →"}
              </Button>
            )}
            {orderId && (customerName.trim() !== savedName || neededBy !== savedNeededBy) && (
              <Button
                onClick={handleSaveDetails}
                disabled={!customerName.trim() || saving}
                className="shrink-0"
              >
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : "Save Changes"}
              </Button>
            )}
            {orderId && savedFlash && (
              <span className="flex items-center gap-1.5 text-sm text-green-700 pb-2 shrink-0">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Catalog — only shown after order is created */}
      {orderId && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <CardTitle className="text-base shrink-0">Availability Catalog</CardTitle>
                {categories.length > 0 && (
                  <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setSearchQuery(""); }}>
                    <SelectTrigger className="h-8 w-52 text-sm">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div ref={searchWrapperRef} className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  ref={searchRef}
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                  className="pl-9 h-9"
                  autoComplete="off"
                />
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border bg-popover shadow-lg overflow-hidden">
                    {suggestions.map((item, idx) => (
                      <button
                        key={item.shopListingId}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${idx === highlightedIndex ? "bg-accent" : "hover:bg-muted"}`}
                      >
                        <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.productName}</p>
                          {item.price && <p className="text-xs text-muted-foreground">${item.price}</p>}
                        </div>
                        {(catalogCart[item.shopListingId]?.qty ?? 0) > 0 && (
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            {catalogCart[item.shopListingId].qty} in cart
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {catalogLoading ? (
              <div className="px-6 py-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)}
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <Package className="h-10 w-10 opacity-20" />
                <p className="text-sm">{catalog.length === 0 ? "No products listed. Import a weekly availability sheet in Admin → Shop." : "No products in this category."}</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredCatalog.map((item) => {
                  const qty = catalogCart[item.shopListingId]?.qty ?? 0;
                  const isEditing = editingListingId === item.shopListingId;
                  return (
                    <div
                      key={item.shopListingId}
                      className={`flex items-center gap-4 px-6 py-3 transition-colors ${qty > 0 ? "bg-green-50/60" : ""}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{item.productName}</p>
                          {item.status === "limited" && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium leading-none">Limited</span>
                          )}
                        </div>
                        {item.price && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <span className="font-medium text-foreground">${item.price}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEditing ? (
                          <>
                            <Input
                              type="number"
                              min="0"
                              autoFocus
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") confirmEdit(item);
                                if (e.key === "Escape") { setEditingListingId(null); setEditDraft(""); }
                              }}
                              onBlur={() => confirmEdit(item)}
                              className="w-16 h-8 text-center text-sm px-1"
                            />
                            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={() => confirmEdit(item)}>
                              OK
                            </Button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => delta(item, -1)}
                              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className={`w-8 text-center text-sm font-semibold tabular-nums ${qty > 0 ? "text-green-700" : "text-muted-foreground"}`}>
                              {qty}
                            </span>
                            <button
                              onClick={() => delta(item, 1)}
                              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => startEdit(item)}
                              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="Enter quantity"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Done button at bottom */}
      {orderId && inCartCount > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleDone} size="lg" className="bg-green-700 hover:bg-green-800 text-white">
            Done — View Order #{orderId}
          </Button>
        </div>
      )}
    </div>
  );
}
