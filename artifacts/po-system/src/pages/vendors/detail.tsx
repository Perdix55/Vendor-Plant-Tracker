import { useGetVendor, useListVendorProducts, getGetVendorQueryKey, getListVendorProductsQueryKey } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Package } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function VendorDetail() {
  const [, params] = useRoute("/vendors/:id");
  const vendorId = params?.id ? parseInt(params.id) : 0;

  const { data: vendor, isLoading: isLoadingVendor } = useGetVendor(vendorId, { 
    query: { enabled: !!vendorId, queryKey: getGetVendorQueryKey(vendorId) } 
  });
  const { data: products, isLoading: isLoadingProducts } = useListVendorProducts(vendorId, {
    query: { enabled: !!vendorId, queryKey: getListVendorProductsQueryKey(vendorId) }
  });

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!search) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.packSize && p.packSize.toLowerCase().includes(search.toLowerCase()))
    );
  }, [products, search]);

  if (!vendorId) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Link href="/vendors">
        <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vendors
        </Button>
      </Link>

      {isLoadingVendor ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : vendor ? (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground" data-testid="text-vendor-name">{vendor.name}</h1>
              {vendor.sourceLocation && (
                <Badge variant="outline" className="text-sm">{vendor.sourceLocation}</Badge>
              )}
            </div>
            {vendor.notes && <p className="text-muted-foreground mt-2 max-w-2xl">{vendor.notes}</p>}
          </div>
          <Link href={`/orders/new?vendorId=${vendor.id}`}>
            <Button data-testid="button-create-order-vendor">Create Order for {vendor.name}</Button>
          </Link>
        </div>
      ) : null}

      <div className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            Product Catalog
            {products && <Badge variant="secondary" className="ml-2">{products.length}</Badge>}
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-products"
            />
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Pack Size</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="border rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[55%]">Product Name</TableHead>
                  <TableHead>Pack Size</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                    <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.packSize || "—"}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {product.cost ? `$${parseFloat(product.cost).toFixed(2)}` : <span className="text-muted-foreground text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.isActive ? (
                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
            {search ? "No products found matching your search." : "No products available for this vendor."}
          </div>
        )}
      </div>
    </div>
  );
}