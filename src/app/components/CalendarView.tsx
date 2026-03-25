import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
  Users,
  X,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: "task" | "deadline" | "meeting" | "milestone";
  color: string;
  assignee?: string;
  project?: string;
}

const mockEvents: CalendarEvent[] = [
  { id: "e1", title: "Review Assets Q1", date: "2026-03-09", time: "10:00", type: "task", color: "bg-blue-500", assignee: "Sarah J.", project: "Campanha Q1" },
  { id: "e2", title: "Reunião de Sprint", date: "2026-03-09", time: "14:00", type: "meeting", color: "bg-emerald-500", assignee: "Time", project: "Redesign" },
  { id: "e3", title: "Prazo: Vídeo Demo", date: "2026-03-10", type: "deadline", color: "bg-red-500", assignee: "Emma D.", project: "Campanha Q1" },
  { id: "e4", title: "Entregar Guidelines", date: "2026-03-11", time: "16:00", type: "task", color: "bg-purple-500", assignee: "Mike C.", project: "Redesign" },
  { id: "e5", title: "Deploy App Mobile", date: "2026-03-12", type: "milestone", color: "bg-amber-500", assignee: "Time", project: "App Mobile" },
  { id: "e6", title: "Review de Copy", date: "2026-03-13", time: "11:00", type: "task", color: "bg-blue-500", assignee: "Alex M.", project: "Campanha Q1" },
  { id: "e7", title: "Planejamento Q2", date: "2026-03-16", time: "09:00", type: "meeting", color: "bg-emerald-500", project: "Geral" },
  { id: "e8", title: "Prazo: Landing Page", date: "2026-03-18", type: "deadline", color: "bg-red-500", assignee: "Tom W.", project: "Redesign" },
  { id: "e9", title: "Apresentação Stakeholders", date: "2026-03-20", time: "15:00", type: "meeting", color: "bg-emerald-500", project: "Campanha Q1" },
  { id: "e10", title: "Finalizar Design System", date: "2026-03-22", type: "milestone", color: "bg-amber-500", assignee: "Lisa P.", project: "Redesign" },
  { id: "e11", title: "Teste A/B Email", date: "2026-03-25", time: "10:00", type: "task", color: "bg-blue-500", assignee: "Sarah J.", project: "Campanha Q1" },
  { id: "e12", title: "Prazo: Campanha Q1", date: "2026-03-28", type: "deadline", color: "bg-red-500", project: "Campanha Q1" },
];

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const typeConfig: Record<string, { label: string; icon: typeof Clock; textColor: string }> = {
  task: { label: "Tarefa", icon: CheckCircle2, textColor: "text-blue-600 dark:text-blue-400" },
  deadline: { label: "Prazo", icon: AlertTriangle, textColor: "text-red-600 dark:text-red-400" },
  meeting: { label: "Reunião", icon: Users, textColor: "text-emerald-600 dark:text-emerald-400" },
  milestone: { label: "Marco", icon: CalendarIcon, textColor: "text-amber-600 dark:text-amber-400" },
};

export function CalendarView() {
  const today = new Date(2026, 2, 9); // March 9, 2026
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: { day: number; month: "prev" | "current" | "next"; dateStr: string }[] = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({ day, month: "prev", dateStr: `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}` });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: "current",
        dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      });
    }

    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const m = currentMonth + 2 > 12 ? 1 : currentMonth + 2;
      const y = currentMonth + 2 > 12 ? currentYear + 1 : currentYear;
      days.push({ day: i, month: "next", dateStr: `${y}-${String(m).padStart(2, "0")}-${String(i).padStart(2, "0")}` });
    }

    return days;
  }, [currentMonth, currentYear, daysInMonth, firstDayOfMonth, prevMonthDays]);

  const getEventsForDate = (dateStr: string) =>
    mockEvents.filter((e) => e.date === dateStr && (filterType === "all" || e.type === filterType));

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const upcomingEvents = mockEvents
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const navigateMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendário</h1>
          <p className="text-muted-foreground">
            Visualize prazos, reuniões e marcos do projeto
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["all", "task", "deadline", "meeting", "milestone"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filterType === t
                  ? "bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {t === "all" ? "Todos" : typeConfig[t]?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-3 bg-card border border-border rounded-2xl p-5">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {MONTHS_PT[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateMonth(-1)}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <button
                onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); }}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-[#7B61FF]/10 text-[#7B61FF] hover:bg-[#7B61FF]/20 transition-colors"
              >
                Hoje
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateMonth(1)}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_PT.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, i) => {
              const events = getEventsForDate(item.dateStr);
              const isToday = item.dateStr === todayStr;
              const isSelected = item.dateStr === selectedDate;
              const isCurrentMonth = item.month === "current";

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDate(item.dateStr === selectedDate ? null : item.dateStr)}
                  className={`relative min-h-[80px] p-1.5 rounded-xl border transition-all text-left align-top ${
                    isSelected
                      ? "border-[#7B61FF] bg-[#7B61FF]/5 ring-1 ring-[#7B61FF]/20"
                      : isToday
                      ? "border-[#7B61FF]/40 bg-[#7B61FF]/5"
                      : "border-transparent hover:border-border hover:bg-muted/20"
                  } ${!isCurrentMonth ? "opacity-40" : ""}`}
                >
                  <span className={`text-xs font-medium ${
                    isToday
                      ? "bg-[#7B61FF] text-white w-6 h-6 rounded-full flex items-center justify-center"
                      : ""
                  }`}>
                    {item.day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-[9px] px-1 py-0.5 rounded ${event.color} text-white truncate`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[9px] text-muted-foreground px-1">
                        +{events.length - 2} mais
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Upcoming & Selected */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", {
                      day: "numeric", month: "long",
                    })}
                  </h3>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-6 h-6 rounded-lg hover:bg-accent flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Nenhum evento neste dia
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event) => {
                      const config = typeConfig[event.type];
                      const Icon = config.icon;
                      return (
                        <div key={event.id} className="p-3 rounded-xl bg-muted/30 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${event.color}`} />
                            <span className="text-sm font-medium">{event.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className={`flex items-center gap-1 ${config.textColor}`}>
                              <Icon className="w-3 h-3" />
                              {config.label}
                            </span>
                            {event.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </span>
                            )}
                          </div>
                          {event.project && (
                            <p className="text-[10px] text-muted-foreground">{event.project}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upcoming Events */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#7B61FF]" />
              Próximos Eventos
            </h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => {
                const config = typeConfig[event.type];
                const Icon = config.icon;
                const eventDate = new Date(event.date + "T12:00:00");
                return (
                  <motion.div
                    key={event.id}
                    whileHover={{ x: 2 }}
                    onClick={() => setSelectedDate(event.date)}
                    className="p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${event.color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">
                            {eventDate.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                          </span>
                          {event.time && (
                            <span className="text-[10px] text-muted-foreground">{event.time}</span>
                          )}
                          <span className={`text-[10px] ${config.textColor}`}>{config.label}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3">Legenda</h3>
            <div className="space-y-2">
              {Object.entries(typeConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <Icon className={`w-3.5 h-3.5 ${config.textColor}`} />
                    <span>{config.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
