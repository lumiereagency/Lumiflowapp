import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import {
  Sparkles, Brain, Zap, Target, TrendingUp, Clock, CheckCircle2,
  Calendar, Bell, AlertTriangle, ArrowUp, ArrowRight, ArrowDown,
  ChevronLeft, ChevronRight, Plus, X, Check, Flame, Eye,
  BarChart3, Timer, Lightbulb, Rocket, RefreshCw, ExternalLink,
  Settings2, Volume2, VolumeX, Play, Pause, Sun, Moon, Coffee,
  Sunset, Star, Trophy, Repeat, ChevronDown, Send, GripVertical,
  CalendarCheck, BellRing, Link2, Unlink, Layers, MessageSquare,
  FolderKanban, Award, Crown, Gem, Shield, Swords, Gift, Hash,
  TrendingDown, Activity, Wand2, Bot, Sparkle, Gauge, Puzzle,
  CircleDot, RotateCcw, FileText, Users, Workflow,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area, LineChart, Line, RadialBarChart,
  RadialBar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { toast } from "sonner";

interface ProductivityHubProps {
  onNavigate: (section: string) => void;
  onOpenAI?: () => void;
}

/* ═══════════════════════ DATA ═══════════════════════ */

type DayOfWeek = "Seg" | "Ter" | "Qua" | "Qui" | "Sex";

interface TimeBlock {
  id: string;
  title: string;
  start: string;
  end: string;
  type: "deep_work" | "meeting" | "review" | "break" | "admin";
  project?: string;
  completed: boolean;
}

interface AISuggestion {
  id: string;
  title: string;
  reason: string;
  priority: "urgent" | "high" | "medium" | "low";
  estimatedTime: string;
  project: string;
  type: "task" | "follow_up" | "improvement" | "automation";
  accepted: boolean;
}

interface SmartAlert {
  id: string;
  title: string;
  description: string;
  type: "deadline" | "bottleneck" | "overdue" | "suggestion" | "milestone";
  severity: "critical" | "warning" | "info" | "success";
  time: string;
  dismissed: boolean;
  actionLabel?: string;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  date: string;
  recurring: boolean;
  enabled: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  source: "google" | "lumiflow";
  color: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: "focus" | "tasks" | "streak" | "quality";
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  locked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const weeklyPlan: Record<DayOfWeek, TimeBlock[]> = {
  Seg: [
    { id: "b1", title: "Sprint Planning", start: "09:00", end: "10:00", type: "meeting", project: "Campanha Q1", completed: true },
    { id: "b2", title: "Design Assets", start: "10:30", end: "12:30", type: "deep_work", project: "Campanha Q1", completed: true },
    { id: "b3", title: "Almoco", start: "12:30", end: "13:30", type: "break", completed: true },
    { id: "b4", title: "Review Video Demo", start: "14:00", end: "15:30", type: "review", project: "Produto", completed: false },
    { id: "b5", title: "Emails & Admin", start: "16:00", end: "17:00", type: "admin", completed: false },
  ],
  Ter: [
    { id: "b6", title: "Deep Work: Guidelines", start: "09:00", end: "11:30", type: "deep_work", project: "Branding", completed: false },
    { id: "b7", title: "1:1 com Sarah", start: "11:30", end: "12:00", type: "meeting", completed: false },
    { id: "b8", title: "Almoco", start: "12:00", end: "13:00", type: "break", completed: false },
    { id: "b9", title: "Copy Redes Sociais", start: "13:30", end: "15:30", type: "deep_work", project: "Marketing", completed: false },
    { id: "b10", title: "Code Review", start: "16:00", end: "17:00", type: "review", project: "Tech", completed: false },
  ],
  Qua: [
    { id: "b11", title: "Standup Semanal", start: "09:00", end: "09:30", type: "meeting", completed: false },
    { id: "b12", title: "Pesquisa de Mercado", start: "09:30", end: "12:00", type: "deep_work", project: "Estrategia", completed: false },
    { id: "b13", title: "Almoco", start: "12:00", end: "13:00", type: "break", completed: false },
    { id: "b14", title: "Design Campanha Email", start: "13:30", end: "16:00", type: "deep_work", project: "Marketing", completed: false },
    { id: "b15", title: "Retrospectiva", start: "16:30", end: "17:30", type: "meeting", completed: false },
  ],
  Qui: [
    { id: "b16", title: "Graficos Blog", start: "09:00", end: "11:00", type: "deep_work", project: "Conteudo", completed: false },
    { id: "b17", title: "Review Landing Page", start: "11:00", end: "12:00", type: "review", project: "Design", completed: false },
    { id: "b18", title: "Almoco", start: "12:00", end: "13:00", type: "break", completed: false },
    { id: "b19", title: "Workshop Criativo", start: "14:00", end: "16:00", type: "meeting", project: "Equipe", completed: false },
    { id: "b20", title: "Planejamento Prox. Semana", start: "16:30", end: "17:30", type: "admin", completed: false },
  ],
  Sex: [
    { id: "b21", title: "Focus: Entregas finais", start: "09:00", end: "12:00", type: "deep_work", project: "Campanha Q1", completed: false },
    { id: "b22", title: "Almoco", start: "12:00", end: "13:00", type: "break", completed: false },
    { id: "b23", title: "Demo Day", start: "14:00", end: "15:00", type: "meeting", project: "Produto", completed: false },
    { id: "b24", title: "Revisao Semanal", start: "15:30", end: "16:30", type: "review", completed: false },
  ],
};

const blockTypeConfig = {
  deep_work: { label: "Foco Profundo", color: "bg-[#7B61FF]", textColor: "text-white", icon: Brain },
  meeting: { label: "Reuniao", color: "bg-blue-500", textColor: "text-white", icon: MessageSquare },
  review: { label: "Revisao", color: "bg-amber-500", textColor: "text-white", icon: Eye },
  break: { label: "Intervalo", color: "bg-emerald-400", textColor: "text-white", icon: Coffee },
  admin: { label: "Administrativo", color: "bg-slate-400", textColor: "text-white", icon: Layers },
};

const initialSuggestions: AISuggestion[] = [
  { id: "sug1", title: "Finalizar legendas do Video Demo", reason: "Prazo em 2 dias e 75% concluido - termine enquanto esta fresco", priority: "urgent", estimatedTime: "1h30", project: "Campanha Q1", type: "task", accepted: false },
  { id: "sug2", title: "Agendar review de Guidelines com time", reason: "Guidelines atualizadas precisam de aprovacao antes da sprint 4", priority: "high", estimatedTime: "30min", project: "Branding", type: "follow_up", accepted: false },
  { id: "sug3", title: "Automatizar notificacoes de prazo", reason: "3 tarefas atrasaram na ultima semana por falta de alerta", priority: "medium", estimatedTime: "20min", project: "Automacoes", type: "automation", accepted: false },
  { id: "sug4", title: "Criar template de posts recorrentes", reason: "Padrao detectado: 3 posts semanais seguem a mesma estrutura", priority: "medium", estimatedTime: "45min", project: "Marketing", type: "improvement", accepted: false },
  { id: "sug5", title: "Documentar processo de review de video", reason: "Time leva em media 2x mais tempo que o esperado nesta etapa", priority: "low", estimatedTime: "1h", project: "Processos", type: "improvement", accepted: false },
  { id: "sug6", title: "Revisar backlog de tarefas antigas", reason: "12 tarefas com mais de 30 dias sem atualizacao detectadas", priority: "medium", estimatedTime: "30min", project: "Organizacao", type: "task", accepted: false },
  { id: "sug7", title: "Configurar automacao de reports", reason: "Voce gera o mesmo report manualmente toda sexta-feira", priority: "high", estimatedTime: "15min", project: "Automacoes", type: "automation", accepted: false },
];

const initialAlerts: SmartAlert[] = [
  { id: "al1", title: "Video Demo vence em 2 dias", description: "Subtarefa 'Legendas' ainda pendente. Considere priorizar.", type: "deadline", severity: "critical", time: "Agora", dismissed: false, actionLabel: "Ver tarefa" },
  { id: "al2", title: "Coluna 'Revisao' sobrecarregada", description: "3 tarefas aguardando revisao ha mais de 2 dias. Bottleneck detectado.", type: "bottleneck", severity: "warning", time: "Ha 1h", dismissed: false, actionLabel: "Ver board" },
  { id: "al3", title: "Copy Redes Sociais atrasado", description: "Prazo era 17/mar. Sem progresso nos ultimos 3 dias.", type: "overdue", severity: "critical", time: "Ha 2h", dismissed: false, actionLabel: "Atribuir" },
  { id: "al4", title: "Velocidade do time aumentou 15%", description: "Comparado a semana passada, o time concluiu mais tarefas por dia.", type: "milestone", severity: "success", time: "Ha 4h", dismissed: false },
  { id: "al5", title: "Considere blocos de foco nas manhas", description: "Analise: suas entregas de maior qualidade acontecem entre 9h-12h.", type: "suggestion", severity: "info", time: "Ha 6h", dismissed: false },
  { id: "al6", title: "Meta semanal de foco 80% atingida", description: "Voce ja completou 16.5h de 20h de foco profundo esta semana.", type: "milestone", severity: "success", time: "Ha 8h", dismissed: false },
];

const initialReminders: Reminder[] = [
  { id: "r1", title: "Verificar progresso da Campanha Q1", time: "09:00", date: "Seg", recurring: true, enabled: true },
  { id: "r2", title: "Enviar report semanal", time: "16:00", date: "Sex", recurring: true, enabled: true },
  { id: "r3", title: "Review de assets com Sarah", time: "14:00", date: "Ter", recurring: false, enabled: true },
  { id: "r4", title: "Check-in com Mike sobre Guidelines", time: "11:00", date: "Qua", recurring: false, enabled: false },
];

const calendarEvents: CalendarEvent[] = [
  { id: "gc1", title: "Sprint Planning", time: "09:00", date: "Seg", source: "google", color: "#4285f4" },
  { id: "gc2", title: "1:1 com Sarah", time: "11:30", date: "Ter", source: "google", color: "#4285f4" },
  { id: "gc3", title: "Standup Semanal", time: "09:00", date: "Qua", source: "google", color: "#34a853" },
  { id: "gc4", title: "Workshop Criativo", time: "14:00", date: "Qui", source: "google", color: "#fbbc05" },
  { id: "gc5", title: "Demo Day", time: "14:00", date: "Sex", source: "google", color: "#ea4335" },
  { id: "lf1", title: "Review Video Demo", time: "14:00", date: "Seg", source: "lumiflow", color: "#7B61FF" },
  { id: "lf2", title: "Prazo: Copy Redes Sociais", time: "17:00", date: "Ter", source: "lumiflow", color: "#B14EFF" },
];

const initialGoals: Goal[] = [
  { id: "g1", title: "Horas de Foco Semanal", description: "Completar 20h de trabalho profundo por semana", target: 20, current: 16.5, unit: "horas", deadline: "Semanal", category: "focus", color: "#7B61FF" },
  { id: "g2", title: "Tarefas Concluidas", description: "Concluir 30 tarefas nesta sprint", target: 30, current: 24, unit: "tarefas", deadline: "Sprint 4", category: "tasks", color: "#10b981" },
  { id: "g3", title: "Streak de Produtividade", description: "Manter 14 dias consecutivos de metas batidas", target: 14, current: 7, unit: "dias", deadline: "Continuo", category: "streak", color: "#f59e0b" },
  { id: "g4", title: "Entregas no Prazo", description: "Manter 95% de entregas dentro do prazo", target: 95, current: 89, unit: "%", deadline: "Mensal", category: "quality", color: "#3b82f6" },
  { id: "g5", title: "Reunioes Otimizadas", description: "Reduzir reunioes para maximo 6h/semana", target: 6, current: 6.5, unit: "horas", deadline: "Semanal", category: "quality", color: "#ec4899" },
];

const initialAchievements: Achievement[] = [
  { id: "ach1", title: "Primeiro Foco", description: "Complete sua primeira sessao de foco profundo", icon: "brain", unlockedAt: "01/mar", locked: false, rarity: "common" },
  { id: "ach2", title: "Streak de 7 Dias", description: "Mantenha 7 dias consecutivos produtivos", icon: "flame", unlockedAt: "08/mar", locked: false, rarity: "rare" },
  { id: "ach3", title: "Mestre do Planejamento", description: "Complete todas as tarefas de um dia por 5 dias", icon: "crown", unlockedAt: "05/mar", locked: false, rarity: "rare" },
  { id: "ach4", title: "Speed Runner", description: "Termine 5 tarefas em um unico dia", icon: "zap", unlockedAt: "07/mar", locked: false, rarity: "common" },
  { id: "ach5", title: "Automacao Ninja", description: "Crie 3 automacoes que economizam tempo", icon: "bot", locked: true, rarity: "epic" },
  { id: "ach6", title: "Streak Lendario", description: "Mantenha 30 dias consecutivos produtivos", icon: "trophy", locked: true, rarity: "legendary" },
  { id: "ach7", title: "Zero Inbox", description: "Resolva todas as notificacoes pendentes", icon: "check", unlockedAt: "03/mar", locked: false, rarity: "common" },
  { id: "ach8", title: "Guru do Time", description: "Ajude 5 colegas a atingir suas metas", icon: "users", locked: true, rarity: "epic" },
  { id: "ach9", title: "100 Horas de Foco", description: "Acumule 100h de trabalho profundo", icon: "gem", locked: true, rarity: "legendary" },
];

const weeklyVelocity = [
  { week: "Sem 1", completed: 8, planned: 12 },
  { week: "Sem 2", completed: 11, planned: 10 },
  { week: "Sem 3", completed: 14, planned: 13 },
  { week: "Sem 4", completed: 10, planned: 11 },
  { week: "Atual", completed: 6, planned: 9 },
];

const dailyFocus = [
  { day: "Seg", deep: 3, meetings: 1.5, admin: 1 },
  { day: "Ter", deep: 4, meetings: 0.5, admin: 0.5 },
  { day: "Qua", deep: 4.5, meetings: 1, admin: 0 },
  { day: "Qui", deep: 2, meetings: 2.5, admin: 1 },
  { day: "Sex", deep: 3, meetings: 1, admin: 0.5 },
];

const categoryBreakdown = [
  { name: "Foco Profundo", value: 16.5, color: "#7B61FF" },
  { name: "Reunioes", value: 6.5, color: "#3b82f6" },
  { name: "Revisao", value: 4.5, color: "#f59e0b" },
  { name: "Admin", value: 3, color: "#94a3b8" },
  { name: "Intervalo", value: 5, color: "#10b981" },
];

const monthlyTrend = [
  { month: "Out", score: 62, tasks: 22, focus: 14 },
  { month: "Nov", score: 68, tasks: 28, focus: 16 },
  { month: "Dez", score: 71, tasks: 25, focus: 15 },
  { month: "Jan", score: 74, tasks: 30, focus: 18 },
  { month: "Fev", score: 76, tasks: 32, focus: 19 },
  { month: "Mar", score: 78, tasks: 24, focus: 16.5 },
];

const priorityConfig = {
  urgent: { label: "Urgente", icon: Flame, color: "text-red-600", bg: "bg-red-100 dark:bg-red-950/30" },
  high: { label: "Alta", icon: ArrowUp, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-950/30" },
  medium: { label: "Media", icon: ArrowRight, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/30" },
  low: { label: "Baixa", icon: ArrowDown, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/30" },
};

const suggestionTypeConfig = {
  task: { label: "Tarefa", icon: CheckCircle2, color: "text-[#7B61FF]" },
  follow_up: { label: "Follow-up", icon: ArrowRight, color: "text-blue-500" },
  improvement: { label: "Melhoria", icon: Lightbulb, color: "text-amber-500" },
  automation: { label: "Automacao", icon: Zap, color: "text-emerald-500" },
};

const severityConfig = {
  critical: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200 dark:border-red-900/40" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200 dark:border-amber-900/40" },
  info: { icon: Lightbulb, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-900/40" },
  success: { icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200 dark:border-emerald-900/40" },
};

const rarityConfig = {
  common: { label: "Comum", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-900/30", border: "border-slate-200 dark:border-slate-800" },
  rare: { label: "Raro", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-900/40" },
  epic: { label: "Epico", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200 dark:border-purple-900/40" },
  legendary: { label: "Lendario", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-300 dark:border-amber-900/40" },
};

const achievementIcons: Record<string, typeof Brain> = {
  brain: Brain, flame: Flame, crown: Crown, zap: Zap, bot: Bot,
  trophy: Trophy, check: CheckCircle2, users: Users, gem: Gem,
};

/* ═══════════════════════ TABS ═══════════════════════ */

type HubTab = "overview" | "planner" | "insights" | "goals" | "alerts" | "integrations";
const hubTabs: { id: HubTab; label: string; icon: typeof Target }[] = [
  { id: "overview", label: "Visao Geral", icon: Target },
  { id: "planner", label: "Planejador", icon: Calendar },
  { id: "goals", label: "Metas", icon: Trophy },
  { id: "insights", label: "Insights", icon: BarChart3 },
  { id: "alerts", label: "Alertas", icon: Bell },
  { id: "integrations", label: "Integracoes", icon: Link2 },
];

/* ═══════════════════════ COMPONENT ═══════════════════════ */

export function ProductivityHub({ onNavigate, onOpenAI }: ProductivityHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>("overview");
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [reminders, setReminders] = useState(initialReminders);
  const [plan, setPlan] = useState(weeklyPlan);
  const [goals, setGoals] = useState(initialGoals);
  const [achievements] = useState(initialAchievements);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Seg");
  const [gcalConnected, setGcalConnected] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [productivityScore] = useState(78);
  const [autoPlanning, setAutoPlanning] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [selectedAchievementFilter, setSelectedAchievementFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    deadline: true, ai: true, team: true, daily: true, reminders: true, goals: true, achievements: true
  });

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const criticalCount = activeAlerts.filter(a => a.severity === "critical").length;

  const handleAcceptSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, accepted: true } : s));
    const sug = suggestions.find(s => s.id === id);
    toast.success(`"${sug?.title}" adicionado ao seu plano!`, { icon: "✨" });
  };

  const handleBatchAcceptSuggestions = () => {
    const urgentAndHigh = suggestions.filter(s => !s.accepted && (s.priority === "urgent" || s.priority === "high"));
    setSuggestions(prev => prev.map(s =>
      (s.priority === "urgent" || s.priority === "high") && !s.accepted ? { ...s, accepted: true } : s
    ));
    toast.success(`${urgentAndHigh.length} sugestoes prioritarias aceitas!`, { icon: "🚀" });
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
    toast.info("Alerta descartado");
  };

  const handleToggleBlock = (day: DayOfWeek, blockId: string) => {
    setPlan(prev => ({
      ...prev,
      [day]: prev[day].map(b => b.id === blockId ? { ...b, completed: !b.completed } : b),
    }));
  };

  const handleRefreshSuggestions = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Sugestoes atualizadas pela IA!", { icon: "🧠" });
    }, 1500);
  };

  const handleAutoPlanning = () => {
    setAutoPlanning(true);
    setTimeout(() => {
      setAutoPlanning(false);
      toast.success("Plano semanal otimizado pela IA! Blocos de foco movidos para manhas e reunioes agrupadas.", { icon: "🤖" });
    }, 2500);
  };

  const handleConnectGcal = () => {
    setGcalConnected(true);
    toast.success("Google Calendar conectado!", { icon: "📅" });
  };

  const handleAddReminder = () => {
    if (!newReminderTitle.trim()) return;
    setReminders(prev => [...prev, { id: `r${Date.now()}`, title: newReminderTitle, time: "09:00", date: "Seg", recurring: false, enabled: true }]);
    setNewReminderTitle("");
    setShowNewReminder(false);
    toast.success("Lembrete criado!");
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalTarget.trim()) return;
    setGoals(prev => [...prev, {
      id: `g${Date.now()}`,
      title: newGoalTitle,
      description: "",
      target: Number(newGoalTarget),
      current: 0,
      unit: "unidades",
      deadline: "Semanal",
      category: "tasks",
      color: "#7B61FF",
    }]);
    setNewGoalTitle("");
    setNewGoalTarget("");
    setShowNewGoal(false);
    toast.success("Meta criada com sucesso!");
  };

  const toggleNotifPref = (key: string) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preferencia atualizada");
  };

  const completedToday = plan.Seg.filter(b => b.completed).length;
  const totalToday = plan.Seg.length;
  const focusHours = dailyFocus.reduce((acc, d) => acc + d.deep, 0);
  const unlockedAchievements = achievements.filter(a => !a.locked).length;
  const totalXP = unlockedAchievements * 250;

  /* ─────────────── OVERVIEW TAB ─────────────── */
  const OverviewTab = () => (
    <div className="space-y-5">
      {/* Score + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Productivity Score */}
        <div className="md:col-span-1 bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/5 to-[#B14EFF]/5" />
          <div className="relative z-10 text-center">
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="8" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 264" }}
                  animate={{ strokeDasharray: `${productivityScore * 2.64} 264` }}
                  transition={{ duration: 1.5, ease: "easeOut" }} />
                <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7B61FF" /><stop offset="100%" stopColor="#B14EFF" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] bg-clip-text text-transparent">{productivityScore}</motion.span>
                <span className="text-[10px] text-muted-foreground">de 100</span>
              </div>
            </div>
            <h3 className="font-semibold text-sm">Score de Produtividade</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">+5 pontos vs. semana passada</p>
            <div className="flex items-center gap-1 justify-center mt-2">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium">{totalXP} XP · Nivel 4</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          {[
            { label: "Tarefas Concluidas", value: "24/32", sub: "75% esta semana", icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500" },
            { label: "Horas de Foco", value: `${focusHours}h`, sub: "Meta: 20h/semana", icon: Brain, gradient: "from-[#7B61FF] to-[#B14EFF]" },
            { label: "Streak Diario", value: "7 dias", sub: "Melhor: 12 dias", icon: Flame, gradient: "from-orange-500 to-red-500" },
            { label: "Entregas no Prazo", value: "89%", sub: "+4% vs. mes anterior", icon: Target, gradient: "from-blue-500 to-cyan-500" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={`stat-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:shadow-purple-500/5 transition-all">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-2.5`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                <p className="text-[10px] text-emerald-500 font-medium mt-0.5">{stat.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI Daily Coaching */}
      <div className="bg-gradient-to-r from-[#7B61FF]/8 to-[#B14EFF]/8 border border-[#7B61FF]/15 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Coach IA — Resumo do Dia</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
              Bom dia! Voce tem <span className="font-medium text-foreground">3 blocos de foco</span> e <span className="font-medium text-foreground">2 reunioes</span> hoje.
              Sua meta de foco semanal esta em <span className="font-medium text-[#7B61FF]">82%</span>. Recomendo priorizar o "Review Video Demo" que vence em 2 dias.
              Mantenha o streak de 7 dias! 🔥
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setActiveTab("planner")} className="text-[10px] px-2.5 py-1 rounded-lg bg-[#7B61FF]/10 text-[#7B61FF] font-medium hover:bg-[#7B61FF]/20 transition-colors">
                Ver Plano do Dia
              </button>
              <button onClick={() => setActiveTab("goals")} className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-medium hover:bg-emerald-500/20 transition-colors">
                Checar Metas
              </button>
              <button onClick={onOpenAI} className="text-[10px] px-2.5 py-1 rounded-lg bg-muted/40 text-muted-foreground font-medium hover:bg-muted/60 transition-colors">
                Conversar com IA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
            <div>
              <h3 className="font-semibold text-sm">Sugestoes Inteligentes da IA</h3>
              <p className="text-[10px] text-muted-foreground">Baseadas no seu contexto e padroes de trabalho</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {suggestions.filter(s => !s.accepted && (s.priority === "urgent" || s.priority === "high")).length > 0 && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBatchAcceptSuggestions}
                className="px-2.5 py-1.5 rounded-lg bg-[#7B61FF] text-white text-[10px] font-medium hover:bg-[#7B61FF]/90 transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3" />Aceitar Prioritarias
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95, rotate: 180 }} onClick={handleRefreshSuggestions}
              className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors">
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
            </motion.button>
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {suggestions.filter(s => !s.accepted).slice(0, 5).map((sug, i) => {
            const pCfg = priorityConfig[sug.priority];
            const PIcon = pCfg.icon;
            const tCfg = suggestionTypeConfig[sug.type];
            const TIcon = tCfg.icon;
            return (
              <motion.div key={sug.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors">
                <div className={`w-8 h-8 rounded-lg ${pCfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <PIcon className={`w-4 h-4 ${pCfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-medium truncate">{sug.title}</h4>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${pCfg.bg} ${pCfg.color}`}>{pCfg.label}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{sug.reason}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><TIcon className={`w-3 h-3 ${tCfg.color}`} />{tCfg.label}</span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock className="w-3 h-3" />{sug.estimatedTime}</span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><FolderKanban className="w-3 h-3" />{sug.project}</span>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAcceptSuggestion(sug.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[#7B61FF]/10 text-[#7B61FF] text-[10px] font-medium hover:bg-[#7B61FF]/20 transition-colors">
                  Aceitar
                </motion.button>
              </motion.div>
            );
          })}
        </div>
        {suggestions.filter(s => s.accepted).length > 0 && (
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border-t border-emerald-200/30 dark:border-emerald-900/20">
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />{suggestions.filter(s => s.accepted).length} sugestoes aceitas e adicionadas ao seu plano
            </p>
          </div>
        )}
      </div>

      {/* Today's Plan Preview + Alerts Side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500" />Hoje — Segunda</h3>
            <span className="text-[10px] text-muted-foreground">{completedToday}/{totalToday} blocos</span>
          </div>
          <div className="space-y-1.5">
            {plan.Seg.map(block => {
              const cfg = blockTypeConfig[block.type];
              return (
                <div key={block.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all ${block.completed ? "opacity-50" : "hover:bg-muted/20"}`}>
                  <button onClick={() => handleToggleBlock("Seg", block.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${block.completed ? "bg-[#7B61FF] border-[#7B61FF]" : "border-border hover:border-[#7B61FF]/50"}`}>
                    {block.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className={`w-1 h-8 rounded-full ${cfg.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${block.completed ? "line-through" : ""}`}>{block.title}</p>
                    <p className="text-[10px] text-muted-foreground">{block.start} — {block.end}{block.project ? ` · ${block.project}` : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setActiveTab("planner")} className="w-full mt-3 py-2 text-[11px] text-[#7B61FF] font-medium hover:bg-[#7B61FF]/5 rounded-lg transition-colors flex items-center justify-center gap-1">
            Ver planejamento completo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Goals Progress Mini */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />Progresso das Metas
            </h3>
            <button onClick={() => setActiveTab("goals")} className="text-[10px] text-[#7B61FF] font-medium hover:underline">Ver todas</button>
          </div>
          <div className="space-y-3">
            {goals.slice(0, 4).map(goal => {
              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate">{goal.title}</span>
                    <span className="text-[10px] text-muted-foreground">{goal.current}/{goal.target} {goal.unit}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#7B61FF]" />Alertas Inteligentes
            {criticalCount > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{criticalCount}</span>}
          </h3>
          <button onClick={() => setActiveTab("alerts")} className="text-[10px] text-[#7B61FF] font-medium hover:underline">Ver todos</button>
        </div>
        <div className="space-y-2">
          {activeAlerts.slice(0, 3).map(alert => {
            const sCfg = severityConfig[alert.severity];
            const SIcon = sCfg.icon;
            return (
              <div key={alert.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${sCfg.border} ${sCfg.bg}`}>
                <SIcon className={`w-4 h-4 ${sCfg.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{alert.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-muted-foreground">{alert.time}</span>
                    {alert.actionLabel && <button onClick={() => onNavigate("workflow")} className="text-[9px] text-[#7B61FF] font-medium hover:underline">{alert.actionLabel}</button>}
                  </div>
                </div>
                <button onClick={() => handleDismissAlert(alert.id)} className="text-muted-foreground hover:text-foreground flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ─────────────── PLANNER TAB ─────────────── */
  const PlannerTab = () => {
    const days: DayOfWeek[] = ["Seg", "Ter", "Qua", "Qui", "Sex"];
    const dayBlocks = plan[selectedDay];
    const deepHours = dayBlocks.filter(b => b.type === "deep_work").reduce((a, b) => {
      const [sh, sm] = b.start.split(":").map(Number);
      const [eh, em] = b.end.split(":").map(Number);
      return a + (eh - sh) + (em - sm) / 60;
    }, 0);
    const dayCompleted = dayBlocks.filter(b => b.completed).length;

    return (
      <div className="space-y-5">
        {/* AI Auto-Planner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#7B61FF]/8 to-[#B14EFF]/8 border border-[#7B61FF]/15 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Auto-Planejador IA</h3>
                <p className="text-[10px] text-muted-foreground">Otimiza seus blocos: foco profundo de manha, reunioes agrupadas</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAutoPlanning}
              disabled={autoPlanning}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white text-xs font-medium shadow-md shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {autoPlanning ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Otimizando...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" />Otimizar Semana</>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Day Selector */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-1.5">
          {days.map(d => {
            const blocks = plan[d];
            const done = blocks.filter(b => b.completed).length;
            const isToday = d === "Seg";
            return (
              <button key={d} onClick={() => setSelectedDay(d)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all ${selectedDay === d ? "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white shadow-lg shadow-purple-500/20" : "hover:bg-muted/40"}`}>
                <p className={`text-xs font-medium ${selectedDay === d ? "" : "text-muted-foreground"}`}>{d}</p>
                <p className={`text-[9px] mt-0.5 ${selectedDay === d ? "text-white/70" : "text-muted-foreground"}`}>{done}/{blocks.length}</p>
                {isToday && <div className={`w-1 h-1 rounded-full mx-auto mt-1 ${selectedDay === d ? "bg-white" : "bg-[#7B61FF]"}`} />}
              </button>
            );
          })}
        </div>

        {/* Day Summary */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs"><Brain className="w-3.5 h-3.5 text-[#7B61FF]" /><span className="text-muted-foreground">Foco:</span><span className="font-medium">{deepHours}h</span></div>
          <div className="flex items-center gap-1.5 text-xs"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span className="text-muted-foreground">Concluidos:</span><span className="font-medium">{dayCompleted}/{dayBlocks.length}</span></div>
          <div className="flex items-center gap-1.5 text-xs"><Clock className="w-3.5 h-3.5 text-amber-500" /><span className="text-muted-foreground">Blocos:</span><span className="font-medium">{dayBlocks.length}</span></div>
          <div className="flex items-center gap-1.5 text-xs"><Activity className="w-3.5 h-3.5 text-blue-500" /><span className="text-muted-foreground">Energia:</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(n => (
                <div key={n} className={`w-2 h-3 rounded-sm ${n <= (selectedDay === "Seg" ? 4 : selectedDay === "Sex" ? 3 : 5) ? "bg-emerald-500" : "bg-muted/30"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Time Blocks */}
        <div className="space-y-2">
          {dayBlocks.map((block, i) => {
            const cfg = blockTypeConfig[block.type];
            const BIcon = cfg.icon;
            return (
              <motion.div key={block.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${block.completed ? "bg-muted/20 border-border/40 opacity-60" : "bg-card border-border hover:shadow-md hover:shadow-purple-500/5 hover:border-[#7B61FF]/20"}`}>
                <button onClick={() => handleToggleBlock(selectedDay, block.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${block.completed ? "bg-[#7B61FF] border-[#7B61FF]" : "border-border hover:border-[#7B61FF]/50"}`}>
                  {block.completed && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
                <div className={`w-1.5 h-10 rounded-full ${cfg.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className={`text-sm font-medium ${block.completed ? "line-through" : ""}`}>{block.title}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${cfg.color} ${cfg.textColor}`}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{block.start} — {block.end}</span>
                    {block.project && <span className="flex items-center gap-0.5"><FolderKanban className="w-3 h-3" />{block.project}</span>}
                  </div>
                </div>
                <BIcon className={`w-4 h-4 ${block.completed ? "text-muted-foreground" : "text-muted-foreground/60"}`} />
              </motion.div>
            );
          })}
        </div>

        {/* Google Calendar Events */}
        {gcalConnected && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="text-xs font-medium mb-3 flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-blue-500" />Eventos do Google Calendar — {selectedDay}</h4>
            <div className="space-y-1.5">
              {calendarEvents.filter(e => e.date === selectedDay && e.source === "google").map(ev => (
                <div key={ev.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ev.color }} />
                  <span className="text-xs font-medium flex-1">{ev.title}</span>
                  <span className="text-[10px] text-muted-foreground">{ev.time}</span>
                </div>
              ))}
              {calendarEvents.filter(e => e.date === selectedDay && e.source === "google").length === 0 && (
                <p className="text-[10px] text-muted-foreground text-center py-2">Nenhum evento para {selectedDay}</p>
              )}
            </div>
          </div>
        )}

        {!gcalConnected && (
          <div className="bg-card border border-dashed border-border rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-2">Conecte o Google Calendar para ver eventos aqui</p>
            <button onClick={() => setActiveTab("integrations")} className="text-[10px] text-[#7B61FF] font-medium hover:underline">
              Ir para Integracoes
            </button>
          </div>
        )}
      </div>
    );
  };

  /* ─────────────── GOALS TAB ─────────────── */
  const GoalsTab = () => {
    const filteredAchievements = achievements.filter(a => {
      if (selectedAchievementFilter === "unlocked") return !a.locked;
      if (selectedAchievementFilter === "locked") return a.locked;
      return true;
    });

    return (
      <div className="space-y-5">
        {/* Goals Header with XP */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/15 dark:to-orange-950/15 border border-amber-200/30 dark:border-amber-900/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Nivel 4 — Estrategista</h3>
                <p className="text-[10px] text-muted-foreground">{totalXP} XP · Proximo nivel: 1500 XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{unlockedAchievements}/{achievements.length}</p>
              <p className="text-[9px] text-muted-foreground">Conquistas</p>
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-amber-200/50 dark:bg-amber-900/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalXP / 1500) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px] text-muted-foreground">Nivel 4</span>
            <span className="text-[9px] text-muted-foreground">Nivel 5 — Visionario</span>
          </div>
        </div>

        {/* Active Goals */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#7B61FF]" />
              <h3 className="font-semibold text-sm">Metas Ativas</h3>
            </div>
            <button onClick={() => setShowNewGoal(true)} className="text-[10px] text-[#7B61FF] font-medium flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" />Nova Meta</button>
          </div>
          <div className="divide-y divide-border/30">
            {goals.map((goal, i) => {
              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const isOnTrack = percent >= 60;
              const goalCategoryIcons: Record<string, typeof Brain> = {
                focus: Brain, tasks: CheckCircle2, streak: Flame, quality: Target,
              };
              const GIcon = goalCategoryIcons[goal.category] || Target;
              return (
                <motion.div key={goal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="p-4 hover:bg-muted/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${goal.color}15` }}>
                      <GIcon className="w-5 h-5" style={{ color: goal.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-medium">{goal.title}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${isOnTrack ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"}`}>
                          {isOnTrack ? "No caminho" : "Atenção"}
                        </span>
                      </div>
                      {goal.description && <p className="text-[10px] text-muted-foreground mb-2">{goal.description}</p>}
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex-1 h-2.5 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: goal.color }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ color: goal.color }}>{percent}%</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{goal.current}/{goal.target} {goal.unit}</span>
                        <span>· {goal.deadline}</span>
                        {isOnTrack ? (
                          <span className="flex items-center gap-0.5 text-emerald-500"><TrendingUp className="w-3 h-3" />Bom ritmo</span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-amber-500"><AlertTriangle className="w-3 h-3" />Acelere</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <AnimatePresence>
            {showNewGoal && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-border/30">
                <div className="p-4 space-y-2">
                  <input type="text" autoFocus value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)}
                    placeholder="Nome da meta..." className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border focus:border-[#7B61FF]/30 focus:outline-none text-xs" />
                  <div className="flex items-center gap-2">
                    <input type="number" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)}
                      placeholder="Valor alvo" className="flex-1 px-3 py-2 rounded-lg bg-muted/30 border border-border focus:border-[#7B61FF]/30 focus:outline-none text-xs" />
                    <button onClick={handleAddGoal} className="px-3 py-2 rounded-lg bg-[#7B61FF] text-white text-xs font-medium"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setShowNewGoal(false)} className="px-3 py-2 text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-sm">Conquistas</h3>
            </div>
            <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5">
              {(["all", "unlocked", "locked"] as const).map(filter => (
                <button key={filter} onClick={() => setSelectedAchievementFilter(filter)}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${selectedAchievementFilter === filter ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
                  {filter === "all" ? "Todas" : filter === "unlocked" ? "Desbloqueadas" : "Bloqueadas"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {filteredAchievements.map((ach, i) => {
              const rCfg = rarityConfig[ach.rarity];
              const AIcon = achievementIcons[ach.icon] || Star;
              return (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-3 rounded-xl border ${rCfg.border} ${ach.locked ? "opacity-50" : ""} ${rCfg.bg} relative overflow-hidden`}
                >
                  {ach.rarity === "legendary" && !ach.locked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ach.locked ? "bg-muted/30" : rCfg.bg}`}>
                        {ach.locked ? (
                          <Shield className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <AIcon className={`w-4 h-4 ${rCfg.color}`} />
                        )}
                      </div>
                      <span className={`text-[8px] font-bold uppercase ${rCfg.color}`}>{rCfg.label}</span>
                    </div>
                    <h4 className="text-xs font-semibold mb-0.5">{ach.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{ach.description}</p>
                    {ach.unlockedAt && (
                      <p className="text-[9px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <CalendarCheck className="w-3 h-3" />{ach.unlockedAt}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────── INSIGHTS TAB ─────────────── */
  const InsightsTab = () => (
    <div className="space-y-5">
      {/* Monthly Trend */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-sm mb-1">Tendencia Mensal de Produtividade</h3>
        <p className="text-[10px] text-muted-foreground mb-4">Score, tarefas e horas de foco nos ultimos 6 meses</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
            <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
            <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "11px" }} />
            <Line type="monotone" dataKey="score" stroke="#7B61FF" strokeWidth={2} dot={{ fill: "#7B61FF", r: 3 }} name="Score" />
            <Line type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} name="Tarefas" />
            <Line type="monotone" dataKey="focus" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} name="Foco (h)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Velocity Chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-sm mb-1">Velocidade de Entregas</h3>
        <p className="text-[10px] text-muted-foreground mb-4">Tarefas planejadas vs. concluidas por semana</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyVelocity} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
            <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
            <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "11px" }} />
            <Bar dataKey="planned" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Planejadas" />
            <Bar dataKey="completed" fill="#7B61FF" radius={[4, 4, 0, 0]} name="Concluidas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Focus Distribution + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Focus */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-sm mb-1">Distribuicao de Foco Diario</h3>
          <p className="text-[10px] text-muted-foreground mb-4">Horas por tipo de atividade</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyFocus}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "11px" }} />
              <Area type="monotone" dataKey="deep" stackId="1" fill="#7B61FF" fillOpacity={0.6} stroke="#7B61FF" name="Foco Profundo" />
              <Area type="monotone" dataKey="meetings" stackId="1" fill="#3b82f6" fillOpacity={0.5} stroke="#3b82f6" name="Reunioes" />
              <Area type="monotone" dataKey="admin" stackId="1" fill="#94a3b8" fillOpacity={0.4} stroke="#94a3b8" name="Admin" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-sm mb-1">Categorias da Semana</h3>
          <p className="text-[10px] text-muted-foreground mb-4">Horas totais por tipo de bloco</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {categoryBreakdown.map((entry, i) => <Cell key={`cat-${i}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryBreakdown.map(cat => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] flex-1 text-muted-foreground">{cat.name}</span>
                  <span className="text-[10px] font-medium">{cat.value}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Productivity Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/15 dark:to-blue-950/15 border border-[#7B61FF]/15 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#7B61FF]" />
          <h3 className="font-semibold text-sm">Insights da IA sobre sua Produtividade</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: "Pico de Performance", desc: "Suas melhores entregas acontecem entre 9h-12h. Proteja esse horario para trabalho profundo.", icon: Rocket, color: "text-[#7B61FF]" },
            { title: "Reunioes Otimizaveis", desc: "2 reunioes semanais poderiam ser substituidas por updates assincronos, economizando ~2h.", icon: Lightbulb, color: "text-amber-500" },
            { title: "Padrao de Atrasos", desc: "Tarefas de 'Copy' tendem a atrasar 1.5x. Considere adicionar buffer no planejamento.", icon: AlertTriangle, color: "text-red-500" },
          ].map((insight, i) => {
            const IIcon = insight.icon;
            return (
              <motion.div key={`insight-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-[#7B61FF]/10">
                <IIcon className={`w-5 h-5 ${insight.color} mb-2`} />
                <h4 className="text-xs font-semibold mb-1">{insight.title}</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{insight.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-4 h-4 text-[#7B61FF]" />
          <h3 className="font-semibold text-sm">Previsoes da IA</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Score Previsto (prox. semana)", value: "82", trend: "+4", positive: true, icon: TrendingUp },
            { label: "Risco de Atraso", value: "2 tarefas", trend: "medio", positive: false, icon: AlertTriangle },
            { label: "Tempo Economizado com IA", value: "3.5h", trend: "esta semana", positive: true, icon: Clock },
          ].map((pred, i) => {
            const PIcon = pred.icon;
            return (
              <motion.div key={`pred-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <PIcon className={`w-4 h-4 mb-2 ${pred.positive ? "text-emerald-500" : "text-amber-500"}`} />
                <p className="text-lg font-bold">{pred.value}</p>
                <p className="text-[10px] text-muted-foreground">{pred.label}</p>
                <p className={`text-[10px] font-medium mt-0.5 ${pred.positive ? "text-emerald-500" : "text-amber-500"}`}>{pred.trend}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ─────────────── ALERTS TAB ─────────────── */
  const AlertsTab = () => (
    <div className="space-y-5">
      {/* Smart Alert Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Criticos", count: alerts.filter(a => !a.dismissed && a.severity === "critical").length, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20" },
          { label: "Avisos", count: alerts.filter(a => !a.dismissed && a.severity === "warning").length, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20" },
          { label: "Info", count: alerts.filter(a => !a.dismissed && a.severity === "info").length, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
          { label: "Sucesso", count: alerts.filter(a => !a.dismissed && a.severity === "success").length, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
        ].map((stat, i) => (
          <div key={`alert-stat-${i}`} className={`${stat.bg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-2.5">
        {alerts.filter(a => !a.dismissed).length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-medium">Tudo em dia!</p>
            <p className="text-[10px] text-muted-foreground mt-1">Nenhum alerta pendente no momento.</p>
          </div>
        )}
        {alerts.map((alert, i) => {
          if (alert.dismissed) return null;
          const sCfg = severityConfig[alert.severity];
          const SIcon = sCfg.icon;
          return (
            <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-3 p-4 rounded-xl border ${sCfg.border} ${sCfg.bg}`}>
              <SIcon className={`w-5 h-5 ${sCfg.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{alert.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{alert.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                  {alert.actionLabel && (
                    <button onClick={() => onNavigate("workflow")} className="text-[10px] text-[#7B61FF] font-medium hover:underline flex items-center gap-0.5">
                      {alert.actionLabel} <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <button onClick={() => handleDismissAlert(alert.id)} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Reminders */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><BellRing className="w-4 h-4 text-[#7B61FF]" />Lembretes</h3>
          <button onClick={() => setShowNewReminder(true)} className="text-[10px] text-[#7B61FF] font-medium flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" />Novo</button>
        </div>
        <div className="space-y-2">
          {reminders.map(rem => (
            <div key={rem.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${rem.enabled ? "border-border bg-card" : "border-border/50 bg-muted/20 opacity-50"}`}>
              <button onClick={() => setReminders(prev => prev.map(r => r.id === rem.id ? { ...r, enabled: !r.enabled } : r))}
                className={`w-8 h-5 rounded-full flex items-center transition-colors flex-shrink-0 ${rem.enabled ? "bg-[#7B61FF] justify-end" : "bg-muted justify-start"}`}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm mx-0.5" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{rem.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{rem.date} · {rem.time}</span>
                  {rem.recurring && <span className="flex items-center gap-0.5"><Repeat className="w-3 h-3" />Recorrente</span>}
                </div>
              </div>
              <button onClick={() => setReminders(prev => prev.filter(r => r.id !== rem.id))} className="text-muted-foreground hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          <AnimatePresence>
            {showNewReminder && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <div className="flex items-center gap-2 p-2 border border-[#7B61FF]/30 rounded-xl bg-card">
                  <input type="text" autoFocus value={newReminderTitle} onChange={e => setNewReminderTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAddReminder(); if (e.key === "Escape") setShowNewReminder(false); }}
                    placeholder="Titulo do lembrete..." className="flex-1 px-3 py-1.5 rounded-lg bg-muted/30 border border-border focus:border-[#7B61FF]/30 focus:outline-none text-xs" />
                  <button onClick={handleAddReminder} className="p-1.5 rounded-lg bg-[#7B61FF] text-white"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setShowNewReminder(false)} className="p-1.5 text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  /* ─────────────── INTEGRATIONS TAB ─────────────── */
  const IntegrationsTab = () => (
    <div className="space-y-5">
      {/* Google Calendar */}
      <div className={`bg-card border rounded-2xl p-5 transition-all ${gcalConnected ? "border-emerald-200 dark:border-emerald-900/40" : "border-border"}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">Google Calendar</h3>
              {gcalConnected && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-medium">Conectado</span>}
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">Sincronize eventos do Google Calendar com seu planejamento semanal automaticamente.</p>
            {gcalConnected ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{calendarEvents.filter(e => e.source === "google").length} eventos sincronizados esta semana</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ultima sinc: ha 5 min</span>
                  <button onClick={() => toast.success("Calendario sincronizado!")} className="text-[#7B61FF] font-medium hover:underline">Sincronizar agora</button>
                </div>
                <button onClick={() => { setGcalConnected(false); toast.info("Google Calendar desconectado"); }}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"><Unlink className="w-3 h-3" />Desconectar</button>
              </div>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleConnectGcal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium shadow-md shadow-blue-500/20 flex items-center gap-2">
                <Link2 className="w-3.5 h-3.5" />Conectar Google Calendar
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Notificacoes Push</h3>
            <p className="text-[11px] text-muted-foreground mb-3">Receba alertas em tempo real sobre prazos, tarefas e insights de produtividade.</p>
            <div className="space-y-3">
              {[
                { label: "Alertas de prazo (24h antes)", key: "deadline" },
                { label: "Sugestoes da IA", key: "ai" },
                { label: "Updates de tarefas do time", key: "team" },
                { label: "Resumo diario de produtividade", key: "daily" },
                { label: "Lembretes personalizados", key: "reminders" },
                { label: "Progresso de metas", key: "goals" },
                { label: "Novas conquistas", key: "achievements" },
              ].map(notif => (
                <div key={notif.key} className="flex items-center justify-between">
                  <span className="text-xs">{notif.label}</span>
                  <button onClick={() => toggleNotifPref(notif.key)}
                    className={`w-8 h-5 rounded-full flex items-center transition-colors ${notifPrefs[notif.key] ? "bg-[#7B61FF] justify-end" : "bg-muted justify-start"}`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm mx-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slack Integration Mock */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A154B] to-[#611f69] flex items-center justify-center flex-shrink-0">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">Slack</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Em breve</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">Receba notificacoes e atualizacoes diretamente no Slack da equipe.</p>
            <button disabled className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-medium flex items-center gap-2 cursor-not-allowed">
              <Link2 className="w-3.5 h-3.5" />Conectar Slack
            </button>
          </div>
        </div>
      </div>

      {/* Reminders Integration */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <BellRing className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Sistema de Lembretes</h3>
            <p className="text-[11px] text-muted-foreground mb-3">Lembretes inteligentes baseados no seu padrao de trabalho e prazos.</p>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{reminders.filter(r => r.enabled).length} lembretes ativos</span>
            </div>
            <button onClick={() => setActiveTab("alerts")} className="text-xs text-[#7B61FF] font-medium hover:underline mt-2 flex items-center gap-1">Gerenciar lembretes <ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─────────────── MAIN RENDER ─────────────── */
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center"><Rocket className="w-4 h-4 text-white" /></div>
            Assistente de Produtividade
          </h1>
          <p className="text-sm text-muted-foreground">Planeje, otimize e acompanhe sua produtividade com inteligencia artificial</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {criticalCount > 0 && (
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />{criticalCount} alerta{criticalCount > 1 ? "s" : ""} critico{criticalCount > 1 ? "s" : ""}
            </motion.div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
            <Trophy className="w-3.5 h-3.5" />{totalXP} XP
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs font-medium hover:border-[#7B61FF]/30 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#7B61FF]" />Perguntar a IA
          </motion.button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1 overflow-x-auto">
        {hubTabs.map(tab => {
          const TIcon = tab.icon;
          const isActive = activeTab === tab.id;
          const alertBadge = tab.id === "alerts" ? criticalCount : 0;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive ? "bg-card shadow-sm text-[#7B61FF]" : "text-muted-foreground hover:text-foreground"}`}>
              <TIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              {alertBadge > 0 && <span className="bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{alertBadge}</span>}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "planner" && <PlannerTab />}
          {activeTab === "goals" && <GoalsTab />}
          {activeTab === "insights" && <InsightsTab />}
          {activeTab === "alerts" && <AlertsTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
