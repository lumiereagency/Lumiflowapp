import { motion } from "motion/react";
import { useState } from "react";
import {
  CreditCard,
  Download,
  Check,
  ArrowLeft,
  Crown,
  Zap,
  BarChart3,
  Brain,
  GitBranch,
  Users,
  Calendar,
  FileText,
  ChevronRight,
} from "lucide-react";

interface BillingPageProps {
  currentPlan: string;
  isPremium: boolean;
  onBack: () => void;
  onUpgrade: () => void;
}

const invoices = [
  { id: "INV-2026-003", date: "01 mar 2026", amount: "R$ 149,00", status: "Pago" },
  { id: "INV-2026-002", date: "01 fev 2026", amount: "R$ 149,00", status: "Pago" },
  { id: "INV-2026-001", date: "01 jan 2026", amount: "R$ 149,00", status: "Pago" },
  { id: "INV-2025-012", date: "01 dez 2025", amount: "R$ 149,00", status: "Pago" },
];

const usageStats = [
  { label: "Mapas mentais criados", current: 24, limit: "Ilimitado", icon: Brain, color: "from-[#7B61FF] to-[#B14EFF]", percent: 0 },
  { label: "Cards no Kanban", current: 156, limit: "Ilimitado", icon: GitBranch, color: "from-blue-500 to-cyan-500", percent: 0 },
  { label: "Membros do time", current: 8, limit: 15, icon: Users, color: "from-emerald-500 to-teal-500", percent: 53 },
  { label: "Requisições IA", current: 342, limit: 500, icon: Zap, color: "from-orange-500 to-red-500", percent: 68 },
  { label: "Eventos do calendário", current: 45, limit: "Ilimitado", icon: Calendar, color: "from-amber-500 to-yellow-500", percent: 0 },
  { label: "Armazenamento", current: "2.4 GB", limit: "10 GB", icon: BarChart3, color: "from-pink-500 to-rose-500", percent: 24 },
];

export function BillingPage({ currentPlan, isPremium, onBack, onUpgrade }: BillingPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "usage">("overview");

  const planInfo: Record<string, { name: string; price: string; features: string[] }> = {
    starter: {
      name: "Starter",
      price: "R$ 49,00",
      features: ["2 workspaces", "Mapas mentais básicos", "Kanban básico", "Google Calendar"],
    },
    pro: {
      name: "Pro",
      price: "R$ 149,00",
      features: ["Projetos ilimitados", "IA completa", "Aprovações", "Colaboração em tempo real"],
    },
    enterprise: {
      name: "Enterprise",
      price: "R$ 399,00",
      features: ["Tudo ilimitado", "Análises avançadas", "API access", "Suporte 24/7"],
    },
  };

  const plan = planInfo[currentPlan] || planInfo.pro;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold">Planos e Pagamento</h1>
            <p className="text-muted-foreground text-sm">
              Gerencie sua assinatura, pagamentos e uso
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl mb-8 max-w-fit">
          {[
            { id: "overview" as const, label: "Visão Geral" },
            { id: "invoices" as const, label: "Faturas" },
            { id: "usage" as const, label: "Uso" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Current Plan */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6" />
                    <div>
                      <h3 className="font-bold text-lg">Plano {plan.name}</h3>
                      <p className="text-white/70 text-sm">
                        {isPremium ? "Ativo" : "Período de teste"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{plan.price}</div>
                    <div className="text-white/70 text-sm">/mês</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  {currentPlan !== "enterprise" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onUpgrade}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
                    >
                      Fazer upgrade
                    </motion.button>
                  )}
                  <button className="px-5 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
                    Cancelar assinatura
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#7B61FF]" />
                Método de Pagamento
              </h3>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expira 12/28</p>
                  </div>
                </div>
                <button className="text-sm text-[#7B61FF] hover:text-[#B14EFF] transition-colors font-medium">
                  Alterar
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Próxima cobrança: 01 de abril de 2026
              </p>
            </div>

            {/* Quick Usage */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#7B61FF]" />
                  Resumo de Uso
                </h3>
                <button
                  onClick={() => setActiveTab("usage")}
                  className="flex items-center gap-1 text-sm text-[#7B61FF] hover:text-[#B14EFF] transition-colors"
                >
                  Ver detalhes
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold">342</div>
                  <div className="text-xs text-muted-foreground">Requisições IA</div>
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Membros</div>
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: "53%" }} />
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold">2.4</div>
                  <div className="text-xs text-muted-foreground">GB usado</div>
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: "24%" }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "invoices" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#7B61FF]" />
                  Histórico de Faturas
                </h3>
              </div>
              <div className="divide-y divide-border">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{inv.id}</p>
                        <p className="text-xs text-muted-foreground">{inv.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{inv.amount}</span>
                      <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-full font-medium">
                        {inv.status}
                      </span>
                      <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "usage" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {usageStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{stat.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          {String(stat.current)}{" "}
                          {typeof stat.limit === "number"
                            ? `de ${stat.limit}`
                            : `— ${stat.limit}`}
                        </p>
                      </div>
                    </div>
                    {stat.percent > 0 && (
                      <span
                        className={`text-sm font-medium ${
                          stat.percent > 80
                            ? "text-amber-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stat.percent}%
                      </span>
                    )}
                  </div>
                  {stat.percent > 0 && (
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percent}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                      />
                    </div>
                  )}
                  {stat.percent === 0 && (
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full w-full opacity-30" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
