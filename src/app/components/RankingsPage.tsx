import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Target,
  CheckCircle2,
  TrendingUp,
  Star,
  Zap,
  ChevronUp,
  ChevronDown,
  Minus,
  Award,
  Users,
  Calendar,
  Globe,
  Sparkles,
  Gift,
  ArrowRight,
} from "lucide-react";

interface RankingsPageProps {
  onNavigate: (section: string) => void;
}

type LeaderboardPeriod = "weekly" | "monthly" | "global";

interface RankedUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  points: number;
  streak: number;
  tasksCompleted: number;
  goalsAchieved: number;
  challengesWon: number;
  change: "up" | "down" | "same";
  changeAmount?: number;
  badge?: string;
  isElite?: boolean;
}

const mockUsers: RankedUser[] = [
  { id: "1", name: "Ana Beatriz", initials: "AB", color: "from-pink-500 to-rose-500", points: 12840, streak: 45, tasksCompleted: 342, goalsAchieved: 28, challengesWon: 12, change: "same", badge: "🔥 Imparável", isElite: true },
  { id: "2", name: "Carlos Silva", initials: "CS", color: "from-blue-500 to-cyan-500", points: 11920, streak: 38, tasksCompleted: 298, goalsAchieved: 24, challengesWon: 10, change: "up", changeAmount: 2, badge: "⚡ Veloz", isElite: true },
  { id: "3", name: "Marina Costa", initials: "MC", color: "from-purple-500 to-violet-500", points: 10650, streak: 32, tasksCompleted: 267, goalsAchieved: 21, challengesWon: 8, change: "up", changeAmount: 1, isElite: true },
  { id: "4", name: "Rafael Oliveira", initials: "RO", color: "from-emerald-500 to-green-500", points: 9870, streak: 28, tasksCompleted: 231, goalsAchieved: 19, challengesWon: 7, change: "down", changeAmount: 1 },
  { id: "5", name: "Juliana Lima", initials: "JL", color: "from-amber-500 to-orange-500", points: 9340, streak: 25, tasksCompleted: 215, goalsAchieved: 17, challengesWon: 6, change: "up", changeAmount: 3 },
  { id: "6", name: "Lucas Pereira", initials: "LP", color: "from-indigo-500 to-blue-500", points: 8920, streak: 22, tasksCompleted: 198, goalsAchieved: 15, challengesWon: 5, change: "same" },
  { id: "7", name: "Fernanda Santos", initials: "FS", color: "from-teal-500 to-emerald-500", points: 8450, streak: 19, tasksCompleted: 184, goalsAchieved: 14, challengesWon: 5, change: "down", changeAmount: 2 },
  { id: "8", name: "Pedro Mendes", initials: "PM", color: "from-red-500 to-pink-500", points: 7980, streak: 16, tasksCompleted: 172, goalsAchieved: 12, challengesWon: 4, change: "up", changeAmount: 1 },
  { id: "9", name: "Gabriela Rocha", initials: "GR", color: "from-violet-500 to-purple-500", points: 7520, streak: 14, tasksCompleted: 159, goalsAchieved: 11, challengesWon: 3, change: "same" },
  { id: "10", name: "Thiago Alves", initials: "TA", color: "from-sky-500 to-blue-500", points: 7100, streak: 12, tasksCompleted: 145, goalsAchieved: 10, challengesWon: 3, change: "up", changeAmount: 2 },
];

const currentUser = {
  rank: 4,
  name: "Você",
  initials: "VC",
  points: 9870,
  streak: 28,
  totalXP: 15200,
  level: 18,
  nextLevelXP: 17000,
};

const weeklyChallenge = {
  title: "Sprint de Produtividade",
  description: "Complete 50 tarefas esta semana para ganhar 500 pontos extras",
  progress: 34,
  target: 50,
  reward: 500,
  endsIn: "3 dias",
};

const pointRules = [
  { icon: CheckCircle2, label: "Tarefa concluída", points: "+10 pts", color: "text-emerald-500" },
  { icon: Flame, label: "Streak diário", points: "+5 pts/dia", color: "text-orange-500" },
  { icon: Target, label: "Meta alcançada", points: "+50 pts", color: "text-blue-500" },
  { icon: Trophy, label: "Desafio semanal vencido", points: "+200 pts", color: "text-amber-500" },
  { icon: Star, label: "Consistência mensal", points: "+500 pts", color: "text-purple-500" },
];

export function RankingsPage({ onNavigate }: RankingsPageProps) {
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");

  const periods: { id: LeaderboardPeriod; label: string; icon: typeof Calendar }[] = [
    { id: "weekly", label: "Semanal", icon: Calendar },
    { id: "monthly", label: "Mensal", icon: TrendingUp },
    { id: "global", label: "Global", icon: Globe },
  ];

  const progressPercent = ((currentUser.totalXP - (currentUser.nextLevelXP - 2000)) / 2000) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-500" />
            Rankings & Gamificação
          </h1>
          <p className="text-muted-foreground mt-1">
            Compita, evolua e conquiste recompensas reais
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate("rewards")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-orange-500/20"
        >
          <Gift className="w-4 h-4" />
          Ver Recompensas
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Sua Posição", value: `#${currentUser.rank}`, icon: Medal, color: "from-amber-400 to-orange-500", sub: "Top 10%" },
          { label: "Pontos Totais", value: currentUser.points.toLocaleString("pt-BR"), icon: Star, color: "from-[#7B61FF] to-[#B14EFF]", sub: `Nível ${currentUser.level}` },
          { label: "Streak Atual", value: `${currentUser.streak} dias`, icon: Flame, color: "from-orange-500 to-red-500", sub: "Recorde: 45 dias" },
          { label: "XP Total", value: currentUser.totalXP.toLocaleString("pt-BR"), icon: Zap, color: "from-emerald-400 to-teal-500", sub: `${currentUser.nextLevelXP - currentUser.totalXP} XP p/ nível ${currentUser.level + 1}` },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-card border border-border/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-5 rounded-full -translate-y-4 translate-x-4" />
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} mb-2`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-0.5">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="p-5 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center text-white text-sm font-bold">
              {currentUser.level}
            </div>
            <span className="font-medium">Nível {currentUser.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentUser.totalXP.toLocaleString("pt-BR")} / {currentUser.nextLevelXP.toLocaleString("pt-BR")} XP
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border/50 overflow-hidden">
          {/* Period Tabs */}
          <div className="flex items-center gap-1 p-3 border-b border-border/50">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  period === p.id
                    ? "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <p.icon className="w-4 h-4" />
                {p.label}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-4 pt-8 pb-6 px-4 bg-gradient-to-b from-[#7B61FF]/5 to-transparent">
            {[1, 0, 2].map((idx) => {
              const user = mockUsers[idx];
              const isFirst = idx === 0;
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`flex flex-col items-center ${isFirst ? "order-1" : idx === 1 ? "order-0" : "order-2"}`}
                >
                  <div className="relative mb-2">
                    {isFirst && (
                      <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 text-amber-400" />
                    )}
                    <div className={`w-${isFirst ? "16" : "14"} h-${isFirst ? "16" : "14"} rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold ${isFirst ? "text-lg ring-4 ring-amber-400/30" : "text-base"}`}
                      style={{ width: isFirst ? 64 : 56, height: isFirst ? 64 : 56 }}
                    >
                      {user.initials}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? "bg-amber-400 text-amber-900" : idx === 1 ? "bg-gray-300 text-gray-700" : "bg-orange-400 text-orange-900"
                    }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-1 text-center">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.points.toLocaleString("pt-BR")} pts</p>
                  {user.isElite && (
                    <span className="text-[10px] px-2 py-0.5 bg-amber-400/10 text-amber-600 rounded-full mt-1">Elite</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Rankings List */}
          <div className="divide-y divide-border/30">
            {mockUsers.slice(3).map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 + 0.3 }}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors ${
                  user.id === "4" ? "bg-[#7B61FF]/5 border-l-2 border-[#7B61FF]" : ""
                }`}
              >
                <span className="text-sm font-bold text-muted-foreground w-6 text-center">
                  {idx + 4}
                </span>
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {user.id === "4" ? "Você" : user.name}
                    </p>
                    {user.badge && (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{user.badge}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.tasksCompleted} tarefas · {user.streak} dias de streak
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-0.5 text-xs ${
                    user.change === "up" ? "text-emerald-500" : user.change === "down" ? "text-red-500" : "text-muted-foreground"
                  }`}>
                    {user.change === "up" && <ChevronUp className="w-3.5 h-3.5" />}
                    {user.change === "down" && <ChevronDown className="w-3.5 h-3.5" />}
                    {user.change === "same" && <Minus className="w-3.5 h-3.5" />}
                    {user.changeAmount || ""}
                  </div>
                  <span className="text-sm font-bold min-w-[70px] text-right">
                    {user.points.toLocaleString("pt-BR")} pts
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weekly Challenge */}
          <div className="rounded-2xl bg-gradient-to-br from-[#7B61FF]/10 to-[#B14EFF]/10 border border-[#7B61FF]/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">{weeklyChallenge.title}</p>
                <p className="text-xs text-muted-foreground">Termina em {weeklyChallenge.endsIn}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{weeklyChallenge.description}</p>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium">{weeklyChallenge.progress}/{weeklyChallenge.target} tarefas</span>
              <span className="text-[#7B61FF] font-bold">+{weeklyChallenge.reward} pts</span>
            </div>
            <div className="h-2.5 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(weeklyChallenge.progress / weeklyChallenge.target) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-full"
              />
            </div>
          </div>

          {/* How Points Work */}
          <div className="rounded-2xl bg-card border border-border/50 p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7B61FF]" />
              Como ganhar pontos
            </h3>
            <div className="space-y-3">
              {pointRules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-3">
                  <rule.icon className={`w-4 h-4 ${rule.color}`} />
                  <span className="text-sm flex-1">{rule.label}</span>
                  <span className="text-xs font-bold text-muted-foreground">{rule.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-2xl bg-card border border-border/50 p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Suas Conquistas
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "🔥", label: "Streak 7", unlocked: true },
                { emoji: "⚡", label: "100 Tarefas", unlocked: true },
                { emoji: "🎯", label: "10 Metas", unlocked: true },
                { emoji: "🏆", label: "Top 5", unlocked: true },
                { emoji: "💎", label: "30 Dias", unlocked: false },
                { emoji: "👑", label: "Elite", unlocked: false },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    badge.unlocked
                      ? "border-amber-400/30 bg-amber-400/5"
                      : "border-border/30 bg-muted/20 opacity-40"
                  }`}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-[10px] text-center text-muted-foreground">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
