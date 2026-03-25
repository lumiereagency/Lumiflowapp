import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  Brain,
  ListChecks,
  Wand2,
  Target,
  AlertTriangle,
  BarChart3,
  Users,
  Calendar,
  Zap,
  FileText,
  ArrowRight,
  Command,
} from "lucide-react";

interface AICommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToAI: (prompt: string) => void;
}

const commandCategories = [
  {
    label: "IA — Projetos",
    commands: [
      { icon: Target, label: "Criar estrutura de projeto", prompt: "Criar um novo projeto com estrutura completa", accent: "text-[#7B61FF]" },
      { icon: Brain, label: "Mapa mental → Tarefas", prompt: "Transformar esse mapa mental em um plano de projeto com tarefas organizadas", accent: "text-[#7B61FF]" },
      { icon: ListChecks, label: "Gerar tarefas automaticamente", prompt: "Criar tarefas para esse projeto", accent: "text-[#7B61FF]" },
      { icon: FileText, label: "Resumir status do projeto", prompt: "Resumir status do projeto", accent: "text-[#7B61FF]" },
    ],
  },
  {
    label: "IA — Análises",
    commands: [
      { icon: Wand2, label: "Otimizar fluxo de trabalho", prompt: "Analisar o fluxo de trabalho e sugerir melhorias", accent: "text-blue-500" },
      { icon: AlertTriangle, label: "Detectar riscos de atraso", prompt: "Analisar o projeto atual e identificar riscos de atraso", accent: "text-amber-500" },
      { icon: BarChart3, label: "Analisar produtividade", prompt: "Analisar produtividade do time", accent: "text-emerald-500" },
      { icon: Users, label: "Resumir discussões do time", prompt: "Resumir as últimas discussões e comentários do time", accent: "text-cyan-500" },
    ],
  },
  {
    label: "IA — Automação",
    commands: [
      { icon: Zap, label: "Criar automação por texto", prompt: "Quando uma tarefa for aprovada, mover para concluído", accent: "text-orange-500" },
      { icon: Calendar, label: "Gerar plano semanal", prompt: "Gerar plano semanal", accent: "text-indigo-500" },
    ],
  },
];

export function AICommandBar({ isOpen, onClose, onSendToAI }: AICommandBarProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allCommands = commandCategories.flatMap((cat) =>
    cat.commands.map((cmd) => ({ ...cmd, category: cat.label }))
  );

  const filtered = query.trim()
    ? allCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.prompt.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (index: number) => {
    const cmd = filtered[index];
    if (cmd) {
      onSendToAI(cmd.prompt);
      onClose();
    }
  };

  const handleSubmitCustom = () => {
    if (query.trim()) {
      onSendToAI(query.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length > 0) {
        handleSelect(selectedIndex);
      } else {
        handleSubmitCustom();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Group filtered commands by category for display
  const groupedFiltered: { label: string; commands: typeof filtered }[] = [];
  const seenCategories = new Set<string>();
  for (const cmd of filtered) {
    if (!seenCategories.has(cmd.category)) {
      seenCategories.add(cmd.category);
      groupedFiltered.push({
        label: cmd.category,
        commands: filtered.filter((c) => c.category === cmd.category),
      });
    }
  }

  let globalIndex = -1;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-xl bg-background/95 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Peça algo ao AI Copilot..."
            className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">ESC</kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[350px] overflow-y-auto py-2">
          {query.trim() && filtered.length === 0 && (
            <div className="px-5 py-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Nenhum comando encontrado
              </p>
              <button
                onClick={handleSubmitCustom}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-xs font-medium"
              >
                <Sparkles className="w-3 h-3" />
                Enviar "{query}" para o AI Copilot
              </button>
            </div>
          )}

          {groupedFiltered.map((group) => (
            <div key={group.label}>
              <div className="px-5 py-1.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {group.label}
                </p>
              </div>
              {group.commands.map((cmd) => {
                globalIndex++;
                const idx = globalIndex;
                const Icon = cmd.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={`${cmd.label}-${idx}`}
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                      isSelected ? "bg-[#7B61FF]/10" : "hover:bg-muted/30"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${cmd.accent}`} />
                    <span className={`text-sm flex-1 ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {cmd.label}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#7B61FF]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border/40 bg-muted/10 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded">↑</kbd>
              <kbd className="px-1 py-0.5 bg-muted rounded">↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
              executar
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />K para abrir
          </span>
        </div>
      </motion.div>
    </div>
  );
}
