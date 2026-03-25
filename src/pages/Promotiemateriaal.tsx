import { useState, useRef } from "react";
import { Printer, Plus, Eye, Download, Trash2, Palette, Type, Image, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type TemplateType = "poster-a3" | "flyer-a5" | "banner" | "kaart";
type ColorTheme = "rose" | "sage" | "cream" | "midnight" | "coral";

interface PromoDesign {
  id: string;
  name: string;
  type: TemplateType;
  theme: ColorTheme;
  headline: string;
  subtext: string;
  promoCode: string;
  discount: string;
  footer: string;
  createdAt: Date;
}

const templateLabels: Record<TemplateType, { label: string; size: string }> = {
  "poster-a3": { label: "Poster", size: "A3 — 297×420mm" },
  "flyer-a5": { label: "Flyer", size: "A5 — 148×210mm" },
  "banner": { label: "Banner", size: "728×90px" },
  "kaart": { label: "Kaart", size: "A6 — 105×148mm" },
};

const themeStyles: Record<ColorTheme, { bg: string; accent: string; text: string; label: string; dot: string }> = {
  rose: { bg: "bg-gradient-to-br from-rose-50 to-pink-100", accent: "text-primary", text: "text-foreground", label: "Rosé", dot: "bg-primary" },
  sage: { bg: "bg-gradient-to-br from-emerald-50 to-teal-100", accent: "text-emerald-700", text: "text-emerald-900", label: "Sage", dot: "bg-emerald-500" },
  cream: { bg: "bg-gradient-to-br from-amber-50 to-orange-100", accent: "text-amber-700", text: "text-amber-900", label: "Cream Gold", dot: "bg-amber-500" },
  midnight: { bg: "bg-gradient-to-br from-slate-800 to-indigo-900", accent: "text-blue-300", text: "text-slate-100", label: "Midnight", dot: "bg-indigo-500" },
  coral: { bg: "bg-gradient-to-br from-red-50 to-rose-100", accent: "text-red-600", text: "text-red-900", label: "Coral", dot: "bg-red-500" },
};

const initialDesigns: PromoDesign[] = [
  {
    id: "1", name: "Glass Skin Lancering", type: "poster-a3", theme: "rose",
    headline: "Glass Skin\nCollection", subtext: "Ontdek de geheimen van Koreaanse huidverzorging",
    promoCode: "GLASS20", discount: "20% korting", footer: "Geldig t/m 30 april 2026 • oppa-seoul.nl",
    createdAt: new Date(2026, 2, 20),
  },
  {
    id: "2", name: "Zomer Sale Flyer", type: "flyer-a5", theme: "coral",
    headline: "Summer\nGlow Sale", subtext: "Tot 40% korting op alle zonbescherming & hydratatie",
    promoCode: "SUMMER40", discount: "40% korting", footer: "21 juni — 21 juli • Alleen online",
    createdAt: new Date(2026, 2, 18),
  },
  {
    id: "3", name: "VIP Klantenkaart", type: "kaart", theme: "midnight",
    headline: "VIP\nMember", subtext: "Exclusieve toegang tot nieuwe collecties & samples",
    promoCode: "", discount: "15% altijd", footer: "oppa-seoul.nl/vip",
    createdAt: new Date(2026, 2, 15),
  },
];

const DesignPreview = ({ design, scale = 1 }: { design: PromoDesign; scale?: number }) => {
  const theme = themeStyles[design.theme];
  const isVertical = design.type !== "banner";
  const aspectMap: Record<TemplateType, string> = {
    "poster-a3": "aspect-[297/420]",
    "flyer-a5": "aspect-[148/210]",
    "banner": "aspect-[728/90]",
    "kaart": "aspect-[105/148]",
  };

  return (
    <div className={`${aspectMap[design.type]} ${theme.bg} rounded-lg overflow-hidden relative flex flex-col`}
      style={{ fontSize: `${scale * 100}%` }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="40" fill="currentColor" className={theme.accent} />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="80" r="30" fill="currentColor" className={theme.accent} />
        </svg>
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col ${isVertical ? "justify-between h-full p-[8%]" : "justify-center items-center h-full px-[4%] flex-row gap-[4%]"}`}>
        {/* Logo area */}
        <div className={`flex items-center gap-1 ${!isVertical ? "order-first" : ""}`}>
          <Sparkles className={`${theme.accent} opacity-70`} style={{ width: "1em", height: "1em" }} />
          <span className={`font-bold tracking-tight ${theme.text} opacity-60`} style={{ fontSize: "0.55em" }}>
            OPPA SEOUL
          </span>
        </div>

        {/* Main content */}
        <div className={`${isVertical ? "flex-1 flex flex-col justify-center" : "flex items-center gap-[3%]"}`}>
          <h2 className={`font-bold leading-[0.95] tracking-tight ${theme.text}`}
            style={{ fontSize: isVertical ? "1.8em" : "1.1em", fontFamily: "var(--font-display)" }}
          >
            {design.headline.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          {design.subtext && (
            <p className={`${theme.text} opacity-70 leading-snug mt-[0.4em]`} style={{ fontSize: "0.5em" }}>
              {design.subtext}
            </p>
          )}
          {design.discount && (
            <div className={`inline-flex items-center gap-1 mt-[0.6em] rounded-full px-[0.6em] py-[0.2em] ${design.theme === "midnight" ? "bg-blue-500/20" : "bg-foreground/5"}`}>
              <span className={`font-bold ${theme.accent}`} style={{ fontSize: "0.7em" }}>{design.discount}</span>
            </div>
          )}
          {design.promoCode && (
            <div className={`mt-[0.4em] border ${design.theme === "midnight" ? "border-slate-600" : "border-foreground/10"} rounded-md px-[0.5em] py-[0.15em] inline-block`}>
              <span className={`${theme.text} opacity-50`} style={{ fontSize: "0.35em" }}>CODE: </span>
              <span className={`font-bold tracking-widest ${theme.accent}`} style={{ fontSize: "0.5em" }}>{design.promoCode}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        {design.footer && (
          <p className={`${theme.text} opacity-40`} style={{ fontSize: "0.3em" }}>
            {design.footer}
          </p>
        )}
      </div>
    </div>
  );
};

const Promotiemateriaal = () => {
  const [designs, setDesigns] = useState<PromoDesign[]>(initialDesigns);
  const [showCreate, setShowCreate] = useState(false);
  const [preview, setPreview] = useState<PromoDesign | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({
    name: "", type: "poster-a3" as TemplateType, theme: "rose" as ColorTheme,
    headline: "", subtext: "", promoCode: "", discount: "", footer: "oppa-seoul.nl",
  });

  const resetForm = () => setForm({
    name: "", type: "poster-a3", theme: "rose",
    headline: "", subtext: "", promoCode: "", discount: "", footer: "oppa-seoul.nl",
  });

  const handleCreate = () => {
    if (!form.name || !form.headline) return;
    if (editId) {
      setDesigns((prev) => prev.map((d) => d.id === editId ? { ...d, ...form } : d));
      toast({ title: "Ontwerp bijgewerkt", description: form.name });
      setEditId(null);
    } else {
      const newDesign: PromoDesign = {
        ...form, id: `d${Date.now()}`, createdAt: new Date(),
      };
      setDesigns((prev) => [newDesign, ...prev]);
      toast({ title: "Ontwerp aangemaakt", description: form.name });
    }
    resetForm();
    setShowCreate(false);
  };

  const handleEdit = (d: PromoDesign) => {
    setForm({ name: d.name, type: d.type, theme: d.theme, headline: d.headline, subtext: d.subtext, promoCode: d.promoCode, discount: d.discount, footer: d.footer });
    setEditId(d.id);
    setShowCreate(true);
  };

  const handleDelete = (id: string) => {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Ontwerp verwijderd" });
  };

  const handlePrint = (d: PromoDesign) => {
    setPreview(d);
    setTimeout(() => window.print(), 300);
  };

  const livePreview: PromoDesign = {
    id: "preview", name: form.name || "Preview", type: form.type, theme: form.theme,
    headline: form.headline || "Headline\nHier", subtext: form.subtext || "Subtekst komt hier",
    promoCode: form.promoCode, discount: form.discount, footer: form.footer, createdAt: new Date(),
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Promotiemateriaal</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1 ml-8">Maak posters, flyers en kaarten voor je promoties</p>
        </div>
        <Button onClick={() => { resetForm(); setEditId(null); setShowCreate(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nieuw ontwerp
        </Button>
      </div>

      {/* Grid of designs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {designs.map((d) => (
          <div key={d.id} className="glass-card rounded-xl overflow-hidden group">
            <div className="p-3">
              <DesignPreview design={d} scale={0.55} />
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-foreground truncate">{d.name}</h3>
                <Badge variant="secondary" className="text-[10px] shrink-0">{templateLabels[d.type].label}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {d.createdAt.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                {" • "}{themeStyles[d.theme].label}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs" onClick={() => setPreview(d)}>
                  <Eye className="w-3 h-3" /> Bekijk
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs" onClick={() => handleEdit(d)}>
                  <Palette className="w-3 h-3" /> Bewerk
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => handlePrint(d)}>
                  <Printer className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(d.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {designs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Printer className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nog geen ontwerpen. Maak je eerste promotie!</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreate} onOpenChange={(o) => { if (!o) { setShowCreate(false); setEditId(null); resetForm(); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{editId ? "Ontwerp bewerken" : "Nieuw promotiemateriaal"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 overflow-auto pr-1" style={{ maxHeight: "65vh" }}>
            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Naam</Label>
                <Input placeholder="Bijv. Zomer Sale Poster" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TemplateType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(templateLabels) as [TemplateType, { label: string; size: string }][]).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label} — {v.size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Kleurthema</Label>
                  <Select value={form.theme} onValueChange={(v) => setForm({ ...form, theme: v as ColorTheme })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(themeStyles) as [ColorTheme, typeof themeStyles[ColorTheme]][]).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          <span className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${v.dot}`} />
                            {v.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Headline (gebruik Enter voor regelbreuk)</Label>
                <Textarea placeholder="Glass Skin&#10;Collection" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} rows={2} />
              </div>
              <div>
                <Label className="text-xs">Subtekst</Label>
                <Input placeholder="Ontdek onze nieuwe collectie..." value={form.subtext} onChange={(e) => setForm({ ...form, subtext: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Korting</Label>
                  <Input placeholder="20% korting" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Promocode</Label>
                  <Input placeholder="GLASS20" value={form.promoCode} onChange={(e) => setForm({ ...form, promoCode: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Footer</Label>
                <Input placeholder="oppa-seoul.nl" value={form.footer} onChange={(e) => setForm({ ...form, footer: e.target.value })} />
              </div>
            </div>

            {/* Live preview */}
            <div className="flex flex-col">
              <Label className="text-xs mb-2">Live preview</Label>
              <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg p-4">
                <div className="w-full max-w-[240px]">
                  <DesignPreview design={livePreview} scale={0.5} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); setEditId(null); resetForm(); }}>Annuleren</Button>
            <Button onClick={handleCreate} disabled={!form.name || !form.headline}>
              {editId ? "Opslaan" : "Aanmaken"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview / Print Dialog */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div ref={printRef} className="flex justify-center">
              <div className="w-full max-w-md print:max-w-full">
                <DesignPreview design={preview} scale={0.9} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(null)}>Sluiten</Button>
            <Button className="gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Printen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          [data-radix-dialog-content], [data-radix-dialog-content] * { visibility: visible; }
          [data-radix-dialog-content] { position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Promotiemateriaal;
