import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Shield,
  Mail,
  MoreHorizontal,
  Crown,
  Eye,
  Edit3,
  Trash2,
  X,
  Check,
  Clock,
  Activity,
  UserPlus,
  ChevronDown,
  ArrowUpRight,
  Star,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface TeamManagementProps {
  onNavigate: (section: string) => void;
  onInviteClick: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: "owner" | "admin" | "editor" | "viewer";
  status: "active" | "invited" | "inactive";
  joinedDate: string;
  lastActive: string;
  projectsCount: number;
  tasksCompleted: number;
  avatar?: string;
}

const mockMembers: TeamMember[] = [
  {
    id: "m1",
    name: "João Silva",
    email: "joao@empresa.com",
    initials: "JD",
    color: "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]",
    role: "owner",
    status: "active",
    joinedDate: "01 jan, 2025",
    lastActive: "Agora",
    projectsCount: 6,
    tasksCompleted: 128,
  },
  {
    id: "m2",
    name: "Sarah Johnson",
    email: "sarah@empresa.com",
    initials: "SJ",
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    role: "admin",
    status: "active",
    joinedDate: "15 jan, 2025",
    lastActive: "Há 5 min",
    projectsCount: 4,
    tasksCompleted: 95,
  },
  {
    id: "m3",
    name: "Mike Chen",
    email: "mike@empresa.com",
    initials: "MC",
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    role: "editor",
    status: "active",
    joinedDate: "20 jan, 2025",
    lastActive: "Há 15 min",
    projectsCount: 3,
    tasksCompleted: 72,
  },
  {
    id: "m4",
    name: "Emma Davis",
    email: "emma@empresa.com",
    initials: "ED",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    role: "editor",
    status: "active",
    joinedDate: "01 fev, 2025",
    lastActive: "Há 1h",
    projectsCount: 3,
    tasksCompleted: 64,
  },
  {
    id: "m5",
    name: "Alex Martinez",
    email: "alex@empresa.com",
    initials: "AM",
    color: "bg-gradient-to-br from-orange-500 to-red-500",
    role: "editor",
    status: "active",
    joinedDate: "10 fev, 2025",
    lastActive: "Há 2h",
    projectsCount: 2,
    tasksCompleted: 41,
  },
  {
    id: "m6",
    name: "Lisa Park",
    email: "lisa@empresa.com",
    initials: "LP",
    color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    role: "viewer",
    status: "active",
    joinedDate: "15 fev, 2025",
    lastActive: "Há 3h",
    projectsCount: 2,
    tasksCompleted: 33,
  },
  {
    id: "m7",
    name: "Tom Wilson",
    email: "tom@empresa.com",
    initials: "TW",
    color: "bg-gradient-to-br from-rose-500 to-pink-500",
    role: "editor",
    status: "invited",
    joinedDate: "—",
    lastActive: "—",
    projectsCount: 0,
    tasksCompleted: 0,
  },
  {
    id: "m8",
    name: "Nina Rodriguez",
    email: "nina@empresa.com",
    initials: "NR",
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
    role: "viewer",
    status: "inactive",
    joinedDate: "05 jan, 2025",
    lastActive: "Há 14 dias",
    projectsCount: 1,
    tasksCompleted: 12,
  },
];

const roleConfig: Record<string, { label: string; icon: typeof Crown; color: string; bg: string }> = {
  owner: { label: "Proprietário", icon: Crown, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/30" },
  admin: { label: "Admin", icon: Shield, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-950/30" },
  editor: { label: "Editor", icon: Edit3, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-950/30" },
  viewer: { label: "Visualizador", icon: Eye, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Ativo", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
  invited: { label: "Convidado", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/30" },
  inactive: { label: "Inativo", color: "text-muted-foreground", bg: "bg-muted/50" },
};

export function TeamManagement({ onNavigate, onInviteClick }: TeamManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = mockMembers.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || m.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: mockMembers.length,
    active: mockMembers.filter((m) => m.status === "active").length,
    invited: mockMembers.filter((m) => m.status === "invited").length,
    totalTasks: mockMembers.reduce((a, m) => a + m.tasksCompleted, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie membros, permissões e atividade do seu workspace
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onInviteClick}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-shadow"
        >
          <UserPlus className="w-5 h-5" />
          Convidar Membro
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total de Membros", value: stats.total, icon: Users, color: "from-[#7B61FF] to-[#B14EFF]" },
          { label: "Membros Ativos", value: stats.active, icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
          { label: "Convites Pendentes", value: stats.invited, icon: Mail, color: "from-amber-500 to-orange-500" },
          { label: "Tarefas Concluídas", value: stats.totalTasks, icon: Activity, color: "from-blue-500 to-cyan-500" },
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
            placeholder="Buscar membros..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "owner", "admin", "editor", "viewer"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filterRole === role
                  ? "bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {role === "all" ? "Todos" : roleConfig[role]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_120px_100px_120px_100px_80px] gap-4 px-6 py-3 border-b border-border/40 bg-muted/20">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Membro</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Função</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Último Acesso</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tarefas</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider"></span>
        </div>

        {/* Members */}
        {filteredMembers.map((member, i) => {
          const role = roleConfig[member.role];
          const RoleIcon = role.icon;
          const status = statusConfig[member.status];

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedMember(member)}
              className="grid grid-cols-[1fr_120px_100px_120px_100px_80px] gap-4 px-6 py-4 border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors cursor-pointer group"
            >
              {/* Member Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
                  {member.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-[#7B61FF] transition-colors">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center">
                <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium ${role.bg} ${role.color}`}>
                  <RoleIcon className="w-3 h-3" />
                  {role.label}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Last Active */}
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">{member.lastActive}</span>
              </div>

              {/* Tasks */}
              <div className="flex items-center">
                <span className="text-sm font-medium">{member.tasksCompleted}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end">
                <button className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum membro encontrado</p>
          </div>
        )}
      </div>

      {/* Member Detail Overlay */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[420px] z-50 bg-background border-l border-border shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                <h2 className="font-semibold">Perfil do Membro</h2>
                <button onClick={() => setSelectedMember(null)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-2xl ${selectedMember.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}>
                    {selectedMember.initials}
                  </div>
                  <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                  <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-lg text-xs font-medium ${roleConfig[selectedMember.role].bg} ${roleConfig[selectedMember.role].color}`}>
                    {(() => {
                      const RIcon = roleConfig[selectedMember.role].icon;
                      return <RIcon className="w-3 h-3" />;
                    })()}
                    {roleConfig[selectedMember.role].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{selectedMember.projectsCount}</p>
                    <p className="text-xs text-muted-foreground">Projetos</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{selectedMember.tasksCompleted}</p>
                    <p className="text-xs text-muted-foreground">Tarefas</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${statusConfig[selectedMember.status].bg} ${statusConfig[selectedMember.status].color}`}>
                      {statusConfig[selectedMember.status].label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-xs text-muted-foreground">Membro desde</span>
                    <span className="text-sm">{selectedMember.joinedDate}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-xs text-muted-foreground">Último acesso</span>
                    <span className="text-sm">{selectedMember.lastActive}</span>
                  </div>
                </div>

                {selectedMember.role !== "owner" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => { setSelectedMember(null); toast.success("Convite reenviado!"); }}
                      className="flex-1 py-2.5 rounded-xl bg-[#7B61FF]/10 text-[#7B61FF] text-sm font-medium hover:bg-[#7B61FF]/20 transition-colors"
                    >
                      Reenviar Convite
                    </button>
                    <button
                      onClick={() => { setSelectedMember(null); toast.success("Membro removido"); }}
                      className="py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}