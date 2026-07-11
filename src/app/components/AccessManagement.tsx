import { useState } from "react";
import { motion } from "motion/react";
import { Mail, UserPlus, ShieldCheck, Clock, Check, Trash2, Users, Search } from "lucide-react";
import {
  LumiButton,
  LumiBadge,
  LumiInput,
  LumiModal,
  LumiAvatar,
  LumiEmptyState,
  LumiGradientText,
} from "./ui/lumiflow-ds";
import { platformById } from "./workspace/platforms";
import { useWorkspace } from "./workspace/WorkspaceContext";

interface AccessManagementProps {
  onNavigate?: (section: string) => void;
}

export function AccessManagement(_: AccessManagementProps) {
  const { team, clients, inviteMember, updateMemberAccess, removeMember, activateMember } = useWorkspace();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteClients, setInviteClients] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const members = team.filter((m) => m.role === "member");
  const filtered = members.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  const isValidGmail = /@(gmail\.com|.+\..+)$/.test(inviteEmail.trim());

  const handleInvite = () => {
    if (!isValidGmail) return;
    inviteMember(inviteName, inviteEmail.trim().toLowerCase(), inviteClients);
    setInviteName("");
    setInviteEmail("");
    setInviteClients([]);
    setInviteOpen(false);
  };

  const toggleInviteClient = (id: string) =>
    setInviteClients((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#7B61FF]" />
            Gestão de Acessos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Libere o acesso da equipe por <LumiGradientText>e-mail</LumiGradientText> e defina em quais clientes cada pessoa pode trabalhar.
          </p>
        </div>
        <LumiButton variant="gradient" icon={<UserPlus className="w-4 h-4" />} onClick={() => setInviteOpen(true)}>
          Liberar acesso
        </LumiButton>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Colaboradores", value: members.length, color: "from-[#7B61FF] to-[#B14EFF]", icon: Users },
          { label: "Ativos", value: members.filter((m) => m.status === "active").length, color: "from-emerald-500 to-teal-500", icon: Check },
          { label: "Pendentes", value: members.filter((m) => m.status === "pending").length, color: "from-amber-500 to-orange-500", icon: Clock },
          { label: "Clientes", value: clients.length, color: "from-blue-500 to-cyan-500", icon: ShieldCheck },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail…"
          className="w-full h-10 rounded-xl border border-border bg-input-background text-sm pl-10 pr-3 outline-none focus:border-[#7B61FF]/40 focus:ring-2 focus:ring-[#7B61FF]/15"
        />
      </div>

      {/* Lista de colaboradores */}
      {filtered.length === 0 ? (
        <LumiEmptyState icon={<Users />} title="Nenhum colaborador encontrado" description="Libere o acesso de um novo membro pelo e-mail." action={{ label: "Liberar acesso", onClick: () => setInviteOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <LumiAvatar name={m.name} size="md" status={m.status === "active" ? "online" : "away"} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{m.name}</p>
                      {m.status === "pending" ? (
                        <LumiBadge color="amber" icon={<Clock />}>Convite pendente</LumiBadge>
                      ) : (
                        <LumiBadge color="green" dot>Ativo</LumiBadge>
                      )}
                    </div>
                    <p className="text-[12px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {m.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {m.status === "pending" && (
                    <LumiButton variant="outline" size="sm" icon={<Check className="w-3.5 h-3.5" />} onClick={() => activateMember(m.id)}>
                      Ativar
                    </LumiButton>
                  )}
                  <LumiButton variant="ghost" size="sm" onClick={() => setEditing(editing === m.id ? null : m.id)}>
                    {editing === m.id ? "Fechar" : "Editar acessos"}
                  </LumiButton>
                  <LumiButton variant="ghost" size="sm" className="text-red-500" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => removeMember(m.id)}>
                    Remover
                  </LumiButton>
                </div>
              </div>

              {/* Clientes liberados */}
              <div className="mt-3 pt-3 border-t border-border/60">
                <p className="text-[11px] font-medium text-muted-foreground mb-2">
                  Contas que pode trabalhar ({m.allowedClientIds.length}/{clients.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {clients.map((c) => {
                    const allowed = m.allowedClientIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        disabled={editing !== m.id}
                        onClick={() =>
                          updateMemberAccess(
                            m.id,
                            allowed ? m.allowedClientIds.filter((id) => id !== c.id) : [...m.allowedClientIds, c.id]
                          )
                        }
                        className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border text-[12px] font-medium transition-all ${
                          allowed ? "border-[#7B61FF]/40 bg-[#7B61FF]/5" : "border-border text-muted-foreground"
                        } ${editing === m.id ? "cursor-pointer hover:border-[#7B61FF]" : "cursor-default opacity-90"}`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-[9px] font-bold`}>
                          {c.name.slice(0, 2).toUpperCase()}
                        </span>
                        {c.name}
                        {allowed && <Check className="w-3 h-3 text-[#7B61FF]" />}
                      </button>
                    );
                  })}
                </div>
                {editing === m.id && (
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Colaboradores não têm acesso aos insights dos clientes — apenas às ferramentas de criação e agendamento.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de convite */}
      <LumiModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Liberar acesso de colaborador"
        description="Envie um convite por e-mail e escolha em quais contas de clientes ele poderá trabalhar."
        footer={
          <>
            <LumiButton variant="ghost" onClick={() => setInviteOpen(false)}>Cancelar</LumiButton>
            <LumiButton variant="gradient" icon={<Mail className="w-4 h-4" />} onClick={handleInvite} disabled={!isValidGmail}>
              Enviar convite
            </LumiButton>
          </>
        }
      >
        <div className="space-y-3">
          <LumiInput label="Nome (opcional)" placeholder="Ex.: Lucas Ferreira" value={inviteName} onChange={(e) => setInviteName(e.target.value)} icon={<Users />} />
          <LumiInput
            label="E-mail (Gmail)"
            placeholder="colaborador@gmail.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            icon={<Mail />}
            error={inviteEmail && !isValidGmail ? "Informe um e-mail válido" : undefined}
          />
          <div>
            <p className="text-xs font-medium mb-2">Contas liberadas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {clients.map((c) => {
                const selected = inviteClients.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleInviteClient(c.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${selected ? "border-[#7B61FF]/40 bg-[#7B61FF]/5" : "border-border hover:border-[#7B61FF]/30"}`}
                  >
                    <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate">{c.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {c.connectedNetworks.slice(0, 4).map((n) => {
                          const cfg = platformById(n);
                          const NIcon = cfg.icon;
                          return <NIcon key={n} className={`w-2.5 h-2.5 ${cfg.color}`} />;
                        })}
                      </div>
                    </div>
                    {selected && <Check className="w-4 h-4 text-[#7B61FF] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </LumiModal>
    </div>
  );
}
