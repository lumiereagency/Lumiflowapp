import { Moon, Sun, ChevronDown, LogOut, User, Settings, CreditCard, Bell, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  trialDaysRemaining: number;
  onUpgradeClick: () => void;
  onNotificationsClick: () => void;
  isPremium?: boolean;
  sidebarWidth: number;
  onBillingClick?: () => void;
  onNavigate?: (section: string) => void;
}

export function Navbar({
  darkMode,
  onToggleDarkMode,
  trialDaysRemaining,
  onUpgradeClick,
  onNotificationsClick,
  isPremium,
  sidebarWidth,
  onBillingClick,
  onNavigate,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.nav
      animate={{ paddingLeft: sidebarWidth + 16 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-30 border-b border-border/40 backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex items-center justify-between px-6 h-14">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar projetos, tarefas, membros..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/40 border border-transparent focus:border-[#7B61FF]/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 ml-4">
          {/* Trial Badge */}
          {!isPremium && (
            <motion.button
              onClick={onUpgradeClick}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                {trialDaysRemaining} dias restantes
              </span>
            </motion.button>
          )}

          {isPremium && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#7B61FF]/10 to-[#B14EFF]/10 border border-[#7B61FF]/20 text-xs font-medium text-[#7B61FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
              Premium
            </span>
          )}

          {/* Notifications */}
          <motion.button
            onClick={onNotificationsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-accent transition-colors duration-200"
            aria-label="Notificações"
          >
            <Bell className="w-[18px] h-[18px] text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#7B61FF] ring-2 ring-background" />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            onClick={onToggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-accent transition-colors duration-200"
            aria-label="Alternar tema"
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? (
                <Sun className="w-[18px] h-[18px] text-muted-foreground" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-muted-foreground" />
              )}
            </motion.div>
          </motion.button>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center text-white text-xs font-medium shadow-lg shadow-purple-500/20">
                JD
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-sm font-medium">João Silva</div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <motion.div
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute right-0 mt-2 w-52 bg-popover border border-border rounded-xl shadow-xl overflow-hidden backdrop-blur-xl z-50"
              >
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-medium">João Silva</div>
                  <div className="text-xs text-muted-foreground">joao@empresa.com</div>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onNavigate) onNavigate("settings");
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-left"
                  >
                    <User className="w-4 h-4" />
                    Meu Perfil
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onNavigate) onNavigate("settings");
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-left"
                  >
                    <Settings className="w-4 h-4" />
                    Configurações
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onBillingClick) onBillingClick();
                      else onUpgradeClick();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-left"
                  >
                    <CreditCard className="w-4 h-4" />
                    Planos e Pagamento
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-destructive text-left">
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}