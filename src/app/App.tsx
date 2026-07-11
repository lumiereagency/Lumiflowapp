import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { TabNavigation } from "./components/TabNavigation";
import { MindMapsGrid } from "./components/MindMapsGrid";
import { WorkflowBoard } from "./components/WorkflowBoard";
import { PricingPage } from "./components/PricingPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { SuccessModal } from "./components/SuccessModal";
import { MindMapEditor } from "./components/MindMapEditor";
import { TrialExpiringModal } from "./components/TrialExpiringModal";
import { AIAssistant } from "./components/AIAssistant";
import { AICommandBar } from "./components/AICommandBar";
import { NotificationCenter } from "./components/NotificationCenter";
import { TaskDetailPanel } from "./components/TaskDetailPanel";
import { DashboardHome } from "./components/DashboardHome";
import { LoginPage } from "./components/LoginPage";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { UpgradeModal } from "./components/UpgradeModal";
import { BillingPage } from "./components/BillingPage";
import { InviteTeamModal } from "./components/InviteTeamModal";
import { ShareProjectModal } from "./components/ShareProjectModal";
import { ReferralProgram } from "./components/ReferralProgram";
import { SocialMediaScheduler } from "./components/SocialMediaScheduler";
import { AdminDashboard } from "./components/AdminDashboard";
import { AccessManagement } from "./components/AccessManagement";
import { WorkspaceProvider, type UserRole } from "./components/workspace/WorkspaceContext";
import { GrowthAnalytics } from "./components/GrowthAnalytics";
import { ProjectsDashboard } from "./components/ProjectsDashboard";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { CalendarView } from "./components/CalendarView";
import { SettingsPage } from "./components/SettingsPage";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { TeamManagement } from "./components/TeamManagement";
import { InboxPage } from "./components/InboxPage";
import { AutomationCenter } from "./components/AutomationCenter";
import { ActivityLog } from "./components/ActivityLog";
import { HelpCenter } from "./components/HelpCenter";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { ProductivityHub } from "./components/ProductivityHub";
import { SmartProductivityWidget } from "./components/SmartProductivityWidget";
import { DesignSystemShowcase } from "./components/DesignSystemShowcase";
import { RankingsPage } from "./components/RankingsPage";
import { RewardsPage } from "./components/RewardsPage";
import { LumiStore } from "./components/LumiStore";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";

type View = "dashboard" | "pricing" | "checkout" | "success" | "mindmap" | "billing";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("member");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeTab, setActiveTab] = useState<"mindmaps" | "workflow">("mindmaps");
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(3);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedMapTitle, setSelectedMapTitle] = useState("");
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialModalDismissed, setTrialModalDismissed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiCommandBarOpen, setAiCommandBarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskPanelOpen, setTaskPanelOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState<string | undefined>();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [pendingAIPrompt, setPendingAIPrompt] = useState<string | null>(null);

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Cmd+K / Ctrl+K to open AI Command Bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setAiCommandBarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (trialDaysRemaining <= 3 && !isPremium && !trialModalDismissed && currentView === "dashboard" && isLoggedIn && isOnboarded) {
      const timer = setTimeout(() => {
        setShowTrialModal(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [trialDaysRemaining, isPremium, trialModalDismissed, currentView, isLoggedIn, isOnboarded]);

  const handleSendToAI = useCallback((prompt: string) => {
    setPendingAIPrompt(prompt);
    setAiAssistantOpen(true);
  }, []);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    toast.success(role === "admin" ? "Bem-vinda, Gerente! Acesso administrativo ativo." : "Login realizado com sucesso!");
  };

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    toast.success("Workspace criado! Bem-vindo ao Lumiflow!");
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(darkMode ? "Modo claro ativado" : "Modo escuro ativado");
  };

  const handleUpgradeClick = () => {
    setShowTrialModal(false);
    setUpgradeModalOpen(false);
    setCurrentView("pricing");
  };

  const handleDismissTrialModal = () => {
    setShowTrialModal(false);
    setTrialModalDismissed(true);
    toast.info("Você ainda tem " + trialDaysRemaining + " dias de teste grátis");
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setCurrentView("checkout");
  };

  const handleBackToPricing = () => { setCurrentView("pricing"); };
  const handlePaymentSuccess = () => { setCurrentView("success"); };

  const handleSuccessClose = () => {
    setIsPremium(true);
    setTrialDaysRemaining(30);
    setCurrentView("dashboard");
    toast.success("Bem-vindo ao Lumiflow Premium!");
  };

  const handleClosePricing = () => { setCurrentView("dashboard"); };

  const handleOpenMindMap = (title: string) => {
    setSelectedMapTitle(title);
    setCurrentView("mindmap");
  };

  const handleCloseMindMap = () => { setCurrentView("dashboard"); };

  const handleSectionChange = (section: string) => {
    // Overlay triggers (don't change activeSection)
    if (section === "ai-assistant") { setAiAssistantOpen(true); return; }
    if (section === "notifications") { setNotificationsOpen(true); return; }
    if (section === "command-bar") { setAiCommandBarOpen(true); return; }
    if (section === "pricing") { setCurrentView("pricing"); return; }

    // Ensure we're on the main view
    setCurrentView("dashboard");

    // Map mindmaps/workflow to the tabbed "content" section
    if (section === "mindmaps") {
      setActiveTab("mindmaps");
      setActiveSection("content");
    } else if (section === "workflow") {
      setActiveTab("workflow");
      setActiveSection("content");
    } else {
      setActiveSection(section);
    }
  };

  const handleCardClick = (card: any) => {
    setSelectedTask(card);
    setTaskPanelOpen(true);
  };

  const handleOpenAI = () => { setAiAssistantOpen(true); };

  // Breadcrumbs configuration
  const sectionLabels: Record<string, string> = {
    projects: "Projetos",
    scheduler: "Agendador Social",
    "admin-metrics": "Painel do Gerente",
    access: "Gestão de Acessos",
    calendar: "Calendário",
    analytics: "Análises",
    settings: "Configurações",
    referral: "Indicações",
    growth: "Crescimento",
    team: "Equipe",
    inbox: "Caixa de Entrada",
    automations: "Automações",
    activity: "Atividades",
    help: "Ajuda",
    productivity: "Produtividade",
    "design-system": "Design System",
    rankings: "Rankings",
    rewards: "Recompensas",
    store: "Lumiflow Store",
    content: activeTab === "mindmaps" ? "Mapas Mentais" : "Fluxo de Trabalho",
  };

  const getBreadcrumbs = () => {
    const label = sectionLabels[activeSection] || activeSection;
    return [{ label }];
  };

  // Login
  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster position="bottom-right" toastOptions={{ style: { background: "var(--color-card)", color: "var(--color-foreground)", border: "1px solid var(--color-border)" } }} />
      </>
    );
  }

  // Onboarding
  if (!isOnboarded) {
    return (
      <>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
        <Toaster position="bottom-right" toastOptions={{ style: { background: "var(--color-card)", color: "var(--color-foreground)", border: "1px solid var(--color-border)" } }} />
      </>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <DashboardHome onNavigate={handleSectionChange} onOpenAI={handleOpenAI} />
          </motion.div>
        );

      case "inbox":
        return (
          <motion.div key="inbox" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <InboxPage onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "projects":
        return (
          <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <ProjectsDashboard onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "calendar":
        return (
          <motion.div key="calendar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <CalendarView />
          </motion.div>
        );

      case "scheduler":
        return (
          <motion.div key="scheduler" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <SocialMediaScheduler />
          </motion.div>
        );

      case "admin-metrics":
        // Seção exclusiva da gerência
        if (userRole !== "admin") return null;
        return (
          <motion.div key="admin-metrics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <AdminDashboard onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "access":
        if (userRole !== "admin") return null;
        return (
          <motion.div key="access" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <AccessManagement onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "automations":
        return (
          <motion.div key="automations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <AutomationCenter onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "analytics":
        return (
          <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <AnalyticsDashboard />
          </motion.div>
        );

      case "activity":
        return (
          <motion.div key="activity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <ActivityLog onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "growth":
        return (
          <motion.div key="growth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <GrowthAnalytics />
          </motion.div>
        );

      case "referral":
        return (
          <motion.div key="referral" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <ReferralProgram onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "team":
        return (
          <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <TeamManagement onNavigate={handleSectionChange} onInviteClick={() => setInviteModalOpen(true)} />
          </motion.div>
        );

      case "help":
        return (
          <motion.div key="help" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <HelpCenter onNavigate={handleSectionChange} onOpenAI={handleOpenAI} />
          </motion.div>
        );

      case "settings":
        return (
          <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <SettingsPage darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
          </motion.div>
        );

      case "productivity":
        return (
          <motion.div key="productivity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <ProductivityHub onNavigate={handleSectionChange} onOpenAI={handleOpenAI} />
          </motion.div>
        );

      case "design-system":
        return (
          <motion.div key="design-system" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <DesignSystemShowcase onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "rankings":
        return (
          <motion.div key="rankings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <RankingsPage onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "rewards":
        return (
          <motion.div key="rewards" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <RewardsPage onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "store":
        return (
          <motion.div key="store" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <LumiStore onNavigate={handleSectionChange} />
          </motion.div>
        );

      case "content":
        return (
          <>
            <div className="mb-8">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <AnimatePresence mode="wait">
              {activeTab === "mindmaps" ? (
                <motion.div key="mindmaps" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <MindMapsGrid onOpenMap={handleOpenMindMap} />
                </motion.div>
              ) : (
                <motion.div key="workflow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <WorkflowBoard onCardClick={handleCardClick} onShareClick={() => setShareModalOpen(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <WorkspaceProvider role={userRole}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/30 dark:to-purple-950/10">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeSection={activeSection === "content" ? activeTab : activeSection}
            onSectionChange={handleSectionChange}
            role={userRole}
          />
        </div>

        {/* Navbar */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          trialDaysRemaining={trialDaysRemaining}
          onUpgradeClick={handleUpgradeClick}
          onNotificationsClick={() => setNotificationsOpen(true)}
          isPremium={isPremium}
          sidebarWidth={sidebarWidth}
          onBillingClick={() => setCurrentView("billing")}
          onNavigate={handleSectionChange}
        />

        {/* Main Content */}
        {currentView === "dashboard" && (
          <motion.main
            animate={{ marginLeft: sidebarWidth }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden lg:block px-8 py-8"
          >
            {activeSection !== "dashboard" && (
              <Breadcrumbs items={getBreadcrumbs()} onNavigate={handleSectionChange} />
            )}
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </motion.main>
        )}

        {/* Mobile Main Content */}
        {currentView === "dashboard" && (
          <div className="block lg:hidden px-4 pt-4 pb-20">
            {activeSection !== "dashboard" && (
              <Breadcrumbs items={getBreadcrumbs()} onNavigate={handleSectionChange} />
            )}
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        )}

        {/* Mobile Bottom Nav */}
        <MobileBottomNav
          activeSection={activeSection === "content" ? activeTab : activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* Background Gradient Orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>
      </div>

      {/* AI Copilot Panel */}
      <AIAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} isPremium={isPremium} currentSection={activeSection} />

      {/* AI Command Bar */}
      <AICommandBar isOpen={aiCommandBarOpen} onClose={() => setAiCommandBarOpen(false)} onSendToAI={handleSendToAI} />

      {/* Notification Center */}
      <NotificationCenter isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Task Detail Panel */}
      <TaskDetailPanel isOpen={taskPanelOpen} onClose={() => { setTaskPanelOpen(false); setSelectedTask(null); }} task={selectedTask} />

      {/* Upgrade Modal */}
      <UpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} onUpgrade={handleUpgradeClick} featureName={upgradeFeatureName} />

      {/* Invite Team Modal */}
      <InviteTeamModal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} />

      {/* Share Project Modal */}
      <ShareProjectModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />

      {/* Smart Productivity Widget */}
      {currentView === "dashboard" && (
        <SmartProductivityWidget onNavigate={handleSectionChange} onOpenAI={handleOpenAI} />
      )}

      {/* Full-screen Overlays */}
      <AnimatePresence>
        {currentView === "pricing" && (
          <PricingPage onSelectPlan={handleSelectPlan} onClose={handleClosePricing} />
        )}
        {currentView === "checkout" && (
          <CheckoutPage selectedPlan={selectedPlan} onBack={handleBackToPricing} onSuccess={handlePaymentSuccess} />
        )}
        {currentView === "success" && <SuccessModal onClose={handleSuccessClose} />}
        {currentView === "mindmap" && (
          <MindMapEditor mapTitle={selectedMapTitle} onClose={handleCloseMindMap} />
        )}
        {currentView === "billing" && (
          <BillingPage currentPlan={selectedPlan} isPremium={isPremium} onBack={() => setCurrentView("dashboard")} onUpgrade={handleUpgradeClick} />
        )}
        {showTrialModal && (
          <TrialExpiringModal daysRemaining={trialDaysRemaining} onUpgrade={handleUpgradeClick} onDismiss={handleDismissTrialModal} />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--color-card)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </WorkspaceProvider>
  );
}
