import { motion } from "motion/react";
import { Lock, Sparkles, Check, X, Zap } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName?: string;
}

const featureComparison = [
  { feature: "Workspaces", starter: "2", pro: "Ilimitados", enterprise: "Ilimitados" },
  { feature: "Mapas mentais", starter: "Básico", pro: "Avançado", enterprise: "Avançado" },
  { feature: "Kanban boards", starter: "Básico", pro: "Completo", enterprise: "Completo" },
  { feature: "IA — Geração de tarefas", starter: "10/mês", pro: "Ilimitado", enterprise: "Ilimitado" },
  { feature: "IA — Automações", starter: false, pro: true, enterprise: true },
  { feature: "IA — Resumos de projeto", starter: false, pro: true, enterprise: true },
  { feature: "Sistema de aprovação", starter: false, pro: true, enterprise: true },
  { feature: "Aprovação de clientes externos", starter: false, pro: false, enterprise: true },
  { feature: "Google Calendar", starter: true, pro: true, enterprise: true },
  { feature: "Colaboração em tempo real", starter: false, pro: true, enterprise: true },
  { feature: "Dashboard de análises", starter: false, pro: false, enterprise: true },
  { feature: "API access", starter: false, pro: false, enterprise: true },
  { feature: "Suporte prioritário", starter: false, pro: true, enterprise: true },
  { feature: "Suporte 24/7 dedicado", starter: false, pro: false, enterprise: true },
];

export function UpgradeModal({ isOpen, onClose, onUpgrade, featureName }: UpgradeModalProps) {
  if (!isOpen) return null;

  const renderCell = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-sm">{value}</span>;
    }
    return value ? (
      <Check className="w-4 h-4 text-emerald-500 mx-auto" />
    ) : (
      <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-background rounded-3xl shadow-2xl my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
            className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
          >
            <Lock className="w-7 h-7" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">
            {featureName
              ? `"${featureName}" é um recurso premium`
              : "Desbloqueie recursos avançados"}
          </h2>
          <p className="text-white/80">
            Compare os planos e escolha o melhor para sua equipe
          </p>
        </div>

        {/* Comparison Table */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Recurso
                </th>
                <th className="text-center py-3 px-2 text-sm font-medium w-24">
                  Starter
                </th>
                <th className="text-center py-3 px-2 text-sm font-medium w-24">
                  <span className="bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] bg-clip-text text-transparent">
                    Pro
                  </span>
                </th>
                <th className="text-center py-3 px-2 text-sm font-medium w-24">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {featureComparison.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-2.5 px-2 text-sm">{row.feature}</td>
                  <td className="py-2.5 px-2 text-center">
                    {renderCell(row.starter)}
                  </td>
                  <td className="py-2.5 px-2 text-center bg-purple-50/30 dark:bg-purple-950/10">
                    {renderCell(row.pro)}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {renderCell(row.enterprise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="p-6 border-t border-border flex flex-col sm:flex-row items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all"
          >
            <Zap className="w-4 h-4" />
            Desbloquear recursos avançados
          </motion.button>
          <button
            onClick={onClose}
            className="px-6 py-3.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Agora não
          </button>
        </div>
      </motion.div>
    </div>
  );
}
