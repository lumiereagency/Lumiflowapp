import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  X,
  Mail,
  Link2,
  Copy,
  Check,
  Users,
  UserPlus,
  Eye,
  Shield,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type InviteRole = "member" | "collaborator" | "client";

const roles: { id: InviteRole; label: string; desc: string; icon: typeof Users; color: string }[] = [
  {
    id: "member",
    label: "Membro da Equipe",
    desc: "Acesso completo ao workspace",
    icon: Users,
    color: "from-[#7B61FF] to-[#B14EFF]",
  },
  {
    id: "collaborator",
    label: "Colaborador Externo",
    desc: "Pode editar projetos específicos",
    icon: UserPlus,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "client",
    label: "Revisor / Cliente",
    desc: "Visualizar, aprovar e comentar",
    icon: Eye,
    color: "from-emerald-500 to-teal-500",
  },
];

const pendingInvites = [
  { email: "ana@agencia.com", role: "member" as InviteRole, status: "Pendente", initials: "AN", time: "Há 2h" },
  { email: "carlos@cliente.com", role: "client" as InviteRole, status: "Pendente", initials: "CA", time: "Há 1 dia" },
];

const activeMembers = [
  { name: "João Silva", email: "joao@empresa.com", role: "Proprietário", initials: "JS", color: "from-[#7B61FF] to-[#B14EFF]" },
  { name: "Sarah Johnson", email: "sarah@empresa.com", role: "Membro", initials: "SJ", color: "from-blue-500 to-cyan-500" },
  { name: "Mike Chen", email: "mike@empresa.com", role: "Membro", initials: "MC", color: "from-purple-500 to-pink-500" },
  { name: "Emma Davis", email: "emma@empresa.com", role: "Membro", initials: "ED", color: "from-emerald-500 to-teal-500" },
];

export function InviteTeamModal({ isOpen, onClose }: InviteTeamModalProps) {
  const [activeTab, setActiveTab] = useState<"invite" | "link" | "members">("invite");
  const [selectedRole, setSelectedRole] = useState<InviteRole>("member");
  const [emails, setEmails] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [message, setMessage] = useState("");

  const inviteLink = "https://app.lumiflow.com/invite/wks-a1b2c3d4";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).catch(() => {});
    setLinkCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendInvites = () => {
    if (!emails.trim()) return;
    const count = emails.split(/[\n,]/).filter((e) => e.trim()).length;
    toast.success(`${count} convite${count > 1 ? "s" : ""} enviado${count > 1 ? "s" : ""} com sucesso!`);
    setEmails("");
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Convidar Equipe</h2>
              <p className="text-xs text-muted-foreground">
                Convide sua equipe para acelerar seus projetos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/30 p-1 mx-6 mt-4 rounded-xl max-w-fit">
          {[
            { id: "invite" as const, label: "Convidar", icon: Mail },
            { id: "link" as const, label: "Link", icon: Link2 },
            { id: "members" as const, label: "Membros", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "invite" && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Tipo de acesso
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-[#7B61FF] bg-purple-50/50 dark:bg-purple-950/20"
                              : "border-border hover:border-[#7B61FF]/30"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-[#7B61FF] rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-2`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-xs font-medium">{role.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {role.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Emails
                  </label>
                  <textarea
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder={"maria@empresa.com\npedro@empresa.com"}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 focus:border-[#7B61FF]/30 text-sm transition-all resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Separe múltiplos emails por linha ou vírgula
                  </p>
                </div>

                {/* Optional Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mensagem personalizada{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Vamos colaborar nesse projeto juntos!"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 focus:border-[#7B61FF]/30 text-sm transition-all"
                  />
                </div>

                {/* Send */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendInvites}
                  disabled={!emails.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Enviar Convites
                </motion.button>

                {/* Pending */}
                {pendingInvites.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Convites pendentes
                    </p>
                    <div className="space-y-2">
                      {pendingInvites.map((inv) => (
                        <div
                          key={inv.email}
                          className="flex items-center justify-between p-3 bg-muted/20 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                              {inv.initials}
                            </div>
                            <div>
                              <p className="text-sm">{inv.email}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {roles.find((r) => r.id === inv.role)?.label} · {inv.time}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-medium">
                            {inv.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "link" && (
              <motion.div
                key="link"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="text-center py-4">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#7B61FF]/10 to-[#B14EFF]/10 rounded-2xl flex items-center justify-center">
                    <Link2 className="w-7 h-7 text-[#7B61FF]" />
                  </div>
                  <h3 className="font-semibold mb-1">Link de convite</h3>
                  <p className="text-sm text-muted-foreground">
                    Compartilhe este link para convidar pessoas ao seu workspace
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-muted/30 rounded-xl text-sm font-mono truncate border border-border">
                    {inviteLink}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 whitespace-nowrap"
                  >
                    {linkCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {linkCopied ? "Copiado" : "Copiar"}
                  </motion.button>
                </div>

                <div className="flex items-center gap-2 p-4 bg-muted/20 rounded-xl">
                  <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Pessoas com este link podem entrar como{" "}
                    <span className="font-medium text-foreground">
                      Membro da Equipe
                    </span>
                    . Você pode alterar o papel depois.
                  </p>
                </div>

                {/* Social Share */}
                <div>
                  <p className="text-sm font-medium mb-3">Compartilhar via</p>
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#0A66C2]">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X / Twitter
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">
                    {activeMembers.length} membros ativos
                  </p>
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Todos online
                  </div>
                </div>
                {activeMembers.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xs font-medium shadow-lg`}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        member.role === "Proprietário"
                          ? "bg-[#7B61FF]/10 text-[#7B61FF]"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/10 dark:to-blue-950/10 rounded-xl border border-[#7B61FF]/10">
                    <Sparkles className="w-5 h-5 text-[#7B61FF] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        Convide mais pessoas e ganhe benefícios
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cada convite aceito libera mais requisições de IA
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
