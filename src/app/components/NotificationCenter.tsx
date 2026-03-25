import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Bell,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Clock,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: "approval" | "comment" | "deadline" | "ai" | "mention" | "invite";
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: { initials: string; color: string };
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "approval",
    title: "Aprovação solicitada",
    description: 'Sarah Johnson pediu sua aprovação em "Assets Campanha Q1"',
    time: "Há 5 min",
    read: false,
    avatar: {
      initials: "SJ",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
  },
  {
    id: "2",
    type: "comment",
    title: "Novo comentário",
    description:
      'Mike Chen comentou em "Atualização de Guidelines": "Nova paleta aprovada!"',
    time: "Há 15 min",
    read: false,
    avatar: {
      initials: "MC",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
  },
  {
    id: "3",
    type: "deadline",
    title: "Prazo se aproximando",
    description:
      '"Copy Redes Sociais" vence amanhã — atribuído a Alex Martinez',
    time: "Há 1h",
    read: false,
  },
  {
    id: "4",
    type: "ai",
    title: "Sugestão da IA",
    description:
      "Detectei um gargalo no fluxo de trabalho. 2 cards estão parados há 3+ dias.",
    time: "Há 2h",
    read: true,
  },
  {
    id: "5",
    type: "mention",
    title: "Você foi mencionado",
    description:
      'Emma Davis mencionou você em "Vídeo Demo do Produto": "@João, pode revisar o script?"',
    time: "Há 3h",
    read: true,
    avatar: {
      initials: "ED",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
  },
  {
    id: "6",
    type: "invite",
    title: "Convite para projeto",
    description: 'Lisa Park convidou você para o projeto "Rebranding 2026"',
    time: "Há 5h",
    read: true,
    avatar: {
      initials: "LP",
      color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    },
  },
];

const typeConfig: Record<
  string,
  { icon: typeof Bell; color: string; bgColor: string }
> = {
  approval: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
  },
  comment: {
    icon: MessageSquare,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
  },
  deadline: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-950/30",
  },
  ai: {
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
  },
  mention: {
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
  },
  invite: {
    icon: UserPlus,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-950/30",
  },
};

export function NotificationCenter({
  isOpen,
  onClose,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [items, setItems] = useState(notifications);

  const filteredItems =
    filter === "unread" ? items.filter((n) => !n.read) : items;
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-4 top-4 bottom-4 w-[400px] z-50 flex flex-col bg-background/95 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Notificações</h3>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount} não lidas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#7B61FF] hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === "all"
                    ? "bg-[#7B61FF] text-white"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === "unread"
                    ? "bg-[#7B61FF] text-white"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Não lidas ({unreadCount})
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredItems.map((notification, index) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-start gap-3 px-5 py-4 border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer ${
                      !notification.read ? "bg-purple-50/30 dark:bg-purple-950/10" : ""
                    }`}
                  >
                    {notification.avatar ? (
                      <div
                        className={`w-9 h-9 rounded-full ${notification.avatar.color} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}
                      >
                        {notification.avatar.initials}
                      </div>
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm ${
                            !notification.read ? "font-semibold" : ""
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-[#7B61FF] mt-1.5 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
