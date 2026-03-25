import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Inbox,
  CheckCircle2,
  MessageSquare,
  AtSign,
  GitBranch,
  Bell,
  Clock,
  Check,
  CheckCheck,
  Filter,
  AlertTriangle,
  ArrowRight,
  Star,
  StarOff,
  Trash2,
  Archive,
  Eye,
  Users,
  FolderKanban,
  Brain,
} from "lucide-react";
import { toast } from "sonner";

interface InboxPageProps {
  onNavigate: (section: string) => void;
}

interface InboxItem {
  id: string;
  type: "approval" | "mention" | "comment" | "assignment" | "update" | "deadline";
  title: string;
  description: string;
  project: string;
  sender: { name: string; initials: string; color: string };
  time: string;
  read: boolean;
  starred: boolean;
  actionable: boolean;
}

const mockInbox: InboxItem[] = [
  {
    id: "i1",
    type: "approval",
    title: "Aprovação necessária: Assets Campanha Q1",
    description: "Sarah Johnson enviou para sua aprovação os novos assets visuais da campanha do primeiro trimestre.",
    project: "Campanha Marketing Q1",
    sender: { name: "Sarah Johnson", initials: "SJ", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    time: "Há 10 min",
    read: false,
    starred: true,
    actionable: true,
  },
  {
    id: "i2",
    type: "mention",
    title: 'Você foi mencionado em "Vídeo Demo do Produto"',
    description: '@João, pode revisar o corte final do vídeo demo? Precisamos enviar hoje.',
    project: "Campanha Marketing Q1",
    sender: { name: "Emma Davis", initials: "ED", color: "bg-gradient-to-br from-emerald-500 to-teal-500" },
    time: "Há 25 min",
    read: false,
    starred: false,
    actionable: false,
  },
  {
    id: "i3",
    type: "comment",
    title: "Novo comentário em Guidelines de Marca",
    description: "Concordo com a Sarah. Também podemos adicionar mais contraste no CTA principal.",
    project: "Redesign do Produto",
    sender: { name: "Mike Chen", initials: "MC", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    time: "Há 1h",
    read: false,
    starred: false,
    actionable: false,
  },
  {
    id: "i4",
    type: "assignment",
    title: "Nova tarefa atribuída a você",
    description: "Criar wireframes para a nova página de onboarding do aplicativo mobile.",
    project: "Lançamento App Mobile",
    sender: { name: "Lisa Park", initials: "LP", color: "bg-gradient-to-br from-indigo-500 to-purple-500" },
    time: "Há 2h",
    read: true,
    starred: false,
    actionable: true,
  },
  {
    id: "i5",
    type: "deadline",
    title: "Prazo se aproximando: Deploy App Mobile",
    description: "O deploy do aplicativo mobile está programado para daqui a 3 dias. Verifique as tarefas pendentes.",
    project: "Lançamento App Mobile",
    sender: { name: "Sistema", initials: "SY", color: "bg-gradient-to-br from-amber-500 to-orange-500" },
    time: "Há 3h",
    read: true,
    starred: true,
    actionable: false,
  },
  {
    id: "i6",
    type: "update",
    title: "Projeto atualizado: Redesign do Produto",
    description: "Lisa Park atualizou o status do projeto para 45% concluído. 3 novas tarefas foram adicionadas.",
    project: "Redesign do Produto",
    sender: { name: "Lisa Park", initials: "LP", color: "bg-gradient-to-br from-indigo-500 to-purple-500" },
    time: "Há 4h",
    read: true,
    starred: false,
    actionable: false,
  },
  {
    id: "i7",
    type: "approval",
    title: "Aprovação necessária: Copy Redes Sociais",
    description: "Alex Martinez finalizou os textos para Instagram e LinkedIn. Aguardando sua revisão.",
    project: "Campanha Marketing Q1",
    sender: { name: "Alex Martinez", initials: "AM", color: "bg-gradient-to-br from-orange-500 to-red-500" },
    time: "Há 5h",
    read: true,
    starred: false,
    actionable: true,
  },
  {
    id: "i8",
    type: "comment",
    title: "Novo comentário em Renovação Landing Page",
    description: "A seção hero ficou excelente! Podemos seguir com esta versão para aprovação do cliente.",
    project: "Redesign do Produto",
    sender: { name: "Tom Wilson", initials: "TW", color: "bg-gradient-to-br from-rose-500 to-pink-500" },
    time: "Ontem",
    read: true,
    starred: false,
    actionable: false,
  },
];

const typeConfig: Record<string, { label: string; icon: typeof Bell; color: string; bg: string }> = {
  approval: { label: "Aprovação", icon: CheckCircle2, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/30" },
  mention: { label: "Menção", icon: AtSign, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-950/30" },
  comment: { label: "Comentário", icon: MessageSquare, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-950/30" },
  assignment: { label: "Atribuição", icon: GitBranch, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
  update: { label: "Atualização", icon: FolderKanban, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-950/30" },
  deadline: { label: "Prazo", icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-950/30" },
};

export function InboxPage({ onNavigate }: InboxPageProps) {
  const [items, setItems] = useState(mockInbox);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);

  const unreadCount = items.filter((i) => !i.read).length;

  const filteredItems = items.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !item.read;
    if (activeFilter === "starred") return item.starred;
    if (activeFilter === "actionable") return item.actionable;
    return item.type === activeFilter;
  });

  const markAsRead = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, read: true } : i));
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, starred: !i.starred } : i));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    toast.success("Todas as notificações marcadas como lidas");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Caixa de Entrada</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? (
              <>Você tem <span className="text-[#7B61FF] font-medium">{unreadCount} {unreadCount === 1 ? "notificação não lida" : "notificações não lidas"}</span></>
            ) : (
              "Todas as notificações foram lidas"
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={markAllRead}
            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "Todas" },
          { id: "unread", label: `Não lidas (${unreadCount})` },
          { id: "actionable", label: "Ação necessária" },
          { id: "starred", label: "Favoritas" },
          { id: "approval", label: "Aprovações" },
          { id: "mention", label: "Menções" },
          { id: "comment", label: "Comentários" },
          { id: "assignment", label: "Atribuições" },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === filter.id
                ? "bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20"
                : "bg-muted/40 text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Inbox List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Inbox className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Nenhuma notificação</p>
            <p className="text-xs text-muted-foreground mt-1">Quando algo precisar da sua atenção, aparecerá aqui.</p>
          </div>
        ) : (
          filteredItems.map((item, i) => {
            const cfg = typeConfig[item.type];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { markAsRead(item.id); setSelectedItem(item); }}
                className={`flex items-start gap-4 px-6 py-4 border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors cursor-pointer group ${
                  !item.read ? "bg-[#7B61FF]/[0.02]" : ""
                }`}
              >
                {/* Unread Dot */}
                <div className="flex items-center pt-1.5 flex-shrink-0">
                  {!item.read ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7B61FF] shadow-sm shadow-purple-500/30" />
                  ) : (
                    <div className="w-2.5 h-2.5" />
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full ${item.sender.color} flex items-center justify-center text-white text-xs font-medium flex-shrink-0 mt-0.5`}>
                  {item.sender.initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{item.project}</span>
                  </div>
                  <p className={`text-sm mb-1 ${!item.read ? "font-semibold" : "font-medium"} group-hover:text-[#7B61FF] transition-colors`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                  <button
                    onClick={(e) => toggleStar(item.id, e)}
                    className="text-muted-foreground hover:text-amber-500 transition-colors"
                  >
                    {item.starred ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : <StarOff className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-[95vw] z-50 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  {(() => {
                    const cfg = typeConfig[selectedItem.type];
                    const Icon = cfg.icon;
                    return (
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs text-muted-foreground">· {selectedItem.time}</span>
                </div>
                <button onClick={() => setSelectedItem(null)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${selectedItem.sender.color} flex items-center justify-center text-white text-sm font-medium`}>
                    {selectedItem.sender.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedItem.sender.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedItem.project}</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold">{selectedItem.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedItem.description}</p>

                {selectedItem.actionable && (
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedItem(null); toast.success("Aprovado!"); }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white text-sm font-medium"
                    >
                      Aprovar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedItem(null); onNavigate("workflow"); }}
                      className="flex-1 py-2.5 rounded-xl bg-muted/50 text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Ver no Kanban
                    </motion.button>
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
