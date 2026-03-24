import { Package, Plus, Search, TrendingUp } from "lucide-react";

const products = [
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

const Producten = () => (
  <div className="flex-1 p-8 overflow-auto">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-foreground">Producten</h1>
        <p className="text-muted-foreground mt-1">Beheer je Oppa Seoul productcatalogus.</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        <Plus className="w-4 h-4" /> Product toevoegen
      </button>
    </div>

    <div className="glass-card rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Search className="w-4 h-4" />
        <input type="text" placeholder="Zoek producten..." className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1" />
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((p, i) => (
        <div key={p.name} className="glass-card rounded-xl p-5 animate-fade-in hover:shadow-md transition-shadow cursor-pointer" style={{ animationDelay: `${i * 60}ms` }}>
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
      ))}
    </div>
  </div>
);

export default Producten;
