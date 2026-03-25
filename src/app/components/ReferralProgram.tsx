import { motion } from "motion/react";
import { useState } from "react";
import {
  Gift,
  Copy,
  Check,
  Users,
  Zap,
  Brain,
  Sparkles,
  ArrowRight,
  Trophy,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface ReferralProgramProps {
  onNavigate: (section: string) => void;
}

const rewards = [
  {
    milestone: 3,
    title: "+50 requisições IA",
    desc: "Mais poder de inteligência artificial",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    unlocked: true,
  },
  {
    milestone: 5,
    title: "Templates Premium",
    desc: "Acesso a 10 templates exclusivos",
    icon: Brain,
    color: "from-[#7B61FF] to-[#B14EFF]",
    unlocked: true,
  },
  {
    milestone: 10,
    title: "Automações Avançadas",
    desc: "Desbloqueie 5 automações extras",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-500",
    unlocked: false,
  },
  {
    milestone: 25,
    title: "1 mês grátis Pro",
    desc: "Um mês completo do plano Pro de graça",
    icon: Trophy,
    color: "from-amber-500 to-orange-500",
    unlocked: false,
  },
];

const referralHistory = [
  { name: "Ana Souza", email: "ana@empresa.com", date: "05 mar 2026", status: "Ativo", initials: "AS", color: "from-pink-500 to-rose-500" },
  { name: "Pedro Lima", email: "pedro@startup.com", date: "02 mar 2026", status: "Ativo", initials: "PL", color: "from-blue-500 to-cyan-500" },
  { name: "Marina Costa", email: "marina@agencia.com", date: "28 fev 2026", status: "Ativo", initials: "MC", color: "from-emerald-500 to-teal-500" },
  { name: "Lucas Mendes", email: "lucas@dev.com", date: "25 fev 2026", status: "Ativo", initials: "LM", color: "from-orange-500 to-red-500" },
  { name: "Carla Dias", email: "carla@design.com", date: "20 fev 2026", status: "Ativo", initials: "CD", color: "from-violet-500 to-purple-500" },
  { name: "Thiago Rocha", email: "thiago@tech.com", date: "18 fev 2026", status: "Pendente", initials: "TR", color: "from-slate-500 to-gray-600" },
];

export function ReferralProgram({ onNavigate }: ReferralProgramProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const referralLink = "https://app.lumiflow.com/r/joao-s1lva";
  const totalReferrals = 6;
  const activeReferrals = 5;
  const nextMilestone = 10;
  const progress = (activeReferrals / nextMilestone) * 100;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setLinkCopied(true);
    toast.success("Link de indicação copiado!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Gift className="w-6 h-6 text-[#7B61FF]" />
          Programa de Indicação
        </h1>
        <p className="text-muted-foreground">
          Convide amigos e ganhe recompensas exclusivas
        </p>
      </div>

      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalReferrals}</div>
              <div className="text-white/70 text-sm">Total convidados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{activeReferrals}</div>
              <div className="text-white/70 text-sm">Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2</div>
              <div className="text-white/70 text-sm">Recompensas ganhas</div>
            </div>
          </div>

          {/* Progress to next milestone */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/80">
                Próxima recompensa: {nextMilestone} indicações
              </span>
              <span className="font-medium">
                {activeReferrals}/{nextMilestone}
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Referral Link */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          Seu link de indicação
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-muted/30 rounded-xl text-sm font-mono truncate border border-border">
            {referralLink}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 whitespace-nowrap"
          >
            {linkCopied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {linkCopied ? "Copiado" : "Copiar"}
          </motion.button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Compartilhe este link e ganhe recompensas quando novos usuários se cadastrarem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rewards */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Recompensas
          </h3>
          {rewards.map((reward, index) => {
            const Icon = reward.icon;
            return (
              <motion.div
                key={reward.milestone}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  reward.unlocked
                    ? "bg-card border-border"
                    : "bg-muted/10 border-border/50 opacity-60"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${reward.color} flex items-center justify-center shadow-lg flex-shrink-0 ${
                    !reward.unlocked ? "grayscale" : ""
                  }`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-medium text-sm">{reward.title}</h4>
                    {reward.unlocked && (
                      <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] rounded-full font-medium">
                        Desbloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {reward.desc}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-sm font-bold ${
                      reward.unlocked
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {reward.milestone}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    indicações
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* History */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7B61FF]" />
            Histórico de Indicações
          </h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {referralHistory.map((ref, index) => (
              <motion.div
                key={ref.email}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className="flex items-center justify-between px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${ref.color} flex items-center justify-center text-white text-xs font-medium shadow-md`}
                  >
                    {ref.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ref.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {ref.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                    ref.status === "Ativo"
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {ref.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Viral CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/15 dark:to-blue-950/15 border border-[#7B61FF]/10 rounded-2xl p-6 text-center"
      >
        <Star className="w-8 h-8 text-[#7B61FF] mx-auto mb-3" />
        <h3 className="font-bold mb-1">
          Faltam {nextMilestone - activeReferrals} indicações para sua próxima recompensa!
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Convide colegas e desbloqueie automações avançadas
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate("team")}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-500/20"
        >
          Convidar agora
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}
