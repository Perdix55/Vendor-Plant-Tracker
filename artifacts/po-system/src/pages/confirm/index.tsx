import { useState } from "react";
import { useRoute } from "wouter";
import {
  useGetOrderByToken,
  useConfirmOrderByToken,
  getGetOrderByTokenQueryKey,
  ConfirmOrderBodyItemsItemAvailability,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Check, AlertCircle, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";

type ItemState = {
  availability: ConfirmOrderBodyItemsItemAvailability;
  quantityConfirmed: number;
  notes: string;
  substitutionName: string;
  substitutionNotes: string;
};

export default function VendorConfirm() {
  const [, params] = useRoute("/confirm/:token");
  const token = params?.token ?? "";
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError } = useGetOrderByToken(token, {
    query: { enabled: !!token, queryKey: getGetOrderByTokenQueryKey(token) },
  });

  const confirmMutation = useConfirmOrderByToken();

  const [confirmData, setConfirmData] = useState<Record<number, ItemState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  if (order && !initialized) {
    const initial: typeof confirmData = {};
    order.items.forEach((item) => {
      initial[item.id] = {
        availability: (item.availability as ConfirmOrderBodyItemsItemAvailability) ?? "available",
        quantityConfirmed: item.quantityConfirmed ?? item.quantityOrdered,
        notes: item.notes ?? "",
        substitutionName: (item as any).substitutionName ?? "",
        substitutionNotes: (item as any).substitutionNotes ?? "",
      };
    });
    setConfirmData(initial);
    setInitialized(true);
  }

  const handleChange = (itemId: number, field: keyof ItemState, value: string | number) => {
    setConfirmData((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  const handleAvailabilityChange = (itemId: number, val: string, orderedQty: number) => {
    const avail = val as ConfirmOrderBodyItemsItemAvailability;
    setConfirmData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        availability: avail,
        quantityConfirmed:
          avail === "available" ? orderedQty :
          avail === "unavailable" || avail === "substitution" ? 0 :
          prev[itemId].quantityConfirmed,
      },
    }));
  };

  const handleSubmit = () => {
    const items = Object.entries(confirmData).map(([idStr, d]) => ({
      itemId: parseInt(idStr),
      availability: d.availability,
      quantityConfirmed: d.availability === "unavailable" || d.availability === "substitution" ? 0 : d.quantityConfirmed,
      notes: d.notes || undefined,
      substitutionName: d.availability === "substitution" ? (d.substitutionName || undefined) : undefined,
      substitutionNotes: d.availability === "substitution" ? (d.substitutionNotes || undefined) : undefined,
    }));

    confirmMutation.mutate(
      { token, data: { items } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetOrderByTokenQueryKey(token) });
          setSubmitted(true);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-3xl space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8 space-y-3">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Link Not Found</h2>
            <p className="text-muted-foreground text-sm">
              This confirmation link is invalid or has expired. Please contact your buyer for a new link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted || order.status === "confirmed" || order.status === "partial" || order.status === "substitution") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8 space-y-3">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-700" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Confirmation Received</h2>
            <p className="text-muted-foreground text-sm">
              Thank you, {order.vendorName}. Your availability responses for PO #{order.id} (week of{" "}
              {order.weekDate}) have been recorded.
            </p>
            {order.status === "substitution" && (
              <p className="text-purple-700 text-xs bg-purple-50 border border-purple-200 rounded-md p-2">
                Your substitution proposals are pending buyer approval.
              </p>
            )}
            <p className="text-muted-foreground text-xs pt-2">You may close this window.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1 pb-2">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary mb-3">
            <span className="text-primary-foreground font-bold text-lg">V</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Vickery Wholesale Greenhouse</h1>
          <p className="text-muted-foreground text-sm">Purchase Order Confirmation Request</p>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              PO #{order.id} — {order.vendorName}
            </CardTitle>
            <CardDescription>
              Week of {order.weekDate}
              {order.shipDate && ` · Ship: ${order.shipDate}`}
              {order.arriveDate && ` · Arrive: ${order.arriveDate}`}
            </CardDescription>
          </CardHeader>
          {order.notes && (
            <CardContent className="pt-0">
              <p className="text-sm bg-muted/40 border rounded-md p-3 text-muted-foreground">
                <strong className="text-foreground">Buyer note:</strong> {order.notes}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Review Your Items</CardTitle>
            <CardDescription>
              For each item, indicate availability. If you can offer a substitution for an out-of-stock item, select "Substitution" and specify what you can provide.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Product</TableHead>
                  <TableHead>Pack Size</TableHead>
                  <TableHead className="text-right">Ordered</TableHead>
                  <TableHead className="text-right">Confirm Qty</TableHead>
                  <TableHead>Your Availability</TableHead>
                  <TableHead>Notes / Substitution Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => {
                  const row = confirmData[item.id];
                  if (!row) return null;
                  const isUnavailable = row.availability === "unavailable";
                  const isSubstitution = row.availability === "substitution";

                  return (
                    <TableRow
                      key={item.id}
                      className={
                        isUnavailable ? "opacity-60 bg-muted/20" :
                        isSubstitution ? "bg-purple-50/50" : ""
                      }
                      data-testid={`row-item-${item.id}`}
                    >
                      <TableCell className="pl-6 font-medium">{item.productName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.packSize ?? "—"}</TableCell>
                      <TableCell className="text-right font-medium">{item.quantityOrdered}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          max={item.quantityOrdered}
                          disabled={isUnavailable || isSubstitution}
                          value={isUnavailable || isSubstitution ? 0 : row.quantityConfirmed}
                          onChange={(e) =>
                            handleChange(item.id, "quantityConfirmed", parseInt(e.target.value) || 0)
                          }
                          className="w-20 ml-auto text-right h-8"
                          data-testid={`input-qty-${item.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={row.availability}
                          onValueChange={(val) => handleAvailabilityChange(item.id, val, item.quantityOrdered)}
                        >
                          <SelectTrigger
                            className={`h-8 w-36 text-xs ${
                              row.availability === "available"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : row.availability === "unavailable"
                                ? "border-red-200 text-red-700 bg-red-50"
                                : row.availability === "partial"
                                ? "border-amber-200 text-amber-700 bg-amber-50"
                                : row.availability === "substitution"
                                ? "border-purple-200 text-purple-700 bg-purple-50"
                                : ""
                            }`}
                            data-testid={`select-avail-${item.id}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                            <SelectItem value="substitution">
                              <span className="flex items-center gap-1">
                                <ArrowLeftRight className="h-3 w-3" /> Substitution
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {isSubstitution ? (
                          <div className="space-y-1 min-w-[220px]">
                            <Input
                              placeholder="Substitute item name *"
                              value={row.substitutionName}
                              onChange={(e) => handleChange(item.id, "substitutionName", e.target.value)}
                              className="h-8 text-xs border-purple-200 focus-visible:ring-purple-300"
                              data-testid={`input-sub-name-${item.id}`}
                            />
                            <Input
                              placeholder="Additional notes (optional)"
                              value={row.substitutionNotes}
                              onChange={(e) => handleChange(item.id, "substitutionNotes", e.target.value)}
                              className="h-8 text-xs"
                              data-testid={`input-sub-notes-${item.id}`}
                            />
                          </div>
                        ) : (
                          <Input
                            placeholder="Optional note..."
                            value={row.notes}
                            onChange={(e) => handleChange(item.id, "notes", e.target.value)}
                            className="h-8 w-36 text-xs"
                            data-testid={`input-notes-${item.id}`}
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

        {/* Substitution notice */}
        {Object.values(confirmData).some(r => r.availability === "substitution") && (
          <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
            <ArrowLeftRight className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              Items marked as <strong>Substitution</strong> will be sent to the buyer for approval before the order is finalized.
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pb-6">
          <Button
            size="lg"
            className="gap-2"
            onClick={handleSubmit}
            disabled={confirmMutation.isPending}
            data-testid="button-submit-confirmation"
          >
            <Check className="h-4 w-4" />
            {confirmMutation.isPending ? "Submitting..." : "Submit Confirmations"}
          </Button>
        </div>
      </div>
    </div>
  );
}
