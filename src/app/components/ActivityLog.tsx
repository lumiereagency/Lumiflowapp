import { motion } from "motion/react";
import { useState } from "react";
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  MessageSquare,
  GitBranch,
  Plus,
  Edit3,
  Trash2,
  UserPlus,
  FolderKanban,
  Brain,
  ArrowRight,
  Calendar,
  Eye,
  Star,
  Upload,
  Settings,
  Zap,
} from "lucide-react";

interface ActivityLogProps {
  onNavigate: (section: string) => void;
}

interface ActivityEntry {
  id: string;
  type: "task_created" | "task_moved" | "task_completed" | "comment" | "project_created" | "member_joined" | "file_uploaded" | "mindmap_edited" | "approval" | "automation";
  user: { name: string; initials: string; color: string };
  action: string;
  target: string;
  project?: string;
  time: string;
  date: string;
}

const mockActivity: ActivityEntry[] = [
  { id: "a1", type: "task_moved", user: { name: "Sarah Johnson", initials: "SJ", color: "bg-gradient-to-br from-blue-500 to-cyan-500" }, action: "moveu", target: '"Assets Campanha Q1" para Em Revisão', project: "Campanha Marketing Q1", time: "09:45", date: "Hoje" },
  { id: "a2", type: "comment", user: { name: "Mike Chen", initials: "MC", color: "bg-gradient-to-br from-purple-500 to-pink-500" }, action: "comentou em", target: '"Guidelines de Marca"', project: "Redesign do Produto", time: "09:30", date: "Hoje" },
  { id: "a3", type: "approval", user: { name: "João Silva", initials: "JD", color: "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]" }, action: "aprovou", target: '"Design Campanha Email"', project: "Campanha Marketing Q1", time: "09:15", date: "Hoje" },
  { id: "a4", type: "task_created", user: { name: "Emma Davis", initials: "ED", color: "bg-gradient-to-br from-emerald-500 to-teal-500" }, action: "criou a tarefa", target: '"Testes QA Final"', project: "Lançamento App Mobile", time: "08:50", date: "Hoje" },
  { id: "a5", type: "file_uploaded", user: { name: "Lisa Park", initials: "LP", color: "bg-gradient-to-br from-indigo-500 to-purple-500" }, action: "enviou", target: '"wireframes-v3.fig" em Redesign', project: "Redesign do Produto", time: "08:30", date: "Hoje" },
  { id: "a6", type: "automation", user: { name: "Sistema", initials: "SY", color: "bg-gradient-to-br from-amber-500 to-orange-500" }, action: "executou automação", target: '"Lembrete de Prazo" para 3 tarefas', time: "08:00", date: "Hoje" },
  { id: "a7", type: "task_completed", user: { name: "Alex Martinez", initials: "AM", color: "bg-gradient-to-br from-orange-500 to-red-500" }, action: "concluiu", target: '"Copy Instagram Semana 10"', project: "Campanha Marketing Q1", time: "17:45", date: "Ontem" },
  { id: "a8", type: "mindmap_edited", user: { name: "Sarah Johnson", initials: "SJ", color: "bg-gradient-to-br from-blue-500 to-cyan-500" }, action: "editou o mapa mental", target: '"Roadmap de Produto Q1"', time: "16:20", date: "Ontem" },
  { id: "a9", type: "member_joined", user: { name: "Tom Wilson", initials: "TW", color: "bg-gradient-to-br from-rose-500 to-pink-500" }, action: "entrou no workspace como", target: "Editor", time: "15:00", date: "Ontem" },
  { id: "a10", type: "project_created", user: { name: "João Silva", initials: "JD", color: "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]" }, action: "criou o projeto", target: '"Integração com Parceiros"', time: "14:30", date: "Ontem" },
  { id: "a11", type: "task_moved", user: { name: "Nina Rodriguez", initials: "NR", color: "bg-gradient-to-br from-yellow-500 to-orange-500" }, action: "moveu", target: '"Pesquisa de Mercado" para Pendente', project: "Estratégia de Conteúdo", time: "11:00", date: "8 mar" },
  { id: "a12", type: "comment", user: { name: "Emma Davis", initials: "ED", color: "bg-gradient-to-br from-emerald-500 to-teal-500" }, action: "comentou em", target: '"Vídeo Demo do Produto"', project: "Campanha Marketing Q1", time: "10:15", date: "8 mar" },
];

const typeIcons: Record<string, { icon: typeof Activity; color: string; bg: string }> = {
  task_created: { icon: Plus, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
  task_moved: { icon: GitBranch, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-950/30" },
  task_completed: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
  comment: { icon: MessageSquare, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-950/30" },
  project_created: { icon: FolderKanban, color: "text-[#7B61FF]", bg: "bg-purple-100 dark:bg-purple-950/30" },
  member_joined: { icon: UserPlus, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-950/30" },
  file_uploaded: { icon: Upload, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-950/30" },
  mindmap_edited: { icon: Brain, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-950/30" },
  approval: { icon: Eye, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/30" },
  automation: { icon: Zap, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-950/30" },
};

export function ActivityLog({ onNavigate }: ActivityLogProps) {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockActivity.filter((a) => {
    const matchesSearch = a.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || a.type === filterType;
    return matchesSearch && matchesType;
  });

  const groupedByDate: Record<string, ActivityEntry[]> = {};
  filtered.forEach((a) => {
    if (!groupedByDate[a.date]) groupedByDate[a.date] = [];
    groupedByDate[a.date].push(a);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Registro de Atividades</h1>
        <p className="text-muted-foreground">
          Histórico completo de todas as ações no workspace
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar atividades..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "all", label: "Tudo" },
            { id: "task_moved", label: "Movimentos" },
            { id: "comment", label: "Comentários" },
            { id: "approval", label: "Aprovações" },
            { id: "task_created", label: "Criações" },
            { id: "automation", label: "Automações" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filterType === f.id
                  ? "bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedByDate).map(([date, entries]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold">{date}</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{entries.length} atividades</span>
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/50" />

              <div className="space-y-1">
                {entries.map((entry, i) => {
                  const cfg = typeIcons[entry.type];
                  const Icon = cfg.icon;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-4 py-3 px-2 rounded-xl hover:bg-muted/20 transition-colors group relative"
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 z-10 border-2 border-background`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{entry.user.name}</span>{" "}
                          <span className="text-muted-foreground">{entry.action}</span>{" "}
                          <span className="font-medium">{entry.target}</span>
                        </p>
                        {entry.project && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">{entry.project}</p>
                        )}
                      </div>

                      {/* Time */}
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 pt-1">{entry.time}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Activity className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Nenhuma atividade encontrada</p>
        </div>
      )}
    </div>
  );
}
