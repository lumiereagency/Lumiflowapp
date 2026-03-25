import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Zap,
  Plus,
  Search,
  Play,
  Pause,
  MoreHorizontal,
  ArrowRight,
  Clock,
  CheckCircle2,
  GitBranch,
  Mail,
  Bell,
  Calendar,
  RefreshCw,
  Filter,
  TrendingUp,
  Sparkles,
  X,
  ChevronRight,
  Target,
  Users,
  FileText,
  AlertTriangle,
  Settings,
  Bot,
} from "lucide-react";
import { toast } from "sonner";

interface AutomationCenterProps {
  onNavigate: (section: string) => void;
}

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: "active" | "paused" | "draft";
  runsTotal: number;
  runsThisWeek: number;
  lastRun: string;
  category: string;
  icon: typeof Zap;
  color: string;
}

const mockAutomations: Automation[] = [
  {
    id: "a1",
    name: "Notificar ao mover para Revisão",
    description: "Envia notificação ao responsável quando um card é movido para a coluna de revisão",
    trigger: "Card movido para 'Em Revisão'",
    actions: ["Enviar notificação push", "Enviar email ao revisor", "Atualizar status no calendário"],
    status: "active",
    runsTotal: 156,
    runsThisWeek: 12,
    lastRun: "Há 30 min",
    category: "workflow",
    icon: GitBranch,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "a2",
    name: "Lembrete de Prazo",
    description: "Envia lembrete automático 2 dias antes do prazo de entrega de cada tarefa",
    trigger: "2 dias antes do prazo",
    actions: ["Enviar notificação push", "Enviar email", "Marcar como urgente"],
    status: "active",
    runsTotal: 89,
    runsThisWeek: 5,
    lastRun: "Há 2h",
    category: "deadline",
    icon: Calendar,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "a3",
    name: "Aprovação Automática de Design",
    description: "Quando todos os itens do checklist estão marcados, mover card automaticamente para aprovação",
    trigger: "Checklist 100% completo",
    actions: ["Mover para 'Aprovado'", "Notificar gerente", "Atualizar progresso do projeto"],
    status: "active",
    runsTotal: 42,
    runsThisWeek: 3,
    lastRun: "Há 1 dia",
    category: "approval",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "a4",
    name: "Resumo Semanal por IA",
    description: "Gera um resumo semanal automático de todas as atividades do projeto usando IA",
    trigger: "Toda segunda-feira às 09:00",
    actions: ["Gerar resumo com IA", "Enviar por email ao time", "Salvar no projeto"],
    status: "active",
    runsTotal: 24,
    runsThisWeek: 1,
    lastRun: "Há 2 dias",
    category: "ai",
    icon: Sparkles,
    color: "from-[#7B61FF] to-[#B14EFF]",
  },
  {
    id: "a5",
    name: "Atribuição Automática de Tarefas",
    description: "Distribui novas tarefas automaticamente entre membros do time com menor carga de trabalho",
    trigger: "Nova tarefa criada sem responsável",
    actions: ["Analisar carga do time", "Atribuir ao membro disponível", "Notificar membro"],
    status: "paused",
    runsTotal: 67,
    runsThisWeek: 0,
    lastRun: "Há 5 dias",
    category: "assignment",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "a6",
    name: "Relatório de Gargalos",
    description: "Detecta cards parados na mesma coluna há mais de 3 dias e notifica o time",
    trigger: "Card parado há 3+ dias",
    actions: ["Detectar gargalos", "Enviar alerta", "Sugerir ação via IA"],
    status: "draft",
    runsTotal: 0,
    runsThisWeek: 0,
    lastRun: "—",
    category: "analytics",
    icon: AlertTriangle,
    color: "from-rose-500 to-pink-500",
  },
];

const templateAutomations = [
  { name: "Onboarding de Novo Membro", desc: "Automatiza tarefas de boas-vindas para novos membros do time", icon: Users, color: "from-blue-500 to-cyan-500" },
  { name: "Pipeline de Conteúdo", desc: "Fluxo automático: rascunho → revisão → aprovação → publicação", icon: FileText, color: "from-emerald-500 to-teal-500" },
  { name: "Escalonamento de Prioridade", desc: "Aumenta prioridade automaticamente quando prazos se aproximam", icon: TrendingUp, color: "from-amber-500 to-orange-500" },
  { name: "Sincronizar com Calendário", desc: "Sincroniza prazos e reuniões automaticamente com o calendário", icon: Calendar, color: "from-purple-500 to-pink-500" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Ativo", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
  paused: { label: "Pausado", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/30" },
  draft: { label: "Rascunho", color: "text-muted-foreground", bg: "bg-muted/50" },
};

export function AutomationCenter({ onNavigate }: AutomationCenterProps) {
  const [automations, setAutomations] = useState(mockAutomations);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  const filteredAutomations = automations.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: automations.length,
    active: automations.filter((a) => a.status === "active").length,
    totalRuns: automations.reduce((a, b) => a + b.runsThisWeek, 0),
    timeSaved: "12h",
  };

  const toggleStatus = (id: string) => {
    setAutomations((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const next = a.status === "active" ? "paused" : "active";
      toast.success(`Automação ${next === "active" ? "ativada" : "pausada"}`);
      return { ...a, status: next as "active" | "paused" | "draft" };
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Automações</h1>
          <p className="text-muted-foreground">
            Automatize tarefas repetitivas e acelere o fluxo de trabalho do seu time
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreatePanel(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Nova Automação
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total de Automações", value: stats.total, icon: Zap, color: "from-[#7B61FF] to-[#B14EFF]" },
          { label: "Automações Ativas", value: stats.active, icon: Play, color: "from-emerald-500 to-teal-500" },
          { label: "Execuções esta Semana", value: stats.totalRuns, icon: RefreshCw, color: "from-blue-500 to-cyan-500" },
          { label: "Tempo Estimado Salvo", value: stats.timeSaved, icon: Clock, color: "from-amber-500 to-orange-500" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar automações..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "active", "paused", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filterStatus === status
                  ? "bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {status === "all" ? "Todas" : statusConfig[status]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-3">
        {filteredAutomations.map((auto, i) => {
          const Icon = auto.icon;
          const statusInfo = statusConfig[auto.status];
          return (
            <motion.div
              key={auto.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-purple-500/5 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${auto.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold group-hover:text-[#7B61FF] transition-colors">{auto.name}</h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{auto.description}</p>

                  {/* Trigger & Actions */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="px-2 py-1 rounded-lg bg-muted/40 font-medium">Gatilho: {auto.trigger}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="px-2 py-1 rounded-lg bg-muted/40 font-medium">{auto.actions.length} ações</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {auto.runsTotal} execuções</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {auto.runsThisWeek} esta semana</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {auto.lastRun}</span>
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {auto.status !== "draft" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleStatus(auto.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        auto.status === "active"
                          ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {auto.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </motion.button>
                  )}
                  <button className="w-10 h-10 rounded-xl hover:bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Templates Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#7B61FF]" />
          Templates de Automação
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templateAutomations.map((tmpl, i) => {
            const Icon = tmpl.icon;
            return (
              <motion.div
                key={tmpl.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 hover:border-[#7B61FF]/30 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tmpl.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium group-hover:text-[#7B61FF] transition-colors">{tmpl.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{tmpl.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create Panel */}
      <AnimatePresence>
        {showCreatePanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreatePanel(false)} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[520px] max-w-[95vw] bg-background border border-border rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Criar Nova Automação</h2>
                <button onClick={() => setShowCreatePanel(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nome da Automação</label>
                  <input type="text" placeholder="Ex: Notificar ao completar tarefa" className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Gatilho (Quando?)</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none text-sm">
                    <option>Card movido entre colunas</option>
                    <option>Checklist completado</option>
                    <option>Prazo se aproximando</option>
                    <option>Nova tarefa criada</option>
                    <option>Comentário adicionado</option>
                    <option>Agendamento recorrente</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Ação (O que fazer?)</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none text-sm">
                    <option>Enviar notificação</option>
                    <option>Enviar email</option>
                    <option>Mover card</option>
                    <option>Alterar prioridade</option>
                    <option>Atribuir membro</option>
                    <option>Gerar resumo com IA</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowCreatePanel(false); toast.success("Automação criada como rascunho!"); }}
                  className="w-full py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30"
                >
                  Criar Automação
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
