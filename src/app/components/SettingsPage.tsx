import { motion } from "motion/react";
import { useState } from "react";
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Monitor,
  Moon,
  Sun,
  Camera,
  Save,
  Link2,
  Mail,
  Smartphone,
  Check,
  ChevronRight,
  Plug,
  Key,
} from "lucide-react";
import { toast } from "sonner";

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsPage({ darkMode, onToggleDarkMode }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Product Designer",
    company: "Lumiflow Inc.",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskAssigned: true,
    taskCompleted: true,
    approvalRequired: true,
    mentions: true,
    weeklyDigest: true,
    projectUpdates: false,
  });

  const [accentColor, setAccentColor] = useState("#7B61FF");

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "integrations", label: "Integrações", icon: Plug },
    { id: "security", label: "Segurança", icon: Shield },
  ];

  const accentColors = [
    { label: "Violeta", value: "#7B61FF" },
    { label: "Azul", value: "#3B82F6" },
    { label: "Esmeralda", value: "#10B981" },
    { label: "Rosa", value: "#EC4899" },
    { label: "Âmbar", value: "#F59E0B" },
    { label: "Vermelho", value: "#EF4444" },
    { label: "Ciano", value: "#06B6D4" },
    { label: "Índigo", value: "#6366F1" },
  ];

  const integrations = [
    { id: "slack", name: "Slack", description: "Receba notificações e atualize tarefas", connected: true, icon: "💬" },
    { id: "google", name: "Google Calendar", description: "Sincronize prazos e reuniões", connected: true, icon: "📅" },
    { id: "figma", name: "Figma", description: "Importe designs e assets", connected: false, icon: "🎨" },
    { id: "github", name: "GitHub", description: "Vincule commits e PRs a tarefas", connected: false, icon: "🐙" },
    { id: "notion", name: "Notion", description: "Sincronize documentos e notas", connected: false, icon: "📝" },
    { id: "zapier", name: "Zapier", description: "Automatize workflows entre apps", connected: false, icon: "⚡" },
  ];

  const handleSaveProfile = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleSaveNotifications = () => {
    toast.success("Preferências de notificação salvas!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize seu workspace e preferências
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-[#7B61FF]/10 text-[#7B61FF] font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-6"
            >
              <h3 className="text-lg font-semibold">Informações do Perfil</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    JD
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nome Completo</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Cargo</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Empresa</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Fuso Horário</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                  >
                    <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                    <option value="America/New_York">Nova York (GMT-5)</option>
                    <option value="Europe/London">Londres (GMT+0)</option>
                    <option value="Europe/Berlin">Berlim (GMT+1)</option>
                    <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Idioma</label>
                  <select
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                  >
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white text-sm font-medium shadow-lg shadow-purple-500/20"
                >
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-6"
            >
              <h3 className="text-lg font-semibold">Preferências de Notificação</h3>

              {/* Channels */}
              <div>
                <h4 className="text-sm font-medium mb-3">Canais de Notificação</h4>
                <div className="space-y-3">
                  <ToggleItem
                    icon={<Mail className="w-4 h-4" />}
                    label="Notificações por Email"
                    description="Receba atualizações importantes no seu email"
                    checked={notifications.email}
                    onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                  />
                  <ToggleItem
                    icon={<Smartphone className="w-4 h-4" />}
                    label="Notificações Push"
                    description="Alertas em tempo real no navegador"
                    checked={notifications.push}
                    onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
                  />
                </div>
              </div>

              {/* Activity Types */}
              <div>
                <h4 className="text-sm font-medium mb-3">Tipos de Atividade</h4>
                <div className="space-y-3">
                  <ToggleItem
                    label="Tarefa atribuída a mim"
                    description="Quando alguém te atribuir uma nova tarefa"
                    checked={notifications.taskAssigned}
                    onChange={() => setNotifications({ ...notifications, taskAssigned: !notifications.taskAssigned })}
                  />
                  <ToggleItem
                    label="Tarefa concluída"
                    description="Quando uma tarefa do seu projeto for finalizada"
                    checked={notifications.taskCompleted}
                    onChange={() => setNotifications({ ...notifications, taskCompleted: !notifications.taskCompleted })}
                  />
                  <ToggleItem
                    label="Aprovação necessária"
                    description="Quando uma tarefa precisar da sua aprovação"
                    checked={notifications.approvalRequired}
                    onChange={() => setNotifications({ ...notifications, approvalRequired: !notifications.approvalRequired })}
                  />
                  <ToggleItem
                    label="Menções"
                    description="Quando alguém te mencionar em comentários"
                    checked={notifications.mentions}
                    onChange={() => setNotifications({ ...notifications, mentions: !notifications.mentions })}
                  />
                  <ToggleItem
                    label="Resumo semanal"
                    description="Relatório semanal de produtividade do time"
                    checked={notifications.weeklyDigest}
                    onChange={() => setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })}
                  />
                  <ToggleItem
                    label="Atualizações de projeto"
                    description="Mudanças de status e progresso em projetos"
                    checked={notifications.projectUpdates}
                    onChange={() => setNotifications({ ...notifications, projectUpdates: !notifications.projectUpdates })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white text-sm font-medium shadow-lg shadow-purple-500/20"
                >
                  <Save className="w-4 h-4" />
                  Salvar Preferências
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Theme */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Tema</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => { if (darkMode) onToggleDarkMode(); }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      !darkMode ? "border-[#7B61FF] bg-[#7B61FF]/5" : "border-border hover:border-[#7B61FF]/30"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-sm font-medium text-center">Claro</p>
                  </button>
                  <button
                    onClick={() => { if (!darkMode) onToggleDarkMode(); }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      darkMode ? "border-[#7B61FF] bg-[#7B61FF]/5" : "border-border hover:border-[#7B61FF]/30"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center mx-auto mb-2">
                      <Moon className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-center">Escuro</p>
                  </button>
                  <button className="p-4 rounded-xl border-2 border-border hover:border-[#7B61FF]/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-gray-900 border border-gray-300 flex items-center justify-center mx-auto mb-2">
                      <Monitor className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-center">Sistema</p>
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Cor de Destaque</h3>
                <p className="text-sm text-muted-foreground">Personalize a cor principal do interface</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => { setAccentColor(color.value); toast.success(`Cor ${color.label} selecionada!`); }}
                      className={`relative w-full aspect-square rounded-xl transition-all ${
                        accentColor === color.value ? "ring-2 ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value, ringColor: color.value }}
                      title={color.label}
                    >
                      {accentColor === color.value && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Integrations */}
          {activeTab === "integrations" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-6"
            >
              <h3 className="text-lg font-semibold">Integrações</h3>
              <p className="text-sm text-muted-foreground">Conecte suas ferramentas favoritas ao Lumiflow</p>

              <div className="space-y-3">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-[#7B61FF]/20 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center text-xl">
                      {integration.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toast.success(
                        integration.connected
                          ? `${integration.name} desconectado`
                          : `${integration.name} conectado!`
                      )}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                        integration.connected
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          : "bg-[#7B61FF]/10 text-[#7B61FF] hover:bg-[#7B61FF]/20"
                      }`}
                    >
                      {integration.connected ? "Conectado" : "Conectar"}
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Alterar Senha</h3>
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Senha Atual</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Nova Senha</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-[#7B61FF]/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 text-sm transition-all"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.success("Senha atualizada com sucesso!")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white text-sm font-medium shadow-lg shadow-purple-500/20"
                >
                  <Key className="w-4 h-4" />
                  Atualizar Senha
                </motion.button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Autenticação em Dois Fatores</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança à sua conta
                </p>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    2FA não está ativado. Recomendamos ativar para maior segurança.
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.info("Configuração de 2FA em breve!")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Ativar 2FA
                </motion.button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Zona de Perigo</h3>
                <p className="text-sm text-muted-foreground">
                  Ações irreversíveis. Proceda com cuidado.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.error("Ação cancelada por segurança")}
                  className="px-5 py-2.5 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Excluir Conta
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleItem({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon?: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-[#7B61FF]" : "bg-muted"
        }`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}
