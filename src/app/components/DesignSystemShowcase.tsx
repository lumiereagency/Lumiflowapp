/**
 * LUMIFLOW DESIGN SYSTEM SHOWCASE
 * Reference page for FlutterFlow conversion — all components, states, and tokens.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Search, Bell, Settings, Plus, Trash2, Heart, Star,
  Send, Download, Upload, Eye, EyeOff, Calendar, Clock, User,
  Mail, Lock, ChevronRight, ArrowRight, AlertTriangle, Check,
  FolderKanban, Brain, Target, TrendingUp, Flame, CheckCircle2,
  Zap, BarChart3, Inbox, BookOpen, Home, Layers, Palette,
} from "lucide-react";
import {
  LumiButton,
  LumiIconButton,
  LumiCard,
  LumiGlassCard,
  LumiInput,
  LumiTextarea,
  LumiSelect,
  LumiBadge,
  LumiSwitch,
  LumiProgress,
  LumiAvatar,
  LumiSkeleton,
  LumiModal,
  LumiNavItem,
  LumiTabBar,
  LumiTag,
  LumiAlert,
  LumiDivider,
  LumiEmptyState,
  LumiStat,
  LumiGradientText,
  LumiSpinner,
} from "./ui/lumiflow-ds";

// Utility to merge class names
function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DesignSystemShowcaseProps {
  onNavigate: (section: string) => void;
}

export function DesignSystemShowcase({ onNavigate }: DesignSystemShowcaseProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [selectVal, setSelectVal] = useState("opt2");
  const [inputVal, setInputVal] = useState("");
  const [textareaVal, setTextareaVal] = useState("");
  const [activeTab, setActiveTab] = useState("buttons");
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [demoTab, setDemoTab] = useState("tab1");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleLoadingDemo = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 2000);
  };

  const sections = [
    { id: "buttons", label: "Botoes", icon: <Layers /> },
    { id: "cards", label: "Cards", icon: <FolderKanban /> },
    { id: "inputs", label: "Inputs", icon: <Mail /> },
    { id: "badges", label: "Badges & Tags", icon: <Star /> },
    { id: "feedback", label: "Feedback", icon: <AlertTriangle /> },
    { id: "navigation", label: "Navegacao", icon: <Home /> },
    { id: "data", label: "Data Display", icon: <BarChart3 /> },
    { id: "colors", label: "Cores & Tokens", icon: <Palette /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <LumiGradientText className="text-2xl font-bold tracking-tight">Design System</LumiGradientText>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Componentes padronizados do Lumiflow — prontos para FlutterFlow</p>
        </div>
        <LumiBadge color="gradient">v2.0 — FlutterFlow Ready</LumiBadge>
      </div>

      {/* Section Tabs */}
      <LumiTabBar
        tabs={sections.map(s => ({ id: s.id, label: s.label, icon: s.icon }))}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ═══════════════ BUTTONS ═══════════════ */}
      {activeTab === "buttons" && (
        <div className="space-y-6">
          <SectionTitle title="Botoes — Variantes" description="7 variantes para todos os contextos da UI" />

          <LumiCard elevation="flat">
            <SubTitle>Variantes Primarias</SubTitle>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <LumiButton variant="primary">Primario</LumiButton>
              <LumiButton variant="gradient">Gradiente</LumiButton>
              <LumiButton variant="secondary">Secundario</LumiButton>
              <LumiButton variant="outline">Outline</LumiButton>
              <LumiButton variant="ghost">Ghost</LumiButton>
              <LumiButton variant="destructive">Destrutivo</LumiButton>
              <LumiButton variant="link">Link</LumiButton>
            </div>

            <SubTitle>Tamanhos</SubTitle>
            <div className="flex flex-wrap items-end gap-3 mb-6">
              <LumiButton variant="primary" size="sm">Pequeno</LumiButton>
              <LumiButton variant="primary" size="md">Medio</LumiButton>
              <LumiButton variant="primary" size="lg">Grande</LumiButton>
            </div>

            <SubTitle>Com Icone</SubTitle>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <LumiButton variant="primary" icon={<Plus className="w-4 h-4" />}>Novo Projeto</LumiButton>
              <LumiButton variant="gradient" icon={<Sparkles className="w-4 h-4" />}>Perguntar a IA</LumiButton>
              <LumiButton variant="outline" icon={<Download className="w-4 h-4" />}>Exportar</LumiButton>
              <LumiButton variant="secondary" iconRight={<ArrowRight className="w-4 h-4" />}>Continuar</LumiButton>
            </div>

            <SubTitle>Estados</SubTitle>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <LumiButton variant="primary" loading={loadingBtn} onClick={handleLoadingDemo}>
                {loadingBtn ? "Salvando..." : "Clique para Loading"}
              </LumiButton>
              <LumiButton variant="primary" disabled>Desabilitado</LumiButton>
              <LumiButton variant="gradient" fullWidth>Botao Full Width</LumiButton>
            </div>

            <SubTitle>Icon Buttons</SubTitle>
            <div className="flex flex-wrap items-center gap-3">
              <LumiIconButton variant="ghost"><Bell /></LumiIconButton>
              <LumiIconButton variant="ghost" badge={3}><Bell /></LumiIconButton>
              <LumiIconButton variant="outline"><Settings /></LumiIconButton>
              <LumiIconButton variant="filled"><Sparkles /></LumiIconButton>
              <LumiIconButton variant="ghost" size="sm"><Search /></LumiIconButton>
              <LumiIconButton variant="ghost" size="lg"><Plus /></LumiIconButton>
            </div>
          </LumiCard>
        </div>
      )}

      {/* ═══════════════ CARDS ═══════════════ */}
      {activeTab === "cards" && (
        <div className="space-y-6">
          <SectionTitle title="Cards" description="3 elevacoes + glass variant para todas as superficies" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LumiCard elevation="flat">
              <SubTitle>Flat Card</SubTitle>
              <p className="text-xs text-muted-foreground">Elevacao zero — para conteudo inline</p>
            </LumiCard>
            <LumiCard elevation="raised">
              <SubTitle>Raised Card</SubTitle>
              <p className="text-xs text-muted-foreground">Sombra sutil — conteudo destacado</p>
            </LumiCard>
            <LumiCard elevation="floating">
              <SubTitle>Floating Card</SubTitle>
              <p className="text-xs text-muted-foreground">Sombra forte — modais, popovers</p>
            </LumiCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LumiCard elevation="flat" hoverable>
              <SubTitle>Hoverable Card</SubTitle>
              <p className="text-xs text-muted-foreground">Passe o mouse para ver o efeito de hover com borda e sombra purple</p>
            </LumiCard>
            <LumiCard elevation="flat" gradient>
              <SubTitle>Gradient Card</SubTitle>
              <p className="text-xs text-muted-foreground">Background gradiente sutil purple — para secoes premium/IA</p>
            </LumiCard>
          </div>

          <LumiGlassCard>
            <SubTitle>Glass Card (Glassmorphism)</SubTitle>
            <p className="text-xs text-muted-foreground">Blur + transparencia — para overlays, widgets flutuantes, navbars</p>
          </LumiGlassCard>

          {/* Stat Cards */}
          <SectionTitle title="Stat Cards" description="Cards de estatistica com icone gradiente" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LumiStat label="Projetos Ativos" value="12" change="+2 esta semana" changePositive icon={<Brain />} gradient="from-[#7B61FF] to-[#B14EFF]" />
            <LumiStat label="Tarefas Concluidas" value="48" change="+15% vs semana" changePositive icon={<CheckCircle2 />} gradient="from-emerald-500 to-teal-500" />
            <LumiStat label="Streak Diario" value="7 dias" change="Melhor: 12 dias" icon={<Flame />} gradient="from-orange-500 to-red-500" />
            <LumiStat label="Score" value="78" change="+5 pontos" changePositive icon={<Target />} gradient="from-blue-500 to-cyan-500" />
          </div>
        </div>
      )}

      {/* ═══════════════ INPUTS ═══════════════ */}
      {activeTab === "inputs" && (
        <div className="space-y-6">
          <SectionTitle title="Inputs & Forms" description="Inputs, textarea, select com estados de validacao" />

          <LumiCard elevation="flat">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <LumiInput label="Nome completo" placeholder="Digite seu nome..." icon={<User />} />
              <LumiInput label="Email" placeholder="email@exemplo.com" icon={<Mail />} type="email" />
              <LumiInput
                label="Senha"
                placeholder="Sua senha..."
                type={showPassword ? "text" : "password"}
                icon={<Lock />}
                iconRight={
                  <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <LumiInput label="Buscar" placeholder="Buscar projetos..." icon={<Search />} value={inputVal} onChange={e => setInputVal(e.target.value)} helper="Pressione Enter para buscar" />
              <LumiInput label="Com erro" placeholder="Campo obrigatorio..." error="Este campo e obrigatorio" />
              <LumiInput label="Desabilitado" placeholder="Nao editavel" disabled />
            </div>

            <LumiDivider className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <LumiTextarea label="Descricao" placeholder="Descreva seu projeto..." value={textareaVal} onChange={e => setTextareaVal(e.target.value)} maxChars={200} helper="Maximo de 200 caracteres" />
              <LumiTextarea label="Com erro" placeholder="Texto..." error="Descricao muito curta" />
            </div>

            <LumiDivider className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <LumiSelect
                label="Projeto"
                placeholder="Selecione um projeto..."
                options={[
                  { value: "opt1", label: "Campanha Q1", icon: <FolderKanban className="w-4 h-4 text-[#7B61FF]" /> },
                  { value: "opt2", label: "Branding", icon: <Palette className="w-4 h-4 text-pink-500" /> },
                  { value: "opt3", label: "Marketing", icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
                ]}
                value={selectVal}
                onChange={setSelectVal}
              />
              <LumiSelect label="Com erro" placeholder="Selecione..." options={[]} error="Selecione uma opcao" />
            </div>

            <LumiDivider className="my-6" />

            <SubTitle>Switches</SubTitle>
            <div className="space-y-3">
              <LumiSwitch checked={switchA} onChange={setSwitchA} label="Notificacoes push" description="Receba alertas em tempo real" />
              <LumiSwitch checked={switchB} onChange={setSwitchB} label="Modo escuro" />
              <LumiSwitch checked={false} onChange={() => {}} label="Desabilitado" disabled />
            </div>
          </LumiCard>
        </div>
      )}

      {/* ═══════════════ BADGES & TAGS ═══════════════ */}
      {activeTab === "badges" && (
        <div className="space-y-6">
          <SectionTitle title="Badges" description="8 variantes de cor para status e categorias" />

          <LumiCard elevation="flat">
            <SubTitle>Cores</SubTitle>
            <div className="flex flex-wrap gap-2 mb-6">
              <LumiBadge color="purple">Purple</LumiBadge>
              <LumiBadge color="blue">Blue</LumiBadge>
              <LumiBadge color="green">Green</LumiBadge>
              <LumiBadge color="amber">Amber</LumiBadge>
              <LumiBadge color="red">Red</LumiBadge>
              <LumiBadge color="pink">Pink</LumiBadge>
              <LumiBadge color="slate">Slate</LumiBadge>
              <LumiBadge color="gradient">Gradient</LumiBadge>
            </div>

            <SubTitle>Com icone e dot</SubTitle>
            <div className="flex flex-wrap gap-2 mb-6">
              <LumiBadge color="green" dot>Online</LumiBadge>
              <LumiBadge color="red" dot>Urgente</LumiBadge>
              <LumiBadge color="purple" icon={<Sparkles />}>IA</LumiBadge>
              <LumiBadge color="blue" icon={<Clock />}>Em andamento</LumiBadge>
              <LumiBadge color="amber" icon={<AlertTriangle />}>Atencao</LumiBadge>
            </div>

            <SubTitle>Tags (removiveis)</SubTitle>
            <div className="flex flex-wrap gap-2">
              <LumiTag color="purple" onRemove={() => {}}>Design</LumiTag>
              <LumiTag color="blue" onRemove={() => {}}>Frontend</LumiTag>
              <LumiTag color="green" onRemove={() => {}}>Concluido</LumiTag>
              <LumiTag color="amber">Sem remover</LumiTag>
            </div>
          </LumiCard>
        </div>
      )}

      {/* ═══════════════ FEEDBACK ═══════════════ */}
      {activeTab === "feedback" && (
        <div className="space-y-6">
          <SectionTitle title="Feedback & Estados" description="Alertas, progress, loading e empty states" />

          <SubTitle>Alertas</SubTitle>
          <div className="space-y-3">
            <LumiAlert severity="info" title="Nova funcionalidade disponivel" description="O auto-planejador IA foi ativado para sua conta." action={{ label: "Experimentar", onClick: () => {} }} />
            <LumiAlert severity="success" title="Tarefa concluida!" description="'Finalizar legendas do video' foi marcada como concluida." onDismiss={() => {}} />
            <LumiAlert severity="warning" title="Prazo se aproximando" description="'Video Demo' vence em 2 dias. 75% concluido." action={{ label: "Ver tarefa", onClick: () => {} }} />
            <LumiAlert severity="error" title="Falha ao sincronizar" description="Nao foi possivel conectar com Google Calendar. Tente novamente." onDismiss={() => {}} />
          </div>

          <LumiDivider className="my-6" />

          <SubTitle>Progress Bars</SubTitle>
          <LumiCard elevation="flat">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Gradiente (padrao)</p>
                <LumiProgress value={78} showLabel />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Cor customizada</p>
                <LumiProgress value={65} color="#10b981" showLabel />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Tamanhos: sm / md / lg</p>
                <div className="space-y-2">
                  <LumiProgress value={50} size="sm" />
                  <LumiProgress value={50} size="md" />
                  <LumiProgress value={50} size="lg" />
                </div>
              </div>
            </div>
          </LumiCard>

          <LumiDivider className="my-6" />

          <SubTitle>Loading States</SubTitle>
          <LumiCard elevation="flat">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <LumiSpinner size="sm" />
                <p className="text-[10px] text-muted-foreground mt-2">SM</p>
              </div>
              <div className="text-center">
                <LumiSpinner size="md" />
                <p className="text-[10px] text-muted-foreground mt-2">MD</p>
              </div>
              <div className="text-center">
                <LumiSpinner size="lg" />
                <p className="text-[10px] text-muted-foreground mt-2">LG</p>
              </div>
            </div>

            <SubTitle>Skeletons</SubTitle>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <LumiSkeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-2">
                  <LumiSkeleton variant="text" width="60%" />
                  <LumiSkeleton variant="text" width="40%" />
                </div>
              </div>
              <LumiSkeleton variant="rectangular" height={120} className="w-full" />
              <div className="grid grid-cols-3 gap-3">
                <LumiSkeleton variant="card" />
                <LumiSkeleton variant="card" />
                <LumiSkeleton variant="card" />
              </div>
            </div>
          </LumiCard>

          <LumiDivider className="my-6" />

          <SubTitle>Empty State</SubTitle>
          <LumiCard elevation="flat" padded={false}>
            <LumiEmptyState
              icon={<Inbox />}
              title="Nenhuma tarefa encontrada"
              description="Crie sua primeira tarefa ou importe de um template para comecar."
              action={{ label: "Criar Tarefa", onClick: () => {} }}
            />
          </LumiCard>

          <LumiDivider className="my-6" />

          <SubTitle>Modal</SubTitle>
          <LumiButton variant="outline" onClick={() => setModalOpen(true)}>Abrir Modal de Exemplo</LumiButton>
          <LumiModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Criar Novo Projeto"
            description="Preencha as informacoes para criar um novo projeto"
            footer={
              <>
                <LumiButton variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</LumiButton>
                <LumiButton variant="gradient" onClick={() => setModalOpen(false)}>Criar Projeto</LumiButton>
              </>
            }
          >
            <div className="space-y-4">
              <LumiInput label="Nome do Projeto" placeholder="Ex: Campanha Q2" icon={<FolderKanban />} />
              <LumiTextarea label="Descricao" placeholder="Descreva o objetivo do projeto..." />
              <LumiSelect
                label="Categoria"
                options={[
                  { value: "design", label: "Design" },
                  { value: "dev", label: "Desenvolvimento" },
                  { value: "marketing", label: "Marketing" },
                ]}
                placeholder="Selecionar categoria..."
              />
            </div>
          </LumiModal>
        </div>
      )}

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      {activeTab === "navigation" && (
        <div className="space-y-6">
          <SectionTitle title="Navegacao" description="Nav items, tab bars e avatares" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LumiCard elevation="flat">
              <SubTitle>Sidebar Nav Items</SubTitle>
              <div className="space-y-1 max-w-[240px]">
                {[
                  { id: "home", label: "Dashboard", icon: <Home /> },
                  { id: "projects", label: "Projetos", icon: <FolderKanban />, badge: 3 },
                  { id: "workflow", label: "Workflow", icon: <Layers /> },
                  { id: "calendar", label: "Calendario", icon: <Calendar /> },
                  { id: "analytics", label: "Analises", icon: <BarChart3 /> },
                ].map(item => (
                  <LumiNavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    active={activeNavItem === item.id}
                    onClick={() => setActiveNavItem(item.id)}
                  />
                ))}
              </div>

              <LumiDivider className="my-4" />
              <SubTitle>Collapsed</SubTitle>
              <div className="flex gap-1">
                {[
                  { id: "home2", icon: <Home /> },
                  { id: "projects2", icon: <FolderKanban /> },
                  { id: "workflow2", icon: <Layers /> },
                ].map(item => (
                  <LumiNavItem
                    key={item.id}
                    icon={item.icon}
                    label=""
                    collapsed
                    active={item.id === "home2"}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </LumiCard>

            <LumiCard elevation="flat">
              <SubTitle>Tab Bar — Pill</SubTitle>
              <LumiTabBar
                tabs={[
                  { id: "tab1", label: "Visao Geral", icon: <Target /> },
                  { id: "tab2", label: "Insights", icon: <BarChart3 /> },
                  { id: "tab3", label: "Alertas", icon: <Bell />, badge: 2 },
                ]}
                activeTab={demoTab}
                onChange={setDemoTab}
              />

              <div className="mt-6">
                <SubTitle>Tab Bar — Underline</SubTitle>
                <LumiTabBar
                  variant="underline"
                  tabs={[
                    { id: "tab1", label: "Geral" },
                    { id: "tab2", label: "Seguranca" },
                    { id: "tab3", label: "Equipe" },
                  ]}
                  activeTab={demoTab}
                  onChange={setDemoTab}
                />
              </div>
            </LumiCard>
          </div>

          <LumiDivider className="my-4" />

          <SubTitle>Avatares</SubTitle>
          <LumiCard elevation="flat">
            <div className="flex flex-wrap items-end gap-4 mb-6">
              <div className="text-center">
                <LumiAvatar name="Ana Silva" size="xs" />
                <p className="text-[9px] text-muted-foreground mt-1">XS</p>
              </div>
              <div className="text-center">
                <LumiAvatar name="Bruno Costa" size="sm" />
                <p className="text-[9px] text-muted-foreground mt-1">SM</p>
              </div>
              <div className="text-center">
                <LumiAvatar name="Carlos Dias" size="md" />
                <p className="text-[9px] text-muted-foreground mt-1">MD</p>
              </div>
              <div className="text-center">
                <LumiAvatar name="Diana Evans" size="lg" />
                <p className="text-[9px] text-muted-foreground mt-1">LG</p>
              </div>
              <div className="text-center">
                <LumiAvatar name="Eduardo Fonseca" size="xl" />
                <p className="text-[9px] text-muted-foreground mt-1">XL</p>
              </div>
            </div>

            <SubTitle>Com status</SubTitle>
            <div className="flex gap-4">
              <LumiAvatar name="Online" size="md" status="online" />
              <LumiAvatar name="Busy" size="md" status="busy" />
              <LumiAvatar name="Away" size="md" status="away" />
              <LumiAvatar name="Offline" size="md" status="offline" />
            </div>
          </LumiCard>
        </div>
      )}

      {/* ═══════════════ DATA DISPLAY ═══════════════ */}
      {activeTab === "data" && (
        <div className="space-y-6">
          <SectionTitle title="Data Display" description="Texto gradiente, divisores e tipografia" />

          <LumiCard elevation="flat">
            <SubTitle>Gradient Text</SubTitle>
            <div className="space-y-2 mb-6">
              <LumiGradientText as="h1" className="text-3xl font-bold">Heading 1 Gradiente</LumiGradientText>
              <LumiGradientText as="h2" className="text-xl font-semibold">Heading 2 Gradiente</LumiGradientText>
              <LumiGradientText as="p" className="text-base font-medium">Texto gradiente inline</LumiGradientText>
            </div>

            <SubTitle>Divisores</SubTitle>
            <div className="space-y-4">
              <LumiDivider />
              <LumiDivider label="Secao" />
              <LumiDivider label="ou" />
            </div>
          </LumiCard>

          <LumiCard elevation="flat">
            <SubTitle>Escala Tipografica</SubTitle>
            <div className="space-y-3">
              {[
                { size: "text-3xl", label: "3XL — 36px — Titulos hero", weight: "font-bold" },
                { size: "text-2xl", label: "2XL — 28px — Titulos de pagina", weight: "font-bold" },
                { size: "text-xl", label: "XL — 22px — Titulos de secao", weight: "font-semibold" },
                { size: "text-lg", label: "LG — 18px — Subtitulos", weight: "font-semibold" },
                { size: "text-[15px]", label: "MD — 15px — Corpo destaque", weight: "font-medium" },
                { size: "text-[14px]", label: "Base — 14px — Corpo principal", weight: "font-normal" },
                { size: "text-[13px]", label: "SM — 13px — Labels, botoes", weight: "font-medium" },
                { size: "text-[11px]", label: "XS — 11px — Captions, helpers", weight: "font-normal" },
              ].map((t, i) => (
                <div key={i} className="flex items-baseline gap-4">
                  <span className={cx(t.size, t.weight, "min-w-[200px]")}>Lumiflow Text</span>
                  <span className="text-[11px] text-muted-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </LumiCard>
        </div>
      )}

      {/* ═══════════════ COLORS & TOKENS ═══════════════ */}
      {activeTab === "colors" && (
        <div className="space-y-6">
          <SectionTitle title="Paleta de Cores & Tokens" description="Todas as cores do design system mapeadas para FlutterFlow" />

          <SubTitle>Cores da Marca</SubTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: "Primary", hex: "#7B61FF", css: "--lumi-primary", className: "bg-[#7B61FF]" },
              { name: "Primary Hover", hex: "#6B4FEF", css: "--lumi-primary-hover", className: "bg-[#6B4FEF]" },
              { name: "Secondary", hex: "#B14EFF", css: "--lumi-secondary", className: "bg-[#B14EFF]" },
              { name: "Gradient Start", hex: "#7B61FF", css: "--lumi-gradient-start", className: "bg-[#7B61FF]" },
              { name: "Gradient End", hex: "#B14EFF", css: "--lumi-gradient-end", className: "bg-[#B14EFF]" },
              { name: "Gradient", hex: "linear", css: "--lumi-gradient", className: "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF]" },
            ].map(c => (
              <div key={c.name} className="text-center">
                <div className={cx("w-full h-16 rounded-xl mb-2", c.className)} />
                <p className="text-xs font-medium">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.hex}</p>
              </div>
            ))}
          </div>

          <SubTitle>Cores Semanticas</SubTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Success", hex: "#10b981", className: "bg-[#10b981]" },
              { name: "Warning", hex: "#f59e0b", className: "bg-[#f59e0b]" },
              { name: "Error", hex: "#ef4444", className: "bg-[#ef4444]" },
              { name: "Info", hex: "#3b82f6", className: "bg-[#3b82f6]" },
            ].map(c => (
              <div key={c.name} className="text-center">
                <div className={cx("w-full h-14 rounded-xl mb-2", c.className)} />
                <p className="text-xs font-medium">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.hex}</p>
              </div>
            ))}
          </div>

          <SubTitle>Neutros (Light / Dark)</SubTitle>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { name: "Background", className: "bg-background border border-border" },
              { name: "Card", className: "bg-card border border-border" },
              { name: "Muted", className: "bg-muted" },
              { name: "Accent", className: "bg-accent" },
              { name: "Input BG", className: "bg-input-background" },
              { name: "Border", className: "bg-border h-14" },
            ].map(c => (
              <div key={c.name} className="text-center">
                <div className={cx("w-full h-14 rounded-xl mb-2", c.className)} />
                <p className="text-[10px] font-medium">{c.name}</p>
              </div>
            ))}
          </div>

          <SubTitle>Escala de Espacamento</SubTitle>
          <LumiCard elevation="flat">
            <div className="space-y-2">
              {[
                { name: "space-1", value: "4px" },
                { name: "space-2", value: "8px" },
                { name: "space-3", value: "12px" },
                { name: "space-4", value: "16px" },
                { name: "space-5", value: "20px" },
                { name: "space-6", value: "24px" },
                { name: "space-8", value: "32px" },
                { name: "space-10", value: "40px" },
                { name: "space-12", value: "48px" },
                { name: "space-16", value: "64px" },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground w-20">{s.name}</span>
                  <div className="bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] h-3 rounded-full" style={{ width: s.value }} />
                  <span className="text-[11px] font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </LumiCard>

          <SubTitle>Border Radius</SubTitle>
          <div className="flex flex-wrap gap-4">
            {[
              { name: "SM", value: "6px", className: "rounded-[6px]" },
              { name: "MD", value: "8px", className: "rounded-[8px]" },
              { name: "LG", value: "12px", className: "rounded-[12px]" },
              { name: "XL", value: "16px", className: "rounded-[16px]" },
              { name: "2XL", value: "20px", className: "rounded-[20px]" },
              { name: "Full", value: "9999px", className: "rounded-full" },
            ].map(r => (
              <div key={r.name} className="text-center">
                <div className={cx("w-16 h-16 bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] mb-1.5", r.className)} />
                <p className="text-[10px] font-medium">{r.name}</p>
                <p className="text-[9px] text-muted-foreground">{r.value}</p>
              </div>
            ))}
          </div>

          <SubTitle>Sombras</SubTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Shadow SM", style: "0 1px 2px rgba(0,0,0,0.05)" },
              { name: "Shadow MD", style: "0 4px 12px rgba(0,0,0,0.08)" },
              { name: "Shadow LG", style: "0 8px 24px rgba(0,0,0,0.12)" },
              { name: "Shadow Purple", style: "0 8px 24px rgba(123,97,255,0.25)" },
            ].map(s => (
              <div key={s.name} className="bg-card rounded-2xl border border-border p-4 text-center" style={{ boxShadow: s.style }}>
                <p className="text-xs font-medium">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Helper Components ─── */

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{children}</p>;
}