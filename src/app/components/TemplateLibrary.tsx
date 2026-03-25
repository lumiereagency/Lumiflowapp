import { motion } from "motion/react";
import { useState } from "react";
import {
  Brain,
  Megaphone,
  Palette,
  Rocket,
  Code2,
  Building2,
  Users,
  BarChart3,
  ArrowRight,
  Search,
  Star,
  Download,
  Sparkles,
  Target,
  X,
  CheckCircle2,
  FolderKanban,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface TemplateLibraryProps {
  onNavigate: (section: string) => void;
}

const categories = [
  { id: "all", label: "Todos", icon: Sparkles },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "design", label: "Design", icon: Palette },
  { id: "product", label: "Produto", icon: Rocket },
  { id: "development", label: "Desenvolvimento", icon: Code2 },
  { id: "agencies", label: "Agências", icon: Building2 },
  { id: "startups", label: "Startups", icon: BarChart3 },
  { id: "productivity", label: "Produtividade", icon: Target },
];

const templates = [
  {
    id: "1",
    name: "Campanha de Marketing Digital",
    description: "Planejamento completo de campanha com Kanban, calendário e métricas",
    category: "marketing",
    icon: Megaphone,
    color: "from-blue-500 to-cyan-500",
    rating: 4.8,
    downloads: 2340,
    tags: ["Kanban", "Calendário", "Métricas"],
    premium: false,
  },
  {
    id: "2",
    name: "Sprint de Produto",
    description: "Gestão ágil com backlog, sprint board e retrospectiva automatizada",
    category: "product",
    icon: Rocket,
    color: "from-[#7B61FF] to-[#B14EFF]",
    rating: 4.9,
    downloads: 3120,
    tags: ["Ágil", "Sprint", "Backlog"],
    premium: false,
  },
  {
    id: "3",
    name: "Workflow de Design System",
    description: "Organize componentes, tokens e guidelines com aprovações integradas",
    category: "design",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    rating: 4.7,
    downloads: 1890,
    tags: ["Design", "Aprovações", "Guidelines"],
    premium: true,
  },
  {
    id: "4",
    name: "Gestão de Agência Criativa",
    description: "Projetos de clientes, briefs, entregas e aprovações em um só lugar",
    category: "agencies",
    icon: Building2,
    color: "from-emerald-500 to-teal-500",
    rating: 4.6,
    downloads: 1450,
    tags: ["Clientes", "Briefs", "Entregas"],
    premium: true,
  },
  {
    id: "5",
    name: "Product Launch Playbook",
    description: "Checklist completo para lançamento de produto com timeline e tarefas",
    category: "product",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
    rating: 4.8,
    downloads: 2100,
    tags: ["Lançamento", "Checklist", "Timeline"],
    premium: false,
  },
  {
    id: "6",
    name: "Calendário Editorial",
    description: "Planejamento de conteúdo para redes sociais com fluxo de aprovação",
    category: "marketing",
    icon: Megaphone,
    color: "from-violet-500 to-purple-500",
    rating: 4.5,
    downloads: 1780,
    tags: ["Conteúdo", "Social Media", "Calendário"],
    premium: false,
  },
  {
    id: "7",
    name: "MVP Builder",
    description: "Framework para validação rápida de ideias com mapa mental e roadmap",
    category: "startups",
    icon: BarChart3,
    color: "from-amber-500 to-orange-500",
    rating: 4.7,
    downloads: 980,
    tags: ["MVP", "Roadmap", "Validação"],
    premium: true,
  },
  {
    id: "8",
    name: "CI/CD Pipeline Manager",
    description: "Gerencie deploys, code reviews e automações com Kanban visual",
    category: "development",
    icon: Code2,
    color: "from-slate-500 to-gray-600",
    rating: 4.4,
    downloads: 760,
    tags: ["DevOps", "Pipeline", "Automação"],
    premium: false,
  },
  {
    id: "9",
    name: "GTD - Getting Things Done",
    description: "Sistema completo de produtividade pessoal com inbox, próximas ações e revisão semanal",
    category: "productivity",
    icon: Target,
    color: "from-emerald-500 to-green-600",
    rating: 4.9,
    downloads: 4200,
    tags: ["GTD", "Produtividade", "Pessoal"],
    premium: false,
  },
  {
    id: "10",
    name: "OKR Tracker",
    description: "Acompanhe objetivos e resultados-chave do time com dashboards visuais",
    category: "productivity",
    icon: Target,
    color: "from-indigo-500 to-blue-600",
    rating: 4.7,
    downloads: 2890,
    tags: ["OKRs", "Metas", "Dashboard"],
    premium: true,
  },
];

export function TemplateLibrary({ onNavigate }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);

  const filteredTemplates = templates.filter((t) => {
    const matchCategory =
      activeCategory === "all" || t.category === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Brain className="w-6 h-6 text-[#7B61FF]" />
            Templates de Fluxo
          </h1>
          <p className="text-muted-foreground">
            Comece mais rápido com templates prontos para usar
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar templates..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 focus:border-[#7B61FF]/30 text-sm transition-all"
        />
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white shadow-lg shadow-purple-500/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-[#7B61FF]/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setPreviewTemplate(template)}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#7B61FF]/20 transition-all duration-300 group cursor-pointer"
            >
              {/* Color banner */}
              <div
                className={`h-2 bg-gradient-to-r ${template.color}`}
              />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {template.premium && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#7B61FF]/10 to-[#B14EFF]/10 border border-[#7B61FF]/20 rounded-full text-[10px] font-medium text-[#7B61FF]">
                      <Sparkles className="w-3 h-3" />
                      Pro
                    </span>
                  )}
                </div>

                <h3 className="font-semibold mb-1.5 group-hover:text-[#7B61FF] transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-muted/50 rounded-md text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {template.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.downloads.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhum template encontrado para essa busca
          </p>
        </div>
      )}

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (() => {
          const PIcon = previewTemplate.icon;
          return (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewTemplate(null)}
                className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[520px] max-w-[95vw] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className={`h-24 bg-gradient-to-r ${previewTemplate.color} relative`}>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 -mt-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${previewTemplate.color} flex items-center justify-center shadow-xl border-4 border-background mb-4`}>
                    <PIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{previewTemplate.name}</h2>
                    {previewTemplate.premium && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-[#7B61FF]/10 border border-[#7B61FF]/20 rounded-full text-[10px] font-medium text-[#7B61FF]">
                        <Sparkles className="w-3 h-3" /> Pro
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{previewTemplate.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {previewTemplate.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" /> {previewTemplate.downloads.toLocaleString("pt-BR")} instalações
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {previewTemplate.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-muted/50 rounded-lg text-xs">{tag}</span>
                    ))}
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-[#7B61FF]" />
                      O que está incluído
                    </h4>
                    <div className="space-y-1.5">
                      {["Kanban board pré-configurado", "Automações de fluxo", "Campos e tags personalizados", "Guia de uso integrado"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setPreviewTemplate(null);
                        toast.success(`Projeto criado com template "${previewTemplate.name}"!`);
                        onNavigate("projects");
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30"
                    >
                      Usar Template
                    </motion.button>
                    <button
                      onClick={() => setPreviewTemplate(null)}
                      className="px-6 py-3 rounded-xl bg-muted/50 text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}