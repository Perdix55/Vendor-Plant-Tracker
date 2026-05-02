import { useState } from "react";
import {
  useListVendors,
  useUpdateVendor,
  getListVendorsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Pencil, X, Mail, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminVendors() {
  const { data: vendors, isLoading } = useListVendors();
  const updateVendor = useUpdateVendor();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");

  const startEdit = (id: number, currentEmail: string | null | undefined) => {
    setEditingId(id);
    setEditEmail(currentEmail ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditEmail("");
  };

  const saveEmail = (vendorId: number) => {
    updateVendor.mutate(
      { vendorId, data: { email: editEmail.trim() || null } },
      {
        onSuccess: () => {
          toast({ title: "Email saved", description: "Vendor email address updated." });
          queryClient.invalidateQueries({ queryKey: getListVendorsQueryKey() });
          setEditingId(null);
          setEditEmail("");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to save email.", variant: "destructive" });
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, vendorId: number) => {
    if (e.key === "Enter") saveEmail(vendorId);
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin</h1>
        <p className="text-muted-foreground mt-1">Manage vendor email addresses for PO notifications.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Vendor Email Addresses</CardTitle>
          </div>
          <CardDescription>
            When you send a PO, the vendor receives an email with a unique link to confirm their products.
            No account or login is needed on the vendor's end.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[220px]">Vendor</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="w-[90px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {(vendors ?? []).map((vendor) => (
                  <TableRow key={vendor.id} data-testid={`row-vendor-${vendor.id}`}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      {editingId === vendor.id ? (
                        <Input
                          type="email"
                          value={editEmail}
                          autoFocus
                          onChange={(e) => setEditEmail(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, vendor.id)}
                          placeholder="vendor@example.com"
                          className="h-8 max-w-xs"
                          data-testid={`input-email-${vendor.id}`}
                        />
                      ) : (
                        <span className={vendor.email ? "text-foreground" : "text-muted-foreground italic"}>
                          {vendor.email ?? "No email on file"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vendor.email ? (
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 text-xs gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Ready
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">
                          Not set
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === vendor.id ? (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-green-700 hover:text-green-800 hover:bg-green-50"
                            onClick={() => saveEmail(vendor.id)}
                            disabled={updateVendor.isPending}
                            data-testid={`button-save-email-${vendor.id}`}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={cancelEdit}
                            data-testid={`button-cancel-email-${vendor.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => startEdit(vendor.id, vendor.email)}
                          data-testid={`button-edit-email-${vendor.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">How vendor confirmation works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. Create a purchase order and set it to <strong className="text-foreground">Sent</strong>.</p>
          <p>2. Click <strong className="text-foreground">Send Email</strong> on the order — the vendor gets a branded email with a unique link.</p>
          <p>3. The vendor opens the link (no login needed) and marks each item as available, unavailable, or partial.</p>
          <p>4. The order status updates to <strong className="text-foreground">Confirmed</strong> or <strong className="text-foreground">Partial</strong> automatically.</p>
        </CardContent>
      </Card>
    </div>
  );
}
