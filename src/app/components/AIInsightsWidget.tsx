import { motion } from "motion/react";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Calendar,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Brain,
  CheckCircle2,
} from "lucide-react";

interface AIInsightsWidgetProps {
  onOpenAI: () => void;
}

const dailyBriefing = {
  greeting: "Bom dia, João!",
  summary: "Você tem 5 tarefas importantes hoje",
  tasks: 5,
  approvals: 2,
  meetings: 1,
  meetingTime: "14h00",
};

const aiAlerts = [
  {
    id: "1",
    type: "risk",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800/30",
    title: "Risco de atraso",
    desc: "Vídeo Demo pode atrasar em 3 dias",
    priority: "alta",
  },
  {
    id: "2",
    type: "optimization",
    icon: Zap,
    color: "text-[#7B61FF]",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800/30",
    title: "Automação sugerida",
    desc: "Aprovações podem ser 2x mais rápidas",
    priority: "média",
  },
  {
    id: "3",
    type: "productivity",
    icon: TrendingUp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800/30",
    title: "Destaque do time",
    desc: "Sarah completou 4 tarefas ontem — recorde!",
    priority: "info",
  },
];

const smartSuggestions = [
  {
    icon: Brain,
    text: "Converter mapa mental 'Roadmap Q1' em tarefas",
    action: "Executar",
  },
  {
    icon: CheckCircle2,
    text: "2 aprovações esperando você há mais de 24h",
    action: "Revisar",
  },
  {
    icon: Users,
    text: "Mike Chen está sobrecarregado — redistribuir tarefas?",
    action: "Ver sugestão",
  },
];

export function AIInsightsWidget({ onOpenAI }: AIInsightsWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#7B61FF]/5 to-[#B14EFF]/5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI Copilot</h3>
            <p className="text-[10px] text-muted-foreground">Insights do dia</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAI}
          className="text-xs text-[#7B61FF] hover:text-[#B14EFF] font-medium flex items-center gap-1 transition-colors"
        >
          Abrir Copilot
          <ArrowRight className="w-3 h-3" />
        </motion.button>
      </div>

      <div className="p-5 space-y-4">
        {/* Daily Briefing */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#7B61FF]/5 to-[#B14EFF]/5 border border-[#7B61FF]/10">
          <p className="text-sm font-semibold mb-1">{dailyBriefing.greeting}</p>
          <p className="text-xs text-muted-foreground mb-3">{dailyBriefing.summary}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7B61FF]" />
              <span>{dailyBriefing.tasks} tarefas</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{dailyBriefing.approvals} aprovações</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{dailyBriefing.meetings} reunião às {dailyBriefing.meetingTime}</span>
            </div>
          </div>
        </div>

        {/* AI Alerts */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
            Alertas inteligentes
          </p>
          <div className="space-y-2">
            {aiAlerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.08 }}
                  className={`flex items-center gap-3 p-2.5 rounded-lg ${alert.bgColor} border ${alert.borderColor} cursor-pointer hover:shadow-sm transition-all`}
                  onClick={onOpenAI}
                >
                  <Icon className={`w-4 h-4 ${alert.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{alert.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{alert.desc}</p>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      alert.priority === "alta"
                        ? "bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                        : alert.priority === "média"
                        ? "bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                        : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {alert.priority}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
            Sugestões inteligentes
          </p>
          <div className="space-y-1.5">
            {smartSuggestions.map((sug, index) => {
              const Icon = sug.icon;
              return (
                <motion.button
                  key={sug.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.08 }}
                  whileHover={{ x: 2 }}
                  onClick={onOpenAI}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors text-left group"
                >
                  <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#7B61FF] transition-colors flex-shrink-0" />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                    {sug.text}
                  </span>
                  <span className="text-[10px] text-[#7B61FF] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    {sug.action}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
