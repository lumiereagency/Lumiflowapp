/**
 * Contexto global do workspace da agência.
 *
 * Centraliza:
 *  - Papel do usuário logado (admin/gerente vs colaborador)
 *  - Clientes conectados e suas redes sociais
 *  - Equipe e quais clientes cada colaborador pode acessar
 *  - Regras de visibilidade (insights de clientes são exclusivos do gerente)
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { PlatformId } from "./platforms";

export type UserRole = "admin" | "member";

export interface ClientAccount {
  id: string;
  name: string;
  handle: string;
  color: string; // gradiente tailwind
  connectedNetworks: PlatformId[];
  // Métricas internas — visíveis somente para o gerente
  insights: { followers: string; engagement: string; reach: string; growth: string };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string; // gmail
  role: UserRole;
  status: "active" | "pending";
  allowedClientIds: string[];
  // Desenvolvimento da equipe (visível ao gerente)
  postsPublished: number;
  approvalRate: number; // %
  tasksCompleted: number;
}

interface WorkspaceState {
  role: UserRole;
  currentUser: TeamMember;
  clients: ClientAccount[];
  team: TeamMember[];
  /** Clientes visíveis ao usuário atual (gerente vê todos; colaborador só os liberados) */
  visibleClients: ClientAccount[];
  /** Insights de clientes só aparecem para o gerente */
  canViewInsights: boolean;
  addClient: (name: string, handle: string) => void;
  toggleClientNetwork: (clientId: string, network: PlatformId) => void;
  inviteMember: (name: string, email: string, clientIds: string[]) => void;
  updateMemberAccess: (memberId: string, clientIds: string[]) => void;
  removeMember: (memberId: string) => void;
  activateMember: (memberId: string) => void;
}

const CLIENT_COLORS = [
  "from-[#7B61FF] to-[#B14EFF]",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-blue-500 to-cyan-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-violet-500",
];

const initialClients: ClientAccount[] = [
  {
    id: "c1",
    name: "Bloom Cosméticos",
    handle: "@bloom.oficial",
    color: CLIENT_COLORS[0],
    connectedNetworks: ["instagram", "facebook", "tiktok"],
    insights: { followers: "128k", engagement: "4.8%", reach: "312k", growth: "+12%" },
  },
  {
    id: "c2",
    name: "TechNova SaaS",
    handle: "@technova",
    color: CLIENT_COLORS[1],
    connectedNetworks: ["linkedin", "twitter", "youtube"],
    insights: { followers: "54k", engagement: "3.1%", reach: "98k", growth: "+8%" },
  },
  {
    id: "c3",
    name: "Verde Café",
    handle: "@verdecafe",
    color: CLIENT_COLORS[2],
    connectedNetworks: ["instagram", "pinterest"],
    insights: { followers: "27k", engagement: "6.2%", reach: "61k", growth: "+21%" },
  },
];

const initialTeam: TeamMember[] = [
  {
    id: "u_admin",
    name: "Marina Prado",
    email: "marina.gerente@gmail.com",
    role: "admin",
    status: "active",
    allowedClientIds: ["c1", "c2", "c3"],
    postsPublished: 142,
    approvalRate: 98,
    tasksCompleted: 210,
  },
  {
    id: "u1",
    name: "Lucas Ferreira",
    email: "lucas.social@gmail.com",
    role: "member",
    status: "active",
    allowedClientIds: ["c1", "c3"],
    postsPublished: 87,
    approvalRate: 92,
    tasksCompleted: 134,
  },
  {
    id: "u2",
    name: "Beatriz Santos",
    email: "bia.designer@gmail.com",
    role: "member",
    status: "active",
    allowedClientIds: ["c2"],
    postsPublished: 63,
    approvalRate: 95,
    tasksCompleted: 98,
  },
  {
    id: "u3",
    name: "Rafael Lima",
    email: "rafael.copy@gmail.com",
    role: "member",
    status: "pending",
    allowedClientIds: ["c1"],
    postsPublished: 0,
    approvalRate: 0,
    tasksCompleted: 0,
  },
];

const WorkspaceContext = createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({ role, children }: { role: UserRole; children: ReactNode }) {
  const [clients, setClients] = useState<ClientAccount[]>(initialClients);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);

  // Usuário logado: gerente fixo, ou o primeiro colaborador ativo como demo.
  const currentUser = useMemo(
    () => (role === "admin" ? team.find((m) => m.role === "admin")! : team.find((m) => m.role === "member" && m.status === "active")!),
    [role, team]
  );

  const visibleClients = useMemo(() => {
    if (role === "admin") return clients;
    return clients.filter((c) => currentUser.allowedClientIds.includes(c.id));
  }, [role, clients, currentUser]);

  const addClient = (name: string, handle: string) => {
    setClients((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        name,
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        color: CLIENT_COLORS[prev.length % CLIENT_COLORS.length],
        connectedNetworks: [],
        insights: { followers: "0", engagement: "—", reach: "0", growth: "—" },
      },
    ]);
  };

  const toggleClientNetwork = (clientId: string, network: PlatformId) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              connectedNetworks: c.connectedNetworks.includes(network)
                ? c.connectedNetworks.filter((n) => n !== network)
                : [...c.connectedNetworks, network],
            }
          : c
      )
    );
  };

  const inviteMember = (name: string, email: string, clientIds: string[]) => {
    setTeam((prev) => [
      ...prev,
      {
        id: `u_${Date.now()}`,
        name: name || email.split("@")[0],
        email,
        role: "member",
        status: "pending",
        allowedClientIds: clientIds,
        postsPublished: 0,
        approvalRate: 0,
        tasksCompleted: 0,
      },
    ]);
  };

  const updateMemberAccess = (memberId: string, clientIds: string[]) => {
    setTeam((prev) => prev.map((m) => (m.id === memberId ? { ...m, allowedClientIds: clientIds } : m)));
  };

  const removeMember = (memberId: string) => setTeam((prev) => prev.filter((m) => m.id !== memberId));

  const activateMember = (memberId: string) =>
    setTeam((prev) => prev.map((m) => (m.id === memberId ? { ...m, status: "active" as const } : m)));

  const value: WorkspaceState = {
    role,
    currentUser,
    clients,
    team,
    visibleClients,
    canViewInsights: role === "admin",
    addClient,
    toggleClientNetwork,
    inviteMember,
    updateMemberAccess,
    removeMember,
    activateMember,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace deve ser usado dentro de WorkspaceProvider");
  return ctx;
}
