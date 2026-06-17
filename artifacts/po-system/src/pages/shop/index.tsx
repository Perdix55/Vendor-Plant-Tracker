import { useState, useRef, useEffect, useCallback } from "react";
import Quagga from "@ericblade/quagga2";
import { useQueryClient } from "@tanstack/react-query";
import { useAddSalesOrderItem, useCreateSalesOrder, useUpdateSalesOrderItem, useDeleteSalesOrderItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, Camera, CameraOff, Leaf, CheckCircle2, ShoppingCart, ScanLine, Package, Pencil } from "lucide-react";

type CatalogItem = {
  shopListingId: number;
  productName: string;
  price: string | null;
  status: string;
  inventoryItemId: number | null;
  vendorName: string | null;
  packSize: string | null;
  quantityOnHand: number | null;
};

type InventorySuggestion = {
  id: number;
  productName: string;
  vendorName: string;
  packSize: string | null;
  quantityOnHand: number;
};

type CartItem = {
  id: number;
  inventoryItemId: number;
  productName: string;
  vendorName: string;
  packSize: string | null;
  quantity: number;
};

type Step = "name" | "scan" | "done";

export default function ShopPage() {
  const [step, setStep] = useState<Step>("name");
  const [customerName, setCustomerName] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanFeedback, setScanFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isLooking, setIsLooking] = useState(false);
  const [suggestions, setSuggestions] = useState<InventorySuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [editingInvId, setEditingInvId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  // Quagga needs a div container — it creates the video + canvas elements itself
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const quaggaRunning = useRef(false);
  const cooldownRef = useRef(false);
  const lastScannedRef = useRef("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep a stable ref to orderId + cart so Quagga callbacks see current values
  const orderIdRef = useRef<number | null>(null);
  const cartRef = useRef<CartItem[]>([]);

  const queryClient = useQueryClient();
  const createSalesOrder = useCreateSalesOrder();
  const addItem = useAddSalesOrderItem();
  const updateItem = useUpdateSalesOrderItem();
  const deleteItem = useDeleteSalesOrderItem();

  // Keep refs in sync
  useEffect(() => { orderIdRef.current = orderId; }, [orderId]);
  useEffect(() => { cartRef.current = cart; }, [cart]);

  // Fetch catalog when order starts
  useEffect(() => {
    if (!orderId) return;
    setCatalogLoading(true);
    fetch("/api/shop-availability/catalog")
      .then((r) => r.json())
      .then((data: CatalogItem[]) => setCatalog(data))
      .catch(() => setCatalog([]))
      .finally(() => setCatalogLoading(false));
  }, [orderId]);

  // Auto-focus text input when scan step opens
  useEffect(() => {
    if (step !== "scan") return;
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [step]);

  // Debounced autocomplete fetch
  useEffect(() => {
    const q = barcodeInput.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setHighlightedIndex(-1);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(`/api/inventory/lookup?q=${encodeURIComponent(q)}`);
        const rows: InventorySuggestion[] = await resp.json();
        setSuggestions(rows.slice(0, 8));
        setShowDropdown(rows.length > 0);
        setHighlightedIndex(-1);
      } catch {
        // silently ignore
      }
    }, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [barcodeInput]);

  // Close dropdown when clicking outside the input wrapper
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputWrapperRef.current && !inputWrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Quagga camera controls ─────────────────────────────────────────────────

  const stopCamera = useCallback(() => {
    if (!quaggaRunning.current) return;
    Quagga.offDetected();
    Quagga.stop();
    quaggaRunning.current = false;
    setCameraReady(false);
  }, []);

  useEffect(() => () => { stopCamera(); }, [stopCamera]);

  const startCamera = useCallback(() => {
    if (!cameraContainerRef.current || quaggaRunning.current) return;
    setCameraError("");
    setCameraReady(false);

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: cameraContainerRef.current,
          constraints: {
            facingMode: "environment",   // rear camera on phones
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        decoder: {
          // Only CODE128 — our labels always use CODE128.
          // Enabling ean_reader / ean_8_reader causes them to grab 8-digit
          // CODE128 barcodes first and return truncated / wrong values.
          readers: ["code_128_reader"],
          multiple: false,
        },
        locate: true,
        frequency: 10,   // decode attempts per second
      },
      (err) => {
        if (err) {
          setCameraError("Camera not available or permission denied.");
          setCameraOpen(false);
          return;
        }
        Quagga.start();
        quaggaRunning.current = true;
        setCameraReady(true);

        Quagga.onDetected((result) => {
          const code = result.codeResult.code;
          if (!code) return;
          if (cooldownRef.current) return;
          if (code === lastScannedRef.current) return;

          cooldownRef.current = true;
          lastScannedRef.current = code;
          handleBarcodeDetected(code);
          setTimeout(() => { cooldownRef.current = false; }, 2000);
        });
      }
    );
  }, []);   // no deps — reads from refs

  const toggleCamera = () => {
    if (cameraOpen) {
      stopCamera();
      setCameraOpen(false);
    } else {
      setCameraOpen(true);
      // DOM needs a tick to render the container before Quagga can attach
      setTimeout(startCamera, 200);
    }
    setTimeout(() => inputRef.current?.focus(), 350);
  };

  // ── Autocomplete selection ─────────────────────────────────────────────────

  const selectSuggestion = async (item: InventorySuggestion) => {
    setShowDropdown(false);
    setSuggestions([]);
    setBarcodeInput("");
    setHighlightedIndex(-1);
    setIsLooking(true);
    try {
      await addOrUpdateCartItem(item);
    } catch {
      showFeedback("Error adding item", false);
    }
    setIsLooking(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── Barcode lookup & cart mutation ─────────────────────────────────────────

  const showFeedback = (text: string, ok: boolean) => {
    setScanFeedback({ text, ok });
    setTimeout(() => setScanFeedback(null), 2500);
  };

  // Shared: add (or increment) an already-resolved inventory item in the cart
  const addOrUpdateCartItem = async (inv: Pick<InventorySuggestion, "id" | "productName" | "vendorName" | "packSize">) => {
    const oid = orderIdRef.current;
    if (!oid) return;
    const existing = cartRef.current.find((c) => c.inventoryItemId === inv.id);
    if (existing) {
      const newQty = existing.quantity + 1;
      await updateItem.mutateAsync({ salesOrderId: oid, itemId: existing.id, data: { quantity: newQty } });
      setCart((prev) => prev.map((c) => (c.id === existing.id ? { ...c, quantity: newQty } : c)));
      showFeedback(`+1 → ${inv.productName}`, true);
    } else {
      const added = await addItem.mutateAsync({ salesOrderId: oid, data: { inventoryItemId: inv.id, quantity: 1 } });
      setCart((prev) => [
        ...prev,
        { id: added.id, inventoryItemId: inv.id, productName: inv.productName, vendorName: inv.vendorName, packSize: inv.packSize, quantity: 1 },
      ]);
      showFeedback(`Added: ${inv.productName}`, true);
    }
  };

  // Fetch by barcode string then add — used by camera + text-submit
  const lookupAndAdd = async (barcode: string): Promise<void> => {
    const oid = orderIdRef.current;
    if (!barcode.trim()) return;
    if (!oid) { showFeedback("No active order — please restart", false); return; }
    const resp = await fetch(`/api/inventory/lookup?q=${encodeURIComponent(barcode.trim())}`);
    const items: InventorySuggestion[] = await resp.json();
    if (!items.length) { showFeedback(`Not found: "${barcode}"`, false); return; }
    await addOrUpdateCartItem(items[0]);
  };

  // Called from Quagga callback (fire and forget)
  const handleBarcodeDetected = (barcode: string) => {
    lookupAndAdd(barcode).catch(() => showFeedback("Error looking up item", false));
  };

  // Called when user presses Enter or the Add button
  const handleBarcodeSubmit = async () => {
    // If a suggestion is highlighted, select it instead of doing a lookup
    if (showDropdown && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      await selectSuggestion(suggestions[highlightedIndex]);
      return;
    }
    const barcode = barcodeInput.trim();
    if (!barcode || !orderId) return;
    setShowDropdown(false);
    setBarcodeInput("");
    setIsLooking(true);
    try {
      await lookupAndAdd(barcode);
    } catch {
      showFeedback("Error looking up item", false);
    }
    setIsLooking(false);
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") handleBarcodeSubmit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        selectSuggestion(suggestions[highlightedIndex]);
      } else {
        handleBarcodeSubmit();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  // ── Cart item controls ─────────────────────────────────────────────────────

  const handleQtyChange = async (item: CartItem, delta: number) => {
    if (!orderId) return;
    const newQty = Math.max(0, item.quantity + delta);
    if (newQty === 0) {
      await deleteItem.mutateAsync({ salesOrderId: orderId, itemId: item.id });
      setCart((prev) => prev.filter((c) => c.id !== item.id));
    } else {
      await updateItem.mutateAsync({ salesOrderId: orderId, itemId: item.id, data: { quantity: newQty } });
      setCart((prev) => prev.map((c) => (c.id === item.id ? { ...c, quantity: newQty } : c)));
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleRemove = async (item: CartItem) => {
    if (!orderId) return;
    await deleteItem.mutateAsync({ salesOrderId: orderId, itemId: item.id });
    setCart((prev) => prev.filter((c) => c.id !== item.id));
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── Catalog qty helpers ────────────────────────────────────────────────────

  const getCartItemByInvId = (invId: number) => cart.find((c) => c.inventoryItemId === invId);

  const handleCatalogSetQty = async (item: CatalogItem, newQty: number) => {
    if (!orderId || !item.inventoryItemId) return;
    const existing = getCartItemByInvId(item.inventoryItemId);
    const clamped = Math.max(0, newQty);
    if (clamped === 0 && existing) {
      await deleteItem.mutateAsync({ salesOrderId: orderId, itemId: existing.id });
      setCart((prev) => prev.filter((c) => c.id !== existing.id));
    } else if (clamped > 0 && !existing) {
      const added = await addItem.mutateAsync({ salesOrderId: orderId, data: { inventoryItemId: item.inventoryItemId, quantity: clamped } });
      setCart((prev) => [...prev, { id: added.id, inventoryItemId: item.inventoryItemId!, productName: item.productName, vendorName: item.vendorName ?? "", packSize: item.packSize, quantity: clamped }]);
    } else if (existing && clamped !== existing.quantity) {
      await updateItem.mutateAsync({ salesOrderId: orderId, itemId: existing.id, data: { quantity: clamped } });
      setCart((prev) => prev.map((c) => (c.id === existing.id ? { ...c, quantity: clamped } : c)));
    }
  };

  const handleCatalogDelta = async (item: CatalogItem, delta: number) => {
    const current = item.inventoryItemId ? (getCartItemByInvId(item.inventoryItemId)?.quantity ?? 0) : 0;
    await handleCatalogSetQty(item, current + delta);
  };

  const startEdit = (item: CatalogItem) => {
    if (!item.inventoryItemId) return;
    const current = getCartItemByInvId(item.inventoryItemId)?.quantity ?? 0;
    setEditingInvId(item.inventoryItemId);
    setEditDraft(current > 0 ? String(current) : "");
  };

  const confirmEdit = async (item: CatalogItem) => {
    const qty = parseInt(editDraft, 10);
    setEditingInvId(null);
    setEditDraft("");
    if (!isNaN(qty)) await handleCatalogSetQty(item, qty);
  };

  const handleStart = async () => {
    if (!customerName.trim()) return;
    const order = await createSalesOrder.mutateAsync({ data: { customerName: customerName.trim() } });
    setOrderId(order.id);
    setStep("scan");
  };

  const handleFinish = () => {
    stopCamera();
    setStep("done");
    queryClient.invalidateQueries({ queryKey: ["listSalesOrders"] });
  };

  // ── Name step ──────────────────────────────────────────────────────────────
  if (step === "name") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Vickery Wholesale</h1>
            <p className="text-muted-foreground text-sm">Enter your name to start an order</p>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              autoFocus
              className="text-center text-lg h-12"
              data-testid="input-customer-name"
            />
            <Button
              className="w-full h-12 text-base"
              onClick={handleStart}
              disabled={!customerName.trim() || createSalesOrder.isPending}
              data-testid="button-start-shopping"
            >
              {createSalesOrder.isPending ? "Starting..." : "Start Shopping →"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Done step ──────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Order Submitted!</h1>
            <p className="text-muted-foreground">
              Thank you, <span className="font-medium text-foreground">{customerName}</span>. Order #{orderId} has been received.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-left space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Order Summary</p>
            {cart.length === 0 && <p className="text-sm text-muted-foreground">No items</p>}
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.productName}{item.packSize ? ` (${item.packSize})` : ""}</span>
                <span className="font-semibold">×{item.quantity}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => {
            setStep("name"); setCustomerName(""); setCart([]); setOrderId(null);
            lastScannedRef.current = "";
          }}>
            Start a New Order
          </Button>
        </div>
      </div>
    );
  }

  // ── Scan step ──────────────────────────────────────────────────────────────
  const totalUnits = cart.reduce((s, c) => s + c.quantity, 0);
  const inCartCount = cart.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="font-semibold text-sm">{customerName}</p>
          <p className="text-xs text-muted-foreground">Order #{orderId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <ShoppingCart className="h-3 w-3" />
            {inCartCount > 0 ? `${inCartCount} item${inCartCount !== 1 ? "s" : ""} · ${totalUnits} units` : "0"}
          </Badge>
          <Button
            size="sm"
            onClick={handleFinish}
            className="bg-green-700 hover:bg-green-800 text-white"
            data-testid="button-finish-order"
          >
            Finish
          </Button>
        </div>
      </div>

      {/* Search / scan bar */}
      <div className="bg-card border-b px-4 py-3 space-y-3 shrink-0">
        <div className="flex gap-2">
          <div ref={inputWrapperRef} className="relative flex-1">
            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <Input
              ref={inputRef}
              placeholder="Scan barcode or search…"
              value={barcodeInput}
              onChange={(e) => { setBarcodeInput(e.target.value); setShowDropdown(true); }}
              onKeyDown={handleInputKeyDown}
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              className="pl-9 h-10 text-sm"
              disabled={isLooking}
              data-testid="input-barcode"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border bg-popover shadow-lg overflow-hidden">
                {suggestions.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${idx === highlightedIndex ? "bg-accent" : "hover:bg-muted"}`}
                  >
                    <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.vendorName}{item.packSize ? ` · ${item.packSize}` : ""}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleBarcodeSubmit} disabled={!barcodeInput.trim() || isLooking} className="h-10 px-4" data-testid="button-add-barcode">
            {isLooking ? "…" : "Add"}
          </Button>
          <Button variant={cameraOpen ? "secondary" : "outline"} size="icon" className="h-10 w-10 shrink-0" onClick={toggleCamera}>
            {cameraOpen ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
          </Button>
        </div>

        {scanFeedback && (
          <div className={`text-sm px-3 py-1.5 rounded-md font-medium ${scanFeedback.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {scanFeedback.text}
          </div>
        )}
        {cameraError && <p className="text-sm text-destructive">{cameraError}</p>}
        {cameraOpen && (
          <div className="relative rounded-lg overflow-hidden bg-black" style={{ height: 220 }}>
            <div ref={cameraContainerRef} className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:w-full [&_canvas]:h-full" />
            {!cameraReady && !cameraError && <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/60">Starting camera…</div>}
            {cameraReady && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="border-2 border-white/80 rounded-lg w-56 h-20 shadow-lg" /></div>}
          </div>
        )}
      </div>

      {/* Product catalog */}
      <div className="flex-1 overflow-y-auto">
        {catalogLoading ? (
          <div className="px-4 py-6 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : catalog.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm gap-2 px-4 text-center">
            <Package className="h-10 w-10 opacity-20" />
            <p>No products listed yet. Use the search bar above to add items by barcode or name.</p>
          </div>
        ) : (
          <div className="divide-y">
            {catalog.map((item) => {
              const cartItem = item.inventoryItemId ? getCartItemByInvId(item.inventoryItemId) : undefined;
              const qty = cartItem?.quantity ?? 0;
              const isEditing = editingInvId === item.inventoryItemId;
              const isLimited = item.status === "limited";
              const noInventory = !item.inventoryItemId;

              return (
                <div
                  key={item.shopListingId}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${qty > 0 ? "bg-green-50/60" : ""}`}
                >
                  {/* Left: name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className={`text-sm font-medium leading-tight ${noInventory ? "text-muted-foreground" : ""}`}>
                        {item.productName}
                      </p>
                      {isLimited && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium leading-none">Limited</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.price ? <span className="font-medium text-foreground">{item.price}</span> : null}
                      {item.price && item.packSize ? " · " : ""}
                      {item.packSize ?? ""}
                      {noInventory ? <span className="ml-1 italic">(not in inventory)</span> : ""}
                    </p>
                  </div>

                  {/* Right: qty controls */}
                  <div className="flex items-center gap-1 shrink-0">
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
                            if (e.key === "Escape") { setEditingInvId(null); setEditDraft(""); }
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
                          disabled={noInventory}
                          onClick={() => handleCatalogDelta(item, -1)}
                          className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className={`w-8 text-center text-sm font-semibold tabular-nums ${qty > 0 ? "text-green-700" : "text-muted-foreground"}`}>
                          {qty}
                        </span>
                        <button
                          disabled={noInventory}
                          onClick={() => handleCatalogDelta(item, 1)}
                          className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          disabled={noInventory}
                          onClick={() => startEdit(item)}
                          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 ml-0.5"
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
      </div>
    </div>
  );
}
