import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  Download,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Sparkles,
  Globe,
  Zap,
  Target,
  CheckCircle2,
  Lightbulb,
  Brain,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const inviteData = [
  { month: "Set", convites: 12, aceitos: 8 },
  { month: "Out", convites: 18, aceitos: 14 },
  { month: "Nov", convites: 25, aceitos: 19 },
  { month: "Dez", convites: 32, aceitos: 24 },
  { month: "Jan", convites: 45, aceitos: 38 },
  { month: "Fev", convites: 58, aceitos: 47 },
  { month: "Mar", convites: 72, aceitos: 61 },
];

const workspaceGrowth = [
  { month: "Set", workspaces: 3 },
  { month: "Out", workspaces: 5 },
  { month: "Nov", workspaces: 8 },
  { month: "Dez", workspaces: 12 },
  { month: "Jan", workspaces: 18 },
  { month: "Fev", workspaces: 24 },
  { month: "Mar", workspaces: 31 },
];

const templateInstalls = [
  { name: "Marketing Pipeline", installs: 1230 },
  { name: "Sprint Planning", installs: 890 },
  { name: "Design System", installs: 670 },
  { name: "Content Calendar", installs: 1450 },
  { name: "MVP Builder", installs: 540 },
];

const sharingChannels = [
  { name: "Link direto", value: 45, color: "#7B61FF" },
  { name: "Email", value: 25, color: "#3B82F6" },
  { name: "LinkedIn", value: 18, color: "#0A66C2" },
  { name: "X / Twitter", value: 12, color: "#1DA1F2" },
];

const kpis = [
  {
    label: "Convites Enviados",
    value: "262",
    change: "+24%",
    positive: true,
    icon: Users,
    color: "from-[#7B61FF] to-[#B14EFF]",
  },
  {
    label: "Crescimento Workspaces",
    value: "31",
    change: "+29%",
    positive: true,
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Templates Instalados",
    value: "4.780",
    change: "+18%",
    positive: true,
    icon: Download,
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Projetos Compartilhados",
    value: "156",
    change: "-3%",
    positive: false,
    icon: Share2,
    color: "from-orange-500 to-red-500",
  },
];

export function GrowthAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#7B61FF]" />
          Análises de Crescimento
        </h1>
        <p className="text-muted-foreground">
          Métricas de adoção viral, convites e expansão da plataforma
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -2 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    kpi.positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {kpi.positive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-0.5">{kpi.value}</h3>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invites Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7B61FF]" />
            Convites vs Aceitos
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Últimos 7 meses
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={inviteData}>
              <defs>
                <linearGradient id="gradConvites" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAceitos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="convites"
                stroke="#7B61FF"
                strokeWidth={2}
                fill="url(#gradConvites)"
                name="Convites"
              />
              <Area
                type="monotone"
                dataKey="aceitos"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#gradAceitos)"
                name="Aceitos"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-[#7B61FF]" />
              Convites enviados
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Aceitos
            </div>
          </div>
        </motion.div>

        {/* Workspace Growth */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#7B61FF]" />
            Crescimento de Workspaces
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Crescimento acumulado
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={workspaceGrowth}>
              <defs>
                <linearGradient id="gradWorkspace" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="workspaces"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#gradWorkspace)"
                name="Workspaces"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Template Installs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Download className="w-4 h-4 text-[#7B61FF]" />
            Templates mais instalados
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Top 5</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={templateInstalls} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 10 }}
                stroke="var(--color-muted-foreground)"
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="installs"
                fill="#7B61FF"
                radius={[0, 6, 6, 0]}
                name="Instalações"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sharing Channels */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#7B61FF]" />
            Canais de Compartilhamento
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Como projetos são compartilhados
          </p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={sharingChannels}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {sharingChannels.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {sharingChannels.map((channel) => (
                <div key={channel.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: channel.color }}
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">{channel.name}</span>
                    <span className="text-sm font-medium">{channel.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Viral Loop Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/15 dark:to-blue-950/15 border border-[#7B61FF]/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-[#7B61FF]" />
          <h3 className="font-semibold">Insight do Loop Viral</h3>
        </div>
        <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
          <span className="px-3 py-1.5 bg-card rounded-lg border border-border">
            Usuário cria projeto
          </span>
          <Zap className="w-4 h-4 text-[#7B61FF]" />
          <span className="px-3 py-1.5 bg-card rounded-lg border border-border">
            Convida equipe
          </span>
          <Zap className="w-4 h-4 text-[#7B61FF]" />
          <span className="px-3 py-1.5 bg-card rounded-lg border border-border">
            Equipe colabora
          </span>
          <Zap className="w-4 h-4 text-[#7B61FF]" />
          <span className="px-3 py-1.5 bg-card rounded-lg border border-border">
            Convida mais pessoas
          </span>
          <Zap className="w-4 h-4 text-[#7B61FF]" />
          <span className="px-3 py-1.5 bg-card rounded-lg border border-border">
            Projetos viram templates
          </span>
          <Zap className="w-4 h-4 text-[#7B61FF]" />
          <span className="px-3 py-1.5 bg-gradient-to-r from-[#7B61FF]/10 to-[#B14EFF]/10 rounded-lg border border-[#7B61FF]/20 text-[#7B61FF] font-medium">
            Templates trazem novos usuários
          </span>
        </div>
      </motion.div>

      {/* Weekly Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Insights Semanais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Produtividade do Time",
              value: "+23%",
              desc: "Aumento na velocidade de conclusão de tarefas vs semana anterior",
              icon: Target,
              color: "from-emerald-500 to-teal-500",
              positive: true,
            },
            {
              title: "Engajamento de Membros",
              value: "94%",
              desc: "Taxa de login diário dos membros do workspace esta semana",
              icon: Users,
              color: "from-blue-500 to-cyan-500",
              positive: true,
            },
            {
              title: "Mapas Mentais Criados",
              value: "18",
              desc: "Novos mapas mentais criados esta semana, +5 vs média",
              icon: Brain,
              color: "from-[#7B61FF] to-[#B14EFF]",
              positive: true,
            },
          ].map((insight, i) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="p-4 rounded-xl bg-muted/20 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{insight.value}</span>
                </div>
                <p className="text-sm font-medium mb-1">{insight.title}</p>
                <p className="text-xs text-muted-foreground">{insight.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* User Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#7B61FF]" />
          Seu Progresso Pessoal
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tarefas Concluídas", value: 128, goal: 150, unit: "tarefas" },
            { label: "Projetos Entregues", value: 8, goal: 10, unit: "projetos" },
            { label: "Mapas Criados", value: 14, goal: 20, unit: "mapas" },
            { label: "Dias Consecutivos", value: 23, goal: 30, unit: "dias" },
          ].map((item) => {
            const pct = Math.round((item.value / item.goal) * 100);
            return (
              <div key={item.label} className="p-3 rounded-xl bg-muted/20">
                <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                <p className="text-lg font-bold mb-1">{item.value}<span className="text-xs text-muted-foreground font-normal">/{item.goal}</span></p>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{pct}% da meta</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}