import { Settings, Bell, Palette, Globe, Shield, CreditCard } from "lucide-react";

const sections = [
  { icon: Bell, title: "Notificaties", desc: "Beheer je e-mail en push notificatie voorkeuren." },
  { icon: Palette, title: "Branding", desc: "Pas je merkkleuren, logo en huisstijl aan." },
  { icon: Globe, title: "Kanalen", desc: "Verbind en beheer je social media accounts." },
  { icon: Shield, title: "Privacy & Beveiliging", desc: "Wachtwoord, 2FA en data-instellingen." },
  { icon: CreditCard, title: "Abonnement", desc: "Bekijk je huidige plan en factuurgeschiedenis." },
];

const Instellingen = () => (
  <div className="flex-1 p-8 overflow-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-display font-semibold text-foreground">Instellingen</h1>
      <p className="text-muted-foreground mt-1">Beheer je account en platform instellingen.</p>
    </div>

    <div className="grid gap-4 max-w-2xl">
      {sections.map((s, i) => (
        <div key={s.title} className="glass-card rounded-xl p-5 flex items-center gap-4 animate-fade-in hover:shadow-md transition-shadow cursor-pointer" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="w-10 h-10 rounded-lg bg-rose-light flex items-center justify-center shrink-0">
            <s.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{s.title}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Instellingen;
