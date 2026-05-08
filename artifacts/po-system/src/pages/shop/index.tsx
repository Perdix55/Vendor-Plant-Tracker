import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddSalesOrderItem, useCreateSalesOrder, useUpdateSalesOrderItem, useDeleteSalesOrderItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, Camera, CameraOff, Leaf, CheckCircle2, ShoppingCart, ScanLine } from "lucide-react";

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
  const [lastCameraScanned, setLastCameraScanned] = useState("");
  const [isLooking, setIsLooking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanControlsRef = useRef<{ stop: () => void } | null>(null);
  const cameraCooldownRef = useRef(false);
  const queryClient = useQueryClient();

  const createSalesOrder = useCreateSalesOrder();
  const addItem = useAddSalesOrderItem();
  const updateItem = useUpdateSalesOrderItem();
  const deleteItem = useDeleteSalesOrderItem();

  // Keep the barcode input focused whenever it's the scan step
  useEffect(() => {
    if (step !== "scan") return;
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [step]);

  const stopCamera = useCallback(() => {
    if (scanControlsRef.current) {
      scanControlsRef.current.stop();
      scanControlsRef.current = null;
    }
    setCameraReady(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;
    setCameraError("");
    setCameraReady(false);
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result && !cameraCooldownRef.current) {
            const text = result.getText();
            if (text !== lastCameraScanned) {
              cameraCooldownRef.current = true;
              setLastCameraScanned(text);
              handleBarcodeFound(text);
              setTimeout(() => { cameraCooldownRef.current = false; }, 2000);
            }
          }
        }
      );
      scanControlsRef.current = controls;
      setCameraReady(true);
    } catch {
      setCameraError("Camera not available or permission denied.");
      setCameraOpen(false);
    }
  }, [lastCameraScanned]);

  const toggleCamera = () => {
    if (cameraOpen) {
      stopCamera();
      setCameraOpen(false);
    } else {
      setCameraOpen(true);
      setTimeout(startCamera, 150);
    }
    // Re-focus the input after toggling
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const showFeedback = (text: string, ok: boolean) => {
    setScanFeedback({ text, ok });
    setTimeout(() => setScanFeedback(null), 2500);
  };

  const handleBarcodeFound = async (barcode: string) => {
    if (!orderId || !barcode.trim()) return;
    setIsLooking(true);
    try {
      const resp = await fetch(`/api/inventory/lookup?q=${encodeURIComponent(barcode.trim())}`);
      const items: Array<{ id: number; productName: string; vendorName: string; packSize: string | null }> = await resp.json();

      if (!items.length) {
        showFeedback(`Not found: "${barcode}"`, false);
        setIsLooking(false);
        return;
      }

      const inv = items[0];
      // Use functional state update to get latest cart
      setCart((prev) => {
        const existing = prev.find((c) => c.inventoryItemId === inv.id);
        if (existing) {
          const newQty = existing.quantity + 1;
          updateItem.mutateAsync({ salesOrderId: orderId!, itemId: existing.id, data: { quantity: newQty } });
          showFeedback(`+1 → ${inv.productName}`, true);
          return prev.map((c) => (c.id === existing.id ? { ...c, quantity: newQty } : c));
        } else {
          addItem.mutateAsync({ salesOrderId: orderId!, data: { inventoryItemId: inv.id, quantity: 1 } }).then((added) => {
            setCart((p) => p.some((c) => c.inventoryItemId === inv.id && c.id !== added.id)
              ? p
              : p.map((c) => c.inventoryItemId === inv.id && c.id === 0 ? { ...c, id: added.id } : c));
          });
          showFeedback(`Added: ${inv.productName}`, true);
          return [
            ...prev,
            { id: 0, inventoryItemId: inv.id, productName: inv.productName, vendorName: inv.vendorName, packSize: inv.packSize, quantity: 1 },
          ];
        }
      });
    } catch {
      showFeedback("Error looking up item", false);
    }
    setIsLooking(false);
  };

  // Simpler version using ref-stable cart for add
  const handleBarcodeSubmit = async () => {
    const barcode = barcodeInput.trim();
    if (!barcode || !orderId) return;
    setBarcodeInput("");
    setIsLooking(true);
    try {
      const resp = await fetch(`/api/inventory/lookup?q=${encodeURIComponent(barcode)}`);
      const items: Array<{ id: number; productName: string; vendorName: string; packSize: string | null }> = await resp.json();

      if (!items.length) {
        showFeedback(`Not found: "${barcode}"`, false);
        setIsLooking(false);
        inputRef.current?.focus();
        return;
      }

      const inv = items[0];
      const existing = cart.find((c) => c.inventoryItemId === inv.id);

      if (existing) {
        const newQty = existing.quantity + 1;
        await updateItem.mutateAsync({ salesOrderId: orderId, itemId: existing.id, data: { quantity: newQty } });
        setCart((prev) => prev.map((c) => (c.id === existing.id ? { ...c, quantity: newQty } : c)));
        showFeedback(`+1 → ${inv.productName}`, true);
      } else {
        const added = await addItem.mutateAsync({ salesOrderId: orderId, data: { inventoryItemId: inv.id, quantity: 1 } });
        setCart((prev) => [
          ...prev,
          { id: added.id, inventoryItemId: inv.id, productName: inv.productName, vendorName: inv.vendorName, packSize: inv.packSize, quantity: 1 },
        ]);
        showFeedback(`Added: ${inv.productName}`, true);
      }
    } catch {
      showFeedback("Error looking up item", false);
    }
    setIsLooking(false);
    inputRef.current?.focus();
  };

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

  // ── Name Step ──────────────────────────────────────────────────────────────
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

  // ── Done Step ──────────────────────────────────────────────────────────────
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
            setStep("name"); setCustomerName(""); setCart([]); setOrderId(null); setLastCameraScanned("");
          }}>
            Start a New Order
          </Button>
        </div>
      </div>
    );
  }

  // ── Scan Step ──────────────────────────────────────────────────────────────
  const totalUnits = cart.reduce((s, c) => s + c.quantity, 0);

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
            {totalUnits}
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

      {/* Barcode input — always visible, always primary */}
      <div className="bg-card border-b px-4 py-4 space-y-3 shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Scan or type a barcode, then press Enter"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBarcodeSubmit()}
              className="pl-9 h-11 text-sm"
              disabled={isLooking}
              data-testid="input-barcode"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <Button
            onClick={handleBarcodeSubmit}
            disabled={!barcodeInput.trim() || isLooking}
            className="h-11 px-4"
            data-testid="button-add-barcode"
          >
            {isLooking ? "..." : "Add"}
          </Button>
          <Button
            variant={cameraOpen ? "secondary" : "outline"}
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={toggleCamera}
            title={cameraOpen ? "Close camera" : "Open camera scanner"}
          >
            {cameraOpen ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
          </Button>
        </div>

        {/* Scan feedback */}
        {scanFeedback && (
          <div className={`text-sm px-3 py-1.5 rounded-md font-medium ${scanFeedback.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {scanFeedback.text}
          </div>
        )}

        {/* Camera error */}
        {cameraError && (
          <p className="text-sm text-destructive">{cameraError}</p>
        )}

        {/* Camera viewfinder */}
        {cameraOpen && (
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "220px" }}>
            <video ref={videoRef} className="w-full h-full object-cover" />
            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                Starting camera…
              </div>
            )}
            {cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white rounded-lg w-52 h-20 opacity-60" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-3">
            <ShoppingCart className="h-10 w-10 opacity-25" />
            <p>Scan a barcode above to add items</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">{item.vendorName}{item.packSize ? ` · ${item.packSize}` : ""}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleQtyChange(item, -1)}
                  className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleQtyChange(item, 1)}
                  className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleRemove(item)}
                  className="ml-1 h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
