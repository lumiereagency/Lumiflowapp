import { SocialMediaScheduler } from "./SocialMediaScheduler";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Star,
  StarOff,
  X,
  Brain,
  GitBranch,
  Target,
  TrendingUp,
  Activity,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface ProjectsDashboardProps {
  onNavigate: (section: string) => void;
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  progress: number;
  status: "active" | "completed" | "paused" | "planning";
  totalTasks: number;
  completedTasks: number;
  pendingApprovals: number;
  team: { initials: string; color: string; name: string }[];
  deadline: string;
  daysLeft: number;
  starred: boolean;
  category: string;
  recentActivity: { action: string; time: string }[];
}

const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Campanha Marketing Q1",
    description: "Criar e executar a campanha de marketing digital para o primeiro trimestre de 2026",
    color: "from-[#7B61FF] to-[#B14EFF]",
    progress: 68,
    status: "active",
    totalTasks: 24,
    completedTasks: 16,
    pendingApprovals: 3,
    team: [
      { initials: "SJ", color: "bg-gradient-to-br from-blue-500 to-cyan-500", name: "Sarah Johnson" },
      { initials: "MC", color: "bg-gradient-to-br from-purple-500 to-pink-500", name: "Mike Chen" },
      { initials: "ED", color: "bg-gradient-to-br from-emerald-500 to-teal-500", name: "Emma Davis" },
    ],
    deadline: "28 mar, 2026",
    daysLeft: 19,
    starred: true,
    category: "Marketing",
    recentActivity: [
      { action: "Sarah atualizou assets visuais", time: "Há 2h" },
      { action: "Mike aprovou guidelines", time: "Há 5h" },
    ],
  },
  {
    id: "p2",
    name: "Redesign do Produto",
    description: "Renovação completa da interface do produto com novo sistema de design",
    color: "from-blue-500 to-cyan-500",
    progress: 42,
    status: "active",
    totalTasks: 36,
    completedTasks: 15,
    pendingApprovals: 5,
    team: [
      { initials: "LP", color: "bg-gradient-to-br from-indigo-500 to-purple-500", name: "Lisa Park" },
      { initials: "TW", color: "bg-gradient-to-br from-rose-500 to-pink-500", name: "Tom Wilson" },
      { initials: "AM", color: "bg-gradient-to-br from-orange-500 to-red-500", name: "Alex Martinez" },
      { initials: "NR", color: "bg-gradient-to-br from-yellow-500 to-orange-500", name: "Nina Rodriguez" },
    ],
    deadline: "15 abr, 2026",
    daysLeft: 37,
    starred: true,
    category: "Produto",
    recentActivity: [
      { action: "Lisa criou wireframes v2", time: "Há 1h" },
      { action: "Tom comentou na review", time: "Há 3h" },
    ],
  },
  {
    id: "p3",
    name: "Lançamento App Mobile",
    description: "Desenvolvimento e lançamento do aplicativo mobile para iOS e Android",
    color: "from-emerald-500 to-teal-500",
    progress: 85,
    status: "active",
    totalTasks: 18,
    completedTasks: 15,
    pendingApprovals: 1,
    team: [
      { initials: "MC", color: "bg-gradient-to-br from-purple-500 to-pink-500", name: "Mike Chen" },
      { initials: "ED", color: "bg-gradient-to-br from-emerald-500 to-teal-500", name: "Emma Davis" },
    ],
    deadline: "12 mar, 2026",
    daysLeft: 3,
    starred: false,
    category: "Desenvolvimento",
    recentActivity: [
      { action: "Mike finalizou testes QA", time: "Há 30min" },
      { action: "Emma atualizou documentação", time: "Há 2h" },
    ],
  },
  {
    id: "p4",
    name: "Estratégia de Conteúdo",
    description: "Planejamento e criação do calendário de conteúdo para todos os canais",
    color: "from-orange-500 to-red-500",
    progress: 25,
    status: "planning",
    totalTasks: 12,
    completedTasks: 3,
    pendingApprovals: 0,
    team: [
      { initials: "AM", color: "bg-gradient-to-br from-orange-500 to-red-500", name: "Alex Martinez" },
      { initials: "NR", color: "bg-gradient-to-br from-yellow-500 to-orange-500", name: "Nina Rodriguez" },
    ],
    deadline: "30 abr, 2026",
    daysLeft: 52,
    starred: false,
    category: "Marketing",
    recentActivity: [
      { action: "Alex criou brief de conteúdo", time: "Há 4h" },
    ],
  },
  {
    id: "p5",
    name: "Onboarding de Clientes",
    description: "Redesenhar o fluxo de onboarding para melhorar a retenção",
    color: "from-indigo-500 to-purple-500",
    progress: 100,
    status: "completed",
    totalTasks: 8,
    completedTasks: 8,
    pendingApprovals: 0,
    team: [
      { initials: "SJ", color: "bg-gradient-to-br from-blue-500 to-cyan-500", name: "Sarah Johnson" },
      { initials: "LP", color: "bg-gradient-to-br from-indigo-500 to-purple-500", name: "Lisa Park" },
    ],
    deadline: "01 mar, 2026",
    daysLeft: 0,
    starred: false,
    category: "Produto",
    recentActivity: [
      { action: "Projeto concluído!", time: "Há 1 dia" },
    ],
  },
  {
    id: "p6",
    name: "Integração com Parceiros",
    description: "Desenvolver integrações com ferramentas parceiras e APIs externas",
    color: "from-rose-500 to-pink-500",
    progress: 10,
    status: "paused",
    totalTasks: 20,
    completedTasks: 2,
    pendingApprovals: 0,
    team: [
      { initials: "TW", color: "bg-gradient-to-br from-rose-500 to-pink-500", name: "Tom Wilson" },
    ],
    deadline: "30 mai, 2026",
    daysLeft: 82,
    starred: false,
    category: "Desenvolvimento",
    recentActivity: [
      { action: "Projeto pausado temporariamente", time: "Há 3 dias" },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: "Ativo", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-950/30" },
  completed: { label: "Concluído", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-950/30" },
  paused: { label: "Pausado", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-950/30" },
  planning: { label: "Planejamento", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-950/30" },
};

export function ProjectsDashboard({ onNavigate }: ProjectsDashboardProps) {
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"projects" | "scheduler">("projects");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleStar = (id: string) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, starred: !p.starred } : p));
  };

  const summaryStats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    totalTasks: projects.reduce((a, p) => a + p.totalTasks, 0),
    completedTasks: projects.reduce((a, p) => a + p.completedTasks, 0),
    pendingApprovals: projects.reduce((a, p) => a + p.pendingApprovals, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus projetos em um só lugar
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === "projects" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Lista de Projetos
          {activeTab === "projects" && (
            <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B61FF]" layoutId="projectsTabIndicator" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("scheduler")}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === "scheduler" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Agendador Social
          {activeTab === "scheduler" && (
            <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B61FF]" layoutId="projectsTabIndicator" />
          )}
        </button>
      </div>

      {activeTab === "projects" ? (
        <>
          {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total de Projetos", value: summaryStats.total, icon: FolderKanban, color: "from-[#7B61FF] to-[#B14EFF]" },
          { label: "Projetos Ativos", value: summaryStats.active, icon: Activity, color: "from-emerald-500 to-teal-500" },
          { label: "Tarefas Concluídas", value: `${summaryStats.completedTasks}/${summaryStats.totalTasks}`, icon: CheckCircle2, color: "from-blue-500 to-cyan-500" },
          { label: "Aprovações Pendentes", value: summaryStats.pendingApprovals, icon: Clock, color: "from-amber-500 to-orange-500" },
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

      {/* Filters & Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar projetos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "active", "planning", "paused", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filterStatus === status
                  ? "bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {status === "all" ? "Todos" : statusConfig[status]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProjects.map((project, index) => {
          const statusInfo = statusConfig[project.status];
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedProject(project)}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:shadow-purple-500/5 transition-all cursor-pointer group"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg`}>
                  <FolderKanban className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStar(project.id); }}
                    className="text-muted-foreground hover:text-amber-500 transition-colors"
                  >
                    {project.starred ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : <StarOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-semibold mb-1 group-hover:text-[#7B61FF] transition-colors">{project.name}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Progresso</span>
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${project.color}`}
                  />
                </div>
              </div>

              {/* Tasks Summary */}
              <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{project.completedTasks}/{project.totalTasks} tarefas</span>
                </div>
                {project.pendingApprovals > 0 && (
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{project.pendingApprovals} aprovações</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                {/* Team Avatars */}
                <div className="flex -space-x-2">
                  {project.team.slice(0, 4).map((member) => (
                    <div
                      key={member.initials}
                      className={`w-7 h-7 rounded-full ${member.color} flex items-center justify-center text-white text-[10px] font-medium ring-2 ring-card`}
                      title={member.name}
                    >
                      {member.initials}
                    </div>
                  ))}
                  {project.team.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium ring-2 ring-card">
                      +{project.team.length - 4}
                    </div>
                  )}
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.deadline}</span>
                  {project.daysLeft <= 5 && project.daysLeft > 0 && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[680px] z-50 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className={`relative px-6 py-6 bg-gradient-to-r ${selectedProject.color}`}>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-white">
                  <span className="px-2 py-1 rounded-lg bg-white/20 text-xs font-medium mb-2 inline-block">
                    {statusConfig[selectedProject.status].label}
                  </span>
                  <h2 className="text-2xl font-bold mt-2">{selectedProject.name}</h2>
                  <p className="text-white/80 text-sm mt-1">{selectedProject.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Progress Section */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    Progresso do Projeto
                  </h4>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{selectedProject.progress}% concluído</span>
                      <span className="text-xs text-muted-foreground">
                        {selectedProject.completedTasks} de {selectedProject.totalTasks} tarefas
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedProject.progress}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${selectedProject.color}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{selectedProject.totalTasks}</p>
                    <p className="text-xs text-muted-foreground">Total de Tarefas</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{selectedProject.completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Concluídas</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{selectedProject.pendingApprovals}</p>
                    <p className="text-xs text-muted-foreground">Aprovações</p>
                  </div>
                </div>

                {/* Team */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Equipe ({selectedProject.team.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.team.map((member) => (
                      <div key={member.initials} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/30 transition-colors">
                        <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-medium`}>
                          {member.initials}
                        </div>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Prazo
                  </h4>
                  <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm">{selectedProject.deadline}</span>
                    {selectedProject.daysLeft > 0 ? (
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        selectedProject.daysLeft <= 5
                          ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      }`}>
                        {selectedProject.daysLeft} dias restantes
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                        Concluído
                      </span>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    Atividade Recente
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-muted/20">
                        <div className="w-2 h-2 rounded-full bg-[#7B61FF]" />
                        <span className="text-sm flex-1">{activity.action}</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedProject(null); onNavigate("workflow"); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#7B61FF]/10 text-[#7B61FF] text-sm font-medium hover:bg-[#7B61FF]/20 transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    Ver Kanban
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedProject(null); onNavigate("mindmaps"); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#7B61FF]/10 text-[#7B61FF] text-sm font-medium hover:bg-[#7B61FF]/20 transition-colors"
                  >
                    <Brain className="w-4 h-4" />
                    Mapa Mental
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        </>
      ) : (
        <SocialMediaScheduler />
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onCreate={(name, desc) => {
              const newProject: Project = {
                id: `p${Date.now()}`,
                name,
                description: desc,
                color: "from-[#7B61FF] to-[#B14EFF]",
                progress: 0,
                status: "planning",
                totalTasks: 0,
                completedTasks: 0,
                pendingApprovals: 0,
                team: [{ initials: "JD", color: "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]", name: "João Silva" }],
                deadline: "30 abr, 2026",
                daysLeft: 52,
                starred: false,
                category: "Geral",
                recentActivity: [{ action: "Projeto criado", time: "Agora" }],
              };
              setProjects((prev) => [newProject, ...prev]);
              setShowCreateModal(false);
              toast.success("Projeto criado com sucesso!");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, desc: string) => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] max-w-[95vw] bg-background border border-border rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Criar Novo Projeto</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nome do Projeto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Campanha de Marketing Q2"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Descrição</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descreva brevemente o objetivo do projeto..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => name.trim() && onCreate(name, desc)}
            disabled={!name.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white text-sm font-medium shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar Projeto
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
