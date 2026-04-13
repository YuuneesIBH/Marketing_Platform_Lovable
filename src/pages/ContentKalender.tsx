import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { usePersistedState } from "@/lib/api";
import type { CalendarEvent } from "@/lib/app-types";

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

const today = new Date();

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const ContentKalender = () => {
  const { t, locale } = useLanguage();
  const { value: events, setValue: setEvents, loading } = usePersistedState<CalendarEvent[]>("calendar", []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", platform: "", time: "10:00" });

  const dayNames = locale === "nl" ? ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthNames =
    locale === "nl"
      ? ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"]
      : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    events.forEach((event) => {
      const date = new Date(event.date);
      if (date.getFullYear() === year && date.getMonth() === month) {
        const day = date.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(event);
      }
    });
    return map;
  }, [events, year, month]);

  const resetForm = () => {
    setEditId(null);
    setForm({ title: "", platform: "", time: "10:00" });
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.platform || selectedDay === null) {
      toast({ title: t("calendar.fillFields"), variant: "destructive" });
      return;
    }

    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const color = platformColors[form.platform] ?? platformColors.Anders;

    if (editId) {
      await setEvents((prev) =>
        prev.map((event) =>
          event.id === editId ? { ...event, title: form.title, platform: form.platform, time: form.time, date, color } : event,
        ),
      );
      toast({ title: t("calendar.eventUpdated") });
    } else {
      await setEvents((prev) => [
        ...prev,
        {
          id: `event-${Date.now()}`,
          title: form.title,
          platform: form.platform,
          time: form.time,
          date,
          color,
        },
      ]);
      toast({ title: t("calendar.eventAdded") });
    }

    resetForm();
    setOpen(false);
  };

  const handleDeleteEvent = async (id: string) => {
    await setEvents((prev) => prev.filter((event) => event.id !== id));
    toast({ title: t("calendar.eventDeleted") });
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    resetForm();
    setOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">{t("calendar.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("calendar.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-52 text-center text-lg font-semibold text-foreground">
            {monthNames[month]} {year}
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button className="gap-1.5" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> {t("calendar.addEvent")}
          </Button>
        </div>
      </div>

      {loading && events.length === 0 && (
        <div className="glass-card mb-4 rounded-xl p-4 text-sm text-muted-foreground">
          Kalender wordt geladen...
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-7 border-b border-border">
          {dayNames.map((dayName) => (
            <div key={dayName} className="bg-muted/40 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {dayName}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[100px] border-b border-r border-border bg-muted/30" />
          ))}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const isToday = isCurrentMonth && today.getDate() === day;
            const isSelected = selectedDay === day;
            const dayEvents = eventsByDay[day] || [];

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`min-h-[100px] cursor-pointer border-b border-r border-border p-2 transition-colors hover:bg-secondary/30 ${
                  isToday ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : ""
                } ${isSelected ? "bg-primary/10" : ""}`}
              >
                <span className={`text-xs font-medium ${isToday ? "font-semibold text-primary" : "text-foreground"}`}>{day}</span>
                {dayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className={`mt-1 truncate rounded px-1.5 py-0.5 text-[10px] ${event.color}`}>
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <p className="mt-0.5 text-[9px] text-muted-foreground">+{dayEvents.length - 3} {t("calendar.more")}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">
              {editId ? t("calendar.editEvent") : `${t("calendar.addEvent")} - ${selectedDay ?? today.getDate()} ${monthNames[month]}`}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            {selectedDay !== null && eventsByDay[selectedDay]?.length > 0 && (
              <div className="space-y-1 border-b border-border pb-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">{t("calendar.existingEvents")}</p>
                {eventsByDay[selectedDay].map((event) => (
                  <div key={event.id} className="group flex items-center gap-2">
                    <div className={`rounded px-1.5 py-0.5 text-[10px] ${event.color}`}>{event.platform}</div>
                    <span className="flex-1 text-xs text-foreground">{event.title}</span>
                    <span className="text-[10px] text-muted-foreground">{event.time}</span>
                    <button
                      onClick={() => void handleDeleteEvent(event.id)}
                      className="text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div>
              <Label>{t("calendar.eventTitle")}</Label>
              <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <div>
              <Label>{t("contacts.platform")}</Label>
              <Select value={form.platform} onValueChange={(value) => setForm({ ...form, platform: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.choosePlatform")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(platformColors).map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("calendar.time")}</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />
              </div>
            </div>
            <Button onClick={() => void handleSave()} className="w-full">
              {editId ? t("common.save") : t("common.add")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentKalender;
