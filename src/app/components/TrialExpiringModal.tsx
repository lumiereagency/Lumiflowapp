import { motion } from "motion/react";
import { Clock, Sparkles, Zap, Users, Shield } from "lucide-react";

interface TrialExpiringModalProps {
  daysRemaining: number;
  onUpgrade: () => void;
  onDismiss: () => void;
}

export function TrialExpiringModal({
  daysRemaining,
  onUpgrade,
  onDismiss,
}: TrialExpiringModalProps) {
  const percentage = (daysRemaining / 15) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <Clock className="w-8 h-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-2"
          >
            Seu teste termina em {daysRemaining} dias
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/90"
          >
            Continue aproveitando todos os recursos premium
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 -mt-4 relative z-10">
          <div className="bg-background rounded-full h-3 shadow-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#7B61FF]" />
            O que você ganha ao assinar:
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Acesso Ilimitado</h4>
                <p className="text-sm text-muted-foreground">
                  Crie quantos mapas e workflows precisar, sem limites
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Colaboração em Tempo Real</h4>
                <p className="text-sm text-muted-foreground">
                  Trabalhe junto com seu time simultaneamente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Suporte Prioritário</h4>
                <p className="text-sm text-muted-foreground">
                  Ajuda rápida quando você mais precisa
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUpgrade}
              className="w-full py-4 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all"
            >
              Assinar agora
            </motion.button>

            <button
              onClick={onDismiss}
              className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continuar com teste grátis
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            💳 Sem cobranças até o fim do período de teste
          </p>
        </div>
      </motion.div>
    </div>
  );
}
