import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { Printer } from "lucide-react";

type OrderItem = {
  id: number;
  productName: string;
  vendorName: string | null;
  packSize: string | null;
  price: string | null;
  quantity: number;
  _source: "legacy" | "shop";
};

type Order = {
  id: number;
  customerName: string;
  status: string;
  neededBy: string | null;
  notes: string | null;
  shippingAddress: string | null;
  billingAddress: string | null;
  createdAt: string;
  items: OrderItem[];
};

export default function SalesOrderPrint() {
  const [, params] = useRoute("/sales-orders/:id/print");
  const salesOrderId = params?.id ? parseInt(params.id) : 0;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!salesOrderId) return;
    fetch(`/api/sales-orders/${salesOrderId}`)
      .then((r) => r.json())
      .then((data) => setOrder(data))
      .catch(() => setError(true));
  }, [salesOrderId]);

  useEffect(() => {
    if (!order) return;
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, [order]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        Order not found.
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-7 w-7 rounded-full border-2 border-green-700 border-t-transparent animate-spin" />
      </div>
    );
  }

  const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);
  const hasPrice = order.items.some((i) => i.price !== null);

  const subtotal = hasPrice
    ? order.items.reduce((s, i) => s + (parseFloat(i.price ?? "0") * i.quantity), 0)
    : null;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { margin: 0.75in; size: letter; }
        }
        @media screen {
          body { background: #f1f5f9; }
        }
      `}</style>

      <div className="no-print fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </button>
      </div>

      <div className="min-h-screen flex justify-center py-10 px-4 screen:bg-slate-100">
        <div
          className="bg-white w-full max-w-2xl shadow-md rounded-md overflow-hidden"
          style={{ fontFamily: "Georgia, serif" }}
        >
          <div className="px-10 pt-10 pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-green-800" style={{ fontFamily: "Arial, sans-serif" }}>
                  Vickery Greenhouse
                </h1>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  4911 E Grand Ave<br />
                  Dallas, TX 75223<br />
                  214-824-4440 / 800-408-0323<br />
                  sales@vickerygreenhouse.com
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1" style={{ fontFamily: "Arial, sans-serif" }}>Sales Order</p>
                <p className="text-3xl font-bold text-gray-800" style={{ fontFamily: "Arial, sans-serif" }}>#{order.id}</p>
                <p className="text-sm text-gray-500 mt-1">{format(new Date(order.createdAt), "MMMM d, yyyy")}</p>
              </div>
            </div>
          </div>

          <div className="px-10 py-5 border-b border-gray-200 grid grid-cols-2 gap-6" style={{ fontFamily: "Arial, sans-serif" }}>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Customer</p>
              <p className="font-semibold text-gray-800">{order.customerName}</p>
            </div>
            {order.neededBy && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Needed By</p>
                <p className="font-semibold text-gray-800">
                  {format(new Date(order.neededBy + "T00:00:00"), "MMMM d, yyyy")}
                </p>
              </div>
            )}
            {(order.shippingAddress || order.billingAddress) && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Ship To</p>
                <p className="font-semibold text-gray-800 whitespace-pre-line">
                  {order.shippingAddress || order.billingAddress}
                </p>
              </div>
            )}
            {order.notes && (
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="px-10 py-6">
            <table className="w-full text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-xs uppercase tracking-widest text-gray-400 font-normal w-8">#</th>
                  <th className="text-left py-2 text-xs uppercase tracking-widest text-gray-400 font-normal">Product</th>
                  <th className="text-center py-2 text-xs uppercase tracking-widest text-gray-400 font-normal w-16">Qty</th>
                  {hasPrice && (
                    <>
                      <th className="text-right py-2 text-xs uppercase tracking-widest text-gray-400 font-normal w-20">Unit Price</th>
                      <th className="text-right py-2 text-xs uppercase tracking-widest text-gray-400 font-normal w-20">Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="py-2.5">
                      <p className="font-medium text-gray-800">{item.productName}</p>
                      {(item.vendorName || item.packSize) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[item.vendorName, item.packSize].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 text-center font-semibold text-gray-700">{item.quantity}</td>
                    {hasPrice && (
                      <>
                        <td className="py-2.5 text-right text-gray-600">
                          {item.price ? `$${parseFloat(item.price).toFixed(2)}` : "—"}
                        </td>
                        <td className="py-2.5 text-right font-medium text-gray-800">
                          {item.price ? `$${(parseFloat(item.price) * item.quantity).toFixed(2)}` : "—"}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={hasPrice ? 2 : 2} />
                  <td className="pt-4 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Units</p>
                    <p className="font-bold text-gray-800 text-base">{totalUnits}</p>
                  </td>
                  {hasPrice && subtotal !== null && (
                    <>
                      <td className="pt-4 text-right text-xs text-gray-400 uppercase tracking-widest pr-1">Subtotal</td>
                      <td className="pt-4 text-right font-bold text-gray-800 text-base">
                        ${subtotal.toFixed(2)}
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="px-10 pb-10 mt-2 text-center">
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-6">
              Thank you for your order — Vickery Wholesale Greenhouse · Dallas, TX
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
