import { useState } from "react";
import { BarChart3, TrendingUp, Eye, Heart, ShoppingBag, ArrowUpRight, ArrowDownRight, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Metric {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

interface Channel {
  channel: string;
  impressions: string;
  engagement: string;
  conversions: string;
  revenue: string;
}

const Analytics = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [metricOpen, setMetricOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [mForm, setMForm] = useState({ label: "", value: "", change: "", up: true });
  const [cForm, setCForm] = useState({ channel: "", impressions: "", engagement: "", conversions: "", revenue: "" });

  const saveMetric = () => {
    if (!mForm.label || !mForm.value) return;
    const item: Metric = { ...mForm };
    if (editIdx >= 0) setMetrics(s => s.map((x, i) => i === editIdx ? item : x));
    else setMetrics(s => [...s, item]);
    setMForm({ label: "", value: "", change: "", up: true });
    setEditIdx(-1);
    setMetricOpen(false);
    toast({ title: editIdx >= 0 ? "Metric bijgewerkt" : "Metric toegevoegd" });
  };

  const saveChannel = () => {
    if (!cForm.channel) return;
    if (editIdx >= 0) setChannels(s => s.map((x, i) => i === editIdx ? { ...cForm } : x));
    else setChannels(s => [...s, { ...cForm }]);
    setCForm({ channel: "", impressions: "", engagement: "", conversions: "", revenue: "" });
    setEditIdx(-1);
    setChannelOpen(false);
    toast({ title: editIdx >= 0 ? "Kanaal bijgewerkt" : "Kanaal toegevoegd" });
  };

  const iconForIdx = (i: number) => [Eye, Heart, ShoppingBag, TrendingUp][i % 4];

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Inzichten en prestaties van je marketing kanalen.</p>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground text-sm">KPI's</h3>
        <Dialog open={metricOpen} onOpenChange={o => { setMetricOpen(o); if (!o) { setEditIdx(-1); setMForm({ label: "", value: "", change: "", up: true }); } }}>
          <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="w-3 h-3 mr-1" />Toevoegen</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editIdx >= 0 ? "KPI bewerken" : "Nieuwe KPI"}</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div><Label>Label</Label><Input placeholder="Bijv. Totaal Impressies" value={mForm.label} onChange={e => setMForm({ ...mForm, label: e.target.value })} /></div>
              <div><Label>Waarde</Label><Input placeholder="Bijv. 12.4M" value={mForm.value} onChange={e => setMForm({ ...mForm, value: e.target.value })} /></div>
              <div><Label>Verandering</Label><Input placeholder="Bijv. +18.3%" value={mForm.change} onChange={e => setMForm({ ...mForm, change: e.target.value })} /></div>
              <div className="flex items-center gap-2">
                <Label>Stijgend?</Label>
                <input type="checkbox" checked={mForm.up} onChange={e => setMForm({ ...mForm, up: e.target.checked })} />
              </div>
              <Button onClick={saveMetric} className="w-full">{editIdx >= 0 ? "Opslaan" : "Toevoegen"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {metrics.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {metrics.map((m, i) => {
            const Icon = iconForIdx(i);
            return (
              <div key={i} className="glass-card rounded-xl p-5 animate-fade-in group relative" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <button onClick={() => { setMForm(m); setEditIdx(i); setMetricOpen(true); }} className="p-1 rounded hover:bg-secondary"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                  <button onClick={() => { setMetrics(s => s.filter((_, j) => j !== i)); toast({ title: "Verwijderd" }); }} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive" /></button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${m.up ? "text-sage" : "text-destructive"}`}>
                    {m.change} {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-8 mb-8 text-center text-muted-foreground text-sm">
          Nog geen KPI's — voeg je eerste metric toe.
        </div>
      )}

      {/* Channel table */}
      <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground">Kanaal Prestaties</h3>
          <Dialog open={channelOpen} onOpenChange={o => { setChannelOpen(o); if (!o) { setEditIdx(-1); setCForm({ channel: "", impressions: "", engagement: "", conversions: "", revenue: "" }); } }}>
            <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="w-3 h-3 mr-1" />Toevoegen</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editIdx >= 0 ? "Kanaal bewerken" : "Nieuw Kanaal"}</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div><Label>Kanaal</Label><Input placeholder="Bijv. Instagram" value={cForm.channel} onChange={e => setCForm({ ...cForm, channel: e.target.value })} /></div>
                <div><Label>Impressies</Label><Input placeholder="Bijv. 5.2M" value={cForm.impressions} onChange={e => setCForm({ ...cForm, impressions: e.target.value })} /></div>
                <div><Label>Engagement</Label><Input placeholder="Bijv. 5.1%" value={cForm.engagement} onChange={e => setCForm({ ...cForm, engagement: e.target.value })} /></div>
                <div><Label>Conversies</Label><Input placeholder="Bijv. 4.8K" value={cForm.conversions} onChange={e => setCForm({ ...cForm, conversions: e.target.value })} /></div>
                <div><Label>Omzet</Label><Input placeholder="Bijv. €18.4K" value={cForm.revenue} onChange={e => setCForm({ ...cForm, revenue: e.target.value })} /></div>
                <Button onClick={saveChannel} className="w-full">{editIdx >= 0 ? "Opslaan" : "Toevoegen"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {channels.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Kanaal</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Impressies</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Engagement</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Conversies</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Omzet</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {channels.map((c, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors group">
                    <td className="py-3 px-2 font-medium text-foreground">{c.channel}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{c.impressions}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{c.engagement}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{c.conversions}</td>
                    <td className="py-3 px-2 text-right font-medium text-foreground">{c.revenue}</td>
                    <td className="py-3 px-2">
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 justify-end transition-opacity">
                        <button onClick={() => { setCForm(c); setEditIdx(i); setChannelOpen(true); }} className="p-1 rounded hover:bg-secondary"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                        <button onClick={() => { setChannels(s => s.filter((_, j) => j !== i)); toast({ title: "Verwijderd" }); }} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">Nog geen kanaaldata — voeg je eerste kanaal toe.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
