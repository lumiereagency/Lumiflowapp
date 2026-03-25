import { motion } from "motion/react";
import {
  Brain,
  GitBranch,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Plus,
  ArrowUpRight,
  Calendar,
  BarChart3,
  Zap,
  FolderKanban,
  AlertTriangle,
  ArrowRight,
  Eye,
  Target,
} from "lucide-react";
import { AIInsightsWidget } from "./AIInsightsWidget";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DashboardHomeProps {
  onNavigate: (section: string) => void;
  onOpenAI?: () => void;
}

const stats = [
  {
    label: "Projetos Ativos",
    value: "12",
    change: "+2 esta semana",
    icon: Brain,
    color: "from-[#7B61FF] to-[#B14EFF]",
    shadowColor: "shadow-purple-500/20",
    section: "projects",
  },
  {
    label: "Aprovações Pendentes",
    value: "7",
    change: "3 urgentes",
    icon: Clock,
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
    section: "workflow",
  },
  {
    label: "Tarefas Concluídas",
    value: "48",
    change: "+15% vs semana passada",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/20",
    section: "analytics",
  },
  {
    label: "Membros do Time",
    value: "8",
    change: "Todos ativos",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
    section: "team",
  },
];

const myTasks = [
  {
    id: "t1",
    title: "Revisar assets visuais da campanha",
    project: "Campanha Marketing Q1",
    priority: "high" as const,
    dueDate: "Hoje",
    status: "review",
    overdue: false,
  },
  {
    id: "t2",
    title: "Aprovar guidelines de marca",
    project: "Redesign do Produto",
    priority: "high" as const,
    dueDate: "Amanhã",
    status: "pending",
    overdue: false,
  },
  {
    id: "t3",
    title: "Finalizar wireframes v2",
    project: "Redesign do Produto",
    priority: "medium" as const,
    dueDate: "12 mar",
    status: "pending",
    overdue: false,
  },
  {
    id: "t4",
    title: "Review do vídeo demo",
    project: "Campanha Marketing Q1",
    priority: "medium" as const,
    dueDate: "8 mar",
    status: "review",
    overdue: true,
  },
  {
    id: "t5",
    title: "Testes QA do app mobile",
    project: "Lançamento App Mobile",
    priority: "low" as const,
    dueDate: "15 mar",
    status: "pending",
    overdue: false,
  },
];

const upcomingDeadlines = [
  { id: "d1", title: "Deploy App Mobile", project: "App Mobile", date: "12 mar", daysLeft: 3, severity: "critical" as const },
  { id: "d2", title: "Review Landing Page", project: "Redesign", date: "14 mar", daysLeft: 5, severity: "warning" as const },
  { id: "d3", title: "Entrega Campanha Q1", project: "Marketing Q1", date: "28 mar", daysLeft: 19, severity: "normal" as const },
  { id: "d4", title: "Design System v2", project: "Redesign", date: "15 abr", daysLeft: 37, severity: "normal" as const },
];

const recentActivity = [
  {
    id: "1",
    user: "Sarah Johnson",
    initials: "SJ",
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    action: 'atualizou "Assets Campanha Q1"',
    time: "Há 5 min",
  },
  {
    id: "2",
    user: "Mike Chen",
    initials: "MC",
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    action: 'aprovou "Guidelines de Marca"',
    time: "Há 15 min",
  },
  {
    id: "3",
    user: "Emma Davis",
    initials: "ED",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    action: 'comentou em "Vídeo Demo"',
    time: "Há 1h",
  },
  {
    id: "4",
    user: "Alex Martinez",
    initials: "AM",
    color: "bg-gradient-to-br from-orange-500 to-red-500",
    action: 'criou novo card "Copy Redes Sociais"',
    time: "Há 2h",
  },
];

const quickActions = [
  { label: "Novo Projeto", icon: FolderKanban, section: "projects", color: "from-[#7B61FF] to-[#B14EFF]" },
  { label: "Novo Mapa Mental", icon: Brain, section: "mindmaps", color: "from-blue-500 to-cyan-500" },
  { label: "Novo Card", icon: GitBranch, section: "workflow", color: "from-emerald-500 to-teal-500" },
  { label: "Ver Calendário", icon: Calendar, section: "calendar", color: "from-orange-500 to-red-500" },
];

const priorityStyles = {
  high: { label: "Alta", dot: "bg-red-500" },
  medium: { label: "Média", dot: "bg-amber-500" },
  low: { label: "Baixa", dot: "bg-blue-500" },
};

const severityStyles = {
  critical: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800/40" },
  warning: { bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800/40" },
  normal: { bg: "bg-muted/30", text: "text-muted-foreground", border: "border-border" },
};

const weeklyProgress = [
  { day: "Seg", concluidas: 8, criadas: 5 },
  { day: "Ter", concluidas: 12, criadas: 7 },
  { day: "Qua", concluidas: 6, criadas: 10 },
  { day: "Qui", concluidas: 14, criadas: 8 },
  { day: "Sex", concluidas: 10, criadas: 4 },
  { day: "Sáb", concluidas: 3, criadas: 1 },
  { day: "Dom", concluidas: 1, criadas: 0 },
];

export function DashboardHome({ onNavigate, onOpenAI }: DashboardHomeProps) {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bom dia, João! 👋
          </h1>
          <p className="text-muted-foreground">
            Você tem <span className="text-amber-600 dark:text-amber-400 font-medium">3 tarefas urgentes</span> e{" "}
            <span className="text-[#7B61FF] font-medium">7 aprovações pendentes</span> hoje.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate("projects")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Novo Projeto
        </motion.button>
      </div>

      {/* Stats Grid - Now clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              onClick={() => onNavigate(stat.section)}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-[#7B61FF]/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadowColor}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {stat.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#7B61FF]" />
            Progresso Semanal
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7B61FF]" />
              Concluídas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B14EFF]/40" />
              Criadas
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyProgress} barGap={4}>
            <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis key="xaxis" dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
            <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} width={30} />
            <Tooltip
              key="tooltip"
              contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
              cursor={{ fill: "rgba(123, 97, 255, 0.05)" }}
            />
            <Bar key="concluidas" dataKey="concluidas" name="Concluídas" fill="#7B61FF" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar key="criadas" dataKey="criadas" name="Criadas" fill="rgba(177, 78, 255, 0.35)" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Tasks - Takes 2 cols */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#7B61FF]" />
              Minhas Tarefas
            </h3>
            <button
              onClick={() => onNavigate("workflow")}
              className="text-xs text-[#7B61FF] font-medium flex items-center gap-1 hover:underline"
            >
              Ver todas
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {myTasks.map((task, i) => {
              const pStyle = priorityStyles[task.priority];
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group ${
                    i !== myTasks.length - 1 ? "border-b border-border/40" : ""
                  }`}
                >
                  {/* Priority Dot */}
                  <div className={`w-2.5 h-2.5 rounded-full ${pStyle.dot} flex-shrink-0`} title={pStyle.label} />

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate group-hover:text-[#7B61FF] transition-colors ${task.overdue ? "text-red-600 dark:text-red-400" : ""}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{task.project}</p>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    task.status === "review"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}>
                    {task.status === "review" ? "Revisão" : "Pendente"}
                  </span>

                  {/* Due Date */}
                  <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${
                    task.overdue
                      ? "text-red-600 dark:text-red-400"
                      : task.dueDate === "Hoje"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground"
                  }`}>
                    {task.overdue && <AlertTriangle className="w-3 h-3" />}
                    <Calendar className="w-3 h-3" />
                    <span>{task.dueDate}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#7B61FF]" />
            Ações Rápidas
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(action.section)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-card border border-border hover:border-[#7B61FF]/30 hover:shadow-md transition-all group"
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-[#7B61FF] transition-colors">
                    {action.label}
                  </span>
                  <Plus className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Próximos Prazos
          </h3>
          <div className="space-y-2">
            {upcomingDeadlines.map((deadline, i) => {
              const style = severityStyles[deadline.severity];
              return (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-3 rounded-xl border ${style.border} ${style.bg} transition-colors cursor-pointer hover:shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${deadline.severity === "critical" ? style.text : ""}`}>
                      {deadline.title}
                    </span>
                    <span className={`text-[10px] font-medium ${style.text}`}>
                      {deadline.daysLeft === 0 ? "Hoje" : `${deadline.daysLeft}d`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{deadline.project}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{deadline.date}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#7B61FF]" />
            Atividade Recente
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}
                >
                  {activity.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">
                      {activity.action}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <AIInsightsWidget onOpenAI={onOpenAI || (() => onNavigate("ai-assistant"))} />
        </div>
      </div>
    </div>
  );
}