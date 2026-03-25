import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Sparkles,
  Brain,
  GitBranch,
  Calendar,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  BarChart3,
  FolderKanban,
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const workflowStyles = [
  {
    id: "creative",
    label: "Criativo & Design",
    desc: "Mapas mentais, brainstorming, fluxos visuais",
    icon: Brain,
    color: "from-[#7B61FF] to-[#B14EFF]",
  },
  {
    id: "project",
    label: "Gestão de Projetos",
    desc: "Kanban, tarefas, prazos, aprovações",
    icon: FolderKanban,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "marketing",
    label: "Marketing & Conteúdo",
    desc: "Campanhas, calendário editorial, aprovações",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "agile",
    label: "Desenvolvimento Ágil",
    desc: "Sprints, backlog, retrospectivas",
    icon: Zap,
    color: "from-orange-500 to-red-500",
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const nextStep = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onComplete();
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 1) return selectedStyle !== null;
    if (step === 2) return workspaceName.trim().length > 0;
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3">
              Bem-vindo ao Lumiflow!
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Vamos configurar seu workspace em apenas alguns passos. Tudo pode
              ser alterado depois nas configurações.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Rápido e simples
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Personalizável
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Pronto em 2 min
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="workflow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Escolha seu estilo de trabalho
              </h2>
              <p className="text-muted-foreground">
                Isso nos ajuda a personalizar sua experiência
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {workflowStyles.map((style) => {
                const Icon = style.icon;
                const isSelected = selectedStyle === style.id;
                return (
                  <motion.button
                    key={style.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-[#7B61FF] bg-purple-50 dark:bg-purple-950/20 shadow-lg shadow-purple-500/10"
                        : "border-border hover:border-[#7B61FF]/40"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 bg-[#7B61FF] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    )}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center mb-3 shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{style.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {style.desc}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <FolderKanban className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">
                Crie seu primeiro workspace
              </h2>
              <p className="text-muted-foreground">
                Um workspace é onde seus projetos vivem
              </p>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome do workspace
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Ex: Minha Agência, Time de Design..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30 focus:border-[#7B61FF]/50 transition-all"
                />
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground">
                  💡 Você pode criar mais workspaces depois e organizar seus
                  projetos por equipe, cliente ou tipo de trabalho.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Calendar className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">
                Conecte seu Google Calendar
              </h2>
              <p className="text-muted-foreground">
                Sincronize prazos e reuniões automaticamente
              </p>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCalendarConnected(true)}
                disabled={calendarConnected}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-medium transition-all ${
                  calendarConnected
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                    : "bg-white dark:bg-white/10 border-2 border-border hover:border-[#7B61FF]/40 shadow-md"
                }`}
              >
                {calendarConnected ? (
                  <>
                    <Check className="w-5 h-5" />
                    Google Calendar conectado
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Conectar Google Calendar
                  </>
                )}
              </motion.button>
              <button
                onClick={nextStep}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Pular por enquanto
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="invite"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Convide sua equipe</h2>
              <p className="text-muted-foreground">
                Trabalhe junto com seu time desde o início
              </p>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Emails dos membros
                </label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  placeholder="maria@empresa.com&#10;pedro@empresa.com"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30 focus:border-[#7B61FF]/50 transition-all resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Separe múltiplos emails por linha
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl p-4 border border-[#7B61FF]/10">
                <p className="text-xs text-muted-foreground">
                  🎉 Tudo pronto! Ao finalizar, seu workspace será criado e você
                  poderá começar a usar o Lumiflow imediatamente.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span>
              Passo {step + 1} de {totalSteps}
            </span>
            <button
              onClick={onComplete}
              className="text-xs hover:text-foreground transition-colors"
            >
              Pular configuração
            </button>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-full"
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevStep}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              step === 0
                ? "opacity-0 pointer-events-none"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === totalSteps - 1 ? "Finalizar" : "Próximo"}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
