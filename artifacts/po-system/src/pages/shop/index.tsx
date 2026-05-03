import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddSalesOrderItem, useCreateSalesOrder, useUpdateSalesOrderItem, useDeleteSalesOrderItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ScanLine, Leaf, CheckCircle2, ShoppingCart, Keyboard } from "lucide-react";

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
  const [scanError, setScanError] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  const [useManual, setUseManual] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [lastScanned, setLastScanned] = useState("");
  const [scanFeedback, setScanFeedback] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const scanControlsRef = useRef<{ stop: () => void } | null>(null);
  const scanCooldownRef = useRef(false);
  const queryClient = useQueryClient();

  const createSalesOrder = useCreateSalesOrder();
  const addItem = useAddSalesOrderItem();
  const updateItem = useUpdateSalesOrderItem();
  const deleteItem = useDeleteSalesOrderItem();

  const stopScanner = useCallback(() => {
    if (scanControlsRef.current) {
      scanControlsRef.current.stop();
      scanControlsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopScanner();
  }, [stopScanner]);

  const startScanner = useCallback(async () => {
    if (!videoRef.current || useManual) return;
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      setScannerReady(false);
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, _err) => {
          if (result && !scanCooldownRef.current) {
            const text = result.getText();
            if (text !== lastScanned) {
              scanCooldownRef.current = true;
              handleBarcodeFound(text);
              setLastScanned(text);
              setTimeout(() => {
                scanCooldownRef.current = false;
              }, 2000);
            }
          }
        }
      );
      scanControlsRef.current = controls;
      setScannerReady(true);
    } catch (err) {
      setScanError("Camera not available. Use manual entry below.");
      setUseManual(true);
    }
  }, [useManual, lastScanned]);

  useEffect(() => {
    if (step === "scan" && !useManual) {
      startScanner();
    }
    return () => {
      if (step !== "scan") stopScanner();
    };
  }, [step, useManual]);

  const handleBarcodeFound = async (barcode: string) => {
    if (!orderId) return;
    setScanFeedback("Looking up...");
    try {
      const resp = await fetch(`/api/inventory/lookup?q=${encodeURIComponent(barcode)}`);
      const items: Array<{ id: number; productName: string; vendorName: string; packSize: string | null; quantityOnHand: number }> = await resp.json();

      if (!items.length) {
        setScanFeedback(`Not found: "${barcode}"`);
        return;
      }

      const inv = items[0];
      const existing = cart.find((c) => c.inventoryItemId === inv.id);

      if (existing) {
        const newQty = existing.quantity + 1;
        await updateItem.mutateAsync({
          salesOrderId: orderId,
          itemId: existing.id,
          data: { quantity: newQty },
        });
        setCart((prev) =>
          prev.map((c) => (c.id === existing.id ? { ...c, quantity: newQty } : c))
        );
        setScanFeedback(`+1 ${inv.productName}`);
      } else {
        const added = await addItem.mutateAsync({
          salesOrderId: orderId,
          data: { inventoryItemId: inv.id, quantity: 1 },
        });
        setCart((prev) => [
          ...prev,
          {
            id: added.id,
            inventoryItemId: inv.id,
            productName: inv.productName,
            vendorName: inv.vendorName,
            packSize: inv.packSize,
            quantity: 1,
          },
        ]);
        setScanFeedback(`Added ${inv.productName}`);
      }
    } catch {
      setScanFeedback("Error looking up item");
    }
    setTimeout(() => setScanFeedback(""), 2500);
  };

  const handleManualAdd = async () => {
    if (!manualBarcode.trim()) return;
    await handleBarcodeFound(manualBarcode.trim());
    setManualBarcode("");
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
  };

  const handleRemove = async (item: CartItem) => {
    if (!orderId) return;
    await deleteItem.mutateAsync({ salesOrderId: orderId, itemId: item.id });
    setCart((prev) => prev.filter((c) => c.id !== item.id));
  };

  const handleStart = async () => {
    if (!customerName.trim()) return;
    const order = await createSalesOrder.mutateAsync({ data: { customerName: customerName.trim() } });
    setOrderId(order.id);
    setStep("scan");
  };

  const handleFinish = async () => {
    stopScanner();
    setStep("done");
    queryClient.invalidateQueries({ queryKey: ["listSalesOrders"] });
  };

  if (step === "name") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Vickery Wholesale</h1>
            <p className="text-muted-foreground text-sm">Enter your name to start an order</p>
          </div>

          <div className="space-y-4">
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

  if (step === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Order Submitted!</h1>
            <p className="text-muted-foreground">
              Thank you, <span className="font-medium text-foreground">{customerName}</span>. Your order #{orderId} has been received.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 text-left space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Order Summary</p>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.productName}{item.packSize ? ` (${item.packSize})` : ""}</span>
                <span className="font-medium">×{item.quantity}</span>
              </div>
            ))}
            {cart.length === 0 && <p className="text-sm text-muted-foreground">No items</p>}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setStep("name");
              setCustomerName("");
              setCart([]);
              setOrderId(null);
              setLastScanned("");
            }}
          >
            Start a New Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">{customerName}</p>
          <p className="text-xs text-muted-foreground">Order #{orderId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <ShoppingCart className="h-3 w-3" />
            {cart.reduce((s, c) => s + c.quantity, 0)} items
          </Badge>
          <Button size="sm" onClick={handleFinish} className="bg-green-700 hover:bg-green-800 text-white" data-testid="button-finish-order">
            Finish
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {!useManual ? (
          <div className="relative bg-black" style={{ height: "40vh" }}>
            <video ref={videoRef} className="w-full h-full object-cover" />
            {!scannerReady && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                Starting camera...
              </div>
            )}
            {scannerReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white rounded-lg w-48 h-24 opacity-60" />
              </div>
            )}
            {scanFeedback && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div className="bg-black/80 text-white text-sm px-4 py-1.5 rounded-full">{scanFeedback}</div>
              </div>
            )}
            <button
              onClick={() => { stopScanner(); setUseManual(true); }}
              className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
            >
              <Keyboard className="h-3 w-3" /> Manual
            </button>
            {scanError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-sm text-center px-4">{scanError}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border-b px-4 py-3 space-y-2">
            <p className="text-sm font-medium flex items-center gap-1.5">
              <ScanLine className="h-4 w-4 text-muted-foreground" />
              Manual Barcode Entry
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Type or scan barcode..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
                autoFocus
                data-testid="input-manual-barcode"
              />
              <Button onClick={handleManualAdd} disabled={!manualBarcode.trim()}>Add</Button>
            </div>
            {scanFeedback && (
              <p className="text-sm text-muted-foreground">{scanFeedback}</p>
            )}
            <button onClick={() => { setUseManual(false); setTimeout(startScanner, 100); }} className="text-xs text-primary underline">
              Use Camera Instead
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2">
              <ShoppingCart className="h-8 w-8 opacity-40" />
              <p>Scan items to add them here</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">{item.vendorName}{item.packSize ? ` • ${item.packSize}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQtyChange(item, -1)}
                    className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item, 1)}
                    className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="ml-1 h-7 w-7 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
