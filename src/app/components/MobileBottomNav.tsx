import { motion } from "motion/react";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  Rocket,
  Sparkles,
} from "lucide-react";

interface MobileBottomNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "projects", label: "Projetos", icon: FolderKanban },
  { id: "productivity", label: "Produção", icon: Rocket },
  { id: "ai-assistant", label: "IA", icon: Sparkles },
];

export function MobileBottomNav({ activeSection, onSectionChange }: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/40 px-2 py-1 safe-area-pb">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSectionChange(item.id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-colors ${
                  isActive ? "text-[#7B61FF]" : "text-muted-foreground"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="mobileActive"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7B61FF]"
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}