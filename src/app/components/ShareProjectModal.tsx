import { motion } from "motion/react";
import { useState } from "react";
import {
  X,
  Globe,
  Link2,
  Copy,
  Check,
  Eye,
  Lock,
  Mail,
  ExternalLink,
  BarChart3,
  Brain,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export function ShareProjectModal({
  isOpen,
  onClose,
  projectName = "Campanha Q1 2026",
}: ShareProjectModalProps) {
  const [isPublic, setIsPublic] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [showMindMap, setShowMindMap] = useState(true);
  const [showTasks, setShowTasks] = useState(true);

  const publicLink = `https://app.lumiflow.com/p/campanha-q1-2026-x7k9m`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink).catch(() => {});
    setLinkCopied(true);
    toast.success("Link público copiado!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const shareText = encodeURIComponent(
      `Organizei esse projeto no Lumiflow: "${projectName}"`
    );
    const shareUrl = encodeURIComponent(publicLink);
    let url = "";
    if (platform === "linkedin") {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    } else if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    } else if (platform === "email") {
      url = `mailto:?subject=${encodeURIComponent(`Projeto: ${projectName}`)}&body=${shareText}%0A%0A${shareUrl}`;
    }
    if (url) window.open(url, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold">Compartilhar Projeto</h2>
            <p className="text-xs text-muted-foreground">{projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Public toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-emerald-500" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isPublic ? "Link público ativo" : "Projeto privado"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPublic
                    ? "Qualquer pessoa com o link pode visualizar"
                    : "Apenas membros do workspace podem acessar"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsPublic(!isPublic);
                toast.success(
                  !isPublic
                    ? "Link público ativado"
                    : "Projeto voltou a ser privado"
                );
              }}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isPublic ? "bg-[#7B61FF]" : "bg-muted"
              }`}
            >
              <motion.div
                animate={{ x: isPublic ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          {/* Public Link */}
          {isPublic && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 bg-muted/30 rounded-xl text-xs font-mono truncate border border-border">
                  {publicLink}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-xs font-medium whitespace-nowrap"
                >
                  {linkCopied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {linkCopied ? "Copiado" : "Copiar"}
                </motion.button>
              </div>

              {/* What to show */}
              <div>
                <p className="text-sm font-medium mb-3">
                  Conteúdo da página pública
                </p>
                <div className="space-y-2">
                  {[
                    {
                      id: "progress",
                      label: "Progresso das tarefas",
                      icon: BarChart3,
                      checked: showProgress,
                      onChange: setShowProgress,
                    },
                    {
                      id: "mindmap",
                      label: "Mapa mental visual",
                      icon: Brain,
                      checked: showMindMap,
                      onChange: setShowMindMap,
                    },
                    {
                      id: "tasks",
                      label: "Lista de tarefas",
                      icon: CheckCircle2,
                      checked: showTasks,
                      onChange: setShowTasks,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => item.onChange(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-[#7B61FF] focus:ring-[#7B61FF]/50"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview Card */}
          <div className="p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/10 dark:to-blue-950/10 rounded-xl border border-[#7B61FF]/10">
            <p className="text-xs text-muted-foreground mb-2">
              Pré-visualização do card de compartilhamento
            </p>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] rounded flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">L</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Lumiflow
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{projectName}</p>
              <p className="text-xs text-muted-foreground">
                12 tarefas · 75% concluído · 4 membros
              </p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] rounded-full" />
              </div>
            </div>
          </div>

          {/* Social Share */}
          <div>
            <p className="text-sm font-medium mb-3">Compartilhar via</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleShare("linkedin")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#0A66C2]"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </button>
              <button
                onClick={() => handleShare("email")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </button>
            </div>
          </div>

          {/* Open preview */}
          {isPublic && (
            <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[#7B61FF] hover:text-[#B14EFF] transition-colors">
              <ExternalLink className="w-4 h-4" />
              Abrir página pública
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
