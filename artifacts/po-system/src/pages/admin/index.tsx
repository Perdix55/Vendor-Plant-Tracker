import { useState } from "react";
import {
  useListVendors,
  useUpdateVendor,
  useCreateVendor,
  useListVendorProducts,
  useCreateProduct,
  useUpdateProduct,
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
import { Check, Pencil, X, Mail, ShieldCheck, Plus, Package, Sparkles, ToggleLeft, ToggleRight, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        </TabsList>
        <TabsContent value="vendors">
          <VendorEmailTab />
        </TabsContent>
        <TabsContent value="products">
          <VendorProductsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
