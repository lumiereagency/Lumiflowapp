import { motion } from "motion/react";
import { useState } from "react";
import {
  Globe,
  Heart,
  MessageSquare,
  Download,
  Star,
  TrendingUp,
  Sparkles,
  Users,
  Brain,
  GitBranch,
  Zap,
  Search,
  BookOpen,
  Lightbulb,
  ArrowUpRight,
  Eye,
  Award,
} from "lucide-react";

interface CommunityHubProps {
  onNavigate: (section: string) => void;
}

const featuredWorkflows = [
  {
    id: "1",
    title: "Marketing Omnichannel Pipeline",
    author: "Juliana Costa",
    authorInitials: "JC",
    authorColor: "from-pink-500 to-rose-500",
    description: "Pipeline completo de marketing omnichannel com automação de IA e aprovações",
    likes: 284,
    comments: 42,
    installs: 1230,
    tags: ["Marketing", "Automação", "IA"],
    icon: TrendingUp,
    color: "from-[#7B61FF] to-[#B14EFF]",
    featured: true,
  },
  {
    id: "2",
    title: "Sprint Planning Framework",
    author: "Rafael Mendes",
    authorInitials: "RM",
    authorColor: "from-blue-500 to-cyan-500",
    description: "Framework ágil para planejamento de sprints com backlog automatizado",
    likes: 198,
    comments: 31,
    installs: 890,
    tags: ["Ágil", "Sprints", "Dev"],
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    featured: false,
  },
  {
    id: "3",
    title: "Design System Governance",
    author: "Camila Ferreira",
    authorInitials: "CF",
    authorColor: "from-emerald-500 to-teal-500",
    description: "Governança de design system com fluxo de aprovação e versionamento",
    likes: 156,
    comments: 23,
    installs: 670,
    tags: ["Design", "Governança", "UI"],
    icon: Brain,
    color: "from-emerald-500 to-teal-500",
    featured: false,
  },
  {
    id: "4",
    title: "Content Calendar Pro",
    author: "Lucas Oliveira",
    authorInitials: "LO",
    authorColor: "from-orange-500 to-red-500",
    description: "Calendário editorial com planejamento de conteúdo e aprovação de clientes",
    likes: 312,
    comments: 56,
    installs: 1450,
    tags: ["Conteúdo", "Social Media", "Clientes"],
    icon: GitBranch,
    color: "from-orange-500 to-red-500",
    featured: false,
  },
];

const productivityTips = [
  {
    id: "1",
    title: "5 formas de acelerar seu fluxo de aprovação",
    category: "Produtividade",
    readTime: "4 min",
    icon: Zap,
  },
  {
    id: "2",
    title: "Como usar IA para gerar tarefas automaticamente",
    category: "Inteligência Artificial",
    readTime: "6 min",
    icon: Sparkles,
  },
  {
    id: "3",
    title: "Templates que salvam 10h por semana em agências",
    category: "Templates",
    readTime: "5 min",
    icon: Lightbulb,
  },
];

const topCreators = [
  { name: "Juliana Costa", installs: 3240, templates: 8, initials: "JC", color: "from-pink-500 to-rose-500" },
  { name: "Rafael Mendes", installs: 2180, templates: 5, initials: "RM", color: "from-blue-500 to-cyan-500" },
  { name: "Camila Ferreira", installs: 1890, templates: 6, initials: "CF", color: "from-emerald-500 to-teal-500" },
];

export function CommunityHub({ onNavigate }: CommunityHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#7B61FF]" />
            Comunidade Lumiflow
          </h1>
          <p className="text-muted-foreground">
            Descubra workflows, templates e estratégias de produtividade
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-500/20"
        >
          <Sparkles className="w-4 h-4" />
          Publicar Workflow
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar workflows, templates, estratégias..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 focus:border-[#7B61FF]/30 text-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Workflows */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#7B61FF]" />
              Workflows em destaque
            </h2>
            <button className="text-sm text-[#7B61FF] hover:text-[#B14EFF] transition-colors">
              Ver todos
            </button>
          </div>

          {featuredWorkflows.map((workflow, index) => {
            const Icon = workflow.icon;
            const isLiked = likedItems.has(workflow.id);
            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -2 }}
                className={`bg-card border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                  workflow.featured
                    ? "border-[#7B61FF]/30 shadow-md shadow-purple-500/5"
                    : "border-border"
                }`}
              >
                {workflow.featured && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      Destaque da semana
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${workflow.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 group-hover:text-[#7B61FF] transition-colors">
                      {workflow.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {workflow.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {workflow.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-muted/50 rounded-md text-[10px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${workflow.authorColor} flex items-center justify-center text-white text-[8px] font-medium`}
                        >
                          {workflow.authorInitials}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {workflow.author}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(workflow.id);
                          }}
                          className={`flex items-center gap-1 transition-colors ${
                            isLiked
                              ? "text-rose-500"
                              : "hover:text-rose-500"
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isLiked ? "fill-current" : ""
                            }`}
                          />
                          {workflow.likes + (isLiked ? 1 : 0)}
                        </button>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {workflow.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" />
                          {workflow.installs.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Creators */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Top Criadores
            </h3>
            <div className="space-y-3">
              {topCreators.map((creator, index) => (
                <motion.div
                  key={creator.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <span className="text-xs text-muted-foreground font-medium w-4">
                    {index + 1}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${creator.color} flex items-center justify-center text-white text-xs font-medium shadow-md`}
                  >
                    {creator.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {creator.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {creator.templates} templates · {creator.installs.toLocaleString("pt-BR")} installs
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Productivity Tips */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#7B61FF]" />
              Dicas de Produtividade
            </h3>
            <div className="space-y-3">
              {productivityTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-muted/20 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm group-hover:text-[#7B61FF] transition-colors">
                        {tip.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {tip.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          · {tip.readTime}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-[#7B61FF]/10 rounded-2xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#7B61FF]" />
              Comunidade
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold">12.4k</div>
                <div className="text-[10px] text-muted-foreground">
                  Membros
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">2.8k</div>
                <div className="text-[10px] text-muted-foreground">
                  Workflows
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">890</div>
                <div className="text-[10px] text-muted-foreground">
                  Templates
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">45k</div>
                <div className="text-[10px] text-muted-foreground">
                  Instalações
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
