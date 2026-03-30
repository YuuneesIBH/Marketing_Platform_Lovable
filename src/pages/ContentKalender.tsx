import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, X, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  time: string;
  date: string; // YYYY-MM-DD
  color: string;
}

const platformColors: Record<string, string> = {
  Instagram: "bg-primary/20 text-primary",
  TikTok: "bg-rose-light text-primary",
  YouTube: "bg-sage/30 text-foreground",
  Website: "bg-accent text-accent-foreground",
  Email: "bg-secondary text-secondary-foreground",
  Studio: "bg-accent text-accent-foreground",
  Kantoor: "bg-sage/30 text-foreground",
  Anders: "bg-muted text-muted-foreground",
};

const initialEvents: CalendarEvent[] = [];

const dayNames = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const monthNames = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

const ContentKalender = () => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2); // March = 2
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", platform: "", time: "10:00" });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    events.forEach(e => {
      const d = new Date(e.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(e);
      }
    });
    return map;
  }, [events, year, month]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const handleSave = () => {
    if (!form.title || !form.platform || selectedDay === null) {
      toast({ title: "Vul alle velden in", variant: "destructive" });
      return;
    }
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    if (editId) {
      setEvents(events.map(e => e.id === editId ? {
        ...e,
        title: form.title,
        platform: form.platform,
        time: form.time,
        date: dateStr,
        color: platformColors[form.platform] || platformColors.Anders,
      } : e));
      toast({ title: "Event bijgewerkt", description: `"${form.title}" is opgeslagen.` });
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: form.title,
        platform: form.platform,
        time: form.time,
        date: dateStr,
        color: platformColors[form.platform] || platformColors.Anders,
      };
      setEvents([...events, newEvent]);
      toast({ title: "Event toegevoegd", description: `"${form.title}" op ${selectedDay} ${monthNames[month]}.` });
    }
    setForm({ title: "", platform: "", time: "10:00" });
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (e: CalendarEvent) => {
    const d = new Date(e.date);
    setSelectedDay(d.getDate());
    setForm({ title: e.title, platform: e.platform, time: e.time });
    setEditId(e.id);
    setOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    const ev = events.find(e => e.id === id);
    setEvents(events.filter(e => e.id !== id));
    if (ev) toast({ title: "Event verwijderd", description: `"${ev.title}" is verwijderd.` });
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setOpen(true);
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Content Kalender</h1>
          <p className="text-muted-foreground mt-1">Plan en beheer je social media content.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-foreground min-w-[150px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay !== null && eventsByDay[selectedDay]?.length > 0 && (
        <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground">
              {selectedDay} {monthNames[month]} — Events
            </h3>
            <button onClick={() => setSelectedDay(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {eventsByDay[selectedDay].map(e => (
              <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group">
                <div className={`px-2 py-0.5 rounded text-[10px] font-medium ${e.color}`}>{e.platform}</div>
                <p className="text-sm font-medium text-foreground flex-1">{e.title}</p>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time}</span>
                <button onClick={() => handleDeleteEvent(e.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
        <div className="grid grid-cols-7 border-b border-border">
          {dayNames.map(d => (
            <div key={d} className="p-3 text-center text-xs font-semibold text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/30" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && today.getDate() === day;
            const isSelected = selectedDay === day;
            const dayEvents = eventsByDay[day] || [];
            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`min-h-[100px] border-b border-r border-border p-2 cursor-pointer transition-colors hover:bg-secondary/30 ${
                  isToday ? "bg-primary/5 ring-1 ring-primary/30 ring-inset" : ""
                } ${isSelected ? "bg-primary/10" : ""}`}
              >
                <span className={`text-xs font-medium ${isToday ? "text-primary font-semibold" : "text-foreground"}`}>
                  {day}
                </span>
                {dayEvents.slice(0, 3).map(e => (
                  <div key={e.id} className={`mt-1 text-[10px] px-1.5 py-0.5 rounded ${e.color} truncate`}>
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <p className="mt-0.5 text-[9px] text-muted-foreground">+{dayEvents.length - 3} meer</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create event dialog */}
      <Dialog open={open && selectedDay !== null} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedDay(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">
              Event toevoegen — {selectedDay} {monthNames[month]}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {selectedDay !== null && eventsByDay[selectedDay]?.length > 0 && (
              <div className="space-y-1 pb-3 border-b border-border">
                <p className="text-xs text-muted-foreground font-medium mb-2">Bestaande events:</p>
                {eventsByDay[selectedDay].map(e => (
                  <div key={e.id} className="flex items-center gap-2 group">
                    <div className={`px-1.5 py-0.5 rounded text-[10px] ${e.color}`}>{e.platform}</div>
                    <span className="text-xs text-foreground flex-1">{e.title}</span>
                    <span className="text-[10px] text-muted-foreground">{e.time}</span>
                    <button onClick={() => handleDeleteEvent(e.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div>
              <Label>Titel</Label>
              <Input placeholder="Bijv. Product review reel" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                <SelectTrigger><SelectValue placeholder="Kies platform" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Anders">Anders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tijd</Label>
              <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
            <Button onClick={handleSave} className="w-full">
              <Plus className="w-4 h-4" /> {editId ? "Opslaan" : "Event toevoegen"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentKalender;
