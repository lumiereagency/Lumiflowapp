import { motion } from "motion/react";
import { useState, useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Undo,
  Redo,
  Plus,
  X,
  Maximize2,
  GitBranch,
  CheckCircle2,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  children?: string[];
}

interface MindMapEditorProps {
  mapTitle: string;
  onClose: () => void;
}

const initialNodes: MindMapNode[] = [
  {
    id: "root",
    text: "Roadmap de Produto Q1",
    x: 400,
    y: 300,
    color: "from-purple-500 to-pink-500",
    children: ["node1", "node2", "node3"],
  },
  {
    id: "node1",
    text: "Novos Recursos",
    x: 200,
    y: 200,
    color: "from-blue-500 to-cyan-500",
    children: ["node4", "node5"],
  },
  {
    id: "node2",
    text: "Melhorias UX",
    x: 200,
    y: 400,
    color: "from-emerald-500 to-teal-500",
    children: ["node6"],
  },
  {
    id: "node3",
    text: "Integrações",
    x: 600,
    y: 300,
    color: "from-orange-500 to-red-500",
    children: ["node7"],
  },
  {
    id: "node4",
    text: "Editor colaborativo",
    x: 50,
    y: 150,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "node5",
    text: "Templates premium",
    x: 50,
    y: 250,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "node6",
    text: "Onboarding interativo",
    x: 50,
    y: 450,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "node7",
    text: "API v2",
    x: 750,
    y: 300,
    color: "from-rose-500 to-pink-500",
  },
];

export function MindMapEditor({ mapTitle, onClose }: MindMapEditorProps) {
  const [nodes, setNodes] = useState<MindMapNode[]>(initialNodes);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertedNodes, setConvertedNodes] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Draw connection line between parent and child
  const drawConnection = (parentNode: MindMapNode, childId: string) => {
    const childNode = nodes.find((n) => n.id === childId);
    if (!childNode) return null;

    return (
      <line
        key={`${parentNode.id}-${childId}`}
        x1={parentNode.x}
        y1={parentNode.y}
        x2={childNode.x}
        y2={childNode.y}
        stroke="currentColor"
        strokeWidth="2"
        className="text-border"
        strokeDasharray="5,5"
        opacity="0.5"
      />
    );
  };

  // Add a new node
  const addNode = (parentId: string) => {
    const newNode: MindMapNode = {
      id: `node${nodes.length + 1}`,
      text: "Novo Nó",
      x: nodes.find((n) => n.id === parentId)?.x || 0,
      y: nodes.find((n) => n.id === parentId)?.y || 0,
      color: "from-indigo-500 to-purple-500",
    };

    setNodes((prevNodes) => {
      const parent = prevNodes.find((n) => n.id === parentId);
      if (parent) {
        parent.children = [...(parent.children || []), newNode.id];
      }
      return [...prevNodes, newNode];
    });
  };

  // Convert a node to a branch
  const convertToBranch = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const newBranch: MindMapNode = {
      id: `branch${nodes.length + 1}`,
      text: "Nova Ramificação",
      x: node.x,
      y: node.y,
      color: "from-indigo-500 to-purple-500",
      children: [nodeId],
    };

    setNodes((prevNodes) => {
      const parent = prevNodes.find((n) => n.children?.includes(nodeId));
      if (parent) {
        parent.children = parent.children?.map((id) =>
          id === nodeId ? newBranch.id : id
        );
      }
      return [...prevNodes, newBranch];
    });

    setConvertedNodes((prev) => new Set([...prev, nodeId]));
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-semibold">{mapTitle}</h2>
            <p className="text-xs text-muted-foreground">Editando mapa mental</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Compartilhar</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Exportar</span>
          </motion.button>
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="absolute top-24 left-6 bg-background/90 backdrop-blur-xl border border-border rounded-2xl shadow-xl p-2 z-10">
        <div className="flex flex-col gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
            title="Desfazer"
          >
            <Undo className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
            title="Refazer"
          >
            <Redo className="w-5 h-5" />
          </motion.button>
          <div className="h-px bg-border my-1" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
            title="Diminuir zoom"
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>
          <div className="h-px bg-border my-1" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
            title="Ajustar à tela"
          >
            <Maximize2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white flex items-center justify-center shadow-lg shadow-purple-500/30"
            title="Adicionar nó"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full overflow-hidden bg-gradient-to-br from-background via-background to-purple-50/10 dark:to-purple-950/5 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(123, 97, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Draw connections */}
          {nodes.map((node) =>
            node.children?.map((childId) => drawConnection(node, childId))
          )}
        </svg>

        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Render nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              drag
              dragMomentum={false}
              whileHover={{ scale: 1.05 }}
              className={`absolute cursor-pointer group`}
              style={{
                left: node.x,
                top: node.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`px-6 py-3 rounded-xl bg-gradient-to-br ${node.color} text-white shadow-lg hover:shadow-xl transition-shadow min-w-[150px] text-center`}
              >
                <p className="font-medium text-sm whitespace-nowrap">{node.text}</p>
              </div>

              {/* Add child button - appears on hover */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#7B61FF] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => addNode(node.id)}
              >
                <Plus className="w-4 h-4 text-white" />
              </motion.button>

              {/* Convert to branch button - appears on hover */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#7B61FF] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  convertToBranch(node.id);
                  toast.success("Nó convertido em ramificação!");
                }}
                disabled={convertedNodes.has(node.id)}
              >
                <GitBranch className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Zoom Indicator */}
      <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-xl border border-border rounded-xl px-4 py-2 text-sm font-medium">
        {Math.round(zoom * 100)}%
      </div>

      {/* Convert to Tasks Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowConvertModal(true)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-2xl font-medium shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-shadow z-10"
      >
        <GitBranch className="w-5 h-5" />
        Converter em Tarefas
      </motion.button>

      {/* Convert to Tasks Modal */}
      <AnimatePresence>
        {showConvertModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConvertModal(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[480px] max-w-[95vw] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-[#7B61FF]" />
                    Converter Nós em Tarefas
                  </h2>
                  <button onClick={() => setShowConvertModal(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione os nós que serão convertidos em tarefas no Kanban:
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto mb-6">
                  {nodes.filter(n => n.id !== "root").map((node) => (
                    <label
                      key={node.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        convertedNodes.has(node.id)
                          ? "border-[#7B61FF]/30 bg-[#7B61FF]/5"
                          : "border-border hover:border-[#7B61FF]/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={convertedNodes.has(node.id)}
                        onChange={() => {
                          setConvertedNodes(prev => {
                            const next = new Set(prev);
                            if (next.has(node.id)) next.delete(node.id);
                            else next.add(node.id);
                            return next;
                          });
                        }}
                        className="w-4 h-4 rounded border-border accent-[#7B61FF]"
                      />
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${node.color}`} />
                      <span className="text-sm font-medium">{node.text}</span>
                      {convertedNodes.has(node.id) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (convertedNodes.size === 0) {
                        toast.error("Selecione pelo menos um nó");
                        return;
                      }
                      setShowConvertModal(false);
                      toast.success(`${convertedNodes.size} tarefas criadas no Kanban!`);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30"
                  >
                    Criar {convertedNodes.size} {convertedNodes.size === 1 ? "Tarefa" : "Tarefas"}
                  </motion.button>
                  <button
                    onClick={() => setShowConvertModal(false)}
                    className="px-5 py-3 rounded-xl bg-muted/50 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}