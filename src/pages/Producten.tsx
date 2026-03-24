import { useState } from "react";
import { Package, Plus, Search, TrendingUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Product {
  name: string;
  category: string;
  price: string;
  stock: number;
  sales: string;
  trend: string;
  status: string;
}

const initialProducts: Product[] = [
  { name: "Hydra Glow Serum", category: "Serums", price: "€34,95", stock: 248, sales: "4.2K", trend: "+18%", status: "Op voorraad" },
  { name: "Rice Water Toner", category: "Toners", price: "€24,95", stock: 186, sales: "3.8K", trend: "+12%", status: "Op voorraad" },
  { name: "Snail Mucin Cream", category: "Crèmes", price: "€39,95", stock: 42, sales: "2.9K", trend: "+9%", status: "Bijna op" },
  { name: "Centella Sheet Mask (5x)", category: "Maskers", price: "€14,95", stock: 520, sales: "2.4K", trend: "+22%", status: "Op voorraad" },
  { name: "Vitamin C Ampoule", category: "Serums", price: "€29,95", stock: 0, sales: "1.8K", trend: "+5%", status: "Uitverkocht" },
  { name: "Green Tea Cleansing Oil", category: "Reiniging", price: "€22,95", stock: 310, sales: "1.6K", trend: "+7%", status: "Op voorraad" },
  { name: "Retinol Nachtcrème", category: "Crèmes", price: "€44,95", stock: 89, sales: "1.2K", trend: "+15%", status: "Op voorraad" },
  { name: "Hyaluronic Acid Mist", category: "Toners", price: "€19,95", stock: 15, sales: "980", trend: "+3%", status: "Bijna op" },
];

const stockColor: Record<string, string> = {
  "Op voorraad": "text-sage",
  "Bijna op": "text-primary",
  "Uitverkocht": "text-destructive",
};

const Producten = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "" });

  const handleCreate = () => {
    if (!form.name || !form.category || !form.price || !form.stock) {
      toast({ title: "Vul alle velden in", variant: "destructive" });
      return;
    }
    const stockNum = parseInt(form.stock);
    const newProduct: Product = {
      name: form.name,
      category: form.category,
      price: `€${form.price}`,
      stock: stockNum,
      sales: "0",
      trend: "nieuw",
      status: stockNum === 0 ? "Uitverkocht" : stockNum < 20 ? "Bijna op" : "Op voorraad",
    };
    setProducts([newProduct, ...products]);
    setForm({ name: "", category: "", price: "", stock: "" });
    setOpen(false);
    toast({ title: "Product toegevoegd", description: `"${form.name}" is toegevoegd aan de catalogus.` });
  };

  const handleDelete = (index: number) => {
    const name = products[index].name;
    setProducts(products.filter((_, i) => i !== index));
    toast({ title: "Product verwijderd", description: `"${name}" is verwijderd.` });
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Producten</h1>
          <p className="text-muted-foreground mt-1">Beheer je Oppa Seoul productcatalogus.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" /> Product toevoegen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Nieuw Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Productnaam</Label>
                <Input placeholder="Bijv. Cica Repair Balm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Categorie</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Kies categorie" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Serums">Serums</SelectItem>
                    <SelectItem value="Toners">Toners</SelectItem>
                    <SelectItem value="Crèmes">Crèmes</SelectItem>
                    <SelectItem value="Maskers">Maskers</SelectItem>
                    <SelectItem value="Reiniging">Reiniging</SelectItem>
                    <SelectItem value="Zonnebescherming">Zonnebescherming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Prijs (€)</Label>
                  <Input type="number" step="0.01" placeholder="34,95" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <Label>Voorraad</Label>
                  <Input type="number" placeholder="100" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full">Product toevoegen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl p-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Zoek producten..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
          {search && (
            <button onClick={() => setSearch("")} className="hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Geen producten gevonden.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((p, i) => {
          const realIndex = products.indexOf(p);
          return (
            <div key={`${p.name}-${i}`} className="glass-card rounded-xl p-5 animate-fade-in group relative" style={{ animationDelay: `${i * 60}ms` }}>
              <button
                onClick={() => handleDelete(realIndex)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="w-full h-28 rounded-lg bg-secondary/60 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{p.category}</p>
              <p className="text-sm font-semibold text-foreground mb-1">{p.name}</p>
              <p className="text-lg font-display font-semibold text-foreground mb-3">{p.price}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${stockColor[p.status]}`}>{p.status}</span>
                <span className="text-xs text-sage flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> {p.trend}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{p.sales} verkocht · {p.stock} op voorraad</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Producten;
