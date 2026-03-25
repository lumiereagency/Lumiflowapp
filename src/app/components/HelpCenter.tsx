import { motion } from "motion/react";
import { useState } from "react";
import {
  HelpCircle,
  Search,
  BookOpen,
  Keyboard,
  MessageSquare,
  Sparkles,
  Brain,
  GitBranch,
  FolderKanban,
  Calendar,
  BarChart3,
  Zap,
  ChevronRight,
  ExternalLink,
  Play,
  ArrowRight,
  Mail,
  Globe,
  Users,
  LayoutTemplate,
} from "lucide-react";

interface HelpCenterProps {
  onNavigate: (section: string) => void;
  onOpenAI?: () => void;
}

const shortcuts = [
  { keys: ["⌘", "K"], label: "Abrir barra de comandos" },
  { keys: ["⌘", "N"], label: "Novo card / tarefa" },
  { keys: ["⌘", "P"], label: "Buscar projetos" },
  { keys: ["⌘", "B"], label: "Alternar sidebar" },
  { keys: ["⌘", "D"], label: "Modo escuro / claro" },
  { keys: ["⌘", "/"], label: "Abrir assistente IA" },
  { keys: ["Esc"], label: "Fechar modal / painel" },
  { keys: ["⌘", "S"], label: "Salvar alterações" },
];

const guideCategories = [
  {
    title: "Primeiros Passos",
    icon: Play,
    color: "from-[#7B61FF] to-[#B14EFF]",
    articles: [
      { title: "Criando seu primeiro projeto", section: "projects" },
      { title: "Entendendo o Kanban board", section: "workflow" },
      { title: "Convidando membros do time", section: "team" },
      { title: "Personalizando seu workspace", section: "settings" },
    ],
  },
  {
    title: "Mapas Mentais",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    articles: [
      { title: "Criando e editando nós", section: "mindmaps" },
      { title: "Conectando ideias", section: "mindmaps" },
      { title: "Compartilhando mapas mentais", section: "mindmaps" },
      { title: "Convertendo nós em tarefas", section: "mindmaps" },
    ],
  },
  {
    title: "Fluxo de Trabalho",
    icon: GitBranch,
    color: "from-emerald-500 to-teal-500",
    articles: [
      { title: "Drag & drop no Kanban", section: "workflow" },
      { title: "Criando e editando cards", section: "workflow" },
      { title: "Usando filtros e prioridades", section: "workflow" },
      { title: "Aprovações e revisões", section: "workflow" },
    ],
  },
  {
    title: "Automações",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    articles: [
      { title: "Criando automações", section: "automations" },
      { title: "Gatilhos disponíveis", section: "automations" },
      { title: "Templates de automação", section: "automations" },
      { title: "Automações com IA", section: "automations" },
    ],
  },
  {
    title: "Análises e Relatórios",
    icon: BarChart3,
    color: "from-indigo-500 to-purple-500",
    articles: [
      { title: "Dashboard de produtividade", section: "analytics" },
      { title: "Detecção de gargalos", section: "analytics" },
      { title: "Métricas do time", section: "analytics" },
      { title: "Exportando relatórios", section: "analytics" },
    ],
  },
  {
    title: "Assistente IA",
    icon: Sparkles,
    color: "from-rose-500 to-pink-500",
    articles: [
      { title: "Chat com o Copilot", section: "ai-assistant" },
      { title: "Prompts inteligentes", section: "ai-assistant" },
      { title: "Insights automáticos", section: "ai-assistant" },
      { title: "Gerando conteúdo com IA", section: "ai-assistant" },
    ],
  },
];

const faqItems = [
  { q: "Como faço para mudar meu plano?", a: "Acesse Configurações > Planos e Pagamento para ver as opções disponíveis e fazer o upgrade." },
  { q: "Posso convidar pessoas fora da minha empresa?", a: "Sim! Envie um convite com o email da pessoa e ela terá acesso ao workspace com as permissões que você definir." },
  { q: "Os dados do meu workspace são privados?", a: "Sim, todos os dados são criptografados e acessíveis apenas pelos membros do seu workspace." },
  { q: "Como funciona o assistente de IA?", a: "O Copilot analisa seus projetos e tarefas para sugerir otimizações, gerar resumos e ajudar na criação de conteúdo." },
  { q: "Posso usar o Lumiflow no celular?", a: "O aplicativo mobile está em desenvolvimento. Atualmente, o Lumiflow é otimizado para desktop e tablet." },
];

export function HelpCenter({ onNavigate, onOpenAI }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-3">Central de Ajuda</h1>
        <p className="text-muted-foreground mb-6">
          Encontre guias, atalhos e respostas para usar o Lumiflow ao máximo
        </p>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar artigos, atalhos, perguntas..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => onOpenAI?.()}
          className="bg-gradient-to-br from-[#7B61FF]/10 to-[#B14EFF]/10 border border-[#7B61FF]/20 rounded-2xl p-5 text-left hover:shadow-lg transition-all"
        >
          <Sparkles className="w-8 h-8 text-[#7B61FF] mb-3" />
          <h3 className="font-semibold mb-1">Pergunte ao Copilot</h3>
          <p className="text-xs text-muted-foreground">Use IA para tirar dúvidas sobre o Lumiflow</p>
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-lg hover:border-[#7B61FF]/20 transition-all"
        >
          <MessageSquare className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-semibold mb-1">Chat com Suporte</h3>
          <p className="text-xs text-muted-foreground">Fale com nossa equipe em tempo real</p>
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => onNavigate("community")}
          className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-lg hover:border-[#7B61FF]/20 transition-all"
        >
          <Globe className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-semibold mb-1">Comunidade</h3>
          <p className="text-xs text-muted-foreground">Troque experiências com outros usuários</p>
        </motion.button>
      </div>

      {/* Keyboard Shortcuts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-[#7B61FF]" />
          Atalhos do Teclado
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, ki) => (
                  <kbd key={ki} className="px-2 py-1 rounded-lg bg-muted text-xs font-mono font-medium min-w-[28px] text-center">
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{shortcut.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#7B61FF]" />
          Guias e Tutoriais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guideCategories
            .filter((cat) =>
              !searchQuery || cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              cat.articles.some((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((category, i) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-[#7B61FF]/20 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3">{category.title}</h3>
                  <div className="space-y-1.5">
                    {category.articles.map((article) => (
                      <button
                        key={article.title}
                        onClick={() => onNavigate(article.section)}
                        className="flex items-center gap-2 w-full text-left text-xs text-muted-foreground hover:text-[#7B61FF] transition-colors py-1 group"
                      >
                        <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{article.title}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#7B61FF]" />
          Perguntas Frequentes
        </h2>
        <div className="space-y-2">
          {faqItems.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left text-sm font-medium hover:bg-muted/20 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedFaq === i ? "rotate-90" : ""}`} />
              </button>
              {expandedFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-5 pb-4"
                >
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
