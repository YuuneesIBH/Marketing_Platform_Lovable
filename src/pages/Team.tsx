import { useState } from "react";
import { Mail, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface TeamMember {
  name: string;
  role: string;
  email: string;
  initials: string;
  color: string;
}

const colors = ["bg-primary", "bg-sage", "bg-charcoal", "bg-accent"];

const initialTeam: TeamMember[] = [];

const Team = () => {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", email: "" });

  const handleCreate = () => {
    if (!form.name || !form.role || !form.email) {
      toast({ title: "Vul alle velden in", variant: "destructive" });
      return;
    }
    const parts = form.name.trim().split(" ");
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : form.name.slice(0, 2).toUpperCase();

    const newMember: TeamMember = {
      name: form.name,
      role: form.role,
      email: form.email,
      initials,
      color: colors[team.length % colors.length],
    };
    setTeam([...team, newMember]);
    setForm({ name: "", role: "", email: "" });
    setOpen(false);
    toast({ title: "Teamlid toegevoegd", description: `${form.name} is aan het team toegevoegd.` });
  };

  const handleDelete = (index: number) => {
    const name = team[index].name;
    setTeam(team.filter((_, i) => i !== index));
    toast({ title: "Teamlid verwijderd", description: `${name} is verwijderd.` });
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-1">Je marketing team overzicht.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" /> Lid toevoegen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Nieuw Teamlid</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Naam</Label>
                <Input placeholder="Bijv. Anna de Jong" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Rol</Label>
                <Input placeholder="Bijv. Content Creator" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input type="email" placeholder="anna@oppaseoul.nl" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <Button onClick={handleCreate} className="w-full">Toevoegen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {team.map((m, i) => (
          <div key={`${m.name}-${i}`} className="glass-card rounded-xl p-6 animate-fade-in group relative" style={{ animationDelay: `${i * 80}ms` }}>
            <button
              onClick={() => handleDelete(i)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>
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
};

export default Team;
