import { useState } from "react";
import { TrendingUp, Eye, Heart, ShoppingBag, ArrowUpRight, Calendar, Clock, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import heroProducts from "@/assets/hero-products.jpg";

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: string;
}

interface Campaign {
  name: string;
  status: string;
  platform: string;
  progress: number;
}

interface CalendarItem {
  date: string;
  title: string;
  time: string;
}

interface Product {
  name: string;
  sales: string;
  trend: string;
}

const iconMap: Record<string, React.ElementType> = { Eye, Heart, ShoppingBag, TrendingUp };
const statusColor: Record<string, string> = {
  Actief: "bg-accent text-accent-foreground",
  Gepland: "bg-secondary text-secondary-foreground",
  Review: "bg-accent text-accent-foreground",
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  // Dialog states
  const [statOpen, setStatOpen] = useState(false);
  const [campOpen, setCampOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);

  // Edit index (-1 = new)
  const [editIdx, setEditIdx] = useState(-1);

  // Forms
  const [statForm, setStatForm] = useState({ label: "", value: "", change: "", icon: "Eye" });
  const [campForm, setCampForm] = useState({ name: "", status: "Actief", platform: "", progress: 0 });
  const [calForm, setCalForm] = useState({ date: "", title: "", time: "" });
  const [prodForm, setProdForm] = useState({ name: "", sales: "", trend: "" });

  const saveStat = () => {
    if (!statForm.label || !statForm.value) return;
    if (editIdx >= 0) {
      setStats(s => s.map((x, i) => i === editIdx ? { ...statForm } : x));
    } else {
      setStats(s => [...s, { ...statForm }]);
    }
    setStatForm({ label: "", value: "", change: "", icon: "Eye" });
    setEditIdx(-1);
    setStatOpen(false);
    toast({ title: editIdx >= 0 ? "Statistiek bijgewerkt" : "Statistiek toegevoegd" });
  };

  const saveCamp = () => {
    if (!campForm.name) return;
    if (editIdx >= 0) {
      setCampaigns(s => s.map((x, i) => i === editIdx ? { ...campForm } : x));
    } else {
      setCampaigns(s => [...s, { ...campForm }]);
    }
    setCampForm({ name: "", status: "Actief", platform: "", progress: 0 });
    setEditIdx(-1);
    setCampOpen(false);
    toast({ title: editIdx >= 0 ? "Campagne bijgewerkt" : "Campagne toegevoegd" });
  };

  const saveCal = () => {
    if (!calForm.title) return;
    if (editIdx >= 0) {
      setCalendarItems(s => s.map((x, i) => i === editIdx ? { ...calForm } : x));
    } else {
      setCalendarItems(s => [...s, { ...calForm }]);
    }
    setCalForm({ date: "", title: "", time: "" });
    setEditIdx(-1);
    setCalOpen(false);
    toast({ title: editIdx >= 0 ? "Item bijgewerkt" : "Item toegevoegd" });
  };

  const saveProd = () => {
    if (!prodForm.name) return;
    if (editIdx >= 0) {
      setTopProducts(s => s.map((x, i) => i === editIdx ? { ...prodForm } : x));
    } else {
      setTopProducts(s => [...s, { ...prodForm }]);
    }
    setProdForm({ name: "", sales: "", trend: "" });
    setEditIdx(-1);
    setProdOpen(false);
    toast({ title: editIdx >= 0 ? "Product bijgewerkt" : "Product toegevoegd" });
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">Dashboard ✨</h1>
        <p className="text-muted-foreground mt-1">Je marketing overzicht — voeg je eigen data toe.</p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground text-sm">Statistieken</h3>
        <Dialog open={statOpen} onOpenChange={(o) => { setStatOpen(o); if (!o) { setEditIdx(-1); setStatForm({ label: "", value: "", change: "", icon: "Eye" }); } }}>
          <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="w-3 h-3 mr-1" />Toevoegen</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editIdx >= 0 ? "Statistiek bewerken" : "Nieuwe Statistiek"}</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div><Label>Label</Label><Input placeholder="Bijv. Impressies" value={statForm.label} onChange={e => setStatForm({ ...statForm, label: e.target.value })} /></div>
              <div><Label>Waarde</Label><Input placeholder="Bijv. 2.4M" value={statForm.value} onChange={e => setStatForm({ ...statForm, value: e.target.value })} /></div>
              <div><Label>Verandering</Label><Input placeholder="Bijv. +12.3%" value={statForm.change} onChange={e => setStatForm({ ...statForm, change: e.target.value })} /></div>
              <div><Label>Icoon</Label>
                <select className="w-full border rounded-md p-2 text-sm bg-background" value={statForm.icon} onChange={e => setStatForm({ ...statForm, icon: e.target.value })}>
                  <option value="Eye">👁 Impressies</option>
                  <option value="Heart">❤ Engagement</option>
                  <option value="ShoppingBag">🛍 Conversies</option>
                  <option value="TrendingUp">📈 Groei</option>
                </select>
              </div>
              <Button onClick={saveStat} className="w-full">{editIdx >= 0 ? "Opslaan" : "Toevoegen"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stats.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Eye;
            return (
              <div key={i} className="glass-card rounded-xl p-5 animate-fade-in group relative" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <button onClick={() => { setStatForm(stat); setEditIdx(i); setStatOpen(true); }} className="p-1 rounded hover:bg-secondary"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                  <button onClick={() => { setStats(s => s.filter((_, j) => j !== i)); toast({ title: "Verwijderd" }); }} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive" /></button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium text-sage flex items-center gap-0.5">
                    {stat.change} <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-8 mb-8 text-center text-muted-foreground text-sm">
          Nog geen statistieken — klik op "Toevoegen" om je eerste KPI toe te voegen.
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Hero Banner */}
        <div className="col-span-2 rounded-xl overflow-hidden relative h-52 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <img src={heroProducts} alt="Oppa Seoul producten" className="w-full h-full object-cover" width={1280} height={720} />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 to-transparent flex items-center">
            <div className="p-8">
              <p className="text-sm font-medium text-blush mb-1">Oppa Seoul</p>
              <h2 className="text-2xl font-display font-semibold text-card">Marketing Hub</h2>
              <p className="text-sm text-card/80 mt-1 max-w-xs">Beheer al je marketing vanuit één plek.</p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Aankomend</h3>
            </div>
            <Dialog open={calOpen} onOpenChange={(o) => { setCalOpen(o); if (!o) { setEditIdx(-1); setCalForm({ date: "", title: "", time: "" }); } }}>
              <DialogTrigger asChild><button className="p-1 rounded hover:bg-secondary"><Plus className="w-4 h-4 text-muted-foreground" /></button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editIdx >= 0 ? "Item bewerken" : "Nieuw Agenda Item"}</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-2">
                  <div><Label>Datum</Label><Input placeholder="Bijv. 25 mrt" value={calForm.date} onChange={e => setCalForm({ ...calForm, date: e.target.value })} /></div>
                  <div><Label>Titel</Label><Input placeholder="Bijv. Productfoto shoot" value={calForm.title} onChange={e => setCalForm({ ...calForm, title: e.target.value })} /></div>
                  <div><Label>Tijd</Label><Input placeholder="Bijv. 10:00" value={calForm.time} onChange={e => setCalForm({ ...calForm, time: e.target.value })} /></div>
                  <Button onClick={saveCal} className="w-full">{editIdx >= 0 ? "Opslaan" : "Toevoegen"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {calendarItems.length > 0 ? (
            <div className="space-y-3">
              {calendarItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-10 text-center shrink-0">
                    <p className="text-xs font-semibold text-primary">{item.date.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">{item.date.split(" ")[1]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
                    <button onClick={() => { setCalForm(item); setEditIdx(i); setCalOpen(true); }} className="p-0.5"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                    <button onClick={() => { setCalendarItems(s => s.filter((_, j) => j !== i)); toast({ title: "Verwijderd" }); }} className="p-0.5"><Trash2 className="w-3 h-3 text-destructive" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">Nog geen items</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Campaigns */}
        <div className="col-span-2 glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Actieve Campagnes</h3>
            <Dialog open={campOpen} onOpenChange={(o) => { setCampOpen(o); if (!o) { setEditIdx(-1); setCampForm({ name: "", status: "Actief", platform: "", progress: 0 }); } }}>
              <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="w-3 h-3 mr-1" />Toevoegen</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editIdx >= 0 ? "Campagne bewerken" : "Nieuwe Campagne"}</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-2">
                  <div><Label>Naam</Label><Input placeholder="Bijv. Glass Skin Launch" value={campForm.name} onChange={e => setCampForm({ ...campForm, name: e.target.value })} /></div>
                  <div><Label>Platform</Label><Input placeholder="Bijv. Instagram" value={campForm.platform} onChange={e => setCampForm({ ...campForm, platform: e.target.value })} /></div>
                  <div><Label>Status</Label>
                    <select className="w-full border rounded-md p-2 text-sm bg-background" value={campForm.status} onChange={e => setCampForm({ ...campForm, status: e.target.value })}>
                      <option>Actief</option><option>Gepland</option><option>Review</option>
                    </select>
                  </div>
                  <div><Label>Voortgang (%)</Label><Input type="number" min={0} max={100} value={campForm.progress} onChange={e => setCampForm({ ...campForm, progress: Number(e.target.value) })} /></div>
                  <Button onClick={saveCamp} className="w-full">{editIdx >= 0 ? "Opslaan" : "Toevoegen"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {campaigns.length > 0 ? (
            <div className="space-y-3">
              {campaigns.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.platform}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[c.status] || "bg-secondary text-secondary-foreground"}`}>{c.status}</span>
                  {c.progress > 0 && (
                    <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    <button onClick={() => { setCampForm(c); setEditIdx(i); setCampOpen(true); }} className="p-1 rounded hover:bg-secondary"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                    <button onClick={() => { setCampaigns(s => s.filter((_, j) => j !== i)); toast({ title: "Verwijderd" }); }} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">Nog geen campagnes — voeg je eerste toe.</p>
          )}
        </div>

        {/* Top Products */}
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Top Producten</h3>
            <Dialog open={prodOpen} onOpenChange={(o) => { setProdOpen(o); if (!o) { setEditIdx(-1); setProdForm({ name: "", sales: "", trend: "" }); } }}>
              <DialogTrigger asChild><button className="p-1 rounded hover:bg-secondary"><Plus className="w-4 h-4 text-muted-foreground" /></button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editIdx >= 0 ? "Product bewerken" : "Nieuw Product"}</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-2">
                  <div><Label>Naam</Label><Input placeholder="Bijv. Hydra Glow Serum" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} /></div>
                  <div><Label>Verkopen</Label><Input placeholder="Bijv. 4.2K" value={prodForm.sales} onChange={e => setProdForm({ ...prodForm, sales: e.target.value })} /></div>
                  <div><Label>Trend</Label><Input placeholder="Bijv. +18%" value={prodForm.trend} onChange={e => setProdForm({ ...prodForm, trend: e.target.value })} /></div>
                  <Button onClick={saveProd} className="w-full">{editIdx >= 0 ? "Opslaan" : "Toevoegen"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <span className="w-6 h-6 rounded-full bg-green-light text-primary text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} verkocht</p>
                  </div>
                  <span className="text-xs font-medium text-sage">{p.trend}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
                    <button onClick={() => { setProdForm(p); setEditIdx(i); setProdOpen(true); }} className="p-0.5"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                    <button onClick={() => { setTopProducts(s => s.filter((_, j) => j !== i)); toast({ title: "Verwijderd" }); }} className="p-0.5"><Trash2 className="w-3 h-3 text-destructive" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">Nog geen producten</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
