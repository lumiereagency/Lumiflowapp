import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  X, MessageSquare, Paperclip, Calendar, User, CheckSquare, Clock,
  Tag, Send, ChevronDown, FileText, Image, History, Sparkles,
  ArrowUp, ArrowRight, ArrowDown, Plus, Edit3, Check, Link,
  Trash2, FolderKanban, Flame, Layers, PlayCircle, Eye, CheckCircle2,
  MoreHorizontal, Upload, ListChecks, ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types aligned with WorkflowBoard ─── */
type TaskStatus = "backlog" | "in_progress" | "review" | "done";
type TaskPriority = "urgent" | "high" | "medium" | "low";

interface SubtaskItem { id: string; text: string; completed: boolean }
interface ChecklistItem { id: string; text: string; checked: boolean }
interface CommentItem { id: string; author: string; initials: string; color: string; text: string; time: string }
interface AttachmentItem { id: string; name: string; size: string; type: "pdf" | "image" | "doc" | "other" }
interface Assignee { name: string; initials: string; color: string }

interface TaskData {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  dueDateISO?: string;
  status: string;
  priority?: string;
  assignee: Assignee;
  subtasks?: SubtaskItem[] | { total: number; completed: number };
  checklist?: ChecklistItem[];
  comments?: CommentItem[] | number;
  attachments?: AttachmentItem[];
  createdAt?: string;
}

interface TaskDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskData | null;
}

const statusOptions = [
  { id: "backlog", label: "Backlog", color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400", icon: Layers },
  { id: "in_progress", label: "Em Progresso", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400", icon: PlayCircle },
  { id: "review", label: "Revisão", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400", icon: Eye },
  { id: "done", label: "Concluído", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400", icon: CheckCircle2 },
];

const priorityOptions = [
  { id: "urgent", label: "Urgente", icon: Flame, color: "text-red-600", bg: "bg-red-100 dark:bg-red-950/30" },
  { id: "high", label: "Alta", icon: ArrowUp, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-950/30" },
  { id: "medium", label: "Média", icon: ArrowRight, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/30" },
  { id: "low", label: "Baixa", icon: ArrowDown, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/30" },
];

const teamMembers: Assignee[] = [
  { name: "João Silva", initials: "JS", color: "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]" },
  { name: "Sarah Johnson", initials: "SJ", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { name: "Mike Chen", initials: "MC", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { name: "Emma Davis", initials: "ED", color: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  { name: "Alex Martinez", initials: "AM", color: "bg-gradient-to-br from-orange-500 to-red-500" },
  { name: "Lisa Park", initials: "LP", color: "bg-gradient-to-br from-indigo-500 to-purple-500" },
];

const mockHistory = [
  { id: "1", action: "Tarefa criada", author: "João Silva", time: "01 mar, 10:00" },
  { id: "2", action: "Status alterado para \"Em Progresso\"", author: "Sarah Johnson", time: "03 mar, 09:15" },
  { id: "3", action: "Comentário adicionado", author: "Mike Chen", time: "05 mar, 11:00" },
  { id: "4", action: "Subtarefa concluída", author: "Emma Davis", time: "07 mar, 14:30" },
  { id: "5", action: "Anexo adicionado", author: "João Silva", time: "09 mar, 08:45" },
];

export function TaskDetailPanel({ isOpen, onClose, task }: TaskDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"details" | "comments" | "history">("details");
  const [currentStatus, setCurrentStatus] = useState("backlog");
  const [currentPriority, setCurrentPriority] = useState("medium");
  const [currentAssignee, setCurrentAssignee] = useState(teamMembers[0]);
  const [editTitle, setEditTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [showStatusDD, setShowStatusDD] = useState(false);
  const [showPriorityDD, setShowPriorityDD] = useState(false);
  const [showAssigneeDD, setShowAssigneeDD] = useState(false);

  // Rich data
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [newCheckItem, setNewCheckItem] = useState("");
  const [addingCheck, setAddingCheck] = useState(false);

  // Sync from task prop
  useEffect(() => {
    if (!task) return;
    setCurrentStatus(task.status || "backlog");
    setCurrentPriority(task.priority || "medium");
    setCurrentAssignee(task.assignee || teamMembers[0]);
    setEditTitle(task.title || "");
    setEditDesc(task.description || "");
    // Subtasks - handle both array and {total,completed} format
    if (Array.isArray(task.subtasks)) {
      setSubtasks(task.subtasks);
    } else if (task.subtasks && typeof task.subtasks === "object" && "total" in task.subtasks) {
      setSubtasks(Array.from({ length: task.subtasks.total }, (_, i) => ({
        id: `s${i}`, text: `Subtarefa ${i + 1}`, completed: i < task.subtasks!.completed,
      } as SubtaskItem)));
    } else {
      setSubtasks([]);
    }
    setChecklist(Array.isArray(task.checklist) ? task.checklist : []);
    if (Array.isArray(task.comments)) setComments(task.comments as CommentItem[]);
    else setComments([]);
    setAttachments(Array.isArray(task.attachments) ? task.attachments : []);
    setActiveTab("details");
  }, [task]);

  if (!task) return null;

  const statusInfo = statusOptions.find(s => s.id === currentStatus) || statusOptions[0];
  const priorityInfo = priorityOptions.find(p => p.id === currentPriority) || priorityOptions[2];
  const PriorityIcon = priorityInfo.icon;
  const StatusIcon = statusInfo.icon;
  const subDone = subtasks.filter(s => s.completed).length;
  const checkDone = checklist.filter(c => c.checked).length;

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, { id: `c${Date.now()}`, author: "João Silva", initials: "JS", color: "bg-gradient-to-br from-[#7B61FF] to-[#B14EFF]", text: newComment, time: "Agora" }]);
    setNewComment("");
    toast.success("Comentário adicionado!");
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks(prev => [...prev, { id: `s${Date.now()}`, text: newSubtask, completed: false }]);
    setNewSubtask("");
    setAddingSubtask(false);
    toast.success("Subtarefa criada!");
  };

  const handleAddCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist(prev => [...prev, { id: `k${Date.now()}`, text: newCheckItem, checked: false }]);
    setNewCheckItem("");
    setAddingCheck(false);
  };

  const handleConvertToProject = () => {
    toast.success(`"${editTitle}" convertido em Projeto com ${subtasks.length} tarefas!`, { icon: "🚀" });
    onClose();
  };

  const handleConvertFromProject = () => {
    toast.success(`Projeto convertido em tarefa no Kanban!`, { icon: "📋" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[560px] z-50 flex flex-col bg-background border-l border-border shadow-2xl"
          >
            {/* ─── Header ─── */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-border/40 flex-shrink-0">
              <div className="flex-1 mr-3">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {/* Status */}
                  <div className="relative">
                    <button onClick={() => { setShowStatusDD(!showStatusDD); setShowPriorityDD(false); setShowAssigneeDD(false); }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium ${statusInfo.color} flex items-center gap-1 hover:opacity-80 cursor-pointer`}>
                      <StatusIcon className="w-3 h-3" />{statusInfo.label}<ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {showStatusDD && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-xl shadow-xl z-50 p-1 min-w-[150px]">
                        {statusOptions.map(opt => {
                          const OIcon = opt.icon;
                          return (
                            <button key={opt.id} onClick={() => { setCurrentStatus(opt.id); setShowStatusDD(false); toast.success(`Status → "${opt.label}"`); }}
                              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs hover:bg-accent transition-colors ${currentStatus === opt.id ? "bg-accent" : ""}`}>
                              <OIcon className="w-3 h-3" /><span className={`px-1.5 py-0.5 rounded text-[10px] ${opt.color}`}>{opt.label}</span>
                              {currentStatus === opt.id && <Check className="w-3 h-3 text-[#7B61FF] ml-auto" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                  {/* Priority */}
                  <div className="relative">
                    <button onClick={() => { setShowPriorityDD(!showPriorityDD); setShowStatusDD(false); setShowAssigneeDD(false); }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium ${priorityInfo.bg} ${priorityInfo.color} flex items-center gap-1 hover:opacity-80 cursor-pointer`}>
                      <PriorityIcon className="w-3 h-3" />{priorityInfo.label}<ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {showPriorityDD && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-xl shadow-xl z-50 p-1 min-w-[130px]">
                        {priorityOptions.map(opt => {
                          const OIcon = opt.icon;
                          return (
                            <button key={opt.id} onClick={() => { setCurrentPriority(opt.id); setShowPriorityDD(false); toast.success(`Prioridade → "${opt.label}"`); }}
                              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs hover:bg-accent transition-colors ${currentPriority === opt.id ? "bg-accent" : ""}`}>
                              <OIcon className={`w-3 h-3 ${opt.color}`} /><span>{opt.label}</span>
                              {currentPriority === opt.id && <Check className="w-3 h-3 text-[#7B61FF] ml-auto" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                </div>
                {/* Editable Title */}
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus
                      onKeyDown={e => { if (e.key === "Enter") { setIsEditingTitle(false); toast.success("Título atualizado!"); } if (e.key === "Escape") setIsEditingTitle(false); }}
                      className="flex-1 text-lg font-bold bg-transparent border-b-2 border-[#7B61FF] focus:outline-none" />
                    <button onClick={() => { setIsEditingTitle(false); toast.success("Título atualizado!"); }} className="text-[#7B61FF]"><Check className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <h2 className="text-lg font-bold cursor-pointer hover:text-[#7B61FF] transition-colors group flex items-center gap-2" onClick={() => setIsEditingTitle(true)}>
                    {editTitle}<Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </h2>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toast.success("Link copiado!")} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center" title="Copiar link"><Link className="w-4 h-4 text-muted-foreground" /></button>
                <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
            </div>

            {/* ─── Tabs ─── */}
            <div className="flex items-center gap-1 px-5 py-2 border-b border-border/30 flex-shrink-0 overflow-x-auto">
              {([
                { id: "details" as const, label: "Detalhes", icon: FileText },
                { id: "comments" as const, label: `Comentários (${comments.length})`, icon: MessageSquare },
                { id: "history" as const, label: "Histórico", icon: History },
              ]).map(tab => {
                const TIcon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-[#7B61FF]/10 text-[#7B61FF] font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
                    <TIcon className="w-3.5 h-3.5" />{tab.label}
                  </button>
                );
              })}
            </div>

            {/* ─── Content ─── */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "details" && (
                <div className="p-5 space-y-5">
                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-medium mb-1.5 flex items-center gap-1.5 text-muted-foreground"><FileText className="w-3.5 h-3.5" />Descrição</h4>
                    {isEditingDesc ? (
                      <div className="space-y-2">
                        <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} autoFocus rows={3}
                          className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/15 text-sm resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => { setIsEditingDesc(false); toast.success("Descrição atualizada!"); }} className="px-3 py-1 rounded-lg bg-[#7B61FF] text-white text-xs">Salvar</button>
                          <button onClick={() => setIsEditingDesc(false)} className="px-3 py-1 rounded-lg text-xs text-muted-foreground">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed cursor-pointer hover:text-foreground transition-colors rounded-lg p-2 -m-2 hover:bg-muted/20"
                        onClick={() => setIsEditingDesc(true)}>
                        {editDesc || "Clique para adicionar descrição..."}
                      </p>
                    )}
                  </div>

                  {/* Meta Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Assignee */}
                    <div className="relative">
                      <button onClick={() => { setShowAssigneeDD(!showAssigneeDD); setShowStatusDD(false); setShowPriorityDD(false); }}
                        className="w-full p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors text-left">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1"><User className="w-3 h-3" />Responsável</div>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${currentAssignee.color} flex items-center justify-center text-white text-[9px] font-medium`}>{currentAssignee.initials}</div>
                          <span className="text-xs font-medium">{currentAssignee.name}</span>
                        </div>
                      </button>
                      {showAssigneeDD && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-xl z-50 p-1 max-h-[200px] overflow-y-auto">
                          {teamMembers.map(m => (
                            <button key={m.initials} onClick={() => { setCurrentAssignee(m); setShowAssigneeDD(false); toast.success(`Atribuído a ${m.name}`); }}
                              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs hover:bg-accent transition-colors ${currentAssignee.initials === m.initials ? "bg-accent" : ""}`}>
                              <div className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-white text-[8px] font-medium`}>{m.initials}</div>
                              <span>{m.name}</span>
                              {currentAssignee.initials === m.initials && <Check className="w-3 h-3 text-[#7B61FF] ml-auto" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    {/* Due Date */}
                    <div className="p-3 rounded-xl bg-muted/20">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1"><Calendar className="w-3 h-3" />Prazo</div>
                      <span className="text-xs font-medium">{task.dueDate}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-xs font-medium mb-1.5 flex items-center gap-1.5 text-muted-foreground"><Tag className="w-3.5 h-3.5" />Tags</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {task.tags.map(tag => <span key={tag} className="px-2.5 py-1 rounded-lg bg-[#7B61FF]/10 text-[#7B61FF] text-[10px] font-medium">{tag}</span>)}
                      <button className="px-2 py-1 rounded-lg border border-dashed border-border text-[10px] text-muted-foreground hover:text-[#7B61FF] hover:border-[#7B61FF]/30 transition-colors flex items-center gap-1"><Plus className="w-3 h-3" />Tag</button>
                    </div>
                  </div>

                  {/* Subtasks */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground"><ListChecks className="w-3.5 h-3.5" />Subtarefas ({subDone}/{subtasks.length})</h4>
                      <button onClick={() => setAddingSubtask(true)} className="text-[10px] text-[#7B61FF] font-medium flex items-center gap-0.5 hover:underline"><Plus className="w-3 h-3" />Adicionar</button>
                    </div>
                    {subtasks.length > 0 && (
                      <div className="h-1.5 rounded-full bg-muted/40 mb-2 overflow-hidden">
                        <motion.div animate={{ width: `${subtasks.length > 0 ? (subDone / subtasks.length) * 100 : 0}%` }} className="h-full bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-full" />
                      </div>
                    )}
                    <div className="space-y-0.5">
                      {subtasks.map(s => (
                        <label key={s.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/20 cursor-pointer transition-colors group">
                          <input type="checkbox" checked={s.completed} onChange={() => setSubtasks(prev => prev.map(x => x.id === s.id ? { ...x, completed: !x.completed } : x))}
                            className="w-3.5 h-3.5 rounded border-border accent-[#7B61FF]" />
                          <span className={`text-xs flex-1 ${s.completed ? "line-through text-muted-foreground" : ""}`}>{s.text}</span>
                          <button onClick={e => { e.preventDefault(); setSubtasks(prev => prev.filter(x => x.id !== s.id)); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </label>
                      ))}
                      {addingSubtask && (
                        <div className="flex items-center gap-2 p-2">
                          <input type="text" autoFocus value={newSubtask} onChange={e => setNewSubtask(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAddSubtask(); if (e.key === "Escape") { setAddingSubtask(false); setNewSubtask(""); } }}
                            placeholder="Nova subtarefa..." className="flex-1 px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border focus:border-[#7B61FF]/30 focus:outline-none text-xs" />
                          <button onClick={handleAddSubtask} className="text-[#7B61FF]"><Check className="w-4 h-4" /></button>
                          <button onClick={() => { setAddingSubtask(false); setNewSubtask(""); }} className="text-muted-foreground"><X className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground"><CheckSquare className="w-3.5 h-3.5" />Checklist ({checkDone}/{checklist.length})</h4>
                      <button onClick={() => setAddingCheck(true)} className="text-[10px] text-[#7B61FF] font-medium flex items-center gap-0.5 hover:underline"><Plus className="w-3 h-3" />Adicionar</button>
                    </div>
                    {checklist.length > 0 && (
                      <div className="h-1.5 rounded-full bg-muted/40 mb-2 overflow-hidden">
                        <motion.div animate={{ width: `${checklist.length > 0 ? (checkDone / checklist.length) * 100 : 0}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                      </div>
                    )}
                    <div className="space-y-0.5">
                      {checklist.map(c => (
                        <label key={c.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/20 cursor-pointer transition-colors group">
                          <input type="checkbox" checked={c.checked} onChange={() => setChecklist(prev => prev.map(x => x.id === c.id ? { ...x, checked: !x.checked } : x))}
                            className="w-3.5 h-3.5 rounded border-border accent-emerald-500" />
                          <span className={`text-xs flex-1 ${c.checked ? "line-through text-muted-foreground" : ""}`}>{c.text}</span>
                          <button onClick={e => { e.preventDefault(); setChecklist(prev => prev.filter(x => x.id !== c.id)); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </label>
                      ))}
                      {addingCheck && (
                        <div className="flex items-center gap-2 p-2">
                          <input type="text" autoFocus value={newCheckItem} onChange={e => setNewCheckItem(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAddCheckItem(); if (e.key === "Escape") { setAddingCheck(false); setNewCheckItem(""); } }}
                            placeholder="Novo item..." className="flex-1 px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border focus:border-[#7B61FF]/30 focus:outline-none text-xs" />
                          <button onClick={handleAddCheckItem} className="text-[#7B61FF]"><Check className="w-4 h-4" /></button>
                          <button onClick={() => { setAddingCheck(false); setNewCheckItem(""); }} className="text-muted-foreground"><X className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <h4 className="text-xs font-medium mb-2 flex items-center gap-1.5 text-muted-foreground"><Paperclip className="w-3.5 h-3.5" />Anexos ({attachments.length})</h4>
                    <div className="space-y-1.5">
                      {attachments.map(a => (
                        <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="w-9 h-9 rounded-lg bg-[#7B61FF]/10 flex items-center justify-center">
                            {a.type === "pdf" ? <FileText className="w-4 h-4 text-[#7B61FF]" /> : a.type === "image" ? <Image className="w-4 h-4 text-[#7B61FF]" /> : <Paperclip className="w-4 h-4 text-[#7B61FF]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{a.name}</p>
                            <p className="text-[10px] text-muted-foreground">{a.size}</p>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => { setAttachments(prev => [...prev, { id: `a${Date.now()}`, name: "novo-arquivo.pdf", size: "1.2 MB", type: "pdf" }]); toast.success("Anexo adicionado!"); }}
                        className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-xs text-muted-foreground hover:text-[#7B61FF] hover:border-[#7B61FF]/30 transition-all flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />Adicionar Anexo
                      </button>
                    </div>
                  </div>

                  {/* Convert Task ↔ Project */}
                  <div className="pt-3 border-t border-border/30 space-y-2">
                    <button onClick={handleConvertToProject}
                      className="w-full flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-[#7B61FF]/15 hover:border-[#7B61FF]/30 transition-colors text-left">
                      <FolderKanban className="w-4 h-4 text-[#7B61FF]" />
                      <div>
                        <p className="text-xs font-medium">Converter em Projeto</p>
                        <p className="text-[10px] text-muted-foreground">Cria um projeto com subtarefas como tarefas individuais</p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#7B61FF] ml-auto" />
                    </button>
                    <button onClick={handleConvertFromProject}
                      className="w-full flex items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border hover:border-[#7B61FF]/20 transition-colors text-left">
                      <ListChecks className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium">Converter Projeto em Tarefa</p>
                        <p className="text-[10px] text-muted-foreground">Transforma um projeto existente em tarefa do Kanban</p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                    </button>
                  </div>

                  {/* AI Insight */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/15 dark:to-blue-950/15 border border-[#7B61FF]/15">
                    <div className="flex items-center gap-1.5 mb-1.5"><Sparkles className="w-3.5 h-3.5 text-[#7B61FF]" /><h4 className="text-xs font-medium">Insights da IA</h4></div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {currentStatus === "backlog" && "Esta tarefa está no backlog. Com base no prazo e prioridade, recomenda-se iniciar em breve para cumprir a deadline."}
                      {currentStatus === "in_progress" && `Progresso: ${subtasks.length > 0 ? Math.round(subDone / subtasks.length * 100) : 0}% das subtarefas concluídas. Mantenha o ritmo!`}
                      {currentStatus === "review" && "Em revisão. A média do time para esta etapa é 1.5 dias. Adicione revisores para acelerar."}
                      {currentStatus === "done" && "Tarefa concluída! 🎉 Considere mover tarefas dependentes para a próxima etapa."}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="p-5 space-y-4">
                  {comments.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Nenhum comentário ainda. Seja o primeiro!</p>
                    </div>
                  )}
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className={`w-7 h-7 rounded-full ${c.color} flex items-center justify-center text-white text-[9px] font-medium flex-shrink-0`}>{c.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium">{c.author}</span>
                          <span className="text-[10px] text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border/30">
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center text-white text-[9px] font-medium flex-shrink-0">JS</div>
                      <div className="flex-1 flex gap-2">
                        <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") handlePostComment(); }}
                          placeholder="Escreva um comentário..."
                          className="flex-1 px-3 py-2 rounded-xl bg-muted/30 border border-border/40 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-xs" />
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handlePostComment}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${newComment.trim() ? "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white" : "bg-muted text-muted-foreground"}`}>
                          <Send className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="p-5">
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-5">
                      {mockHistory.map(event => (
                        <div key={event.id} className="flex gap-3.5 relative">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center z-10"><History className="w-3.5 h-3.5 text-muted-foreground" /></div>
                          <div>
                            <p className="text-xs">{event.action}</p>
                            <p className="text-[10px] text-muted-foreground">{event.author} · {event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
