import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, Timer, Play, Pause, RotateCcw, ChevronUp, ChevronDown,
  Zap, Target, Flame, Coffee, X, Sparkles, TrendingUp, CheckCircle2,
  Volume2, VolumeX, SkipForward, Settings2, Minimize2, Maximize2,
} from "lucide-react";
import { toast } from "sonner";

interface SmartProductivityWidgetProps {
  onNavigate: (section: string) => void;
  onOpenAI?: () => void;
}

type TimerMode = "focus" | "short_break" | "long_break";

const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

const TIMER_LABELS: Record<TimerMode, string> = {
  focus: "Foco Profundo",
  short_break: "Pausa Curta",
  long_break: "Pausa Longa",
};

const TIMER_COLORS: Record<TimerMode, string> = {
  focus: "#7B61FF",
  short_break: "#10b981",
  long_break: "#3b82f6",
};

const quickTips = [
  "Seu pico de produtividade e entre 9h-12h. Aproveite!",
  "Tente blocos de 25min de foco seguidos de 5min de pausa.",
  "3 tarefas concluidas hoje - voce esta acima da media!",
  "Beber agua regularmente melhora o foco em ate 14%.",
  "Considere fechar notificacoes durante blocos de foco.",
  "Sua velocidade aumentou 15% esta semana. Continue assim!",
];

export function SmartProductivityWidget({ onNavigate, onOpenAI }: SmartProductivityWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [dailyFocusMinutes, setDailyFocusMinutes] = useState(47);
  const [streak, setStreak] = useState(7);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerMode === "focus") {
        setSessions(prev => prev + 1);
        setDailyFocusMinutes(prev => prev + 25);
        toast.success("Sessao de foco concluida! Hora de uma pausa.", { icon: "🎉" });
        setTimerMode("short_break");
        setTimeLeft(TIMER_DURATIONS.short_break);
      } else {
        toast.success("Pausa finalizada! Pronto para focar?", { icon: "🧠" });
        setTimerMode("focus");
        setTimeLeft(TIMER_DURATIONS.focus);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, timerMode]);

  // Rotate tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % quickTips.length);
    }, 8000);
    return () => clearInterval(tipInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeLeft / TIMER_DURATIONS[timerMode];
  const circumference = 2 * Math.PI * 38;

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[timerMode]);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (timerMode === "focus") {
      setTimerMode("short_break");
      setTimeLeft(TIMER_DURATIONS.short_break);
    } else {
      setTimerMode("focus");
      setTimeLeft(TIMER_DURATIONS.focus);
    }
  };

  const handleModeChange = (mode: TimerMode) => {
    setIsRunning(false);
    setTimerMode(mode);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 lg:bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] shadow-lg shadow-purple-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-purple-500/40 transition-shadow"
      >
        <div className="relative">
          <Brain className="w-5 h-5 text-white" />
          {isRunning && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"
            />
          )}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 lg:bottom-6 right-6 z-40"
    >
      <div
        className={`bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden transition-all ${
          isExpanded ? "w-80" : "w-72"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/40 bg-gradient-to-r from-[#7B61FF]/5 to-[#B14EFF]/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center">
              <Brain className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold">Assistente de Foco</span>
            {isRunning && (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-medium"
              >
                Focando
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-muted/40 transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-3 h-3 text-muted-foreground" /> : <Maximize2 className="w-3 h-3 text-muted-foreground" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-md hover:bg-muted/40 transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Timer */}
        <div className="p-4">
          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5 mb-4">
            {(Object.keys(TIMER_LABELS) as TimerMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`flex-1 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                  timerMode === mode
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {TIMER_LABELS[mode]}
              </button>
            ))}
          </div>

          {/* Circular Timer */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
                <circle
                  cx="44" cy="44" r="38"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted/15"
                  strokeWidth="5"
                />
                <circle
                  cx="44" cy="44" r="38"
                  fill="none"
                  stroke={TIMER_COLORS[timerMode]}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tracking-tight" style={{ color: TIMER_COLORS[timerMode] }}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5">
                  {timerMode === "focus" ? `Sessao ${sessionsCompleted + 1}` : "Descanse"}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${TIMER_COLORS[timerMode]}, ${timerMode === "focus" ? "#B14EFF" : timerMode === "short_break" ? "#059669" : "#2563eb"})`,
                boxShadow: `0 8px 24px ${TIMER_COLORS[timerMode]}40`,
              }}
            >
              {isRunning ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
            </motion.button>
            <button
              onClick={handleSkip}
              className="p-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <SkipForward className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-muted-foreground" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-muted/20 rounded-lg">
              <p className="text-sm font-bold text-[#7B61FF]">{sessionsCompleted}</p>
              <p className="text-[9px] text-muted-foreground">Sessoes</p>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded-lg">
              <p className="text-sm font-bold text-emerald-500">{dailyFocusMinutes}m</p>
              <p className="text-[9px] text-muted-foreground">Foco Hoje</p>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded-lg">
              <p className="text-sm font-bold text-orange-500">{streak}</p>
              <p className="text-[9px] text-muted-foreground flex items-center justify-center gap-0.5"><Flame className="w-2.5 h-2.5" />Streak</p>
            </div>
          </div>

          {/* Expandable Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* AI Tip */}
                <div className="p-2.5 bg-gradient-to-r from-[#7B61FF]/5 to-[#B14EFF]/5 border border-[#7B61FF]/10 rounded-xl mb-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#7B61FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-[#7B61FF] font-medium mb-0.5">Dica da IA</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentTip}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[10px] text-muted-foreground leading-relaxed"
                        >
                          {quickTips[currentTip]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-1.5">
                  <button
                    onClick={() => onNavigate("productivity")}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors text-left"
                  >
                    <Target className="w-3.5 h-3.5 text-[#7B61FF]" />
                    <span className="text-[10px] font-medium">Ver Hub de Produtividade</span>
                    <TrendingUp className="w-3 h-3 text-muted-foreground ml-auto" />
                  </button>
                  <button
                    onClick={onOpenAI}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B14EFF]" />
                    <span className="text-[10px] font-medium">Perguntar a IA</span>
                    <Zap className="w-3 h-3 text-muted-foreground ml-auto" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
