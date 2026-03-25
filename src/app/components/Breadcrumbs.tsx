import { motion } from "motion/react";
import { ChevronRight, LayoutDashboard } from "lucide-react";

interface BreadcrumbsProps {
  items: { label: string; section?: string }[];
  onNavigate: (section: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-xs mb-6"
    >
      <button
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </button>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
          {item.section ? (
            <button
              onClick={() => onNavigate(item.section!)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </motion.nav>
  );
}
