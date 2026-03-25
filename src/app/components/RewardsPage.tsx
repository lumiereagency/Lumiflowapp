import { motion } from "motion/react";
import { useState } from "react";
import {
  Gift,
  Trophy,
  Star,
  Crown,
  Lock,
  Check,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Medal,
  Flame,
  Percent,
  Package,
  Timer,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RewardsPageProps {
  onNavigate: (section: string) => void;
}

type RewardTier = "bronze" | "silver" | "gold" | "diamond";

interface Reward {
  id: string;
  name: string;
  brand: string;
  description: string;
  image: string;
  tier: RewardTier;
  pointsCost: number;
  category: string;
  available: boolean;
  claimed?: boolean;
}

const rewards: Reward[] = [
  {
    id: "1", name: "Cupom 15% Off Suplementos", brand: "NutriPro", description: "Desconto em toda a linha de suplementos esportivos",
    image: "https://images.unsplash.com/photo-1704650311190-7eeb9c4f6e11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm90ZWluJTIwc3VwcGxlbWVudCUyMGZpdG5lc3MlMjBudXRyaXRpb258ZW58MXx8fHwxNzczMTEzODU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tier: "bronze", pointsCost: 2000, category: "Suplementos", available: true,
  },
  {
    id: "2", name: "Garrafa Esportiva Premium", brand: "HydroFlow", description: "Garrafa de hidratação térmica 750ml",
    image: "https://images.unsplash.com/photo-1752681304950-cc5bc78064f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZSUyMGh5ZHJhdGlvbiUyMHNwb3J0c3xlbnwxfHx8fDE3NzMwNDc1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tier: "bronze", pointsCost: 3000, category: "Acessórios", available: true,
  },
  {
    id: "3", name: "Cupom 20% Roupas Fitness", brand: "ActiveWear", description: "Desconto na coleção de roupas esportivas",
    image: "https://images.unsplash.com/photo-1679768763201-e07480531b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2xvdGhpbmclMjBzcG9ydHN3ZWFyfGVufDF8fHx8MTc3MzExMzg1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    tier: "silver", pointsCost: 5000, category: "Vestuário", available: true,
  },
  {
    id: "4", name: "Kit Acessórios Running", brand: "RunPro", description: "Kit com faixa, munhequeira e porta-celular",
    image: "https://images.unsplash.com/photo-1765914448116-587acf59e3f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBhdGhsZXRpYyUyMGdlYXJ8ZW58MXx8fHwxNzczMTEzODU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tier: "silver", pointsCost: 6000, category: "Running", available: true,
  },
  {
    id: "5", name: "Mochila Urban Performance", brand: "FlowPack", description: "Mochila ergonômica com compartimento para notebook",
    image: "https://images.unsplash.com/photo-1766384093156-6189a8aa564f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYWNrcGFjayUyMGxpZmVzdHlsZSUyMHVyYmFufGVufDF8fHx8MTc3MzExMzg1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    tier: "gold", pointsCost: 10000, category: "Acessórios", available: true,
  },
  {
    id: "6", name: "Kit Performance Completo", brand: "Lumiflow Partners", description: "Garrafa + camiseta + suplementos exclusivos",
    image: "https://images.unsplash.com/photo-1761946356399-8335dbdce394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBlcXVpcG1lbnQlMjBmaXRuZXNzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzczMTEzODU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tier: "diamond", pointsCost: 20000, category: "Kits", available: false,
  },
];

const tierConfig: Record<RewardTier, { label: string; color: string; bgColor: string; minPoints: number; icon: typeof Trophy }> = {
  bronze: { label: "Bronze", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-900/20", minPoints: 0, icon: Medal },
  silver: { label: "Prata", color: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-800/30", minPoints: 5000, icon: Star },
  gold: { label: "Ouro", color: "text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-900/20", minPoints: 10000, icon: Trophy },
  diamond: { label: "Diamante", color: "text-cyan-500", bgColor: "bg-cyan-100 dark:bg-cyan-900/20", minPoints: 20000, icon: Crown },
};

const userPoints = 9870;

export function RewardsPage({ onNavigate }: RewardsPageProps) {
  const [selectedTier, setSelectedTier] = useState<RewardTier | "all">("all");
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  const filteredRewards = selectedTier === "all" ? rewards : rewards.filter((r) => r.tier === selectedTier);

  const handleClaim = (id: string) => {
    setClaimedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gift className="w-7 h-7 text-[#7B61FF]" />
            Recompensas
          </h1>
          <p className="text-muted-foreground mt-1">
            Troque seus pontos por recompensas exclusivas de parceiros
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-card border border-border/50 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm">
              <span className="font-bold">{userPoints.toLocaleString("pt-BR")}</span>{" "}
              <span className="text-muted-foreground">pontos disponíveis</span>
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("rankings")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-sm font-medium"
          >
            <Trophy className="w-4 h-4" />
            Ver Rankings
          </motion.button>
        </div>
      </div>

      {/* Tiers Progress */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(tierConfig) as RewardTier[]).map((tier) => {
          const config = tierConfig[tier];
          const TierIcon = config.icon;
          const isUnlocked = userPoints >= config.minPoints;
          return (
            <motion.div
              key={tier}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isUnlocked
                  ? "border-border/50 bg-card"
                  : "border-border/30 bg-muted/20 opacity-60"
              }`}
              onClick={() => setSelectedTier(selectedTier === tier ? "all" : tier)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                  {isUnlocked ? (
                    <TierIcon className={`w-4 h-4 ${config.color}`} />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold">{config.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {config.minPoints > 0 ? `${config.minPoints.toLocaleString("pt-BR")} pts` : "Desbloqueado"}
                  </p>
                </div>
              </div>
              {isUnlocked ? (
                <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Desbloqueado
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  Faltam {(config.minPoints - userPoints).toLocaleString("pt-BR")} pts
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedTier("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedTier === "all"
              ? "bg-[#7B61FF] text-white"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          Todas
        </button>
        {(Object.keys(tierConfig) as RewardTier[]).map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedTier === tier
                ? "bg-[#7B61FF] text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {tierConfig[tier].label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRewards.map((reward, idx) => {
          const config = tierConfig[reward.tier];
          const canAfford = userPoints >= reward.pointsCost;
          const isClaimed = claimedIds.includes(reward.id);

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl bg-card border overflow-hidden transition-all ${
                !reward.available ? "border-border/30 opacity-60" : "border-border/50 hover:shadow-lg"
              }`}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <ImageWithFallback
                  src={reward.image}
                  alt={reward.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${config.bgColor} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/40 text-white backdrop-blur-sm">
                    {reward.category}
                  </span>
                </div>
                {!reward.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white">
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">Em breve</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-[#7B61FF] font-medium mb-1">{reward.brand}</p>
                <h3 className="font-bold mb-1">{reward.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{reward.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold">{reward.pointsCost.toLocaleString("pt-BR")} pts</span>
                  </div>
                  {isClaimed ? (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-medium">
                      <Check className="w-3.5 h-3.5" /> Resgatado
                    </span>
                  ) : reward.available ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => canAfford && handleClaim(reward.id)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        canAfford
                          ? "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white shadow-sm"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? "Resgatar" : "Pontos insuficientes"}
                    </motion.button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Indisponível</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Partner Brands */}
      <div className="rounded-2xl bg-card border border-border/50 p-6">
        <h3 className="font-bold mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7B61FF]" />
          Marcas Parceiras
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          Recompensas exclusivas de marcas líderes em fitness, esportes e lifestyle
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {["NutriPro", "HydroFlow", "ActiveWear", "RunPro", "FlowPack", "FitGear"].map((brand) => (
            <div key={brand} className="flex items-center justify-center p-4 rounded-xl bg-muted/30 border border-border/30">
              <span className="text-sm font-bold text-muted-foreground">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
