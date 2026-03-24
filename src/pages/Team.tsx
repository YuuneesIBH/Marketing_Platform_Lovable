import { Users, Mail, Plus } from "lucide-react";

const team = [
  { name: "Ji-Soo Kim", role: "Marketing Lead", email: "jisoo@oppaseoul.nl", initials: "JS", color: "bg-primary" },
  { name: "Mila de Vries", role: "Content Creator", email: "mila@oppaseoul.nl", initials: "MV", color: "bg-sage" },
  { name: "Thomas Berg", role: "Performance Marketing", email: "thomas@oppaseoul.nl", initials: "TB", color: "bg-charcoal" },
  { name: "Seo-Yeon Park", role: "Social Media Manager", email: "seoyeon@oppaseoul.nl", initials: "SP", color: "bg-primary" },
  { name: "Lucas Jansen", role: "Graphic Designer", email: "lucas@oppaseoul.nl", initials: "LJ", color: "bg-sage" },
  { name: "Emma Bakker", role: "Influencer Relations", email: "emma@oppaseoul.nl", initials: "EB", color: "bg-accent" },
];

const Team = () => (
  <div className="flex-1 p-8 overflow-auto">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-foreground">Team</h1>
        <p className="text-muted-foreground mt-1">Je marketing team overzicht.</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        <Plus className="w-4 h-4" /> Lid toevoegen
      </button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      {team.map((m, i) => (
        <div key={m.name} className="glass-card rounded-xl p-6 animate-fade-in hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${m.color} flex items-center justify-center text-primary-foreground text-sm font-semibold`}>
              {m.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" /> {m.email}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Team;
