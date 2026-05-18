import { useListVendors } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export default function Vendors() {
  const { data: vendors, isLoading } = useListVendors();
  const [search, setSearch] = useState("");

  const filteredVendors = useMemo(() => {
    if (!vendors) return [];
    if (!search) return vendors;
    return vendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));
  }, [vendors, search]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Vendors</h1>
          <p className="text-muted-foreground mt-1">Manage wholesale nursery partners.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-vendors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : filteredVendors.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVendors.map(vendor => (
            <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col hover:shadow-md" data-testid={`card-vendor-${vendor.id}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-start">
                    {vendor.name}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <Badge variant="secondary" className="bg-secondary/50">
                      {vendor.productCount} Products
                    </Badge>
                    {vendor.sourceLocation && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {vendor.sourceLocation}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
          {search ? "No vendors found matching your search." : "No vendors available."}
        </div>
      )}
    </div>
  );
}