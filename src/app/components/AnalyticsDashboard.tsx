import { motion } from "motion/react";
import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const productivityData = [
  { semana: "Sem 1", tarefas: 18, aprovacoes: 12, mindmaps: 5 },
  { semana: "Sem 2", tarefas: 24, aprovacoes: 15, mindmaps: 8 },
  { semana: "Sem 3", tarefas: 20, aprovacoes: 18, mindmaps: 6 },
  { semana: "Sem 4", tarefas: 32, aprovacoes: 22, mindmaps: 10 },
  { semana: "Sem 5", tarefas: 28, aprovacoes: 20, mindmaps: 7 },
  { semana: "Sem 6", tarefas: 35, aprovacoes: 25, mindmaps: 12 },
  { semana: "Sem 7", tarefas: 30, aprovacoes: 28, mindmaps: 9 },
  { semana: "Sem 8", tarefas: 40, aprovacoes: 30, mindmaps: 14 },
];

const taskCycleData = [
  { etapa: "Criação", tempo: 0.5 },
  { etapa: "Planejamento", tempo: 1.2 },
  { etapa: "Execução", tempo: 3.5 },
  { etapa: "Revisão", tempo: 1.8 },
  { etapa: "Aprovação", tempo: 1.0 },
  { etapa: "Conclusão", tempo: 0.3 },
];

const teamPerformance = [
  { nome: "Sarah J.", concluidas: 45, pendentes: 8, aprovadas: 38 },
  { nome: "Mike C.", concluidas: 38, pendentes: 12, aprovadas: 32 },
  { nome: "Emma D.", concluidas: 52, pendentes: 5, aprovadas: 48 },
  { nome: "Alex M.", concluidas: 30, pendentes: 15, aprovadas: 22 },
  { nome: "Lisa P.", concluidas: 42, pendentes: 6, aprovadas: 36 },
  { nome: "Tom W.", concluidas: 28, pendentes: 10, aprovadas: 24 },
];

const projectStatusData = [
  { name: "Ativos", value: 5, color: "#10b981" },
  { name: "Planejamento", value: 2, color: "#8b5cf6" },
  { name: "Pausados", value: 1, color: "#f59e0b" },
  { name: "Concluídos", value: 3, color: "#3b82f6" },
];

const bottleneckData = [
  { area: "Revisão de Design", atraso: 4.2, impacto: "alto" },
  { area: "Aprovação Cliente", atraso: 3.8, impacto: "alto" },
  { area: "QA Testing", atraso: 2.5, impacto: "médio" },
  { area: "Copy Review", atraso: 1.8, impacto: "baixo" },
  { area: "Deploy", atraso: 0.8, impacto: "baixo" },
];

const weeklyCompletionData = [
  { dia: "Seg", concluidas: 8 },
  { dia: "Ter", concluidas: 12 },
  { dia: "Qua", concluidas: 6 },
  { dia: "Qui", concluidas: 15 },
  { dia: "Sex", concluidas: 10 },
  { dia: "Sáb", concluidas: 3 },
  { dia: "Dom", concluidas: 1 },
];

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");

  const kpis = [
    {
      label: "Taxa de Conclusão",
      value: "78%",
      change: "+12%",
      positive: true,
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Tempo Médio por Tarefa",
      value: "2.3 dias",
      change: "-0.5 dia",
      positive: true,
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Produtividade do Time",
      value: "92%",
      change: "+8%",
      positive: true,
      icon: TrendingUp,
      color: "from-[#7B61FF] to-[#B14EFF]",
    },
    {
      label: "Gargalos Detectados",
      value: "2",
      change: "+1",
      positive: false,
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Análises & Relatórios</h1>
          <p className="text-muted-foreground">
            Métricas de produtividade e insights do seu workspace
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl">
          {(["week", "month", "quarter"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "week" ? "Semana" : p === "month" ? "Mês" : "Trimestre"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                  kpi.positive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                }`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#7B61FF]" />
            Tendência de Produtividade
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Evolução de tarefas, aprovações e mapas mentais</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="gradTarefas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradAprovacoes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis key="xaxis" dataKey="semana" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis key="yaxis" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  key="tooltip"
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area key="area-tarefas" type="monotone" dataKey="tarefas" stroke="#7B61FF" fill="url(#gradTarefas)" strokeWidth={2} name="Tarefas" />
                <Area key="area-aprovacoes" type="monotone" dataKey="aprovacoes" stroke="#10b981" fill="url(#gradAprovacoes)" strokeWidth={2} name="Aprovações" />
                <Line key="line-mindmaps" type="monotone" dataKey="mindmaps" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Mapas Mentais" />
                <Legend key="legend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Pie */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#7B61FF]" />
            Status dos Projetos
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Distribuição por status</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {projectStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Cycle Time */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7B61FF]" />
            Tempo por Etapa (dias)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Tempo médio em cada fase do workflow</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskCycleData} layout="vertical">
                <CartesianGrid key="grid-cycle" strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis key="xaxis-cycle" type="number" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis key="yaxis-cycle" dataKey="etapa" type="category" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} width={90} />
                <Tooltip
                  key="tooltip-cycle"
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar key="bar-tempo" dataKey="tempo" fill="#7B61FF" radius={[0, 6, 6, 0]} name="Dias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7B61FF]" />
            Desempenho da Equipe
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Tarefas concluídas vs pendentes por membro</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformance}>
                <CartesianGrid key="grid-team" strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis key="xaxis-team" dataKey="nome" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis key="yaxis-team" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  key="tooltip-team"
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar key="bar-concluidas" dataKey="concluidas" fill="#7B61FF" radius={[6, 6, 0, 0]} name="Concluídas" />
                <Bar key="bar-pendentes" dataKey="pendentes" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Pendentes" />
                <Legend key="legend-team" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottlenecks & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Bottlenecks */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Gargalos do Workflow
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Áreas com maior atraso médio</p>
          <div className="space-y-3">
            {bottleneckData.map((item, i) => (
              <motion.div
                key={item.area}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{item.area}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.impacto === "alto"
                          ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          : item.impacto === "médio"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      }`}>
                        {item.impacto}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.atraso}d</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.atraso / 5) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        item.impacto === "alto" ? "bg-red-500" : item.impacto === "médio" ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Completion */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#7B61FF]" />
            Conclusões por Dia
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Tarefas finalizadas esta semana</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompletionData}>
                <CartesianGrid key="grid-weekly" strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis key="xaxis-weekly" dataKey="dia" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis key="yaxis-weekly" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  key="tooltip-weekly"
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar key="bar-weekly-concluidas" dataKey="concluidas" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Concluídas" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B61FF" />
                    <stop offset="100%" stopColor="#B14EFF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}