import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronRight, ChevronDown, ArrowLeft } from "lucide-react";

type Step = string;

type Article = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  steps: Step[];
  notes?: string;
};

const articles: Article[] = [
  // ── Purchase Orders ──────────────────────────────────────────────────────
  {
    id: "po-create",
    title: "Create a new purchase order",
    category: "Purchase Orders",
    tags: ["new order", "draft", "vendor", "create"],
    steps: [
      "Click Purchase Orders in the left sidebar.",
      "Click the New Order button (top right or sidebar).",
      "Select a vendor from the dropdown.",
      "Choose the Ship Date (when the vendor ships) and optionally an Arrive Date.",
      "Browse the vendor's product catalog and enter quantities in the Qty column.",
      "Click Save Draft — the order is saved with status Draft.",
    ],
  },
  {
    id: "po-send",
    title: "Mark an order as sent to vendor",
    category: "Purchase Orders",
    tags: ["send", "submit", "email", "sent"],
    steps: [
      "Open the purchase order from the orders list.",
      "Review the line items and confirm quantities are correct.",
      "Click Mark as Sent — the status changes to Sent.",
      "Optionally use Send Email to email the order directly to the vendor.",
    ],
    notes: "Vendor email addresses are configured in Admin → Vendors.",
  },
  {
    id: "po-confirm",
    title: "Enter vendor confirmation on an order",
    category: "Purchase Orders",
    tags: ["confirm", "available", "unavailable", "partial", "vendor response"],
    steps: [
      "Open the sent purchase order.",
      "Click Enter Confirmation (or the confirmation panel appears automatically).",
      "For each line item, set the availability: Available, Unavailable, or Partial.",
      "For Partial, enter the confirmed quantity the vendor can supply.",
      "Click Save Confirmation — the order status updates to Confirmed or Partial automatically.",
    ],
  },
  {
    id: "po-receive",
    title: "Receive a shipment and update inventory",
    category: "Purchase Orders",
    tags: ["receive", "shipment", "inventory", "truck", "arrived"],
    steps: [
      "Open the confirmed purchase order.",
      "Click the Receive Shipment button.",
      "On the Receive Shipment page, enter the actual quantity received for each item.",
      "Click Receive Shipment to save — inventory is updated immediately.",
      "The order status changes to Received.",
    ],
    notes: "Only items with a quantity greater than 0 are added to inventory.",
  },
  {
    id: "po-filter",
    title: "Filter and search purchase orders",
    category: "Purchase Orders",
    tags: ["search", "filter", "status", "find order"],
    steps: [
      "Go to Purchase Orders in the sidebar.",
      "Use the search bar to find orders by vendor name, PO number, or date.",
      "Use the Status dropdown to filter by Draft, Sent, Confirmed, Partial, or Received.",
    ],
  },

  // ── Inventory ────────────────────────────────────────────────────────────
  {
    id: "inv-view",
    title: "View current inventory levels",
    category: "Inventory",
    tags: ["stock", "on hand", "levels", "view"],
    steps: [
      "Click Inventory in the left sidebar.",
      "The table shows all products with their current quantity on hand, vendor, and last updated date.",
      "Use the search bar to filter by product name or vendor.",
    ],
  },
  {
    id: "inv-adjust",
    title: "Adjust inventory (sale, write-off, or correction)",
    category: "Inventory",
    tags: ["adjust", "sale", "write-off", "correction", "manual"],
    steps: [
      "Go to Inventory in the sidebar.",
      "Click Adjust Inventory (top right).",
      "Select the product and vendor.",
      "Choose the adjustment type: Sale, Write-Off, or Adjustment (correction).",
      "Enter the quantity (positive number — the system applies the direction automatically).",
      "Add optional notes and click Save.",
    ],
    notes: "Sales and write-offs reduce stock. Adjustments can increase or decrease depending on the entered quantity vs. current stock.",
  },
  {
    id: "inv-history",
    title: "View inventory transaction history",
    category: "Inventory",
    tags: ["history", "transactions", "log", "receives", "sales"],
    steps: [
      "Go to Inventory in the sidebar.",
      "Click History (or the transaction log button).",
      "The list shows all receives, sales, write-offs, and adjustments with dates and notes.",
      "Optionally filter by product to see only that product's history.",
    ],
  },

  // ── Vendors ──────────────────────────────────────────────────────────────
  {
    id: "vendor-browse",
    title: "Browse a vendor's product catalog",
    category: "Vendors",
    tags: ["products", "catalog", "browse", "vendor"],
    steps: [
      "Click Vendors in the left sidebar.",
      "Click on any vendor card to open the vendor detail page.",
      "Use the search bar to filter products by name.",
      "The catalog shows all products available from that vendor with pricing.",
    ],
  },
  {
    id: "vendor-import",
    title: "Import a vendor and their products",
    category: "Vendors",
    tags: ["import", "spreadsheet", "upload", "add vendor", "products"],
    steps: [
      "Go to Admin in the left sidebar.",
      "Select the Vendors tab.",
      "Click Import Vendor and upload a spreadsheet (CSV or XLSX).",
      "The system creates the vendor and imports all products from the file.",
    ],
    notes: "Contact your administrator if you need a spreadsheet template.",
  },
  {
    id: "vendor-email",
    title: "Set a vendor's email address",
    category: "Vendors",
    tags: ["email", "vendor", "contact", "send order"],
    steps: [
      "Go to Admin in the left sidebar.",
      "Select the Vendors tab.",
      "Find the vendor and click Edit or the email field.",
      "Enter the vendor's email address and save.",
      "This email is used when sending purchase orders directly from the system.",
    ],
  },

  // ── Sales Orders ─────────────────────────────────────────────────────────
  {
    id: "so-create",
    title: "Create a new sales order",
    category: "Sales Orders",
    tags: ["sales", "customer", "new", "create"],
    steps: [
      "Click Sales Orders in the left sidebar.",
      "Click New Sales Order.",
      "Enter the customer name.",
      "Browse the availability catalog — use the category tabs to filter by plant type.",
      "Enter quantities for each item the customer wants.",
      "Click Create Order to save.",
    ],
  },
  {
    id: "so-catalog-filter",
    title: "Filter the sales catalog by category",
    category: "Sales Orders",
    tags: ["category", "filter", "tab", "6in", "color", "bromeliad"],
    steps: [
      "On a new or existing sales order, find the availability catalog panel.",
      "Use the Category dropdown to filter products by sheet tab (e.g. Color, 6in, Bromeliads).",
      "The list updates instantly — only products in that category are shown.",
    ],
  },
  {
    id: "so-status",
    title: "Update a sales order status",
    category: "Sales Orders",
    tags: ["status", "open", "complete", "cancel", "sales order"],
    steps: [
      "Open the sales order from the Sales Orders list.",
      "Use the Status dropdown at the top of the order detail page.",
      "Choose the appropriate status: Open, Complete, or Cancelled.",
      "The change saves automatically.",
    ],
  },

  // ── Shop (Customer Page) ─────────────────────────────────────────────────
  {
    id: "shop-order",
    title: "Place an order on the customer shop page",
    category: "Shop",
    tags: ["shop", "customer", "order", "scan", "barcode", "public"],
    steps: [
      "Navigate to /shop or share that link with the customer.",
      "Enter your name and click Start Shopping.",
      "Use the category tabs to browse by plant type (Color, 6in, Bromeliads, etc.).",
      "Tap + to add items, or use the search bar to find a specific product.",
      "You can also scan a barcode using the camera button.",
      "When done, click Finish to submit the order.",
    ],
    notes: "The shop page requires no login — share the /shop URL directly with customers.",
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  {
    id: "admin-shop-import",
    title: "Import the weekly availability sheet for the shop",
    category: "Admin",
    tags: ["availability", "import", "shop", "weekly", "google sheets", "upload"],
    steps: [
      "Go to Admin in the left sidebar.",
      "Select the Shop tab.",
      "To import from Google Sheets: paste the published Google Sheets URL and click Import from URL.",
      "To upload a file: click Choose File, select the XLSX or CSV file, and click Upload.",
      "The system will replace the previous catalog with the new sheet's contents.",
      "Category tabs on the shop page are populated from the sheet tab names.",
    ],
    notes: "All sheet tabs are imported except tabs with 'master' in the name.",
  },
  {
    id: "admin-users",
    title: "Add or manage staff users",
    category: "Admin",
    tags: ["users", "staff", "permissions", "add user", "admin"],
    steps: [
      "Go to Admin in the left sidebar (admin access required).",
      "Select the Users tab.",
      "Click Add User and enter their name, email, and password.",
      "Set permissions: Orders, Inventory, Vendors, Sales Orders, or Admin.",
      "Click Save — the user can now log in with those credentials.",
    ],
  },
  {
    id: "admin-add-product",
    title: "Add or edit a product",
    category: "Admin",
    tags: ["product", "add", "edit", "price", "vendor"],
    steps: [
      "Go to Admin in the left sidebar.",
      "Select the Products tab.",
      "Click Add Product or click an existing product to edit it.",
      "Enter the product name, vendor, and price.",
      "Click Save.",
    ],
  },
];

const categories = Array.from(new Set(articles.map((a) => a.category)));

const categoryColors: Record<string, string> = {
  "Purchase Orders": "bg-blue-100 text-blue-800 border-blue-200",
  Inventory: "bg-green-100 text-green-800 border-green-200",
  Vendors: "bg-purple-100 text-purple-800 border-purple-200",
  "Sales Orders": "bg-amber-100 text-amber-800 border-amber-200",
  Shop: "bg-teal-100 text-teal-800 border-teal-200",
  Admin: "bg-red-100 text-red-800 border-red-200",
};

function score(article: Article, q: string): number {
  const lq = q.toLowerCase();
  if (article.title.toLowerCase().includes(lq)) return 3;
  if (article.tags.some((t) => t.includes(lq))) return 2;
  if (article.steps.some((s) => s.toLowerCase().includes(lq))) return 1;
  if (article.category.toLowerCase().includes(lq)) return 1;
  return 0;
}

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function HelpModal({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Article | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return articles;
    return articles
      .map((a) => ({ article: a, s: score(a, q) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ article }) => article);
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, Article[]> = {};
    for (const a of filtered) {
      if (!map[a.category]) map[a.category] = [];
      map[a.category].push(a);
    }
    return map;
  }, [filtered]);

  const visibleCategories = query.trim()
    ? Object.keys(grouped)
    : categories.filter((c) => grouped[c]?.length);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setSelected(null); setQuery(""); setExpandedCategory(null); }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b shrink-0">
          <DialogTitle className="text-lg font-semibold">Help &amp; How-To</DialogTitle>
        </DialogHeader>

        {selected ? (
          /* ── Article detail ── */
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-5 py-3 border-b shrink-0">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to results
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <div className="space-y-1.5">
                <Badge variant="outline" className={categoryColors[selected.category]}>
                  {selected.category}
                </Badge>
                <h2 className="text-xl font-semibold leading-snug">{selected.title}</h2>
              </div>
              <ol className="space-y-3">
                {selected.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
              {selected.notes && (
                <div className="rounded-lg bg-muted/60 border px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Note: </span>
                    {selected.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Search + article list ── */
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-4 py-3 border-b shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  autoFocus
                  placeholder="Search help topics…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm gap-2">
                  <Search className="h-8 w-8 opacity-20" />
                  <p>No results for &ldquo;{query}&rdquo;</p>
                </div>
              ) : query.trim() ? (
                /* Flat search results */
                <ul className="divide-y">
                  {filtered.map((a) => (
                    <li key={a.id}>
                      <button
                        onClick={() => setSelected(a)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{a.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.category}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                /* Grouped by category */
                <div className="divide-y">
                  {visibleCategories.map((cat) => {
                    const items = grouped[cat] ?? [];
                    const isOpen = expandedCategory === cat;
                    return (
                      <div key={cat}>
                        <button
                          onClick={() => setExpandedCategory(isOpen ? null : cat)}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
                        >
                          <Badge variant="outline" className={`${categoryColors[cat]} text-xs shrink-0`}>
                            {cat}
                          </Badge>
                          <span className="flex-1 text-left text-sm font-medium text-muted-foreground">
                            {items.length} article{items.length !== 1 ? "s" : ""}
                          </span>
                          {isOpen
                            ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                            : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                        </button>
                        {isOpen && (
                          <ul className="bg-muted/20 border-t divide-y">
                            {items.map((a) => (
                              <li key={a.id}>
                                <button
                                  onClick={() => setSelected(a)}
                                  className="w-full flex items-center gap-3 pl-8 pr-5 py-3 text-left hover:bg-muted/50 transition-colors"
                                >
                                  <p className="flex-1 text-sm">{a.title}</p>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
