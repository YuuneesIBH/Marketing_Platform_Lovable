import { Calendar, ChevronLeft, ChevronRight, Clock, Instagram, Youtube } from "lucide-react";

const days = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const currentMonth = "Maart 2026";

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const events: Record<number, { title: string; platform: string; time: string; color: string }[]> = {
  3: [{ title: "Serum tutorial reel", platform: "Instagram", time: "10:00", color: "bg-primary/20 text-primary" }],
  7: [{ title: "Routine video", platform: "YouTube", time: "14:00", color: "bg-sage/30 text-foreground" }],
  10: [{ title: "Sheet mask promo", platform: "Instagram", time: "09:00", color: "bg-primary/20 text-primary" }],
  12: [{ title: "Blog: K-beauty trends", platform: "Website", time: "12:00", color: "bg-accent text-accent-foreground" }],
  15: [{ title: "Influencer takeover", platform: "TikTok", time: "18:00", color: "bg-rose-light text-primary" }],
  18: [{ title: "Product launch post", platform: "Instagram", time: "11:00", color: "bg-primary/20 text-primary" }],
  21: [{ title: "Newsletter Q2", platform: "Email", time: "09:00", color: "bg-secondary text-secondary-foreground" }],
  25: [{ title: "Productfoto shoot", platform: "Studio", time: "10:00", color: "bg-accent text-accent-foreground" }],
  27: [{ title: "Influencer meeting", platform: "Kantoor", time: "11:00", color: "bg-sage/30 text-foreground" }],
};

const ContentKalender = () => (
  <div className="flex-1 p-8 overflow-auto">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-foreground">Content Kalender</h1>
        <p className="text-muted-foreground mt-1">Plan en beheer je social media content.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-sm font-semibold text-foreground min-w-[120px] text-center">{currentMonth}</span>
        <button className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>

    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <div className="grid grid-cols-7 border-b border-border">
        {days.map(d => (
          <div key={d} className="p-3 text-center text-xs font-semibold text-muted-foreground">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {/* offset for March 2026 starting on Sunday → 6 empty cells */}
        {Array.from({ length: 6 }, (_, i) => <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-border bg-muted/30" />)}
        {calendarDays.map(day => (
          <div key={day} className={`min-h-[100px] border-b border-r border-border p-2 hover:bg-secondary/30 transition-colors ${day === 24 ? "bg-primary/5 ring-1 ring-primary/30 ring-inset" : ""}`}>
            <span className={`text-xs font-medium ${day === 24 ? "text-primary font-semibold" : "text-foreground"}`}>{day}</span>
            {events[day]?.map(e => (
              <div key={e.title} className={`mt-1 text-[10px] px-1.5 py-0.5 rounded ${e.color} truncate`}>
                {e.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ContentKalender;
