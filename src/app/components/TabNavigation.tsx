import { motion } from "motion/react";
import { Brain, GitBranch } from "lucide-react";

interface TabNavigationProps {
  activeTab: "mindmaps" | "workflow";
  onTabChange: (tab: "mindmaps" | "workflow") => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-2xl w-fit">
      <button
        onClick={() => onTabChange("mindmaps")}
        className="relative px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
      >
        {activeTab === "mindmaps" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-xl shadow-lg shadow-purple-500/30"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Brain
          className={`w-5 h-5 relative z-10 transition-colors ${
            activeTab === "mindmaps" ? "text-white" : "text-muted-foreground"
          }`}
        />
        <span
          className={`relative z-10 font-medium transition-colors ${
            activeTab === "mindmaps" ? "text-white" : "text-foreground"
          }`}
        >
          Criatividade & Mapas Mentais
        </span>
      </button>

      <button
        onClick={() => onTabChange("workflow")}
        className="relative px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
      >
        {activeTab === "workflow" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-xl shadow-lg shadow-purple-500/30"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <GitBranch
          className={`w-5 h-5 relative z-10 transition-colors ${
            activeTab === "workflow" ? "text-white" : "text-muted-foreground"
          }`}
        />
        <span
          className={`relative z-10 font-medium transition-colors ${
            activeTab === "workflow" ? "text-white" : "text-foreground"
          }`}
        >
          Aprovações & Fluxo de Trabalho
        </span>
      </button>
    </div>
  );
}