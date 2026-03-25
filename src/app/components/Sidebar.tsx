import {
  Brain,
  GitBranch,
  LayoutDashboard,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FolderKanban,
  LayoutTemplate,
  Globe,
  Gift,
  TrendingUp,
  Inbox,
  Zap,
  Activity,
  HelpCircle,
  Rocket,
  Palette,
  Trophy,
  ShoppingBag,
  Share2,
} from "lucide-react";
import logoImg from "figma:asset/941444256f7c55985c72f1ccbbb282a1128e3849.png";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

const navGroups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "inbox", label: "Caixa de Entrada", icon: Inbox, badge: 3 },
      { id: "projects", label: "Projetos", icon: FolderKanban },
      { id: "productivity", label: "Produtividade", icon: Rocket },
      { id: "calendar", label: "Calendário", icon: Calendar },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { id: "mindmaps", label: "Mapas Mentais", icon: Brain },
      { id: "workflow", label: "Fluxo de Trabalho", icon: GitBranch },
      { id: "templates", label: "Templates", icon: LayoutTemplate },
      { id: "automations", label: "Automações", icon: Zap },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "analytics", label: "Análises", icon: BarChart3 },
      { id: "activity", label: "Atividades", icon: Activity },
      { id: "growth", label: "Crescimento", icon: TrendingUp },
    ],
  },
  {
    label: "Comunidade",
    items: [
      { id: "community", label: "Hub Comunitário", icon: Globe },
      { id: "rankings", label: "Rankings", icon: Trophy },
      { id: "rewards", label: "Recompensas", icon: Gift },
      { id: "referral", label: "Indicações", icon: Share2 },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { id: "store", label: "Lumiflow Store", icon: ShoppingBag },
  { id: "team", label: "Equipe", icon: Users },
  { id: "design-system", label: "Design System", icon: Palette },
  { id: "help", label: "Ajuda", icon: HelpCircle },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  activeSection,
  onSectionChange,
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/40">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={logoImg}
            alt="Lumiflow"
            className="w-full h-full object-cover"
          />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-semibold bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] bg-clip-text text-transparent whitespace-nowrap"
            >
              Lumiflow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSectionChange("command-bar")}
          className={`flex items-center gap-3 w-full rounded-xl bg-muted/50 hover:bg-muted transition-colors ${
            collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
          }`}
        >
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between flex-1"
              >
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Buscar...
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-background text-[9px] text-muted-foreground font-mono border border-border/50">
                  ⌘K
                </kbd>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-muted-foreground px-3 pt-4 pb-1.5 uppercase tracking-widest font-medium"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>

            {collapsed && <div className="h-2" />}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: collapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSectionChange(item.id)}
                  className={`relative flex items-center gap-3 w-full rounded-xl transition-all duration-200 ${
                    collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2"
                  } ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-xl shadow-lg shadow-purple-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex-shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                    {item.badge && !isActive && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#7B61FF] text-white text-[8px] rounded-full flex items-center justify-center font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between flex-1 relative z-10"
                      >
                        <span className="text-sm whitespace-nowrap">
                          {item.label}
                        </span>
                        {item.badge && isActive && (
                          <span className="w-5 h-5 bg-white/20 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                            {item.badge}
                          </span>
                        )}
                        {item.badge && !isActive && (
                          <span className="w-5 h-5 bg-[#7B61FF]/10 text-[#7B61FF] text-[9px] rounded-full flex items-center justify-center font-medium">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        ))}

        {/* AI Assistant Button */}
        <div className="pt-1 pb-1">
          {collapsed && <div className="h-px bg-border/40 mx-2 my-2" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-muted-foreground px-3 pt-4 pb-1.5 uppercase tracking-widest font-medium"
              >
                Inteligência
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ x: collapsed ? 0 : 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSectionChange("ai-assistant")}
            className={`relative flex items-center gap-3 w-full rounded-xl transition-all duration-200 ${
              collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2"
            } ${
              activeSection === "ai-assistant"
                ? "text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {activeSection === "ai-assistant" && (
              <motion.div
                layoutId="sidebarActive"
                className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-xl shadow-lg shadow-purple-500/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Sparkles className="w-[18px] h-[18px] relative z-10 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm relative z-10 whitespace-nowrap"
                >
                  Assistente IA
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 pb-2 space-y-0.5 border-t border-border/40 pt-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: collapsed ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange(item.id)}
              className={`relative flex items-center gap-3 w-full rounded-xl transition-all duration-200 ${
                collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2"
              } ${
                isActive
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-xl shadow-lg shadow-purple-500/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className="w-[18px] h-[18px] relative z-10 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm relative z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <div className="px-3 pb-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-full py-2 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}