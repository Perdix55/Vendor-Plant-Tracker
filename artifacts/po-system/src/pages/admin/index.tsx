import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  useListVendors,
  useUpdateVendor,
  useCreateVendor,
  useImportVendor,
  useListVendorProducts,
  useCreateProduct,
  useUpdateProduct,
  useGetSettings,
  useUpdateSettings,
  getListVendorsQueryKey,
  getListVendorProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Pencil, X, Mail, ShieldCheck, Plus, Package, Sparkles, ToggleLeft, ToggleRight, Store, FileSpreadsheet, Upload, AlertCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ParsedProduct = { name: string; packSize: string };

function pickCol(headers: string[], candidates: string[]): number {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const c of candidates) {
    const i = lower.indexOf(c);
    if (i !== -1) return i;
  }
  return -1;
}

function parseSpreadsheet(file: File): Promise<ParsedProduct[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        if (rows.length < 2) return resolve([]);
        const headers = rows[0].map(String);
        const nameIdx = pickCol(headers, ["product name", "name", "product", "item", "item name"]);
        const sizeIdx = pickCol(headers, ["pack size", "packsize", "size", "pack", "unit"]);
        const products: ParsedProduct[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const name = nameIdx >= 0 ? String(row[nameIdx] ?? "").trim() : String(row[0] ?? "").trim();
          const packSize = sizeIdx >= 0 ? String(row[sizeIdx] ?? "").trim() : "";
          if (name) products.push({ name, packSize });
        }
        resolve(products);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function ImportVendorDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorShippingDays, setVendorShippingDays] = useState("");
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const importVendor = useImportVendor();
  const { toast } = useToast();

  const reset = () => {
    setVendorName(""); setVendorEmail(""); setVendorShippingDays("");
    setProducts([]); setFileName(""); setParseError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    setOpen(v);
  };

  const handleFile = async (file: File) => {
    setParseError("");
    setFileName(file.name);
    try {
      const parsed = await parseSpreadsheet(file);
      setProducts(parsed);
      if (parsed.length === 0) setParseError("No product rows found. Make sure the file has a header row and at least one product.");
    } catch {
      setParseError("Could not read the file. Make sure it's a valid .xlsx, .xls, or .csv file.");
      setProducts([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    if (!vendorName.trim() || products.length === 0) return;
    const shippingDays = vendorShippingDays.trim() ? parseInt(vendorShippingDays, 10) : null;
    importVendor.mutate(
      {
        data: {
          name: vendorName.trim(),
          email: vendorEmail.trim() || null,
          shippingDays: shippingDays ?? undefined,
          products: products.map((p) => ({ name: p.name, packSize: p.packSize || null })),
        },
      },
      {
        onSuccess: (result) => {
          toast({
            title: "Import successful",
            description: `${result.vendor.name} added with ${result.productsCreated} product${result.productsCreated === 1 ? "" : "s"}.`,
          });
          setOpen(false);
          reset();
          onSuccess();
        },
        onError: () => toast({ title: "Import failed", description: "Could not import vendor.", variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5" data-testid="button-import-vendor">
          <FileSpreadsheet className="h-4 w-4" />
          Import Spreadsheet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Vendor from Spreadsheet</DialogTitle>
          <DialogDescription>
            Upload a .xlsx, .xls, or .csv file. The file should have a <strong>Product Name</strong> column and an optional <strong>Pack Size</strong> column.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30 ${fileName ? "border-green-300 bg-green-50/50 dark:bg-green-900/10" : "border-muted-foreground/25"}`}
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            data-testid="dropzone-spreadsheet"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              data-testid="input-file-spreadsheet"
            />
            {fileName ? (
              <div className="flex flex-col items-center gap-1">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <p className="font-medium text-sm text-green-700 dark:text-green-400">{fileName}</p>
                <p className="text-xs text-muted-foreground">{products.length} product{products.length === 1 ? "" : "s"} found — click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">Drop your spreadsheet here or click to browse</p>
                <p className="text-xs text-muted-foreground">.xlsx, .xls, or .csv</p>
              </div>
            )}
          </div>

          {parseError && (
            <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 rounded-md p-3">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {parseError}
            </div>
          )}

          {products.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Preview ({products.length} products)</Label>
              <ScrollArea className="h-44 rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0">
                    <TableRow>
                      <TableHead className="text-xs">Product Name</TableHead>
                      <TableHead className="text-xs">Pack Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p, i) => (
                      <TableRow key={i} className="text-sm">
                        <TableCell className="py-1.5">{p.name}</TableCell>
                        <TableCell className="py-1.5 text-muted-foreground">{p.packSize || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 space-y-1.5">
              <Label htmlFor="import-vendor-name">Vendor Name <span className="text-destructive">*</span></Label>
              <Input
                id="import-vendor-name"
                placeholder="e.g. Acme Growers"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                data-testid="input-import-vendor-name"
              />
            </div>
            <div className="sm:col-span-1 space-y-1.5">
              <Label htmlFor="import-vendor-email">Email <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                id="import-vendor-email"
                type="email"
                placeholder="vendor@example.com"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                data-testid="input-import-vendor-email"
              />
            </div>
            <div className="sm:col-span-1 space-y-1.5">
              <Label htmlFor="import-shipping-days">Shipping Days <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                id="import-shipping-days"
                type="number"
                min="0"
                placeholder="e.g. 3"
                value={vendorShippingDays}
                onChange={(e) => setVendorShippingDays(e.target.value)}
                data-testid="input-import-shipping-days"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={!vendorName.trim() || products.length === 0 || importVendor.isPending}
            data-testid="button-confirm-import-vendor"
          >
            {importVendor.isPending ? "Importing..." : `Import ${products.length > 0 ? `${products.length} Products` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VendorEmailTab() {
  const { data: vendors, isLoading } = useListVendors();
  const updateVendor = useUpdateVendor();
  const createVendor = useCreateVendor();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");

  const [editingShippingId, setEditingShippingId] = useState<number | null>(null);
  const [editShippingDays, setEditShippingDays] = useState<string>("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorEmail, setNewVendorEmail] = useState("");

  const startEdit = (id: number, currentEmail: string | null | undefined) => {
    setEditingId(id);
    setEditEmail(currentEmail ?? "");
  };
  const cancelEdit = () => { setEditingId(null); setEditEmail(""); };

  const saveEmail = (vendorId: number) => {
    updateVendor.mutate(
      { vendorId, data: { email: editEmail.trim() || null } },
      {
        onSuccess: () => {
          toast({ title: "Email saved" });
          queryClient.invalidateQueries({ queryKey: getListVendorsQueryKey() });
          setEditingId(null);
          setEditEmail("");
        },
        onError: () => toast({ title: "Error", description: "Failed to save email.", variant: "destructive" }),
      }
    );
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent, vendorId: number) => {
    if (e.key === "Enter") saveEmail(vendorId);
    if (e.key === "Escape") cancelEdit();
  };

  const startEditShipping = (id: number, current: number | null | undefined) => {
    setEditingShippingId(id);
    setEditShippingDays(current != null ? String(current) : "");
  };
  const cancelEditShipping = () => { setEditingShippingId(null); setEditShippingDays(""); };

  const saveShippingDays = (vendorId: number) => {
    const parsed = editShippingDays.trim() === "" ? null : parseInt(editShippingDays, 10);
    if (parsed !== null && (isNaN(parsed) || parsed < 0)) return;
    updateVendor.mutate(
      { vendorId, data: { shippingDays: parsed } },
      {
        onSuccess: () => {
          toast({ title: "Shipping days saved" });
          queryClient.invalidateQueries({ queryKey: getListVendorsQueryKey() });
          setEditingShippingId(null);
          setEditShippingDays("");
        },
        onError: () => toast({ title: "Error", description: "Failed to save shipping days.", variant: "destructive" }),
      }
    );
  };

  const handleShippingKeyDown = (e: React.KeyboardEvent, vendorId: number) => {
    if (e.key === "Enter") saveShippingDays(vendorId);
    if (e.key === "Escape") cancelEditShipping();
  };

  const handleAddVendor = () => {
    if (!newVendorName.trim()) return;
    createVendor.mutate(
      { data: { name: newVendorName.trim(), email: newVendorEmail.trim() || null } },
      {
        onSuccess: () => {
          toast({ title: "Vendor added", description: `${newVendorName.trim()} has been added.` });
          queryClient.invalidateQueries({ queryKey: getListVendorsQueryKey() });
          setAddDialogOpen(false);
          setNewVendorName("");
          setNewVendorEmail("");
        },
        onError: () => toast({ title: "Error", description: "Failed to add vendor.", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Vendor Email Addresses</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <ImportVendorDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: getListVendorsQueryKey() })} />
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5" data-testid="button-add-vendor">
                    <Plus className="h-4 w-4" />
                    Add Vendor
                  </Button>
                </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>Enter the vendor's name and optionally their email address.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="new-vendor-name">Vendor Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="new-vendor-name"
                      placeholder="e.g. Acme Growers"
                      value={newVendorName}
                      onChange={(e) => setNewVendorName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddVendor()}
                      data-testid="input-new-vendor-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-vendor-email">Email Address <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input
                      id="new-vendor-email"
                      type="email"
                      placeholder="vendor@example.com"
                      value={newVendorEmail}
                      onChange={(e) => setNewVendorEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddVendor()}
                      data-testid="input-new-vendor-email"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                  <Button
                    onClick={handleAddVendor}
                    disabled={!newVendorName.trim() || createVendor.isPending}
                    data-testid="button-confirm-add-vendor"
                  >
                    {createVendor.isPending ? "Adding..." : "Add Vendor"}
                  </Button>
                </DialogFooter>
              </DialogContent>
              </Dialog>
            </div>
          </div>
          <CardDescription>
            Each vendor can receive a unique confirmation link via email when you send a PO.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[200px]">Vendor</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[160px]">Shipping Days</TableHead>
                  <TableHead className="w-[80px]" />
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
                          onKeyDown={(e) => handleEmailKeyDown(e, vendor.id)}
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
                          <ShieldCheck className="h-3 w-3" />Ready
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">Not set</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingShippingId === vendor.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="0"
                            autoFocus
                            value={editShippingDays}
                            onChange={(e) => setEditShippingDays(e.target.value)}
                            onKeyDown={(e) => handleShippingKeyDown(e, vendor.id)}
                            placeholder="days"
                            className="h-8 w-20 text-right"
                            data-testid={`input-shipping-days-${vendor.id}`}
                          />
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-green-700 hover:text-green-800 hover:bg-green-50" onClick={() => saveShippingDays(vendor.id)} disabled={updateVendor.isPending} data-testid={`button-save-shipping-${vendor.id}`}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={cancelEditShipping} data-testid={`button-cancel-shipping-${vendor.id}`}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditShipping(vendor.id, vendor.shippingDays)}
                          className="flex items-center gap-1.5 text-sm group w-full"
                          data-testid={`button-edit-shipping-${vendor.id}`}
                        >
                          <span className={vendor.shippingDays != null ? "font-medium" : "text-muted-foreground italic"}>
                            {vendor.shippingDays != null ? `${vendor.shippingDays} day${vendor.shippingDays === 1 ? "" : "s"}` : "Not set"}
                          </span>
                          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === vendor.id ? (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-green-700 hover:text-green-800 hover:bg-green-50" onClick={() => saveEmail(vendor.id)} disabled={updateVendor.isPending} data-testid={`button-save-email-${vendor.id}`}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={cancelEdit} data-testid={`button-cancel-email-${vendor.id}`}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => startEdit(vendor.id, vendor.email)} data-testid={`button-edit-email-${vendor.id}`}>
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
    </div>
  );
}

function VendorProductsTab() {
  const { data: vendors, isLoading: isLoadingVendors } = useListVendors();
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading: isLoadingProducts } = useListVendorProducts(
    selectedVendorId ?? 0,
    { query: { enabled: !!selectedVendorId, queryKey: getListVendorProductsQueryKey(selectedVendorId ?? 0) } }
  );

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPackSize, setNewPackSize] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPackSize, setEditPackSize] = useState("");

  const handleAddProduct = () => {
    if (!newName.trim() || !selectedVendorId) return;
    createProduct.mutate(
      { vendorId: selectedVendorId, data: { name: newName.trim(), packSize: newPackSize.trim() || null } },
      {
        onSuccess: () => {
          toast({ title: "Product added", description: `${newName.trim()} added successfully.` });
          queryClient.invalidateQueries({ queryKey: getListVendorProductsQueryKey(selectedVendorId) });
          queryClient.invalidateQueries({ queryKey: getListVendorsQueryKey() });
          setAddOpen(false);
          setNewName("");
          setNewPackSize("");
        },
        onError: () => toast({ title: "Error", description: "Failed to add product.", variant: "destructive" }),
      }
    );
  };

  const handleToggleActive = (productId: number, current: boolean) => {
    if (!selectedVendorId) return;
    updateProduct.mutate(
      { vendorId: selectedVendorId, productId, data: { isActive: !current } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListVendorProductsQueryKey(selectedVendorId) });
        },
        onError: () => toast({ title: "Error", description: "Failed to update product.", variant: "destructive" }),
      }
    );
  };

  const startEditProduct = (id: number, name: string, packSize: string | null | undefined) => {
    setEditingId(id);
    setEditName(name);
    setEditPackSize(packSize ?? "");
  };

  const saveEditProduct = (productId: number) => {
    if (!selectedVendorId || !editName.trim()) return;
    updateProduct.mutate(
      { vendorId: selectedVendorId, productId, data: { name: editName.trim(), packSize: editPackSize.trim() || null } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListVendorProductsQueryKey(selectedVendorId) });
          setEditingId(null);
        },
        onError: () => toast({ title: "Error", description: "Failed to update product.", variant: "destructive" }),
      }
    );
  };

  const activeCount = (products ?? []).filter(p => p.isActive).length;
  const newCount = (products ?? []).filter(p => p.isNew).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Product Catalog</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedVendorId?.toString() ?? ""}
                onValueChange={(v) => { setSelectedVendorId(parseInt(v)); setEditingId(null); }}
              >
                <SelectTrigger className="w-56" data-testid="select-vendor-products">
                  <SelectValue placeholder="Select a vendor..." />
                </SelectTrigger>
                <SelectContent>
                  {(vendors ?? []).map(v => (
                    <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedVendorId && (
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5" data-testid="button-add-product">
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Add a product to {vendors?.find(v => v.id === selectedVendorId)?.name ?? "this vendor"}'s catalog.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="new-product-name">Product Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="new-product-name"
                          placeholder='e.g. 6" Petunia Hanging Basket'
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
                          data-testid="input-new-product-name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="new-product-packsize">Pack Size <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input
                          id="new-product-packsize"
                          placeholder="e.g. 12, 30, ea"
                          value={newPackSize}
                          onChange={(e) => setNewPackSize(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
                          data-testid="input-new-product-packsize"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                      <Button
                        onClick={handleAddProduct}
                        disabled={!newName.trim() || createProduct.isPending}
                        data-testid="button-confirm-add-product"
                      >
                        {createProduct.isPending ? "Adding..." : "Add Product"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          {selectedVendorId && products && (
            <CardDescription className="flex gap-3 pt-1">
              <span>{products.length} total</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{activeCount} active</span>
              {newCount > 0 && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span className="text-amber-600 font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />{newCount} new (last 30 days)
                  </span>
                </>
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {!selectedVendorId ? (
            <div className="py-16 text-center text-muted-foreground">
              <Store className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a vendor above to view and manage their products.</p>
            </div>
          ) : isLoadingVendors || isLoadingProducts ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Product Name</TableHead>
                  <TableHead className="w-[120px]">Pack Size</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px]">Active</TableHead>
                  <TableHead className="w-[90px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {(products ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No products yet. Click "Add Product" to get started.
                    </TableCell>
                  </TableRow>
                ) : (products ?? []).map((product) => (
                  <TableRow key={product.id} className={!product.isActive ? "opacity-50" : ""} data-testid={`row-product-${product.id}`}>
                    <TableCell className="pl-6">
                      {editingId === product.id ? (
                        <Input
                          value={editName}
                          autoFocus
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEditProduct(product.id); if (e.key === "Escape") setEditingId(null); }}
                          className="h-8 max-w-xs"
                          data-testid={`input-edit-product-name-${product.id}`}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.name}</span>
                          {product.isNew && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0 gap-0.5 hover:bg-amber-100">
                              <Sparkles className="h-2.5 w-2.5" />New
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === product.id ? (
                        <Input
                          value={editPackSize}
                          placeholder="Pack size"
                          onChange={(e) => setEditPackSize(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEditProduct(product.id); if (e.key === "Escape") setEditingId(null); }}
                          className="h-8 w-24"
                          data-testid={`input-edit-product-packsize-${product.id}`}
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">{product.packSize ?? "—"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.isActive ? (
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 text-xs">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleActive(product.id, product.isActive)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        data-testid={`toggle-active-${product.id}`}
                        title={product.isActive ? "Deactivate" : "Activate"}
                      >
                        {product.isActive
                          ? <ToggleRight className="h-5 w-5 text-green-600" />
                          : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </TableCell>
                    <TableCell>
                      {editingId === product.id ? (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-green-700 hover:text-green-800 hover:bg-green-50" onClick={() => saveEditProduct(product.id)} disabled={updateProduct.isPending}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => startEditProduct(product.id, product.name, product.packSize)}>
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
    </div>
  );
}

function SettingsTab() {
  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [fromEmail, setFromEmail] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  if (settings && !initialized) {
    setFromEmail(settings.fromEmail ?? "");
    setInitialized(true);
  }

  const handleSave = () => {
    updateSettings.mutate(
      { data: { fromEmail: fromEmail.trim() || null } },
      {
        onSuccess: () => {
          toast({ title: "Settings saved", description: "Sending email address updated." });
          queryClient.invalidateQueries({ queryKey: ["getSettings"] });
        },
        onError: () => toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Email Settings</CardTitle>
          </div>
          <CardDescription>
            Configure the email address used as the sender when PO confirmation emails are sent to vendors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label htmlFor="from-email">Sending Email Address</Label>
                <Input
                  id="from-email"
                  type="email"
                  placeholder="orders@yourcompany.com"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  data-testid="input-from-email"
                />
                <p className="text-xs text-muted-foreground">
                  This address will appear in the "Reply-To" field on vendor emails. Leave blank to use the default Gmail account.
                </p>
              </div>
              <Button
                onClick={handleSave}
                disabled={updateSettings.isPending}
                data-testid="button-save-settings"
              >
                <Check className="mr-2 h-4 w-4" />
                {updateSettings.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin</h1>
        <p className="text-muted-foreground mt-1">Manage vendors, products, and email settings.</p>
      </div>

      <Tabs defaultValue="vendors">
        <TabsList className="mb-4">
          <TabsTrigger value="vendors" className="gap-1.5">
            <Store className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="vendors">
          <VendorEmailTab />
        </TabsContent>
        <TabsContent value="products">
          <VendorProductsTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
