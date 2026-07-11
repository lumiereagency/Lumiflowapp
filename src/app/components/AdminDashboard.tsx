import { motion } from "motion/react";
import {
  ShieldCheck,
  Users,
  TrendingUp,
  DollarSign,
  Send,
  CheckCircle2,
  Target,
  Award,
  ArrowUpRight,
  UserCog,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
} from "recharts";
import { LumiGradientText, LumiProgress, LumiBadge, LumiAvatar, LumiButton } from "./ui/lumiflow-ds";
import { platformById } from "./workspace/platforms";
import { useWorkspace } from "./workspace/WorkspaceContext";

interface AdminDashboardProps {
  onNavigate?: (section: string) => void;
}

const teamOutput = [
  { month: "Fev", publicados: 82, aprovados: 76 },
  { month: "Mar", publicados: 104, aprovados: 98 },
  { month: "Abr", publicados: 121, aprovados: 115 },
  { month: "Mai", publicados: 98, aprovados: 90 },
  { month: "Jun", publicados: 143, aprovados: 137 },
  { month: "Jul", publicados: 156, aprovados: 149 },
];

const revenueByClient = [
  { name: "Bloom", receita: 12400 },
  { name: "TechNova", receita: 9800 },
  { name: "Verde Café", receita: 5600 },
  { name: "Outros", receita: 7200 },
];

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { team, clients } = useWorkspace();
  const members = team.filter((m) => m.role === "member");
  const totalPosts = team.reduce((sum, m) => sum + m.postsPublished, 0);
  const avgApproval = Math.round(members.reduce((sum, m) => sum + m.approvalRate, 0) / (members.length || 1));

  const kpis = [
    { label: "Receita Mensal", value: "R$ 35k", change: "+14% vs mês anterior", icon: DollarSign, color: "from-emerald-500 to-teal-500" },
    { label: "Posts Publicados", value: String(totalPosts), change: "+9% este mês", icon: Send, color: "from-[#7B61FF] to-[#B14EFF]" },
    { label: "Taxa de Aprovação", value: `${avgApproval}%`, change: "média da equipe", icon: CheckCircle2, color: "from-blue-500 to-cyan-500" },
    { label: "Clientes Ativos", value: String(clients.length), change: "carteira atual", icon: Target, color: "from-amber-500 to-orange-500" },
  ];

  const ranked = [...members].sort((a, b) => b.postsPublished - a.postsPublished);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#7B61FF]" />
            Painel do Gerente
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Métricas internas e <LumiGradientText>desenvolvimento da equipe</LumiGradientText> — visível apenas para a gerência.
          </p>
        </div>
        <LumiButton variant="outline" icon={<UserCog className="w-4 h-4" />} onClick={() => onNavigate?.("access")}>
          Gerenciar acessos
        </LumiButton>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{k.value}</h3>
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{k.change}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#7B61FF]" /> Produção da Equipe
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={teamOutput}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} width={30} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="publicados" name="Publicados" stroke="#7B61FF" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="aprovados" name="Aprovados" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Receita por Cliente
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueByClient} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} width={60} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "rgba(123, 97, 255, 0.05)" }} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
              <Bar dataKey="receita" fill="#7B61FF" radius={[0, 4, 4, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Desenvolvimento da equipe */}
      <div>
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-[#7B61FF]" /> Desenvolvimento da Equipe
        </h3>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {ranked.map((m, i) => (
            <div key={m.id} className={`flex items-center gap-4 px-5 py-4 ${i !== ranked.length - 1 ? "border-b border-border/40" : ""}`}>
              <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
              <LumiAvatar name={m.name} size="md" status={m.status === "active" ? "online" : "away"} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{m.name}</p>
                  {m.status === "pending" && <LumiBadge color="amber">Pendente</LumiBadge>}
                </div>
                <p className="text-[11px] text-muted-foreground">{m.email}</p>
              </div>
              {/* Clientes atendidos */}
              <div className="hidden sm:flex items-center -space-x-1.5">
                {m.allowedClientIds.slice(0, 3).map((cid) => {
                  const c = clients.find((cl) => cl.id === cid);
                  if (!c) return null;
                  return (
                    <span key={cid} className={`w-6 h-6 rounded-full bg-gradient-to-br ${c.color} border-2 border-card flex items-center justify-center text-white text-[8px] font-bold`} title={c.name}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </span>
                  );
                })}
              </div>
              <div className="hidden md:block w-32">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">Aprovação</span>
                  <span className="text-[10px] font-medium">{m.approvalRate}%</span>
                </div>
                <LumiProgress value={m.approvalRate} size="sm" animated={false} />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{m.postsPublished}</p>
                <p className="text-[10px] text-muted-foreground">posts</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saúde dos clientes */}
      <div>
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-[#7B61FF]" /> Saúde das Contas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{c.handle}</p>
                </div>
                <LumiBadge color="green">{c.insights.growth}</LumiBadge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold">{c.insights.followers}</p>
                  <p className="text-[9px] text-muted-foreground">Seguidores</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{c.insights.engagement}</p>
                  <p className="text-[9px] text-muted-foreground">Engaj.</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{c.insights.reach}</p>
                  <p className="text-[9px] text-muted-foreground">Alcance</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/50">
                {c.connectedNetworks.map((n) => {
                  const cfg = platformById(n);
                  const NIcon = cfg.icon;
                  return <NIcon key={n} className={`w-3.5 h-3.5 ${cfg.color}`} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
