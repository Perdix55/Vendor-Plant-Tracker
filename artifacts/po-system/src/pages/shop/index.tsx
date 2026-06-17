import { useState, useRef, useEffect, useCallback } from "react";
import Quagga from "@ericblade/quagga2";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateSalesOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Camera, CameraOff, Leaf, CheckCircle2, ShoppingCart, ScanLine, Package, Pencil } from "lucide-react";

type CatalogItem = {
  shopListingId: number;
  productName: string;
  price: string | null;
  status: string;
};

type CatalogEntry = { cartItemId: number; qty: number };

type Step = "name" | "scan" | "done";

export default function ShopPage() {
  const [step, setStep] = useState<Step>("name");
  const [customerName, setCustomerName] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  // keyed by shopListingId
  const [catalogCart, setCatalogCart] = useState<Record<number, CatalogEntry>>({});
  const [editingListingId, setEditingListingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [scanFeedback, setScanFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<CatalogItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const quaggaRunning = useRef(false);
  const cooldownRef = useRef(false);
  const lastScannedRef = useRef("");
  const orderIdRef = useRef<number | null>(null);
  const catalogRef = useRef<CatalogItem[]>([]);
  const catalogCartRef = useRef<Record<number, CatalogEntry>>({});

  const queryClient = useQueryClient();
  const createSalesOrder = useCreateSalesOrder();

  // Keep refs in sync
  useEffect(() => { orderIdRef.current = orderId; }, [orderId]);
  useEffect(() => { catalogRef.current = catalog; }, [catalog]);
  useEffect(() => { catalogCartRef.current = catalogCart; }, [catalogCart]);

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

  // Auto-focus input when scan step opens
  useEffect(() => {
    if (step !== "scan") return;
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [step]);

  // Filter catalog by search query
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) {
      setFilteredSuggestions([]);
      setShowDropdown(false);
      setHighlightedIndex(-1);
      return;
    }
    const matches = catalogRef.current
      .filter((item) => item.productName.toLowerCase().includes(q))
      .slice(0, 8);
    setFilteredSuggestions(matches);
    setShowDropdown(matches.length > 0);
    setHighlightedIndex(-1);
  }, [searchQuery, catalog]);

  // Close dropdown on outside click
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

  // ── Camera ──────────────────────────────────────────────────────────────────

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
          constraints: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        },
        decoder: { readers: ["code_128_reader"], multiple: false },
        locate: true,
        frequency: 10,
      },
      (err) => {
        if (err) { setCameraError("Camera not available or permission denied."); setCameraOpen(false); return; }
        Quagga.start();
        quaggaRunning.current = true;
        setCameraReady(true);
        Quagga.onDetected((result) => {
          const code = result.codeResult.code;
          if (!code || cooldownRef.current || code === lastScannedRef.current) return;
          cooldownRef.current = true;
          lastScannedRef.current = code;
          handleBarcodeDetected(code);
          setTimeout(() => { cooldownRef.current = false; }, 2000);
        });
      }
    );
  }, []);

  const toggleCamera = () => {
    if (cameraOpen) { stopCamera(); setCameraOpen(false); }
    else { setCameraOpen(true); setTimeout(startCamera, 200); }
    setTimeout(() => inputRef.current?.focus(), 350);
  };

  // ── Shop order item API calls ──────────────────────────────────────────────

  const showFeedback = (text: string, ok: boolean) => {
    setScanFeedback({ text, ok });
    setTimeout(() => setScanFeedback(null), 2500);
  };

  const apiAddItem = async (oid: number, item: CatalogItem, qty: number): Promise<CatalogEntry> => {
    const res = await fetch(`/api/sales-orders/${oid}/shop-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopListingId: item.shopListingId, productName: item.productName, price: item.price, quantity: qty }),
    });
    if (!res.ok) throw new Error("Failed to add item");
    const data = await res.json();
    return { cartItemId: data.id, qty };
  };

  const apiUpdateItem = async (oid: number, cartItemId: number, qty: number): Promise<void> => {
    await fetch(`/api/sales-orders/${oid}/shop-items/${cartItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
  };

  const apiDeleteItem = async (oid: number, cartItemId: number): Promise<void> => {
    await fetch(`/api/sales-orders/${oid}/shop-items/${cartItemId}`, { method: "DELETE" });
  };

  const handleCatalogSetQty = async (item: CatalogItem, newQty: number) => {
    const oid = orderId;
    if (!oid) return;
    const entry = catalogCartRef.current[item.shopListingId];
    const q = Math.max(0, newQty);
    if (q === 0 && entry) {
      await apiDeleteItem(oid, entry.cartItemId);
      setCatalogCart((prev) => { const n = { ...prev }; delete n[item.shopListingId]; return n; });
    } else if (q > 0 && !entry) {
      const newEntry = await apiAddItem(oid, item, q);
      setCatalogCart((prev) => ({ ...prev, [item.shopListingId]: newEntry }));
    } else if (entry && q !== entry.qty) {
      await apiUpdateItem(oid, entry.cartItemId, q);
      setCatalogCart((prev) => ({ ...prev, [item.shopListingId]: { ...entry, qty: q } }));
    }
  };

  const handleCatalogDelta = (item: CatalogItem, delta: number) => {
    const current = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    handleCatalogSetQty(item, current + delta).catch(() => showFeedback("Error updating quantity", false));
  };

  const startEdit = (item: CatalogItem) => {
    const current = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    setEditingListingId(item.shopListingId);
    setEditDraft(current > 0 ? String(current) : "");
  };

  const confirmEdit = async (item: CatalogItem) => {
    const qty = parseInt(editDraft, 10);
    setEditingListingId(null);
    setEditDraft("");
    if (!isNaN(qty)) await handleCatalogSetQty(item, qty).catch(() => showFeedback("Error updating quantity", false));
  };

  // ── Barcode / search ───────────────────────────────────────────────────────

  const addCatalogItemByMatch = async (query: string) => {
    const q = query.toLowerCase();
    const match = catalogRef.current.find((item) => item.productName.toLowerCase().includes(q));
    if (!match) { showFeedback(`Not found: "${query}"`, false); return; }
    const current = catalogCartRef.current[match.shopListingId]?.qty ?? 0;
    await handleCatalogSetQty(match, current + 1);
    showFeedback(`+1 → ${match.productName}`, true);
  };

  const handleBarcodeDetected = (barcode: string) => {
    addCatalogItemByMatch(barcode).catch(() => showFeedback("Error looking up item", false));
  };

  const selectSuggestion = async (item: CatalogItem) => {
    setShowDropdown(false);
    setFilteredSuggestions([]);
    setSearchQuery("");
    setHighlightedIndex(-1);
    const current = catalogCartRef.current[item.shopListingId]?.qty ?? 0;
    await handleCatalogSetQty(item, current + 1).catch(() => showFeedback("Error adding item", false));
    showFeedback(`+1 → ${item.productName}`, true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredSuggestions.length === 0) {
      if (e.key === "Enter" && searchQuery.trim()) {
        setShowDropdown(false);
        setSearchQuery("");
        addCatalogItemByMatch(searchQuery.trim()).catch(() => {});
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex((i) => Math.min(i + 1, filteredSuggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) selectSuggestion(filteredSuggestions[highlightedIndex]);
      else if (searchQuery.trim()) { setShowDropdown(false); setSearchQuery(""); addCatalogItemByMatch(searchQuery.trim()).catch(() => {}); }
    } else if (e.key === "Escape") { setShowDropdown(false); setHighlightedIndex(-1); }
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
    const orderedItems = catalog.filter((ci) => (catalogCart[ci.shopListingId]?.qty ?? 0) > 0);
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
            {orderedItems.length === 0 && <p className="text-sm text-muted-foreground">No items</p>}
            {orderedItems.map((ci) => (
              <div key={ci.shopListingId} className="flex justify-between text-sm">
                <span>{ci.productName}</span>
                <span className="font-semibold">×{catalogCart[ci.shopListingId].qty}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => {
            setStep("name"); setCustomerName(""); setCatalogCart({}); setOrderId(null);
            lastScannedRef.current = "";
          }}>
            Start a New Order
          </Button>
        </div>
      </div>
    );
  }

  // ── Scan / browse step ─────────────────────────────────────────────────────
  const totalUnits = Object.values(catalogCart).reduce((s, e) => s + e.qty, 0);
  const inCartCount = Object.values(catalogCart).filter((e) => e.qty > 0).length;

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
              placeholder="Search or scan barcode…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => { if (filteredSuggestions.length > 0) setShowDropdown(true); }}
              className="pl-9 h-10 text-sm"
              data-testid="input-barcode"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {showDropdown && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border bg-popover shadow-lg overflow-hidden">
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={item.shopListingId}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${idx === highlightedIndex ? "bg-accent" : "hover:bg-muted"}`}
                  >
                    <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      {item.price && <p className="text-xs text-muted-foreground">{item.price}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            variant={cameraOpen ? "secondary" : "outline"}
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={toggleCamera}
          >
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
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : catalog.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm gap-2 px-4 text-center">
            <Package className="h-10 w-10 opacity-20" />
            <p>No products listed. Import a weekly availability sheet in Admin → Shop.</p>
          </div>
        ) : (
          <div className="divide-y">
            {catalog.map((item) => {
              const qty = catalogCart[item.shopListingId]?.qty ?? 0;
              const isEditing = editingListingId === item.shopListingId;
              const isLimited = item.status === "limited";

              return (
                <div
                  key={item.shopListingId}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${qty > 0 ? "bg-green-50/60" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-medium leading-tight">{item.productName}</p>
                      {isLimited && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium leading-none">Limited</span>
                      )}
                    </div>
                    {item.price && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="font-medium text-foreground">{item.price}</span>
                      </p>
                    )}
                  </div>

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
                          onClick={() => handleCatalogDelta(item, -1)}
                          className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className={`w-8 text-center text-sm font-semibold tabular-nums ${qty > 0 ? "text-green-700" : "text-muted-foreground"}`}>
                          {qty}
                        </span>
                        <button
                          onClick={() => handleCatalogDelta(item, 1)}
                          className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => startEdit(item)}
                          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-0.5"
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
