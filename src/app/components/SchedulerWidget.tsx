import { motion } from "motion/react";
import { Send, Clock, ArrowRight, CalendarClock } from "lucide-react";
import { platformById, type PlatformId } from "./workspace/platforms";
import { useWorkspace } from "./workspace/WorkspaceContext";

interface SchedulerWidgetProps {
  onNavigate: (section: string) => void;
}

// Próximas publicações agendadas (demo) — no app real viria do estado compartilhado.
const upcoming: { id: string; clientId: string; time: string; day: string; caption: string; platforms: PlatformId[] }[] = [
  { id: "u1", clientId: "c1", day: "Hoje", time: "09:00", caption: "Lançamento imperdível chegando! 🚀", platforms: ["instagram", "facebook"] },
  { id: "u2", clientId: "c3", day: "Amanhã", time: "08:00", caption: "O café perfeito começa com grãos selecionados ☕", platforms: ["instagram", "pinterest"] },
  { id: "u3", clientId: "c2", day: "Qua", time: "12:00", caption: "5 dicas para escalar sua operação em 2026.", platforms: ["linkedin", "twitter"] },
];

export function SchedulerWidget({ onNavigate }: SchedulerWidgetProps) {
  const { visibleClients } = useWorkspace();
  const items = upcoming.filter((u) => visibleClients.some((c) => c.id === u.clientId)).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/[0.04] to-[#B14EFF]/[0.04] pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-[#7B61FF]" />
            Agendador Social
          </h3>
          <button onClick={() => onNavigate("scheduler")} className="text-xs text-[#7B61FF] font-medium flex items-center gap-1 hover:underline">
            Abrir <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-6">
            <Send className="w-6 h-6 text-[#7B61FF]/40 mx-auto mb-2" />
            <p className="text-[12px] text-muted-foreground">Nenhuma publicação agendada.</p>
            <button onClick={() => onNavigate("scheduler")} className="text-[12px] text-[#7B61FF] font-medium mt-1 hover:underline">
              Criar publicação
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const client = visibleClients.find((c) => c.id === item.clientId);
              return (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => onNavigate("scheduler")}>
                  {client && (
                    <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${client.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                      {client.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate">{item.caption}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.day}, {item.time}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.platforms.map((p) => {
                          const cfg = platformById(p);
                          const PIcon = cfg.icon;
                          return <PIcon key={p} className={`w-3 h-3 ${cfg.color}`} />;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => onNavigate("scheduler")}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white text-[13px] font-medium shadow-sm hover:shadow-md hover:shadow-purple-500/20 transition-shadow"
        >
          <Send className="w-4 h-4" /> Nova publicação
        </button>
      </div>
    </motion.div>
  );
}
