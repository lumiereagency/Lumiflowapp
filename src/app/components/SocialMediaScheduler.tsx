import { useMemo, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "motion/react";
import {
  Image as ImageIcon,
  Video,
  Calendar,
  Clock,
  Plus,
  Sparkles,
  MapPin,
  AtSign,
  Users,
  Hash,
  MessageSquare,
  Trash2,
  Wand2,
  Check,
  Copy,
  X,
  Send,
  LayoutGrid,
  PenLine,
  Smile,
  ChevronLeft,
  ChevronRight,
  Zap,
  Type,
  Link2,
  Lock,
  TrendingUp,
  Eye,
  Heart,
} from "lucide-react";
import {
  LumiButton,
  LumiBadge,
  LumiTextarea,
  LumiTag,
  LumiEmptyState,
  LumiTabBar,
  LumiGradientText,
  LumiSpinner,
  LumiSwitch,
  LumiModal,
  LumiInput,
} from "./ui/lumiflow-ds";
import { PLATFORMS, platformById, type PlatformId, type PlatformConfig } from "./workspace/platforms";
import { useWorkspace } from "./workspace/WorkspaceContext";

/* ─────────────────────────── Tipos ─────────────────────────── */

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
}

interface ScheduledPost {
  id: string;
  clientId: string;
  mediaIds: string[];
  platforms: PlatformId[];
  caption: string;
  date: string;
  time: string;
  location?: string;
}

const ItemTypes = { MEDIA: "media" };

/* ─────────────────────────── Dados mock ─────────────────────────── */

const mockMedia: MediaItem[] = [
  { id: "m1", type: "image", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop", name: "Promo_Q1.jpg" },
  { id: "m2", type: "video", url: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400&h=400&fit=crop", name: "Reels_Lancamento.mp4" },
  { id: "m3", type: "image", url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop", name: "Post_Dicas.png" },
  { id: "m4", type: "image", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop", name: "Bastidores.jpg" },
  { id: "m5", type: "video", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop", name: "Tutorial.mp4" },
  { id: "m6", type: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop", name: "Case_Sucesso.jpg" },
];

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const initialScheduled: ScheduledPost[] = [
  { id: "sp1", clientId: "c1", mediaIds: ["m1"], platforms: ["instagram", "facebook"], caption: "Lançamento imperdível chegando! 🚀 Fique de olho no nosso feed.", date: "2026-07-13", time: "09:00", location: "São Paulo, Brasil" },
  { id: "sp2", clientId: "c2", mediaIds: ["m3"], platforms: ["linkedin"], caption: "5 dicas para escalar sua operação em 2026. Salve este post!", date: "2026-07-15", time: "12:00" },
  { id: "sp3", clientId: "c3", mediaIds: ["m6"], platforms: ["instagram"], caption: "O café perfeito começa com grãos selecionados ☕", date: "2026-07-14", time: "08:00" },
];

/* ───────────────────── Agente de IA de Copy ─────────────────────── */

type Tone = "profissional" | "descontraido" | "vendas" | "storytelling";

const TONES: { id: Tone; label: string }[] = [
  { id: "profissional", label: "Profissional" },
  { id: "descontraido", label: "Descontraído" },
  { id: "vendas", label: "Vendas" },
  { id: "storytelling", label: "Storytelling" },
];

function generateCopySuggestions(platform: PlatformId, tone: Tone, mediaNames: string[]): string[] {
  const subject = mediaNames[0]?.split(".")[0].replace(/_/g, " ") || "sua novidade";
  const cfg = platformById(platform);
  const shortForm = cfg.charLimit <= 300; // Twitter, Threads, Pinterest

  const byTone: Record<Tone, { long: string[]; short: string[] }> = {
    profissional: {
      long: [
        `Apresentamos ${subject}. Uma nova forma de elevar seus resultados. 🎯\n\nDeslize e descubra o que preparamos para você.`,
        `Sobre ${subject}: qualidade e propósito em cada detalhe.\n\nSalve este post para consultar depois. 📌`,
      ],
      short: [`${subject} está no ar. Menos ruído, mais resultado. 🚀`, `Novidade: ${subject}. Confira. ✨`],
    },
    descontraido: {
      long: [
        `Chegou ${subject} e a gente não conseguiu segurar a empolgação! 🎉\n\nConta aqui embaixo: o que você achou? 👇`,
        `Spoiler: ${subject} ficou incrível 😍 corre ver!`,
      ],
      short: [`ok, ${subject} ficou bom demais 🔥`, `a gente avisou que vinha coisa boa 👀 ${subject} tá on!`],
    },
    vendas: {
      long: [
        `🔥 ${subject} com condição especial por tempo limitado!\n\n✅ Resultados reais\n✅ Suporte dedicado\n\n👉 Garanta o seu agora.`,
        `Últimas unidades de ${subject}! Não fique de fora. Comente "EU QUERO" 🛒`,
      ],
      short: [`Oferta relâmpago: ${subject} 🔥 Só hoje!`, `${subject} com desconto. Corre que acaba! ⏳`],
    },
    storytelling: {
      long: [
        `Tudo começou com uma ideia simples...\n\nHoje, ${subject} é realidade. 💜\n\nDeslize e veja os bastidores. →`,
        `Por trás de ${subject} existe uma história de dedicação. Que tal conhecê-la? 🎬`,
      ],
      short: [`a história por trás de ${subject} 🧵`, `${subject} não nasceu pronto. Deixa eu te contar 👇`],
    },
  };

  const set = byTone[tone];
  return shortForm ? set.short : set.long;
}

function suggestHashtags(platform: PlatformId): string[] {
  const common = ["#lumiflow", "#marketingdigital", "#conteudo"];
  const byPlatform: Partial<Record<PlatformId, string[]>> = {
    instagram: ["#instagood", "#reels", "#viral"],
    twitter: ["#trending"],
    linkedin: ["#negocios", "#lideranca"],
    facebook: ["#comunidade"],
    tiktok: ["#fyp", "#foryou", "#viral"],
    youtube: ["#shorts"],
    pinterest: ["#inspiracao", "#ideias"],
    threads: [],
  };
  return [...common, ...(byPlatform[platform] || [])];
}

/* ─────────────────────── Componentes de mídia ─────────────────────── */

function DraggableMedia({ item }: { item: MediaItem }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MEDIA,
    item: { id: item.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className={`relative group rounded-xl overflow-hidden border border-border bg-card cursor-grab active:cursor-grabbing hover:border-[#7B61FF]/50 transition-all ${
        isDragging ? "opacity-40 scale-95" : "opacity-100"
      }`}
    >
      <img src={item.url} alt={item.name} className="w-full h-24 object-cover" />
      <div className="absolute top-1.5 right-1.5">
        <span className="w-6 h-6 rounded-lg bg-black/50 backdrop-blur-sm text-white flex items-center justify-center">
          {item.type === "video" ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
        </span>
      </div>
      <div className="p-2 text-[11px] font-medium truncate">{item.name}</div>
    </div>
  );
}

function ComposerDropZone({
  selectedMedia,
  onDropMedia,
  onRemoveMedia,
}: {
  selectedMedia: MediaItem[];
  onDropMedia: (id: string) => void;
  onRemoveMedia: (id: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.MEDIA,
    drop: (item: { id: string }) => onDropMedia(item.id),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  return (
    <div
      ref={drop}
      className={`rounded-2xl border-2 border-dashed transition-all p-3 min-h-[140px] ${
        isOver ? "border-[#7B61FF] bg-[#7B61FF]/10" : selectedMedia.length ? "border-border bg-muted/10" : "border-border/60 bg-muted/20"
      }`}
    >
      {selectedMedia.length === 0 ? (
        <div className="h-[116px] flex flex-col items-center justify-center text-center gap-1.5 text-muted-foreground">
          <div className="w-10 h-10 rounded-xl bg-[#7B61FF]/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[#7B61FF]" />
          </div>
          <p className="text-xs font-medium">Arraste fotos ou vídeos aqui</p>
          <p className="text-[10px]">A IA vai sugerir a copy com base na mídia</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {selectedMedia.map((m) => (
            <div key={m.id} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
              <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
              {m.type === "video" && (
                <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-black/50 text-white flex items-center justify-center">
                  <Video className="w-3 h-3" />
                </span>
              )}
              <button
                onClick={() => onRemoveMedia(m.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-md bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Painel do Agente de IA ─────────────────── */

function AICopyAgent({
  activePlatform,
  selectedMedia,
  onApply,
  onAppendHashtag,
}: {
  activePlatform: PlatformId;
  selectedMedia: MediaItem[];
  onApply: (text: string) => void;
  onAppendHashtag: (tag: string) => void;
}) {
  const [tone, setTone] = useState<Tone>("descontraido");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const runAgent = () => {
    setLoading(true);
    setSuggestions([]);
    setTimeout(() => {
      setSuggestions(generateCopySuggestions(activePlatform, tone, selectedMedia.map((m) => m.name)));
      setLoading(false);
    }, 900);
  };

  const platform = platformById(activePlatform);
  const hashtags = suggestHashtags(activePlatform);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold flex items-center gap-1.5">
            Copiloto de Copy <LumiBadge color="gradient">IA</LumiBadge>
          </p>
          <p className="text-[10px] text-muted-foreground">
            Otimizado para <span className={platform.color}>{platform.name}</span>
          </p>
        </div>
      </div>

      <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Tom de voz</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {TONES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTone(t.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              tone === t.id ? "bg-[#7B61FF] text-white" : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <LumiButton variant="gradient" size="sm" fullWidth icon={<Wand2 className="w-4 h-4" />} onClick={runAgent} loading={loading} className="mb-3">
        {suggestions.length ? "Gerar novas ideias" : "Gerar sugestões de copy"}
      </LumiButton>

      <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-2">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
            <LumiSpinner size="md" className="text-[#7B61FF]" />
            <p className="text-[11px]">Analisando mídia e plataforma…</p>
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center py-8 px-2">
            <Zap className="w-6 h-6 text-[#7B61FF]/40 mx-auto mb-2" />
            <p className="text-[11px] text-muted-foreground">
              {selectedMedia.length ? "Escolha um tom e gere sugestões sob medida." : "Arraste uma mídia para melhores sugestões."}
            </p>
          </div>
        )}

        <AnimatePresence>
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-3 hover:border-[#7B61FF]/40 transition-colors"
            >
              <p className="text-[12px] whitespace-pre-line leading-relaxed mb-2">{s}</p>
              <div className="flex items-center gap-1.5">
                <LumiButton variant="primary" size="sm" className="h-7 text-[11px]" icon={<Check className="w-3 h-3" />} onClick={() => onApply(s)}>
                  Usar
                </LumiButton>
                <LumiButton
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[11px]"
                  icon={copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  onClick={() => {
                    navigator.clipboard?.writeText(s);
                    setCopiedIndex(i);
                    setTimeout(() => setCopiedIndex(null), 1500);
                  }}
                >
                  {copiedIndex === i ? "Copiado" : "Copiar"}
                </LumiButton>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {suggestions.length > 0 && platform.features.hashtags && hashtags.length > 0 && (
          <div className="rounded-xl border border-dashed border-border p-3">
            <p className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Hash className="w-3 h-3" /> Hashtags sugeridas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.map((h) => (
                <button
                  key={h}
                  onClick={() => onAppendHashtag(h)}
                  className="px-2 py-0.5 rounded-md bg-[#7B61FF]/10 text-[#7B61FF] text-[10px] font-medium hover:bg-[#7B61FF]/20 transition-colors"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── Preview por plataforma ─────────────────── */

function PostPreview({ platform, media, caption }: { platform: PlatformConfig; media: MediaItem[]; caption: string }) {
  const Icon = platform.icon;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${platform.bg} flex items-center justify-center`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold leading-none">Sua Marca</p>
          <p className="text-[10px] text-muted-foreground">{platform.name}</p>
        </div>
        <Icon className={`w-4 h-4 ${platform.color}`} />
      </div>
      {media.length > 0 ? (
        <img src={media[0].url} alt="preview" className="w-full aspect-square object-cover" />
      ) : (
        <div className="w-full aspect-square bg-muted/30 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
        </div>
      )}
      <div className="p-3">
        <p className="text-[12px] whitespace-pre-line leading-relaxed line-clamp-4">
          {caption || <span className="text-muted-foreground/50">Sua legenda aparecerá aqui…</span>}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────── Calendário de agendamentos ─────────────────── */

function CalendarView({ scheduled }: { scheduled: ScheduledPost[] }) {
  const weekStart = new Date("2026-07-12T00:00:00");
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return { iso, label: daysOfWeek[d.getDay()], day: d.getDate() };
  });

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {days.map((d) => (
          <div key={d.iso} className="text-center py-3 border-r border-border last:border-r-0">
            <p className="text-[10px] text-muted-foreground uppercase font-medium">{d.label}</p>
            <p className="text-lg font-bold">{d.day}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 min-h-[420px]">
        {days.map((d) => {
          const posts = scheduled.filter((p) => p.date === d.iso).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <div key={d.iso} className="border-r border-border last:border-r-0 p-2 space-y-2">
              {posts.map((p) => {
                const media = mockMedia.find((m) => m.id === p.mediaIds[0]);
                return (
                  <div key={p.id} className="rounded-xl border border-border bg-muted/20 overflow-hidden hover:border-[#7B61FF]/40 transition-colors">
                    {media && <img src={media.url} alt="" className="w-full h-16 object-cover" />}
                    <div className="p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium">{p.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 mb-1.5">{p.caption}</p>
                      <div className="flex items-center gap-1">
                        {p.platforms.map((pl) => {
                          const cfg = platformById(pl);
                          const PIcon = cfg.icon;
                          return <PIcon key={pl} className={`w-3 h-3 ${cfg.color}`} />;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────── Componente principal ─────────────────── */

export function SocialMediaScheduler() {
  const { visibleClients, canViewInsights, role, addClient, toggleClientNetwork } = useWorkspace();

  const [activeClientId, setActiveClientId] = useState(visibleClients[0]?.id || "");
  const [view, setView] = useState("composer");
  const [scheduled, setScheduled] = useState<ScheduledPost[]>(initialScheduled);

  // Modais
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientHandle, setNewClientHandle] = useState("");

  // Estado do compositor
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [activePreview, setActivePreview] = useState<PlatformId | null>(null);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("2026-07-14");
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [taggedProfiles, setTaggedProfiles] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [firstComment, setFirstComment] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [collabInput, setCollabInput] = useState("");
  const [addFirstComment, setAddFirstComment] = useState(false);

  const activeClient = visibleClients.find((c) => c.id === activeClientId) || visibleClients[0];
  const clientScheduled = useMemo(() => scheduled.filter((p) => p.clientId === activeClient?.id), [scheduled, activeClient]);

  const clientNetworks = activeClient?.connectedNetworks || [];

  const selectedMedia = useMemo(
    () => selectedMediaIds.map((id) => mockMedia.find((m) => m.id === id)!).filter(Boolean),
    [selectedMediaIds]
  );

  const combinedFeatures = useMemo(() => {
    const feats = { location: false, tagProfiles: false, collab: false, firstComment: false, hashtags: false, title: false };
    selectedPlatforms.forEach((id) => {
      const f = platformById(id).features;
      (Object.keys(feats) as (keyof typeof feats)[]).forEach((k) => {
        if (f[k]) feats[k] = true;
      });
    });
    return feats;
  }, [selectedPlatforms]);

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      if (next.length && (!activePreview || !next.includes(activePreview))) setActivePreview(next[0]);
      if (!next.length) setActivePreview(null);
      return next;
    });
  };

  const handleDropMedia = (id: string) => setSelectedMediaIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const previewPlatform = platformById(activePreview && selectedPlatforms.includes(activePreview) ? activePreview : selectedPlatforms[0] || clientNetworks[0] || "instagram");
  const charLimit = selectedPlatforms.length ? Math.min(...selectedPlatforms.map((p) => platformById(p).charLimit)) : undefined;

  const resetComposer = () => {
    setSelectedMediaIds([]);
    setSelectedPlatforms([]);
    setActivePreview(null);
    setCaption("");
    setLocation("");
    setTaggedProfiles([]);
    setCollaborators([]);
    setFirstComment("");
    setPostTitle("");
    setAddFirstComment(false);
  };

  const handleSchedule = () => {
    if (!caption.trim() || selectedPlatforms.length === 0 || !activeClient) return;
    setScheduled((prev) => [
      ...prev,
      {
        id: `sp_${Date.now()}`,
        clientId: activeClient.id,
        mediaIds: selectedMediaIds,
        platforms: selectedPlatforms,
        caption,
        date,
        time,
        location: location || undefined,
      },
    ]);
    resetComposer();
    setView("calendar");
  };

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    addClient(newClientName, newClientHandle);
    setNewClientName("");
    setNewClientHandle("");
    setAddClientOpen(false);
  };

  const canSchedule = caption.trim().length > 0 && selectedPlatforms.length > 0;

  /* ─── Sem clientes ─── */
  if (!activeClient) {
    return (
      <LumiEmptyState
        icon={<Users />}
        title="Nenhuma conta de cliente disponível"
        description={role === "admin" ? "Conecte a primeira conta de cliente para começar a agendar." : "Você ainda não tem contas liberadas. Fale com sua gerente."}
        action={role === "admin" ? { label: "Conectar cliente", onClick: () => setAddClientOpen(true) } : undefined}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Send className="w-5 h-5 text-[#7B61FF]" />
              Agendador Social
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Publique em várias redes ao mesmo tempo com ajuda da <LumiGradientText>IA de copy</LumiGradientText>.
            </p>
          </div>
          <LumiTabBar
            tabs={[
              { id: "composer", label: "Compositor", icon: <PenLine /> },
              { id: "calendar", label: "Calendário", icon: <LayoutGrid />, badge: clientScheduled.length },
            ]}
            activeTab={view}
            onChange={setView}
          />
        </div>

        {/* ─── Abas de clientes (estilo MLabs, aprimorado) ─── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {visibleClients.map((c) => {
            const active = c.id === activeClientId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveClientId(c.id);
                  resetComposer();
                }}
                className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full border transition-all flex-shrink-0 ${
                  active ? "border-[#7B61FF] bg-[#7B61FF]/10" : "border-border hover:border-[#7B61FF]/40"
                }`}
              >
                <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-[11px] font-bold`}>
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="text-left">
                  <p className={`text-[12px] font-medium leading-none ${active ? "text-foreground" : "text-muted-foreground"}`}>{c.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {c.connectedNetworks.slice(0, 4).map((n) => {
                      const cfg = platformById(n);
                      const NIcon = cfg.icon;
                      return <NIcon key={n} className={`w-2.5 h-2.5 ${cfg.color}`} />;
                    })}
                    {c.connectedNetworks.length === 0 && <span className="text-[9px] text-muted-foreground">sem redes</span>}
                  </div>
                </div>
              </button>
            );
          })}
          {role === "admin" && (
            <button
              onClick={() => setAddClientOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-dashed border-border text-muted-foreground hover:border-[#7B61FF]/50 hover:text-[#7B61FF] transition-all flex-shrink-0 text-[12px] font-medium"
            >
              <Plus className="w-4 h-4" /> Conectar cliente
            </button>
          )}
        </div>

        {/* ─── Insights do cliente (somente gerente) ─── */}
        {canViewInsights ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Seguidores", value: activeClient.insights.followers, icon: Users, color: "from-[#7B61FF] to-[#B14EFF]" },
              { label: "Engajamento", value: activeClient.insights.engagement, icon: Heart, color: "from-pink-500 to-rose-500" },
              { label: "Alcance", value: activeClient.insights.reach, icon: Eye, color: "from-blue-500 to-cyan-500" },
              { label: "Crescimento", value: activeClient.insights.growth, icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
            ].map((m) => {
              const MIcon = m.icon;
              return (
                <div key={m.label} className="bg-card border border-border rounded-2xl p-3.5">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center mb-2`}>
                    <MIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg font-bold leading-none">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{m.label}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/20 border border-border rounded-xl px-3 py-2">
            <Lock className="w-3.5 h-3.5" />
            Insights do cliente são exclusivos da gerência. Você pode criar e agendar publicações normalmente.
          </div>
        )}

        {/* ─── Cliente sem redes conectadas ─── */}
        {clientNetworks.length === 0 ? (
          <LumiEmptyState
            icon={<Link2 />}
            title="Nenhuma rede conectada para este cliente"
            description={role === "admin" ? "Conecte as contas sociais deste cliente para começar a publicar." : "Aguarde a gerência conectar as redes deste cliente."}
            action={role === "admin" ? { label: "Conectar contas", onClick: () => setConnectOpen(true) } : undefined}
          />
        ) : view === "calendar" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">12 – 18 de Julho, 2026</span>
                <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <LumiButton variant="outline" size="sm" icon={<PenLine className="w-4 h-4" />} onClick={() => setView("composer")}>
                Nova publicação
              </LumiButton>
            </div>
            {clientScheduled.length === 0 ? (
              <LumiEmptyState icon={<Calendar />} title="Nenhuma publicação agendada" description="Crie sua primeira publicação no compositor." action={{ label: "Criar publicação", onClick: () => setView("composer") }} />
            ) : (
              <CalendarView scheduled={clientScheduled} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr_300px] gap-4 items-start">
            {/* Biblioteca de mídia */}
            <div className="bg-muted/10 rounded-2xl border border-border p-4 flex flex-col max-h-[calc(100vh-260px)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#7B61FF]" /> Biblioteca
                </h3>
                <button className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-2.5 custom-scrollbar">
                {mockMedia.map((item) => (
                  <DraggableMedia key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Compositor */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
              {/* Plataformas do cliente */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-medium text-muted-foreground">Publicar em (redes conectadas de {activeClient.name})</p>
                  {role === "admin" && (
                    <button onClick={() => setConnectOpen(true)} className="text-[11px] text-[#7B61FF] font-medium flex items-center gap-1 hover:underline">
                      <Link2 className="w-3 h-3" /> Gerenciar contas
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {clientNetworks.map((id) => {
                    const p = platformById(id);
                    const Icon = p.icon;
                    const active = selectedPlatforms.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => togglePlatform(id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-medium transition-all ${
                          active ? "border-transparent bg-gradient-to-br text-white shadow-sm " + p.bg : "border-border text-muted-foreground hover:border-[#7B61FF]/40"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {p.name}
                        {active && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <ComposerDropZone selectedMedia={selectedMedia} onDropMedia={handleDropMedia} onRemoveMedia={(id) => setSelectedMediaIds((prev) => prev.filter((m) => m !== id))} />

              {/* Título (YouTube/Pinterest) */}
              {combinedFeatures.title && (
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Título da publicação"
                    className="flex-1 h-9 rounded-xl border border-border bg-input-background text-sm px-3 outline-none focus:border-[#7B61FF]/40 focus:ring-2 focus:ring-[#7B61FF]/15"
                  />
                </div>
              )}

              <LumiTextarea
                label="Legenda"
                placeholder="Escreva a copy ou peça sugestões ao Copiloto de IA →"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxChars={charLimit}
                className="min-h-[120px]"
              />

              {/* Opções contextuais */}
              <div className="space-y-3">
                <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5" /> Opções da publicação
                </p>

                {combinedFeatures.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Adicionar localização" className="flex-1 h-9 rounded-xl border border-border bg-input-background text-sm px-3 outline-none focus:border-[#7B61FF]/40 focus:ring-2 focus:ring-[#7B61FF]/15" />
                  </div>
                )}

                {combinedFeatures.tagProfiles && (
                  <div>
                    <div className="flex items-center gap-2">
                      <AtSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && tagInput.trim()) {
                            setTaggedProfiles((prev) => [...prev, tagInput.trim().replace(/^@/, "")]);
                            setTagInput("");
                          }
                        }}
                        placeholder="Marcar pessoas/páginas (Enter para adicionar)"
                        className="flex-1 h-9 rounded-xl border border-border bg-input-background text-sm px-3 outline-none focus:border-[#7B61FF]/40 focus:ring-2 focus:ring-[#7B61FF]/15"
                      />
                    </div>
                    {taggedProfiles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pl-6">
                        {taggedProfiles.map((t, i) => (
                          <LumiTag key={i} color="blue" onRemove={() => setTaggedProfiles((prev) => prev.filter((_, idx) => idx !== i))}>@{t}</LumiTag>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {combinedFeatures.collab && (
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <input
                        value={collabInput}
                        onChange={(e) => setCollabInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && collabInput.trim()) {
                            setCollaborators((prev) => [...prev, collabInput.trim().replace(/^@/, "")]);
                            setCollabInput("");
                          }
                        }}
                        placeholder="Convidar colaboradores (Instagram Collab)"
                        className="flex-1 h-9 rounded-xl border border-border bg-input-background text-sm px-3 outline-none focus:border-[#7B61FF]/40 focus:ring-2 focus:ring-[#7B61FF]/15"
                      />
                    </div>
                    {collaborators.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pl-6">
                        {collaborators.map((c, i) => (
                          <LumiTag key={i} color="pink" onRemove={() => setCollaborators((prev) => prev.filter((_, idx) => idx !== i))}>@{c}</LumiTag>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {combinedFeatures.firstComment && (
                  <div className="space-y-2">
                    <LumiSwitch checked={addFirstComment} onChange={setAddFirstComment} size="sm" label="Adicionar primeiro comentário" description="Ótimo para hashtags sem poluir a legenda" />
                    {addFirstComment && (
                      <div className="flex items-center gap-2 pl-1">
                        <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <input value={firstComment} onChange={(e) => setFirstComment(e.target.value)} placeholder="Ex.: #lumiflow #marketing #conteudo" className="flex-1 h-9 rounded-xl border border-border bg-input-background text-sm px-3 outline-none focus:border-[#7B61FF]/40 focus:ring-2 focus:ring-[#7B61FF]/15" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Agendamento */}
              <div className="flex items-end gap-3 pt-2 border-t border-border">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1.5">Data</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-9 rounded-xl border border-border bg-input-background text-sm px-3 outline-none focus:border-[#7B61FF]/40" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1.5">Horário</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full h-9 rounded-xl border border-border bg-input-background text-sm px-3 outline-none focus:border-[#7B61FF]/40" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <p className="text-[11px] text-muted-foreground">
                  {selectedPlatforms.length} rede{selectedPlatforms.length !== 1 ? "s" : ""} • {selectedMedia.length} mídia{selectedMedia.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <LumiButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={resetComposer}>Limpar</LumiButton>
                  <LumiButton variant="gradient" size="md" icon={<Send className="w-4 h-4" />} disabled={!canSchedule} onClick={handleSchedule}>Agendar publicação</LumiButton>
                </div>
              </div>
            </div>

            {/* IA + Preview */}
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border p-4 h-[420px]">
                <AICopyAgent
                  activePlatform={previewPlatform.id}
                  selectedMedia={selectedMedia}
                  onApply={(text) => setCaption(text)}
                  onAppendHashtag={(tag) => setCaption((prev) => (prev ? `${prev} ${tag}` : tag))}
                />
              </div>

              <div className="bg-muted/10 rounded-2xl border border-border p-4">
                <p className="text-sm font-semibold mb-3">Pré-visualização</p>
                {selectedPlatforms.length > 1 && (
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    {selectedPlatforms.map((pl) => {
                      const cfg = platformById(pl);
                      const PIcon = cfg.icon;
                      return (
                        <button
                          key={pl}
                          onClick={() => setActivePreview(pl)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activePreview === pl ? `bg-gradient-to-br text-white ${cfg.bg}` : "bg-muted/50 text-muted-foreground"}`}
                        >
                          <PIcon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                )}
                <PostPreview platform={previewPlatform} media={selectedMedia} caption={caption} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: adicionar cliente */}
      <LumiModal
        isOpen={addClientOpen}
        onClose={() => setAddClientOpen(false)}
        title="Conectar novo cliente"
        description="Crie um espaço dedicado para gerenciar as redes deste cliente."
        footer={
          <>
            <LumiButton variant="ghost" onClick={() => setAddClientOpen(false)}>Cancelar</LumiButton>
            <LumiButton variant="gradient" onClick={handleAddClient} disabled={!newClientName.trim()}>Criar cliente</LumiButton>
          </>
        }
      >
        <div className="space-y-3">
          <LumiInput label="Nome do cliente" placeholder="Ex.: Bloom Cosméticos" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} />
          <LumiInput label="@ / identificador" placeholder="Ex.: @bloom.oficial" value={newClientHandle} onChange={(e) => setNewClientHandle(e.target.value)} />
        </div>
      </LumiModal>

      {/* Modal: conectar contas do cliente */}
      <LumiModal
        isOpen={connectOpen}
        onClose={() => setConnectOpen(false)}
        title={`Contas de ${activeClient.name}`}
        description="Conecte ou desconecte as redes sociais deste cliente."
        footer={<LumiButton variant="primary" onClick={() => setConnectOpen(false)}>Concluído</LumiButton>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const connected = clientNetworks.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleClientNetwork(activeClient.id, p.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${connected ? "border-[#7B61FF]/40 bg-[#7B61FF]/5" : "border-border hover:border-[#7B61FF]/30"}`}
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{connected ? "Conectada" : "Não conectada"}</p>
                </div>
                {connected ? <Check className="w-4 h-4 text-[#7B61FF]" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </LumiModal>
    </DndProvider>
  );
}
