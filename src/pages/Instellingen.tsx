import { useState } from "react";
import { Bell, Palette, Globe, Shield, CreditCard, ChevronRight, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Instellingen = () => {
  const [profile, setProfile] = useState({ bedrijfsnaam: "", email: "", website: "" });
  const [editProfile, setEditProfile] = useState(false);

  const [notif, setNotif] = useState({ email: true, push: true, weeklyReport: false, campagneAlerts: true });

  const [branding, setBranding] = useState({ primaryColor: "#E8A0BF", logoUrl: "", slogan: "" });
  const [editBrand, setEditBrand] = useState(false);

  const [channels, setChannels] = useState({ instagram: "", tiktok: "", facebook: "", youtube: "" });
  const [editChannels, setEditChannels] = useState(false);

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">Instellingen</h1>
        <p className="text-muted-foreground mt-1">Beheer je account en platform instellingen.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profiel */}
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Bedrijfsprofiel</h3>
            <Button size="sm" variant="ghost" onClick={() => {
              if (editProfile) { toast({ title: "Profiel opgeslagen" }); }
              setEditProfile(!editProfile);
            }}>
              {editProfile ? <><Check className="w-3 h-3 mr-1" />Opslaan</> : <><Pencil className="w-3 h-3 mr-1" />Bewerken</>}
            </Button>
          </div>
          <div className="space-y-3">
            <div><Label>Bedrijfsnaam</Label><Input disabled={!editProfile} placeholder="Oppa Seoul" value={profile.bedrijfsnaam} onChange={e => setProfile({ ...profile, bedrijfsnaam: e.target.value })} /></div>
            <div><Label>E-mail</Label><Input disabled={!editProfile} placeholder="info@oppaseoul.nl" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
            <div><Label>Website</Label><Input disabled={!editProfile} placeholder="https://oppaseoul.nl" value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} /></div>
          </div>
        </div>

        {/* Notificaties */}
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Notificaties</h3>
          </div>
          <div className="space-y-4">
            {([
              { key: "email" as const, label: "E-mail notificaties", desc: "Ontvang meldingen per e-mail" },
              { key: "push" as const, label: "Push notificaties", desc: "Browser push meldingen" },
              { key: "weeklyReport" as const, label: "Wekelijks rapport", desc: "Automatisch wekelijks overzicht" },
              { key: "campagneAlerts" as const, label: "Campagne alerts", desc: "Meldingen bij campagne wijzigingen" },
            ]).map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch checked={notif[item.key]} onCheckedChange={v => { setNotif({ ...notif, [item.key]: v }); toast({ title: `${item.label} ${v ? "aan" : "uit"}gezet` }); }} />
              </div>
            ))}
          </div>
        </div>

        {/* Branding */}
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Branding</h3>
            </div>
            <Button size="sm" variant="ghost" onClick={() => {
              if (editBrand) toast({ title: "Branding opgeslagen" });
              setEditBrand(!editBrand);
            }}>
              {editBrand ? <><Check className="w-3 h-3 mr-1" />Opslaan</> : <><Pencil className="w-3 h-3 mr-1" />Bewerken</>}
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="w-28">Hoofdkleur</Label>
              <input type="color" disabled={!editBrand} value={branding.primaryColor} onChange={e => setBranding({ ...branding, primaryColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
              <span className="text-sm text-muted-foreground">{branding.primaryColor}</span>
            </div>
            <div><Label>Logo URL</Label><Input disabled={!editBrand} placeholder="https://..." value={branding.logoUrl} onChange={e => setBranding({ ...branding, logoUrl: e.target.value })} /></div>
            <div><Label>Slogan</Label><Input disabled={!editBrand} placeholder="Bijv. K-Beauty voor iedereen" value={branding.slogan} onChange={e => setBranding({ ...branding, slogan: e.target.value })} /></div>
          </div>
        </div>

        {/* Kanalen */}
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Social Media Kanalen</h3>
            </div>
            <Button size="sm" variant="ghost" onClick={() => {
              if (editChannels) toast({ title: "Kanalen opgeslagen" });
              setEditChannels(!editChannels);
            }}>
              {editChannels ? <><Check className="w-3 h-3 mr-1" />Opslaan</> : <><Pencil className="w-3 h-3 mr-1" />Bewerken</>}
            </Button>
          </div>
          <div className="space-y-3">
            <div><Label>Instagram</Label><Input disabled={!editChannels} placeholder="@oppaseoul" value={channels.instagram} onChange={e => setChannels({ ...channels, instagram: e.target.value })} /></div>
            <div><Label>TikTok</Label><Input disabled={!editChannels} placeholder="@oppaseoul" value={channels.tiktok} onChange={e => setChannels({ ...channels, tiktok: e.target.value })} /></div>
            <div><Label>Facebook</Label><Input disabled={!editChannels} placeholder="facebook.com/oppaseoul" value={channels.facebook} onChange={e => setChannels({ ...channels, facebook: e.target.value })} /></div>
            <div><Label>YouTube</Label><Input disabled={!editChannels} placeholder="youtube.com/@oppaseoul" value={channels.youtube} onChange={e => setChannels({ ...channels, youtube: e.target.value })} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instellingen;
