import { motion } from "motion/react";
import { useState } from "react";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  Users,
  Brain,
  Shield,
  Star,
  Trophy,
  Heart,
  Infinity,
  BarChart3,
  Calendar,
  Bell,
  Gamepad2,
  ShoppingBag,
  Salad,
} from "lucide-react";

interface PricingPageProps {
  onSelectPlan: (plan: string) => void;
  onClose: () => void;
}

const plans = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Para creators começando sua jornada",
    color: "from-slate-400 to-slate-500",
    shadowColor: "shadow-slate-500/20",
    features: [
      { text: "Até 3 projetos", included: true },
      { text: "Kanban básico", included: true },
      { text: "Gestão de tarefas", included: true },
      { text: "5 templates de social media", included: true },
      { text: "Acesso à comunidade", included: true },
      { text: "Notificações básicas", included: true },
      { text: "1 mapa mental", included: true },
      { text: "Automações e scheduling", included: false },
      { text: "Analytics de produtividade", included: false },
      { text: "Colaboração em equipe", included: false },
      { text: "Templates avançados", included: false },
      { text: "Lumiflow Store (descontos)", included: false },
    ],
    highlighted: false,
    badge: null,
    cta: "Começar Grátis",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Star,
    monthlyPrice: 29.9,
    annualPrice: 23.9,
    description: "O upgrade ideal para social media managers",
    color: "from-[#7B61FF] to-[#B14EFF]",
    shadowColor: "shadow-purple-500/20",
    features: [
      { text: "Projetos ilimitados", included: true },
      { text: "Kanban avançado + automações", included: true },
      { text: "Prioridades e tags de tarefas", included: true },
      { text: "Templates avançados de conteúdo", included: true },
      { text: "Calendário editorial integrado", included: true },
      { text: "Analytics de produtividade", included: true },
      { text: "Lembretes e notificações smart", included: true },
      { text: "Até 10 mapas mentais", included: true },
      { text: "Rankings e desafios semanais", included: true },
      { text: "Lumiflow Store (frete grátis)", included: true },
      { text: "Colaboração avançada", included: false },
      { text: "Performance insights com IA", included: false },
    ],
    highlighted: true,
    badge: "Mais Popular",
    cta: "Assinar Pro",
  },
  {
    id: "elite",
    name: "Elite",
    icon: Crown,
    monthlyPrice: 59.9,
    annualPrice: 47.9,
    description: "Para agências e power creators",
    color: "from-amber-400 to-orange-500",
    shadowColor: "shadow-orange-500/20",
    features: [
      { text: "Tudo do plano Pro", included: true },
      { text: "Automações avançadas ilimitadas", included: true },
      { text: "Mapas mentais ilimitados", included: true },
      { text: "Analytics avançados + insights IA", included: true },
      { text: "Colaboração em equipe completa", included: true },
      { text: "Templates ilimitados", included: true },
      { text: "Performance insights detalhados", included: true },
      { text: "Suporte prioritário 24/7", included: true },
      { text: "Lumiflow Store (10% off)", included: true },
      { text: "Produtos Lumiflow exclusivos", included: true },
      { text: "Badge Elite no perfil", included: true },
      { text: "Onboarding personalizado", included: true },
    ],
    highlighted: false,
    badge: "Premium",
    cta: "Assinar Elite",
  },
];

const highlights = [
  { icon: Brain, label: "IA Integrada" },
  { icon: Calendar, label: "Calendário Editorial" },
  { icon: ShoppingBag, label: "Lumiflow Store" },
  { icon: Users, label: "Colaboração" },
  { icon: Shield, label: "Sem compromisso" },
];

export function PricingPage({ onSelectPlan, onClose }: PricingPageProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-6xl bg-background rounded-3xl shadow-2xl my-8 mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="relative text-center pt-12 pb-8 px-8 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/5 via-transparent to-[#B14EFF]/5" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#7B61FF]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#B14EFF]/10 rounded-full blur-[80px]" />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7B61FF]/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#7B61FF]" />
              <span className="text-sm text-[#7B61FF] font-medium">
                Ecossistema completo de performance
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] bg-clip-text text-transparent">
              Escolha seu plano ideal
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Produtividade, performance, lifestyle e comunidade em uma única
              plataforma. Desbloqueie todo o potencial do Lumiflow.
            </p>

            {/* Feature highlights */}
            <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <h.icon className="w-4 h-4 text-[#7B61FF]" />
                  <span>{h.label}</span>
                </div>
              ))}
            </div>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-muted/60 rounded-2xl border border-border/50">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  !isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anual
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs rounded-full font-medium">
                  -20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isElite = plan.id === "elite";
            const isPro = plan.id === "pro";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-[1.02] ${
                  plan.highlighted
                    ? "border-[#7B61FF] bg-gradient-to-br from-purple-50/80 to-transparent dark:from-purple-950/30 dark:to-transparent shadow-xl shadow-purple-500/15"
                    : isElite
                    ? "border-amber-400/50 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20 dark:to-transparent shadow-lg shadow-amber-500/10"
                    : "border-border bg-card hover:border-[#7B61FF]/30"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`flex items-center gap-1.5 px-4 py-1 text-white text-xs font-medium rounded-full shadow-lg ${
                        isElite
                          ? "bg-gradient-to-r from-amber-400 to-orange-500"
                          : "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF]"
                      }`}
                    >
                      {isPro ? (
                        <Sparkles className="w-3 h-3" />
                      ) : (
                        <Crown className="w-3 h-3" />
                      )}
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Icon & Name */}
                <div className="mb-5">
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${plan.color} mb-3`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-5">
                  {price === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">Grátis</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-4xl font-bold">
                        {price.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                  )}
                  {isAnnual && price > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      Cobrado anualmente (R${" "}
                      {(price * 12).toFixed(2).replace(".", ",")}
                      /ano)
                    </p>
                  )}
                  {!isAnnual && price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Economize com o plano anual
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-xl font-medium mb-5 transition-all ${
                    isPro
                      ? "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                      : isElite
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                      : "bg-accent hover:bg-accent/80 text-foreground"
                  }`}
                >
                  {plan.cta}
                </motion.button>

                {/* Features */}
                <div className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex-shrink-0">
                        {feature.included ? (
                          <Check
                            className={`w-4 h-4 ${
                              isPro
                                ? "text-[#7B61FF]"
                                : isElite
                                ? "text-amber-500"
                                : "text-emerald-500"
                            }`}
                          />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground/50 line-through"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table Header */}
        <div className="px-8 pb-8">
          <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h3 className="font-bold text-lg mb-1">
                Comparação detalhada dos planos
              </h3>
              <p className="text-sm text-muted-foreground">
                Veja exatamente o que cada plano oferece
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">
                      Recurso
                    </th>
                    <th className="p-4 text-center font-medium">Free</th>
                    <th className="p-4 text-center font-medium text-[#7B61FF]">
                      Pro
                    </th>
                    <th className="p-4 text-center font-medium text-amber-500">
                      Elite
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Projetos", free: "3", pro: "Ilimitados", elite: "Ilimitados" },
                    { feature: "Mapas Mentais", free: "1", pro: "10", elite: "Ilimitados" },
                    { feature: "Templates Conteúdo", free: "5 básicos", pro: "Avançados", elite: "Ilimitados" },
                    { feature: "Kanban Board", free: "Básico", pro: "Avançado", elite: "Avançado+" },
                    { feature: "Automações", free: false, pro: "Básicas", elite: "Ilimitadas" },
                    { feature: "Calendário Editorial", free: false, pro: true, elite: true },
                    { feature: "Analytics", free: false, pro: "Padrão", elite: "Avançado + IA" },
                    { feature: "Colaboração", free: false, pro: false, elite: "Completa" },
                    { feature: "Rankings", free: false, pro: "Básico", elite: "Global" },
                    { feature: "Lumiflow Store", free: "Catálogo", pro: "Frete grátis", elite: "10% desconto" },
                    { feature: "Merch Exclusivo", free: false, pro: false, elite: true },
                    { feature: "Performance Insights", free: false, pro: false, elite: "IA Avançada" },
                    { feature: "Suporte", free: "Email", pro: "Prioritário", elite: "24/7 Dedicado" },
                  ].map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-border/30 last:border-b-0"
                    >
                      <td className="p-4 text-foreground">{row.feature}</td>
                      {[row.free, row.pro, row.elite].map((val, i) => (
                        <td key={i} className="p-4 text-center">
                          {val === true ? (
                            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : val === false ? (
                            <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          ) : (
                            <span
                              className={
                                i === 1
                                  ? "text-[#7B61FF] font-medium"
                                  : i === 2
                                  ? "text-amber-500 font-medium"
                                  : "text-muted-foreground"
                              }
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-8 py-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Todos os planos incluem 15 dias grátis. Cancele a qualquer momento,
            sem taxas.
          </p>
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Continuar com o plano atual
          </button>
        </div>
      </motion.div>
    </div>
  );
}