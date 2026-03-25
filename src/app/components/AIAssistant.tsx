import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  X,
  Brain,
  ListChecks,
  Wand2,
  MessageSquare,
  Bot,
  User,
  Loader2,
  Zap,
  BarChart3,
  AlertTriangle,
  Clock,
  FileText,
  Target,
  Calendar,
  Shield,
  ChevronDown,
  RotateCcw,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Mic,
} from "lucide-react";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
  currentSection?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: { label: string; action: string }[];
}

type CopilotTab = "chat" | "prompts" | "automations" | "insights";

const promptLibrary = [
  {
    category: "Projetos",
    icon: Target,
    color: "from-[#7B61FF] to-[#B14EFF]",
    prompts: [
      "Criar roadmap do projeto",
      "Gerar plano semanal",
      "Resumir status do projeto",
      "Listar próximos entregáveis",
    ],
  },
  {
    category: "Tarefas",
    icon: ListChecks,
    color: "from-blue-500 to-cyan-500",
    prompts: [
      "Criar tarefas para esse projeto",
      "Sugerir prazos para as tarefas",
      "Priorizar backlog automaticamente",
      "Gerar checklist de qualidade",
    ],
  },
  {
    category: "Reuniões",
    icon: Users,
    color: "from-emerald-500 to-teal-500",
    prompts: [
      "Criar resumo da reunião",
      "Extrair ações de uma transcrição",
      "Gerar pauta de reunião",
      "Listar decisões pendentes",
    ],
  },
  {
    category: "Análises",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
    prompts: [
      "Analisar produtividade do time",
      "Identificar gargalos no workflow",
      "Gerar relatório semanal",
      "Prever riscos de atraso",
    ],
  },
];

const automationTemplates = [
  {
    id: "1",
    name: "Resumo diário de tarefas",
    desc: "Enviar resumo de tarefas pendentes toda manhã",
    icon: FileText,
    active: true,
    color: "from-[#7B61FF] to-[#B14EFF]",
  },
  {
    id: "2",
    name: "Alerta de prazo",
    desc: "Notificar quando uma tarefa estiver prestes a vencer",
    icon: AlertTriangle,
    active: true,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "3",
    name: "Mover ao aprovar",
    desc: "Quando tarefa for aprovada, mover para Concluído",
    icon: CheckCircle2,
    active: false,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "4",
    name: "Relatório semanal automático",
    desc: "Gerar e enviar relatório de progresso toda sexta",
    icon: BarChart3,
    active: false,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "5",
    name: "Sugestão automática de tarefas",
    desc: "IA sugere novas tarefas baseado no progresso",
    icon: Sparkles,
    active: false,
    color: "from-purple-500 to-pink-500",
  },
];

const insightsData = [
  {
    id: "1",
    type: "risk" as const,
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    title: "Risco de atraso detectado",
    desc: "O projeto 'Campanha Q1' tem 3 tarefas atrasadas. Prazo final em 5 dias.",
    action: "Ver detalhes",
  },
  {
    id: "2",
    type: "productivity" as const,
    icon: TrendingUp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    title: "Produtividade em alta",
    desc: "Sua equipe completou 12 tarefas esta semana — 40% acima da média.",
    action: "Ver análise",
  },
  {
    id: "3",
    type: "suggestion" as const,
    icon: Lightbulb,
    color: "text-[#7B61FF]",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    title: "Otimização de workflow",
    desc: "O fluxo de aprovação pode ser 2x mais rápido com revisão paralela.",
    action: "Aplicar sugestão",
  },
  {
    id: "4",
    type: "briefing" as const,
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    title: "Briefing do dia",
    desc: "Você tem 5 tarefas importantes hoje, 2 aprovações pendentes e 1 reunião às 14h.",
    action: "Ver agenda",
  },
];

const quickCommands = [
  {
    icon: Brain,
    label: "Mapa mental → Tarefas",
    prompt: "Transformar esse mapa mental em um plano de projeto com tarefas organizadas",
  },
  {
    icon: ListChecks,
    label: "Gerar checklist",
    prompt: "Gerar uma checklist completa para o projeto atual",
  },
  {
    icon: Wand2,
    label: "Otimizar fluxo",
    prompt: "Analisar o fluxo de trabalho e sugerir melhorias",
  },
  {
    icon: MessageSquare,
    label: "Resumir discussões",
    prompt: "Resumir as últimas discussões e comentários do time",
  },
  {
    icon: Target,
    label: "Plano de projeto",
    prompt: "Lançar um produto digital. Gerar estrutura completa do projeto.",
  },
  {
    icon: AlertTriangle,
    label: "Detectar riscos",
    prompt: "Analisar o projeto atual e identificar riscos de atraso",
  },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Olá! 👋 Sou o **Lumiflow AI Copilot** — seu estrategista digital de projetos. Posso ajudar a planejar, organizar, automatizar e otimizar seus fluxos de trabalho. O que deseja fazer?",
    timestamp: new Date(),
    actions: [
      { label: "Criar projeto", action: "Criar um novo projeto com estrutura completa" },
      { label: "Analisar workflow", action: "Analisar o fluxo de trabalho e sugerir melhorias" },
      { label: "Gerar tarefas", action: "Criar tarefas para esse projeto" },
    ],
  },
];

const aiResponses: Record<string, { content: string; actions?: { label: string; action: string }[] }> = {
  "Transformar esse mapa mental em um plano de projeto com tarefas organizadas": {
    content:
      "Analisei o mapa mental **Roadmap de Produto Q1** e identifiquei **8 nós** que podem ser convertidos em tarefas:\n\n✅ **Novos Recursos** → Epic com 2 subtarefas\n✅ **Editor colaborativo** → Task (Prioridade Alta)\n✅ **Templates premium** → Task (Prioridade Média)\n✅ **Melhorias UX** → Epic com 1 subtarefa\n✅ **Onboarding interativo** → Task (Prioridade Alta)\n✅ **Integrações** → Epic com 1 subtarefa\n✅ **API v2** → Task (Prioridade Alta)\n\n📊 **Prazos sugeridos:** com base na velocidade média da equipe, todas as tasks podem ser finalizadas em ~3 sprints (6 semanas).",
    actions: [
      { label: "Criar no Kanban", action: "Criar todas essas tarefas no quadro Kanban" },
      { label: "Ajustar prazos", action: "Ajustar os prazos sugeridos" },
    ],
  },
  "Gerar uma checklist completa para o projeto atual": {
    content:
      "Aqui está uma checklist sugerida para o projeto **Campanha Q1**:\n\n📋 **Planejamento**\n- [ ] Definir objetivos e KPIs\n- [ ] Mapear público-alvo\n- [ ] Aprovar orçamento\n\n📋 **Criação**\n- [ ] Criar assets visuais\n- [ ] Escrever copy\n- [ ] Produzir vídeo demo\n\n📋 **Revisão**\n- [ ] Revisão interna\n- [ ] Aprovação do cliente\n- [ ] Testes A/B\n\n📋 **Lançamento**\n- [ ] Agendar publicações\n- [ ] Monitorar métricas\n- [ ] Relatório pós-campanha",
    actions: [
      { label: "Converter em tarefas", action: "Converter todos os itens da checklist em tarefas" },
    ],
  },
  "Analisar o fluxo de trabalho e sugerir melhorias": {
    content:
      "Analisei seu fluxo de trabalho e encontrei oportunidades:\n\n⚡ **Gargalo detectado:** 2 cards estão na coluna \"Em Revisão\" há mais de 3 dias.\n\n💡 **Sugestões de melhoria:**\n1. Atribuir um revisor dedicado para a \"Copy Redes Sociais\"\n2. Dividir o \"Vídeo Demo\" em etapas menores\n3. Criar um lembrete automático para aprovações pendentes\n4. Considerar revisão paralela em vez de sequencial\n\n📊 **Métricas atuais:**\n- Tempo médio de aprovação: 4.2 dias\n- Taxa de rejeição: 14%\n- Cards concluídos/semana: 3.5\n\n⚠️ **Previsão:** se o ritmo atual se mantiver, o projeto pode atrasar 4 dias.",
    actions: [
      { label: "Criar automação", action: "Criar automação de lembretes para aprovações" },
      { label: "Aplicar sugestões", action: "Aplicar todas as sugestões de melhoria" },
    ],
  },
  "Resumir as últimas discussões e comentários do time": {
    content:
      "📝 **Resumo das últimas 48 horas:**\n\n**Sarah Johnson** comentou em *Assets Campanha Q1*:\n→ Primeira versão dos banners prontos, aguardando feedback\n\n**Mike Chen** atualizou *Guidelines de Marca*:\n→ Nova paleta de cores aprovada pelo diretor criativo\n\n**Emma Davis** mencionou em *Vídeo Demo*:\n→ Solicitou revisão do script antes de gravar\n\n**Pontos de atenção:**\n- 3 cards com prazo esta semana\n- 2 aprovações pendentes\n- 1 card rejeitado necessita revisão\n\n📅 **Decisões pendentes:** aprovação do orçamento de mídia e escolha da plataforma de anúncios.",
  },
  "Lançar um produto digital. Gerar estrutura completa do projeto.": {
    content:
      "Ótimo! Gerei a estrutura completa para o lançamento do seu produto digital:\n\n🎯 **Projeto: Lançamento de Produto Digital**\n\n**Fase 1 — Validação (Semana 1-2)**\n- Pesquisa de mercado e concorrência\n- Definição de persona\n- Validação de proposta de valor\n\n**Fase 2 — Desenvolvimento (Semana 3-6)**\n- Design da landing page\n- Desenvolvimento do produto\n- Criação de conteúdo de marketing\n- Setup de analytics\n\n**Fase 3 — Pré-lançamento (Semana 7-8)**\n- Lista de espera / waitlist\n- Campanha de teaser\n- Beta testers\n- Ajustes finais\n\n**Fase 4 — Lançamento (Semana 9)**\n- Go-live da landing page\n- Campanha de email marketing\n- Anúncios pagos\n- PR e imprensa\n\n**Fase 5 — Pós-lançamento (Semana 10-12)**\n- Monitoramento de métricas\n- Feedback dos primeiros clientes\n- Iteração rápida\n\n📊 **Total:** 18 tarefas · 5 fases · Duração estimada: 12 semanas",
    actions: [
      { label: "Criar tudo no Kanban", action: "Criar todas as 18 tarefas e fases no Kanban" },
      { label: "Gerar mapa mental", action: "Gerar um mapa mental visual com essa estrutura" },
    ],
  },
  "Analisar o projeto atual e identificar riscos de atraso": {
    content:
      "🔍 **Análise de Riscos — Campanha Q1 2026**\n\n🔴 **Risco Alto:**\n- **Vídeo Demo** — está há 5 dias sem atualização, prazo em 3 dias\n- **Aprovação do Cliente** — sem resposta há 2 dias\n\n🟡 **Risco Médio:**\n- **Copy Redes Sociais** — dependência do Vídeo Demo\n- Carga de trabalho de Mike Chen está 120% da capacidade\n\n🟢 **Baixo Risco:**\n- Assets visuais no prazo\n- Guidelines aprovadas\n\n📊 **Previsão de IA:**\n- Probabilidade de atraso: **68%**\n- Atraso estimado: 3-5 dias\n\n💡 **Recomendações:**\n1. Escalar a aprovação do cliente imediatamente\n2. Realocar parte das tarefas de Mike para Sarah\n3. Começar a copy sem o vídeo final",
    actions: [
      { label: "Notificar equipe", action: "Enviar alerta de risco para a equipe" },
      { label: "Realocar tarefas", action: "Realocar tarefas conforme sugestão" },
    ],
  },
  "Criar um novo projeto com estrutura completa": {
    content:
      "Vamos criar seu projeto! Para gerar a melhor estrutura, me diga:\n\n1. **Qual é o objetivo do projeto?**\n   Ex: Lançar um curso online, Redesign do site, Campanha de marketing\n\n2. **Quantas pessoas na equipe?**\n\n3. **Qual o prazo desejado?**\n\nAssim posso gerar um plano personalizado com tarefas, prazos e atribuições.",
  },
  "Criar tarefas para esse projeto": {
    content:
      "Baseado no contexto do projeto **Campanha Q1**, gerei as seguintes tarefas:\n\n📌 **Alta Prioridade**\n1. Finalizar storyboard do vídeo — *Emma Davis* — até 12/03\n2. Revisão copy redes sociais — *Sarah Johnson* — até 13/03\n3. Aprovar orçamento de mídia — *João Silva* — até 11/03\n\n📌 **Média Prioridade**\n4. Criar variações de banner A/B — *Mike Chen* — até 15/03\n5. Configurar tracking de conversão — *Dev Team* — até 16/03\n6. Preparar relatório de baseline — *Analytics* — até 14/03\n\n📌 **Baixa Prioridade**\n7. Atualizar templates de email — *Sarah Johnson* — até 18/03\n8. Documentar guidelines da campanha — *João Silva* — até 19/03\n\n**Total:** 8 tarefas · 3 membros · Prazo médio: 7 dias",
    actions: [
      { label: "Criar no Kanban", action: "Criar todas as 8 tarefas no quadro Kanban" },
      { label: "Ajustar atribuições", action: "Modificar as atribuições sugeridas" },
    ],
  },
};

export function AIAssistant({ isOpen, onClose, isPremium = false, currentSection }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<CopilotTab>("chat");
  const [automationToggles, setAutomationToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(automationTemplates.map((a) => [a.id, a.active]))
  );
  const [customAutomation, setCustomAutomation] = useState("");
  const [aiUsage, setAiUsage] = useState(37);
  const aiLimit = isPremium ? 500 : 50;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setActiveTab("chat");
    setAiUsage((prev) => Math.min(prev + 1, aiLimit));

    setTimeout(() => {
      const responseData = aiResponses[messageText];
      const content = responseData?.content ||
        `Entendi sua solicitação: **"${messageText}"**\n\nAnalisei o contexto do seu workspace e posso ajudar com isso. Baseado nos dados disponíveis:\n\n📊 **Contexto atual:**\n- Projeto ativo: Campanha Q1 2026\n- 12 tarefas pendentes\n- 3 membros da equipe\n\nDeseja que eu elabore um plano detalhado ou prefere uma ação específica?`;
      const actions = responseData?.actions;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        timestamp: new Date(),
        actions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1800);
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  const handleToggleAutomation = (id: string) => {
    setAutomationToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const contextLabel =
    currentSection === "mindmaps"
      ? "Mapas Mentais"
      : currentSection === "workflow"
      ? "Fluxo de Trabalho"
      : currentSection === "projects"
      ? "Projetos"
      : "Dashboard";

  const tabs: { id: CopilotTab; label: string; icon: typeof Sparkles }[] = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "prompts", label: "Prompts", icon: BookOpen },
    { id: "automations", label: "Automações", icon: Zap },
    { id: "insights", label: "Insights", icon: Lightbulb },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-4 top-4 bottom-4 w-[460px] z-50 flex flex-col bg-background/95 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-gradient-to-r from-[#7B61FF]/5 to-[#B14EFF]/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Lumiflow AI Copilot</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] text-muted-foreground">
                    Contexto: {contextLabel}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleResetChat}
                className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
                title="Resetar conversa"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border/40">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all relative ${
                    isActive ? "text-[#7B61FF]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="copilotTab"
                      className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#7B61FF] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {/* CHAT TAB */}
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {/* Quick Commands (only at start) */}
                  {messages.length <= 1 && (
                    <div className="px-4 py-3 border-b border-border/40">
                      <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">
                        Comandos rápidos
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {quickCommands.map((cmd) => {
                          const Icon = cmd.icon;
                          return (
                            <motion.button
                              key={cmd.label}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSend(cmd.prompt)}
                              className="flex items-start gap-2 p-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                            >
                              <Icon className="w-3.5 h-3.5 text-[#7B61FF] mt-0.5 flex-shrink-0" />
                              <span className="text-[11px]">{cmd.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            message.role === "assistant"
                              ? "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]"
                              : "bg-gradient-to-br from-blue-500 to-cyan-500"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <Bot className="w-4 h-4 text-white" />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="max-w-[85%] space-y-2">
                          <div
                            className={`rounded-2xl px-4 py-3 text-sm ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-br-md"
                                : "bg-muted/60 rounded-bl-md"
                            }`}
                          >
                            <p className="whitespace-pre-line leading-relaxed">
                              {message.content.split("**").map((part, i) =>
                                i % 2 === 1 ? (
                                  <strong key={i}>{part}</strong>
                                ) : (
                                  <span key={i}>{part}</span>
                                )
                              )}
                            </p>
                          </div>
                          {/* Action buttons */}
                          {message.actions && message.actions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {message.actions.map((act) => (
                                <motion.button
                                  key={act.label}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleSend(act.action)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#7B61FF]/10 hover:bg-[#7B61FF]/20 text-[#7B61FF] rounded-lg text-[11px] font-medium transition-colors"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                  {act.label}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-muted/60 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#7B61FF]" />
                          <span className="text-sm text-muted-foreground">
                            Analisando contexto...
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </motion.div>
              )}

              {/* PROMPTS TAB */}
              {activeTab === "prompts" && (
                <motion.div
                  key="prompts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-5"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Biblioteca de Prompts
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      Clique em qualquer prompt para executar instantaneamente
                    </p>
                  </div>

                  {promptLibrary.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.category}>
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-6 h-6 rounded-md bg-gradient-to-br ${category.color} flex items-center justify-center`}
                          >
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-xs font-semibold">{category.category}</span>
                        </div>
                        <div className="space-y-1 ml-8">
                          {category.prompts.map((prompt) => (
                            <motion.button
                              key={prompt}
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSend(prompt)}
                              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                            >
                              <Sparkles className="w-3 h-3 text-muted-foreground group-hover:text-[#7B61FF] transition-colors flex-shrink-0" />
                              <span className="text-xs group-hover:text-foreground transition-colors text-muted-foreground">
                                {prompt}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* AUTOMATIONS TAB */}
              {activeTab === "automations" && (
                <motion.div
                  key="automations"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                >
                  {/* Custom Automation Input */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Criar automação com IA
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customAutomation}
                        onChange={(e) => setCustomAutomation(e.target.value)}
                        placeholder='Ex: "Quando tarefa for aprovada, mover para concluído"'
                        className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border/40 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/50 text-xs transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (customAutomation.trim()) {
                            handleSend(`Criar automação: ${customAutomation}`);
                            setCustomAutomation("");
                          }
                        }}
                        className="px-3 py-2 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-lg text-xs font-medium"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Automation Templates */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Templates de Automação
                    </h4>
                    <div className="space-y-2">
                      {automationTemplates.map((auto) => {
                        const Icon = auto.icon;
                        const isActive = automationToggles[auto.id];
                        return (
                          <motion.div
                            key={auto.id}
                            whileHover={{ y: -1 }}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              isActive
                                ? "border-[#7B61FF]/20 bg-purple-50/30 dark:bg-purple-950/10"
                                : "border-border/40"
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-lg bg-gradient-to-br ${auto.color} flex items-center justify-center flex-shrink-0 ${
                                !isActive ? "opacity-50 grayscale" : ""
                              }`}
                            >
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium">{auto.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {auto.desc}
                              </p>
                            </div>
                            <button
                              onClick={() => handleToggleAutomation(auto.id)}
                              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                                isActive ? "bg-[#7B61FF]" : "bg-muted"
                              }`}
                            >
                              <motion.div
                                animate={{ x: isActive ? 20 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                              />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Future: Voice */}
                  <div className="p-3 bg-muted/20 rounded-xl border border-border/40 flex items-center gap-3">
                    <Mic className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium">Comandos de voz</p>
                      <p className="text-[10px] text-muted-foreground">
                        Em breve: crie automações por voz
                      </p>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#7B61FF]/10 text-[#7B61FF] rounded-full font-medium ml-auto">
                      Em breve
                    </span>
                  </div>
                </motion.div>
              )}

              {/* INSIGHTS TAB */}
              {activeTab === "insights" && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                >
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Insights da IA
                  </h4>
                  <p className="text-[11px] text-muted-foreground mb-3">
                    Análises inteligentes baseadas nos seus dados
                  </p>

                  {insightsData.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        whileHover={{ y: -1 }}
                        className="p-3.5 bg-card border border-border/40 rounded-xl hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg ${insight.bgColor} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`w-4 h-4 ${insight.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold mb-0.5">{insight.title}</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {insight.desc}
                            </p>
                            <button
                              onClick={() => handleSend(insight.title)}
                              className="text-[10px] text-[#7B61FF] hover:text-[#B14EFF] font-medium mt-1.5 flex items-center gap-1 transition-colors"
                            >
                              {insight.action}
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Privacy note */}
                  <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-xl mt-2">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] text-muted-foreground">
                      A IA respeita permissões do workspace. Apenas dados que você tem acesso são analisados.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Usage Meter + Input */}
          <div className="border-t border-border/40 bg-background/80">
            {/* Usage Meter */}
            <div className="px-4 pt-2.5 pb-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span>
                  Uso IA: {aiUsage}/{aiLimit} consultas
                </span>
                <span className={isPremium ? "text-emerald-500" : "text-amber-500"}>
                  {isPremium ? "Pro" : "Starter"}
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(aiUsage / aiLimit) * 100}%` }}
                  className={`h-full rounded-full ${
                    aiUsage / aiLimit > 0.8
                      ? "bg-rose-500"
                      : "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF]"
                  }`}
                />
              </div>
            </div>

            {/* Input */}
            <div className="px-4 py-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte ao AI Copilot..."
                  className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border/40 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/50 focus:border-[#7B61FF]/50 text-sm transition-all"
                  disabled={isTyping}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white flex items-center justify-center shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:shadow-none transition-all"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
