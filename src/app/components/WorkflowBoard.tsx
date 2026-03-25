import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback, useMemo, useRef } from "react";
import {
  Plus, Filter, Eye, CheckCircle2, GripVertical, AlertCircle,
  ArrowUp, ArrowRight, ArrowDown, MessageSquare, Calendar,
  Search, Layers, PlayCircle, LayoutGrid, List, CalendarDays,
  GanttChart, Zap, X, ChevronDown, ChevronLeft, ChevronRight,
  Paperclip, MoreHorizontal, FolderKanban, Flame, Clock,
  Settings2, Trash2, Check, Send, User, Tag,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
export interface SubtaskItem { id: string; text: string; completed: boolean }
export interface ChecklistItem { id: string; text: string; checked: boolean }
export interface CommentItem { id: string; author: string; initials: string; color: string; text: string; time: string }
export interface AttachmentItem { id: string; name: string; size: string; type: "pdf" | "image" | "doc" | "other" }
export interface Assignee { name: string; initials: string; color: string }

export type TaskStatus = "backlog" | "in_progress" | "review" | "done";
export type TaskPriority = "urgent" | "high" | "medium" | "low";

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  dueDateISO: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: Assignee;
  subtasks: SubtaskItem[];
  checklist: ChecklistItem[];
  comments: CommentItem[];
  attachments: AttachmentItem[];
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  trigger: TaskStatus;
  action: "notify" | "assign" | "set_priority" | "add_tag";
  value: string;
  enabled: boolean;
}

type ViewMode = "kanban" | "list" | "calendar" | "timeline";

interface WorkflowBoardProps {
  onCardClick?: (card: TaskItem) => void;
  onShareClick?: () => void;
}

/* ─── Constants ─── */
const teamMembers: Assignee[] = [
  { name: "João Silva", initials: "JS", color: "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]" },
  { name: "Sarah Johnson", initials: "SJ", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { name: "Mike Chen", initials: "MC", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { name: "Emma Davis", initials: "ED", color: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  { name: "Alex Martinez", initials: "AM", color: "bg-gradient-to-br from-orange-500 to-red-500" },
  { name: "Lisa Park", initials: "LP", color: "bg-gradient-to-br from-indigo-500 to-purple-500" },
  { name: "Tom Wilson", initials: "TW", color: "bg-gradient-to-br from-rose-500 to-pink-500" },
  { name: "Nina Rodriguez", initials: "NR", color: "bg-gradient-to-br from-yellow-500 to-orange-500" },
];

const columns = [
  { id: "backlog" as TaskStatus, title: "Backlog", color: "text-slate-500 dark:text-slate-400", bgColor: "bg-slate-100 dark:bg-slate-900/30", borderColor: "border-slate-200 dark:border-slate-800/50", icon: Layers, dropBg: "bg-slate-50/50 dark:bg-slate-950/10", accent: "#64748b" },
  { id: "in_progress" as TaskStatus, title: "Em Progresso", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-950/30", borderColor: "border-blue-200 dark:border-blue-800/50", icon: PlayCircle, dropBg: "bg-blue-50/50 dark:bg-blue-950/10", accent: "#3b82f6" },
  { id: "review" as TaskStatus, title: "Revisão", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-950/30", borderColor: "border-amber-200 dark:border-amber-800/50", icon: Eye, dropBg: "bg-amber-50/50 dark:bg-amber-950/10", accent: "#f59e0b" },
  { id: "done" as TaskStatus, title: "Concluído", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-950/30", borderColor: "border-emerald-200 dark:border-emerald-800/50", icon: CheckCircle2, dropBg: "bg-emerald-50/50 dark:bg-emerald-950/10", accent: "#10b981" },
];

const priorityConfig: Record<TaskPriority, { label: string; icon: typeof ArrowUp; color: string; bgColor: string }> = {
  urgent: { label: "Urgente", icon: Flame, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-950/30" },
  high: { label: "Alta", icon: ArrowUp, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-950/30" },
  medium: { label: "Média", icon: ArrowRight, color: "text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-950/30" },
  low: { label: "Baixa", icon: ArrowDown, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-950/30" },
};

const tagColors: Record<string, string> = {
  "Redes Sociais": "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  Branding: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
  "Vídeo": "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400",
  Design: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  "Conteúdo": "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  Copy: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400",
  Pesquisa: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400",
  UX: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
};

const viewModes: { id: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { id: "kanban", label: "Kanban", icon: LayoutGrid },
  { id: "list", label: "Lista", icon: List },
  { id: "calendar", label: "Calendário", icon: CalendarDays },
  { id: "timeline", label: "Timeline", icon: GanttChart },
];

/* ─── Mock Data ─── */
const mkComment = (author: string, initials: string, color: string, text: string, time: string): CommentItem => ({ id: `c${Date.now()}${Math.random()}`, author, initials, color, text, time });
const mkSub = (text: string, done: boolean): SubtaskItem => ({ id: `s${Date.now()}${Math.random()}`, text, completed: done });
const mkCheck = (text: string, done: boolean): ChecklistItem => ({ id: `k${Date.now()}${Math.random()}`, text, checked: done });

const initialTasks: TaskItem[] = [
  {
    id: "1", title: "Assets Campanha Q1", description: "Criar ativos visuais para a campanha de marketing Q1 em todos os canais digitais",
    tags: ["Redes Sociais", "Design"], dueDate: "20 mar", dueDateISO: "2026-03-20", status: "backlog", priority: "high",
    assignee: teamMembers[1],
    subtasks: [mkSub("Definir paleta de cores", true), mkSub("Criar banners Instagram", true), mkSub("Criar carrossel LinkedIn", false), mkSub("Adaptar para Stories", false), mkSub("Review final", false)],
    checklist: [mkCheck("Brief aprovado", true), mkCheck("Assets em alta resolução", false)],
    comments: [mkComment("Sarah Johnson", "SJ", "bg-gradient-to-br from-blue-500 to-cyan-500", "Paleta ficou incrível!", "Há 2h")],
    attachments: [{ id: "a1", name: "brief-campanha.pdf", size: "2.4 MB", type: "pdf" }, { id: "a2", name: "referencia-visual.png", size: "1.8 MB", type: "image" }],
    createdAt: "2026-03-01",
  },
  {
    id: "2", title: "Atualização de Guidelines", description: "Revisar e atualizar o documento de diretrizes da marca com nova paleta de cores",
    tags: ["Branding"], dueDate: "18 mar", dueDateISO: "2026-03-18", status: "in_progress", priority: "medium",
    assignee: teamMembers[2],
    subtasks: [mkSub("Revisar tipografia", true), mkSub("Atualizar paleta", false), mkSub("Documentar componentes", false)],
    checklist: [mkCheck("Acesso ao Figma", true), mkCheck("Aprovação do lead", false)],
    comments: [mkComment("Mike Chen", "MC", "bg-gradient-to-br from-purple-500 to-pink-500", "Estou na etapa de tipografia.", "Há 3h")],
    attachments: [{ id: "a3", name: "guidelines-v1.pdf", size: "5.1 MB", type: "pdf" }],
    createdAt: "2026-03-02",
  },
  {
    id: "3", title: "Vídeo Demo do Produto", description: "Editar e finalizar o vídeo demo de 2 minutos do produto para o site",
    tags: ["Vídeo", "Conteúdo"], dueDate: "22 mar", dueDateISO: "2026-03-22", status: "review", priority: "urgent",
    assignee: teamMembers[3],
    subtasks: [mkSub("Roteiro", true), mkSub("Gravação", true), mkSub("Edição", true), mkSub("Legendas", false)],
    checklist: [mkCheck("Roteiro aprovado", true), mkCheck("Música licenciada", true), mkCheck("Legendas em PT/EN", false)],
    comments: [
      mkComment("Emma Davis", "ED", "bg-gradient-to-br from-emerald-500 to-teal-500", "Edição quase pronta, faltam legendas.", "Há 1h"),
      mkComment("João Silva", "JS", "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]", "Ótimo trabalho! Vamos priorizar as legendas.", "Há 30min"),
    ],
    attachments: [{ id: "a4", name: "demo-v2.mp4", size: "48 MB", type: "other" }],
    createdAt: "2026-03-03",
  },
  {
    id: "4", title: "Copy Redes Sociais", description: "Escrever copy para posts do Instagram e LinkedIn da próxima semana",
    tags: ["Redes Sociais", "Copy"], dueDate: "17 mar", dueDateISO: "2026-03-17", status: "in_progress", priority: "medium",
    assignee: teamMembers[4],
    subtasks: [mkSub("Copy Instagram (5 posts)", false), mkSub("Copy LinkedIn (3 posts)", false)],
    checklist: [], comments: [], attachments: [], createdAt: "2026-03-04",
  },
  {
    id: "5", title: "Design Campanha Email", description: "Criar template de email para newsletter de março",
    tags: ["Design", "Conteúdo"], dueDate: "15 mar", dueDateISO: "2026-03-15", status: "done", priority: "medium",
    assignee: teamMembers[5],
    subtasks: [mkSub("Layout desktop", true), mkSub("Layout mobile", true), mkSub("Testes A/B", true)],
    checklist: [mkCheck("Aprovação do copy", true), mkCheck("Teste cross-browser", true)],
    comments: [mkComment("Lisa Park", "LP", "bg-gradient-to-br from-indigo-500 to-purple-500", "Todos os testes passaram!", "Ontem")],
    attachments: [], createdAt: "2026-02-28",
  },
  {
    id: "6", title: "Renovação Landing Page", description: "Atualizar landing page com nova seção hero e CTAs",
    tags: ["Design", "UX"], dueDate: "14 mar", dueDateISO: "2026-03-14", status: "done", priority: "low",
    assignee: teamMembers[6],
    subtasks: [mkSub("Wireframe", true), mkSub("Design visual", true), mkSub("Implementação", true)],
    checklist: [], comments: [], attachments: [], createdAt: "2026-02-25",
  },
  {
    id: "7", title: "Pesquisa de Mercado", description: "Analisar concorrentes e tendências para informar estratégia Q2",
    tags: ["Pesquisa"], dueDate: "25 mar", dueDateISO: "2026-03-25", status: "backlog", priority: "low",
    assignee: teamMembers[7],
    subtasks: [], checklist: [], comments: [], attachments: [], createdAt: "2026-03-05",
  },
  {
    id: "8", title: "Gráficos para Blog", description: "Criar imagens para a série de posts do blog",
    tags: ["Design", "Conteúdo"], dueDate: "28 mar", dueDateISO: "2026-03-28", status: "backlog", priority: "medium",
    assignee: teamMembers[7],
    subtasks: [mkSub("Post 1 - Tendências", false), mkSub("Post 2 - Case Study", false), mkSub("Post 3 - Tutorial", false)],
    checklist: [], comments: [], attachments: [], createdAt: "2026-03-06",
  },
];

const defaultAutomations: AutomationRule[] = [
  { id: "auto1", trigger: "in_progress", action: "notify", value: "Tarefa iniciada", enabled: true },
  { id: "auto2", trigger: "done", action: "notify", value: "Tarefa concluída 🎉", enabled: true },
  { id: "auto3", trigger: "review", action: "assign", value: "João Silva", enabled: false },
];

/* ─── Component ─── */
export function WorkflowBoard({ onCardClick }: WorkflowBoardProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardPriority, setNewCardPriority] = useState<TaskPriority>("medium");
  const [newCardAssignee, setNewCardAssignee] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [automations, setAutomations] = useState<AutomationRule[]>(defaultAutomations);
  const [showAutomations, setShowAutomations] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(2); // March = 2 (0-indexed)
  const [calendarYear] = useState(2026);
  // Mobile kanban column index
  const [mobileColumnIdx, setMobileColumnIdx] = useState(0);

  const filteredTasks = useMemo(() => tasks.filter((t) => {
    const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchAssignee = filterAssignee === "all" || t.assignee.name === filterAssignee;
    return matchSearch && matchPriority && matchAssignee;
  }), [tasks, searchQuery, filterPriority, filterAssignee]);

  /* ─── Automation Engine ─── */
  const runAutomations = useCallback((task: TaskItem, newStatus: TaskStatus) => {
    automations.filter(a => a.enabled && a.trigger === newStatus).forEach(a => {
      if (a.action === "notify") toast.info(`⚡ Automação: ${a.value} — "${task.title}"`);
      if (a.action === "assign") toast.info(`⚡ Automação: Atribuído a ${a.value}`);
      if (a.action === "set_priority") toast.info(`⚡ Prioridade alterada para ${a.value}`);
      if (a.action === "add_tag") toast.info(`⚡ Tag "${a.value}" adicionada`);
    });
  }, [automations]);

  /* ─── Drag & Drop ─── */
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    // Ghost image
    const el = e.currentTarget as HTMLElement;
    const ghost = el.cloneNode(true) as HTMLElement;
    ghost.style.opacity = "0.8";
    ghost.style.transform = "rotate(3deg)";
    ghost.style.position = "absolute";
    ghost.style.top = "-9999px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    requestAnimationFrame(() => document.body.removeChild(ghost));
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverColumn(colId); };
  const handleDragLeave = () => setDragOverColumn(null);

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    const task = tasks.find(t => t.id === id);
    if (task && task.status !== colId) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: colId as TaskStatus } : t));
      const colName = columns.find(c => c.id === colId)?.title;
      toast.success(`"${task.title}" → ${colName}`);
      runAutomations(task, colId as TaskStatus);
    }
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  /* ─── Quick Add ─── */
  const handleAddCard = (colId: string) => {
    if (!newCardTitle.trim()) return;
    const newTask: TaskItem = {
      id: `t${Date.now()}`,
      title: newCardTitle,
      description: "",
      tags: [],
      dueDate: "A definir",
      dueDateISO: "2026-03-31",
      status: colId as TaskStatus,
      priority: newCardPriority,
      assignee: teamMembers[newCardAssignee],
      subtasks: [],
      checklist: [],
      comments: [],
      attachments: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks(prev => [...prev, newTask]);
    setNewCardTitle("");
    setNewCardPriority("medium");
    setNewCardAssignee(0);
    setAddingToColumn(null);
    toast.success("Tarefa criada!");
    runAutomations(newTask, colId as TaskStatus);
  };

  const handleConvertToProject = (task: TaskItem) => {
    toast.success(`"${task.title}" convertido em Projeto com ${task.subtasks.length} tarefas!`);
  };

  /* ─── Stats ─── */
  const stats = columns.map(c => ({ ...c, count: filteredTasks.filter(t => t.status === c.id).length }));

  /* ────────────────────── KANBAN VIEW ────────────────────── */
  const KanbanView = () => (
    <>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id).sort((a, b) => {
            const order: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
            return order[a.priority] - order[b.priority];
          });
          const Icon = col.icon;
          const isOver = dragOverColumn === col.id;

          return (
            <div key={col.id} className="flex flex-col" onDragOver={e => handleDragOver(e, col.id)} onDragLeave={handleDragLeave} onDrop={e => handleDrop(e, col.id)}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${col.color}`} />
                  <h3 className="font-semibold text-sm">{col.title}</h3>
                </div>
                <span className={`min-w-[22px] h-5 px-1.5 rounded-full text-[10px] font-medium flex items-center justify-center ${col.bgColor} ${col.color} border ${col.borderColor}`}>
                  {colTasks.length}
                </span>
              </div>
              <div className={`flex-1 space-y-2.5 rounded-xl p-2 min-h-[350px] transition-all duration-200 ${isOver ? `${col.dropBg} border-2 border-dashed ${col.borderColor}` : "bg-muted/20"}`}>
                <AnimatePresence>
                  {colTasks.map(task => <KanbanCard key={task.id} task={task} />)}
                </AnimatePresence>
                {addingToColumn === col.id ? (
                  <QuickAddForm columnId={col.id} />
                ) : (
                  <button onClick={() => setAddingToColumn(col.id)} className="w-full py-2.5 border-2 border-dashed border-border/60 rounded-xl text-muted-foreground hover:text-[#7B61FF] hover:border-[#7B61FF]/40 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-all flex items-center justify-center gap-1.5 text-xs font-medium">
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMobileColumnIdx(Math.max(0, mobileColumnIdx - 1))} disabled={mobileColumnIdx === 0} className="p-2 rounded-lg hover:bg-accent disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            {(() => { const Icon = columns[mobileColumnIdx].icon; return <Icon className={`w-4 h-4 ${columns[mobileColumnIdx].color}`} />; })()}
            <span className="font-semibold text-sm">{columns[mobileColumnIdx].title}</span>
            <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-medium flex items-center justify-center ${columns[mobileColumnIdx].bgColor} ${columns[mobileColumnIdx].color}`}>
              {filteredTasks.filter(t => t.status === columns[mobileColumnIdx].id).length}
            </span>
          </div>
          <button onClick={() => setMobileColumnIdx(Math.min(3, mobileColumnIdx + 1))} disabled={mobileColumnIdx === 3} className="p-2 rounded-lg hover:bg-accent disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-1.5 mb-3 justify-center">{columns.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === mobileColumnIdx ? "bg-[#7B61FF]" : "bg-border"}`} />)}</div>
        <div className="space-y-2.5 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div key={mobileColumnIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-2.5">
              {filteredTasks.filter(t => t.status === columns[mobileColumnIdx].id).sort((a, b) => {
                const o: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
                return o[a.priority] - o[b.priority];
              }).map(task => <KanbanCard key={task.id} task={task} />)}
            </motion.div>
          </AnimatePresence>
          <button onClick={() => setAddingToColumn(columns[mobileColumnIdx].id)} className="w-full py-3 border-2 border-dashed border-border/60 rounded-xl text-muted-foreground hover:text-[#7B61FF] hover:border-[#7B61FF]/40 transition-all flex items-center justify-center gap-1.5 text-sm font-medium">
            <Plus className="w-4 h-4" /> Nova Tarefa
          </button>
        </div>
      </div>
    </>
  );

  /* ─── Kanban Card ─── */
  const KanbanCard = ({ task }: { task: TaskItem }) => {
    const p = priorityConfig[task.priority];
    const PIcon = p.icon;
    const subDone = task.subtasks.filter(s => s.completed).length;
    const subTotal = task.subtasks.length;
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: draggedItem === task.id ? 0.4 : 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        draggable
        onDragStart={e => handleDragStart(e as unknown as React.DragEvent, task.id)}
        onDragEnd={() => { setDraggedItem(null); setDragOverColumn(null); }}
        onClick={() => onCardClick?.(task)}
        className="bg-card border border-border rounded-xl p-3.5 hover:shadow-lg hover:shadow-purple-500/5 hover:border-[#7B61FF]/20 transition-all cursor-grab active:cursor-grabbing group select-none"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${p.bgColor} ${p.color}`}>
            <PIcon className="w-3 h-3" />{p.label}
          </div>
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h4 className="font-semibold text-sm mb-1 group-hover:text-[#7B61FF] transition-colors line-clamp-2">{task.title}</h4>
        {task.description && <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2">{task.description}</p>}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.slice(0, 3).map(tag => <span key={tag} className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${tagColors[tag] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>{tag}</span>)}
          </div>
        )}
        {subTotal > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] text-muted-foreground">{subDone}/{subTotal} subtarefas</span>
              <span className="text-[10px] text-muted-foreground">{Math.round(subDone / subTotal * 100)}%</span>
            </div>
            <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
              <motion.div animate={{ width: `${(subDone / subTotal) * 100}%` }} className="h-full bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-full" />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" />{task.dueDate}</span>
            {task.comments.length > 0 && <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{task.comments.length}</span>}
            {task.attachments.length > 0 && <span className="flex items-center gap-0.5"><Paperclip className="w-3 h-3" />{task.attachments.length}</span>}
          </div>
          <div className={`w-6 h-6 rounded-full ${task.assignee.color} flex items-center justify-center text-white text-[8px] font-medium shadow-sm`} title={task.assignee.name}>
            {task.assignee.initials}
          </div>
        </div>
      </motion.div>
    );
  };

  /* ─── Quick Add Form ─── */
  const QuickAddForm = ({ columnId }: { columnId: string }) => (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-[#7B61FF]/30 rounded-xl p-3 space-y-2">
      <input type="text" autoFocus value={newCardTitle} onChange={e => setNewCardTitle(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") handleAddCard(columnId); if (e.key === "Escape") { setAddingToColumn(null); setNewCardTitle(""); } }}
        placeholder="Título da tarefa..." className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border focus:border-[#7B61FF]/40 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/15 text-sm" />
      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority selector */}
        <div className="flex gap-1">
          {(["low", "medium", "high", "urgent"] as TaskPriority[]).map(p => {
            const cfg = priorityConfig[p];
            const PIcon = cfg.icon;
            return <button key={p} onClick={() => setNewCardPriority(p)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${newCardPriority === p ? `${cfg.bgColor} ring-1 ring-current ${cfg.color}` : "hover:bg-muted/50 text-muted-foreground"}`} title={cfg.label}><PIcon className="w-3.5 h-3.5" /></button>;
          })}
        </div>
        <div className="h-4 w-px bg-border" />
        {/* Assignee quick pick */}
        <div className="flex -space-x-1">
          {teamMembers.slice(0, 4).map((m, i) => (
            <button key={m.initials} onClick={() => setNewCardAssignee(i)} className={`w-6 h-6 rounded-full ${m.color} flex items-center justify-center text-white text-[8px] font-medium border-2 transition-transform ${newCardAssignee === i ? "border-[#7B61FF] scale-110 z-10" : "border-background hover:scale-105"}`} title={m.name}>{m.initials}</button>
          ))}
        </div>
        <div className="flex-1" />
        <button onClick={() => handleAddCard(columnId)} className="px-3 py-1.5 rounded-lg bg-[#7B61FF] text-white text-xs font-medium hover:bg-[#6B51EF] transition-colors">Criar</button>
        <button onClick={() => { setAddingToColumn(null); setNewCardTitle(""); }} className="px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancelar</button>
      </div>
    </motion.div>
  );

  /* ────────────────────── LIST VIEW ────────────────────── */
  const ListView = () => (
    <div className="space-y-4">
      {columns.map(col => {
        const colTasks = filteredTasks.filter(t => t.status === col.id);
        if (colTasks.length === 0) return null;
        const Icon = col.icon;
        return (
          <div key={col.id}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Icon className={`w-4 h-4 ${col.color}`} />
              <span className="font-semibold text-sm">{col.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${col.bgColor} ${col.color} font-medium`}>{colTasks.length}</span>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {colTasks.map((task, i) => {
                const p = priorityConfig[task.priority];
                const PIcon = p.icon;
                const subDone = task.subtasks.filter(s => s.completed).length;
                return (
                  <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    onClick={() => onCardClick?.(task)}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors ${i < colTasks.length - 1 ? "border-b border-border/30" : ""}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0`} style={{ backgroundColor: col.accent }} />
                    <div className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${p.bgColor} ${p.color} flex-shrink-0`}>
                      <PIcon className="w-3 h-3" /><span className="hidden sm:inline">{p.label}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate hidden sm:block">{task.description}</p>
                    </div>
                    {task.tags.length > 0 && (
                      <div className="hidden lg:flex gap-1 flex-shrink-0">
                        {task.tags.slice(0, 2).map(t => <span key={t} className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${tagColors[t] || "bg-muted text-muted-foreground"}`}>{t}</span>)}
                      </div>
                    )}
                    {task.subtasks.length > 0 && (
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 hidden sm:block">{subDone}/{task.subtasks.length}</span>
                    )}
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 flex items-center gap-0.5"><Calendar className="w-3 h-3" />{task.dueDate}</span>
                    <div className={`w-6 h-6 rounded-full ${task.assignee.color} flex items-center justify-center text-white text-[8px] font-medium flex-shrink-0`}>{task.assignee.initials}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ────────────────────── CALENDAR VIEW ────────────────────── */
  const CalendarTaskView = () => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const today = 9; // March 9

    const getTasksForDay = (day: number) => {
      const iso = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return filteredTasks.filter(t => t.dueDateISO === iso);
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCalendarMonth(Math.max(0, calendarMonth - 1))} className="p-2 rounded-lg hover:bg-accent"><ChevronLeft className="w-5 h-5" /></button>
          <h3 className="font-semibold">{monthNames[calendarMonth]} {calendarYear}</h3>
          <button onClick={() => setCalendarMonth(Math.min(11, calendarMonth + 1))} className="p-2 rounded-lg hover:bg-accent"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {dayNames.map(d => <div key={d} className="bg-muted/50 py-2 text-center text-[10px] font-medium text-muted-foreground">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="bg-card min-h-[80px] sm:min-h-[100px]" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTasks = getTasksForDay(day);
            const isToday = day === today && calendarMonth === 2;
            return (
              <div key={day} className={`bg-card min-h-[80px] sm:min-h-[100px] p-1.5 ${isToday ? "ring-2 ring-inset ring-[#7B61FF]/40" : ""}`}>
                <span className={`text-[11px] font-medium ${isToday ? "bg-[#7B61FF] text-white w-5 h-5 rounded-full flex items-center justify-center" : "text-muted-foreground"}`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {dayTasks.slice(0, 3).map(t => {
                    const colAccent = columns.find(c => c.id === t.status)?.accent || "#7B61FF";
                    return (
                      <div key={t.id} onClick={() => onCardClick?.(t)} className="text-[9px] px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 font-medium" style={{ backgroundColor: colAccent + "20", color: colAccent }}>
                        {t.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && <span className="text-[9px] text-muted-foreground px-1">+{dayTasks.length - 3}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ────────────────────── TIMELINE VIEW ────────────────────── */
  const TimelineView = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const today = 9;
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header */}
          <div className="flex border-b border-border mb-2">
            <div className="w-[200px] flex-shrink-0 py-2 px-3 text-xs font-medium text-muted-foreground">Tarefa</div>
            <div className="flex-1 flex">
              {days.map(d => (
                <div key={d} className={`flex-1 py-2 text-center text-[10px] ${d === today ? "bg-[#7B61FF]/10 text-[#7B61FF] font-bold rounded-t-lg" : "text-muted-foreground"}`}>{d}</div>
              ))}
            </div>
          </div>
          {/* Rows grouped by status */}
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            if (colTasks.length === 0) return null;
            const Icon = col.icon;
            return (
              <div key={col.id} className="mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg mb-1">
                  <Icon className={`w-3.5 h-3.5 ${col.color}`} />
                  <span className="text-xs font-semibold">{col.title}</span>
                </div>
                {colTasks.map(task => {
                  const dueDay = parseInt(task.dueDateISO.split("-")[2]);
                  const startDay = Math.max(1, dueDay - Math.max(3, task.subtasks.length));
                  const barWidth = dueDay - startDay + 1;
                  const subDone = task.subtasks.filter(s => s.completed).length;
                  const pct = task.subtasks.length > 0 ? (subDone / task.subtasks.length) * 100 : (task.status === "done" ? 100 : 40);
                  return (
                    <div key={task.id} className="flex items-center hover:bg-muted/20 rounded-lg transition-colors cursor-pointer" onClick={() => onCardClick?.(task)}>
                      <div className="w-[200px] flex-shrink-0 py-1.5 px-3 flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full ${task.assignee.color} flex items-center justify-center text-white text-[7px] font-medium flex-shrink-0`}>{task.assignee.initials}</div>
                        <span className="text-xs truncate">{task.title}</span>
                      </div>
                      <div className="flex-1 flex relative h-8 items-center">
                        {days.map(d => <div key={d} className={`flex-1 h-full ${d === today ? "bg-[#7B61FF]/5" : ""} border-r border-border/20`} />)}
                        <div className="absolute h-5 rounded-md overflow-hidden flex items-center" style={{ left: `${((startDay - 1) / 31) * 100}%`, width: `${(barWidth / 31) * 100}%` }}>
                          <div className="h-full w-full rounded-md" style={{ backgroundColor: col.accent + "30" }}>
                            <div className="h-full rounded-md transition-all" style={{ width: `${pct}%`, backgroundColor: col.accent + "80" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {/* Today line */}
          <div className="pointer-events-none absolute inset-0" style={{ display: "none" }} />
        </div>
      </div>
    );
  };

  /* ────────────────────── AUTOMATION PANEL ────────────────────── */
  const AutomationPanel = () => (
    <AnimatePresence>
      {showAutomations && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAutomations(false)} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[500px] max-w-[95vw] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-[#7B61FF]" />Automações de Coluna</h3>
                <button onClick={() => setShowAutomations(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Regras executadas automaticamente quando tarefas mudam de coluna</p>
            </div>
            <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
              {automations.map(rule => {
                const triggerCol = columns.find(c => c.id === rule.trigger);
                const TIcon = triggerCol?.icon || Layers;
                return (
                  <div key={rule.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${rule.enabled ? "border-[#7B61FF]/20 bg-[#7B61FF]/5" : "border-border bg-muted/20 opacity-60"}`}>
                    <button onClick={() => setAutomations(prev => prev.map(a => a.id === rule.id ? { ...a, enabled: !a.enabled } : a))}
                      className={`w-8 h-5 rounded-full flex items-center transition-colors ${rule.enabled ? "bg-[#7B61FF] justify-end" : "bg-muted justify-start"}`}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm mx-0.5" />
                    </button>
                    <TIcon className={`w-4 h-4 ${triggerCol?.color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">Quando mover para <span className={triggerCol?.color}>{triggerCol?.title}</span></p>
                      <p className="text-[10px] text-muted-foreground truncate">→ {rule.action === "notify" ? `Notificar: "${rule.value}"` : rule.action === "assign" ? `Atribuir a ${rule.value}` : rule.action === "set_priority" ? `Definir prioridade: ${rule.value}` : `Adicionar tag: ${rule.value}`}</p>
                    </div>
                    <button onClick={() => setAutomations(prev => prev.filter(a => a.id !== rule.id))} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                );
              })}
              <button onClick={() => {
                const newRule: AutomationRule = { id: `auto${Date.now()}`, trigger: "done", action: "notify", value: "Tarefa finalizada", enabled: true };
                setAutomations(prev => [...prev, newRule]);
                toast.success("Nova automação criada!");
              }} className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-[#7B61FF] hover:border-[#7B61FF]/40 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Nova Automação
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  /* ────────────────────── MAIN RENDER ────────────────────── */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tarefas & Fluxo de Trabalho</h1>
          <p className="text-sm text-muted-foreground">Gerencie tarefas com drag & drop, automações e múltiplas visões</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAutomations(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs font-medium hover:border-[#7B61FF]/30 transition-colors">
            <Zap className="w-3.5 h-3.5 text-[#7B61FF]" />Automações
            <span className="bg-[#7B61FF]/10 text-[#7B61FF] px-1.5 py-0.5 rounded-full text-[9px] font-bold">{automations.filter(a => a.enabled).length}</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setAddingToColumn("backlog")}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-xs font-medium shadow-lg shadow-purple-500/25">
            <Plus className="w-4 h-4" />Nova Tarefa
          </motion.button>
        </div>
      </div>

      {/* View Switcher + Search + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* View tabs */}
        <div className="flex bg-muted/40 rounded-xl p-1 gap-0.5">
          {viewModes.map(v => {
            const VIcon = v.icon;
            return (
              <button key={v.id} onClick={() => setViewMode(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === v.id ? "bg-card shadow-sm text-[#7B61FF]" : "text-muted-foreground hover:text-foreground"}`}>
                <VIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar tarefas..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-card border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/15 text-xs transition-all" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${showFilters ? "border-[#7B61FF]/30 text-[#7B61FF] bg-[#7B61FF]/5" : "border-border bg-card hover:bg-accent"}`}>
          <Filter className="w-3.5 h-3.5" />Filtros
        </button>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center gap-3 sm:gap-5 py-2.5 px-4 bg-card border border-border rounded-xl overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#7B61FF]" />
          <span className="text-muted-foreground">Total:</span>
          <span className="font-medium">{filteredTasks.length}</span>
        </div>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-1 text-[10px] flex-shrink-0">
              <Icon className={`w-3 h-3 ${s.color}`} /><span className="text-muted-foreground hidden sm:inline">{s.title}:</span><span className="font-medium">{s.count}</span>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 p-3 bg-card border border-border rounded-xl">
              <span className="text-xs font-medium text-muted-foreground">Prioridade:</span>
              {["all", "urgent", "high", "medium", "low"].map(p => (
                <button key={p} onClick={() => setFilterPriority(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${filterPriority === p ? "bg-[#7B61FF]/10 text-[#7B61FF] ring-1 ring-[#7B61FF]/20" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
                  {p === "all" ? "Todas" : priorityConfig[p as TaskPriority].label}
                </button>
              ))}
              <div className="h-4 w-px bg-border" />
              <span className="text-xs font-medium text-muted-foreground">Responsável:</span>
              <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}
                className="px-2 py-1 rounded-lg bg-muted/30 border border-border text-[10px] focus:outline-none focus:ring-1 focus:ring-[#7B61FF]/20">
                <option value="all">Todos</option>
                {teamMembers.map(m => <option key={m.initials} value={m.name}>{m.name}</option>)}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Views */}
      <AnimatePresence mode="wait">
        <motion.div key={viewMode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {viewMode === "kanban" && <KanbanView />}
          {viewMode === "list" && <ListView />}
          {viewMode === "calendar" && <CalendarTaskView />}
          {viewMode === "timeline" && <TimelineView />}
        </motion.div>
      </AnimatePresence>

      {/* Automation Panel */}
      <AutomationPanel />
    </div>
  );
}
