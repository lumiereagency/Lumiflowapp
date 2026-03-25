import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Salad,
  Droplets,
  Flame,
  Target,
  Heart,
  Apple,
  Coffee,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ChevronRight,
  ChevronLeft,
  Check,
  Send,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Dumbbell,
  Scale,
  Zap,
  Brain,
  MessageSquare,
  User,
  Calendar,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

interface NutritionCoachProps {
  onNavigate: (section: string) => void;
}

type CoachView = "dashboard" | "onboarding" | "chat" | "mealplan" | "checkin";

interface OnboardingData {
  goal: string;
  age: string;
  weight: string;
  height: string;
  activityLevel: string;
  dietaryPreferences: string[];
  allergies: string[];
}

const goals = [
  { id: "weight-loss", label: "Perda de peso", icon: Scale, color: "from-blue-500 to-cyan-500" },
  { id: "muscle-gain", label: "Ganho muscular", icon: Dumbbell, color: "from-red-500 to-pink-500" },
  { id: "endurance", label: "Resistência", icon: Zap, color: "from-amber-500 to-orange-500" },
  { id: "energy", label: "Mais energia", icon: Flame, color: "from-emerald-500 to-teal-500" },
  { id: "wellness", label: "Bem-estar geral", icon: Heart, color: "from-purple-500 to-violet-500" },
  { id: "performance", label: "Performance mental", icon: Brain, color: "from-[#7B61FF] to-[#B14EFF]" },
];

const activityLevels = [
  { id: "sedentary", label: "Sedentário", desc: "Pouco ou nenhum exercício" },
  { id: "light", label: "Levemente ativo", desc: "1-3 dias por semana" },
  { id: "moderate", label: "Moderado", desc: "3-5 dias por semana" },
  { id: "active", label: "Muito ativo", desc: "6-7 dias por semana" },
  { id: "athlete", label: "Atleta", desc: "Treinos intensos diários" },
];

const dietPrefs = ["Sem restrições", "Vegetariano", "Vegano", "Low carb", "Keto", "Sem glúten", "Sem lactose", "Mediterrâneo"];

const mockMealPlan = {
  day: "Terça-feira",
  calories: 2150,
  protein: 145,
  carbs: 220,
  fat: 72,
  meals: [
    { time: "07:00", icon: Sunrise, label: "Café da manhã", items: ["Ovos mexidos (3 unid.)", "Pão integral com abacate", "Suco de laranja natural"], calories: 480 },
    { time: "10:00", icon: Coffee, label: "Lanche da manhã", items: ["Iogurte grego com granola", "Banana"], calories: 280 },
    { time: "12:30", icon: Sun, label: "Almoço", items: ["Frango grelhado 200g", "Arroz integral", "Salada colorida", "Azeite de oliva"], calories: 620 },
    { time: "15:30", icon: Apple, label: "Lanche da tarde", items: ["Mix de castanhas (30g)", "Maçã"], calories: 220 },
    { time: "19:00", icon: Sunset, label: "Jantar", items: ["Salmão ao forno 180g", "Batata doce", "Brócolis e aspargos"], calories: 550 },
  ],
};

const weeklyTips = [
  { icon: Droplets, title: "Hidratação", tip: "Beba ao menos 2.5L de água hoje. Seu corpo precisa de hidratação constante para manter o foco e a energia." },
  { icon: Apple, title: "Vitamina C", tip: "Inclua frutas cítricas nas suas refeições. Elas ajudam na absorção de ferro e fortalecem a imunidade." },
  { icon: Coffee, title: "Cafeína", tip: "Evite café após as 15h para garantir uma melhor qualidade de sono e recuperação muscular." },
];

const chatMessages = [
  { id: "1", from: "coach", text: "Olá! Sou seu consultor nutricional do Lumiflow. Como posso ajudar hoje?", time: "09:00" },
  { id: "2", from: "user", text: "Quero melhorar minha alimentação para ter mais energia durante o dia", time: "09:02" },
  { id: "3", from: "coach", text: "Ótimo objetivo! Analisei seu perfil e percebi que você pode melhorar em 3 áreas: distribuição de macros ao longo do dia, hidratação e timing das refeições. Vamos começar ajustando seu café da manhã para incluir mais proteínas e gorduras saudáveis.", time: "09:03" },
  { id: "4", from: "coach", text: "Recomendo: 3 ovos mexidos, 1 fatia de pão integral com pasta de amendoim e 1 fruta. Isso vai manter sua energia estável até o almoço. O que acha?", time: "09:04" },
];

const supplementRecs = [
  { name: "Vitamina D3", dosage: "2000 UI/dia", reason: "Suporte imunológico e energia", priority: "alta" },
  { name: "Ômega 3", dosage: "1000mg/dia", reason: "Saúde cardiovascular e anti-inflamatório", priority: "alta" },
  { name: "Magnésio", dosage: "400mg antes de dormir", reason: "Relaxamento e qualidade do sono", priority: "média" },
  { name: "Creatina", dosage: "5g/dia", reason: "Performance física e cognitiva", priority: "média" },
];

export function NutritionCoach({ onNavigate }: NutritionCoachProps) {
  const [view, setView] = useState<CoachView>("dashboard");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(chatMessages);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    goal: "", age: "", weight: "", height: "", activityLevel: "", dietaryPreferences: [], allergies: [],
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { id: Date.now().toString(), from: "user", text: chatInput, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // Simulated coach response
    setTimeout(() => {
      const responses = [
        "Excelente escolha! Vou ajustar seu plano alimentar para incluir essa preferência. Lembre-se de manter a consistência — resultados vêm com o tempo.",
        "Entendi. Com base no seu perfil, recomendo aumentar a ingestão de proteínas em 20g diárias. Isso vai ajudar na recuperação e manter sua energia estável.",
        "Boa pergunta! Para seu caso, o ideal é fazer uma refeição rica em carboidratos complexos 2 horas antes do treino. Posso montar uma sugestão de pré-treino para você.",
      ];
      const resp = {
        id: (Date.now() + 1).toString(),
        from: "coach",
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, resp]);
    }, 1500);
  };

  if (!isOnboarded) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 mb-4">
            <Salad className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Seu Consultor Nutricional</h1>
          <p className="text-muted-foreground mt-2">Responda algumas perguntas para personalizarmos sua experiência</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === onboardingStep ? "w-10 bg-[#7B61FF]" : i < onboardingStep ? "w-6 bg-[#7B61FF]/50" : "w-6 bg-muted"}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {onboardingStep === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="font-bold text-lg">Qual é seu principal objetivo?</h2>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((g) => (
                  <motion.button
                    key={g.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setOnboardingData((d) => ({ ...d, goal: g.id })); setOnboardingStep(1); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${onboardingData.goal === g.id ? "border-[#7B61FF] bg-[#7B61FF]/5" : "border-border hover:border-[#7B61FF]/30"}`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${g.color} flex items-center justify-center`}>
                      <g.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{g.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {onboardingStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="font-bold text-lg">Seus dados básicos</h2>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm text-muted-foreground block mb-1">Idade</label><input type="number" placeholder="25" value={onboardingData.age} onChange={(e) => setOnboardingData((d) => ({ ...d, age: e.target.value }))} className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" /></div>
                <div><label className="text-sm text-muted-foreground block mb-1">Peso (kg)</label><input type="number" placeholder="75" value={onboardingData.weight} onChange={(e) => setOnboardingData((d) => ({ ...d, weight: e.target.value }))} className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" /></div>
                <div><label className="text-sm text-muted-foreground block mb-1">Altura (cm)</label><input type="number" placeholder="175" value={onboardingData.height} onChange={(e) => setOnboardingData((d) => ({ ...d, height: e.target.value }))} className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" /></div>
              </div>
              <div className="flex justify-between pt-4">
                <button onClick={() => setOnboardingStep(0)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Voltar</button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setOnboardingStep(2)} className="px-6 py-2 bg-[#7B61FF] text-white rounded-xl text-sm font-medium flex items-center gap-1">Próximo <ChevronRight className="w-4 h-4" /></motion.button>
              </div>
            </motion.div>
          )}

          {onboardingStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="font-bold text-lg">Nível de atividade física</h2>
              <div className="space-y-2">
                {activityLevels.map((a) => (
                  <button key={a.id} onClick={() => setOnboardingData((d) => ({ ...d, activityLevel: a.id }))} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${onboardingData.activityLevel === a.id ? "border-[#7B61FF] bg-[#7B61FF]/5" : "border-border hover:border-[#7B61FF]/30"}`}>
                    <div><p className="text-sm font-medium text-left">{a.label}</p><p className="text-xs text-muted-foreground text-left">{a.desc}</p></div>
                    {onboardingData.activityLevel === a.id && <Check className="w-5 h-5 text-[#7B61FF]" />}
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <button onClick={() => setOnboardingStep(1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Voltar</button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setOnboardingStep(3)} className="px-6 py-2 bg-[#7B61FF] text-white rounded-xl text-sm font-medium flex items-center gap-1">Próximo <ChevronRight className="w-4 h-4" /></motion.button>
              </div>
            </motion.div>
          )}

          {onboardingStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="font-bold text-lg">Preferências alimentares</h2>
              <div className="flex flex-wrap gap-2">
                {dietPrefs.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setOnboardingData((d) => ({ ...d, dietaryPreferences: d.dietaryPreferences.includes(pref) ? d.dietaryPreferences.filter((p) => p !== pref) : [...d.dietaryPreferences, pref] }))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${onboardingData.dietaryPreferences.includes(pref) ? "border-[#7B61FF] bg-[#7B61FF]/10 text-[#7B61FF]" : "border-border text-muted-foreground hover:border-[#7B61FF]/30"}`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <button onClick={() => setOnboardingStep(2)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Voltar</button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setIsOnboarded(true); toast.success("Perfil nutricional criado com sucesso!"); }} className="px-6 py-2 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl text-sm font-medium flex items-center gap-1">Concluir <Check className="w-4 h-4" /></motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Salad className="w-7 h-7 text-emerald-500" />
            Nutrition Coach
          </h1>
          <p className="text-muted-foreground mt-1">
            Seu consultor nutricional personalizado
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["dashboard", "mealplan", "chat", "checkin"] as CoachView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === v ? "bg-emerald-500 text-white shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {v === "dashboard" ? "Visão Geral" : v === "mealplan" ? "Plano Alimentar" : v === "chat" ? "Consultoria" : "Check-in"}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "dashboard" && (
          <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Calorias Hoje", value: "1.380 / 2.150", icon: Flame, color: "from-orange-500 to-red-500", pct: 64 },
                { label: "Água", value: "1.8L / 2.5L", icon: Droplets, color: "from-blue-500 to-cyan-500", pct: 72 },
                { label: "Proteína", value: "89g / 145g", icon: Target, color: "from-emerald-500 to-teal-500", pct: 61 },
                { label: "Streak Nutricional", value: "12 dias", icon: Award, color: "from-amber-500 to-orange-500", pct: 100 },
              ].map((stat) => (
                <motion.div key={stat.label} whileHover={{ y: -2 }} className="p-4 rounded-2xl bg-card border border-border/50">
                  <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} mb-2`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold mt-0.5">{stat.value}</p>
                  <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.pct}%` }} transition={{ duration: 1 }} className={`h-full bg-gradient-to-r ${stat.color} rounded-full`} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Meals Preview */}
              <div className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    Refeições de Hoje
                  </h3>
                  <button onClick={() => setView("mealplan")} className="text-xs text-[#7B61FF] hover:underline">Ver plano completo</button>
                </div>
                <div className="space-y-3">
                  {mockMealPlan.meals.map((meal, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${idx < 3 ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-muted/20 border border-border/30"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx < 3 ? "bg-emerald-500/10" : "bg-muted/50"}`}>
                        <meal.icon className={`w-4 h-4 ${idx < 3 ? "text-emerald-500" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-medium">{meal.label}</p>
                          <span className="text-xs text-muted-foreground">{meal.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{meal.items.join(", ")}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold">{meal.calories}</span>
                        <span className="text-[10px] text-muted-foreground block">kcal</span>
                      </div>
                      {idx < 3 && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Supplements */}
              <div className="space-y-5">
                {/* Tips */}
                <div className="rounded-2xl bg-card border border-border/50 p-5">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Dicas da Semana
                  </h3>
                  <div className="space-y-3">
                    {weeklyTips.map((tip) => (
                      <div key={tip.title} className="p-3 rounded-xl bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                          <tip.icon className="w-4 h-4 text-[#7B61FF]" />
                          <span className="text-xs font-bold">{tip.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{tip.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supplements */}
                <div className="rounded-2xl bg-card border border-border/50 p-5">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Suplementos Recomendados
                  </h3>
                  <div className="space-y-2">
                    {supplementRecs.map((sup) => (
                      <div key={sup.name} className="flex items-center gap-3 p-2 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${sup.priority === "alta" ? "bg-red-500" : "bg-amber-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold">{sup.name}</p>
                          <p className="text-[10px] text-muted-foreground">{sup.dosage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === "mealplan" && (
          <motion.div key="mealplan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Macros */}
            <div className="rounded-2xl bg-card border border-border/50 p-6">
              <h3 className="font-bold mb-4">Plano de {mockMealPlan.day} — {mockMealPlan.calories} kcal</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Proteínas", value: `${mockMealPlan.protein}g`, pct: 27, color: "from-blue-500 to-cyan-500" },
                  { label: "Carboidratos", value: `${mockMealPlan.carbs}g`, pct: 41, color: "from-amber-500 to-orange-500" },
                  { label: "Gorduras", value: `${mockMealPlan.fat}g`, pct: 30, color: "from-emerald-500 to-teal-500" },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-muted" strokeWidth="3" />
                        <motion.path
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          className="stroke-[#7B61FF]"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 100" }}
                          animate={{ strokeDasharray: `${m.pct} ${100 - m.pct}` }}
                          transition={{ duration: 1 }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{m.pct}%</span>
                    </div>
                    <p className="text-sm font-bold">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Meals */}
              <div className="space-y-4">
                {mockMealPlan.meals.map((meal, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-muted/20 border border-border/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <meal.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{meal.label}</p>
                        <p className="text-xs text-muted-foreground">{meal.time} · {meal.calories} kcal</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5 ml-13">
                      {meal.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === "chat" && (
          <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="rounded-2xl bg-card border border-border/50 overflow-hidden" style={{ height: "60vh" }}>
              <div className="p-4 border-b border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Salad className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">Consultor Nutricional</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                  </p>
                </div>
              </div>

              <div className="p-4 overflow-y-auto" style={{ height: "calc(100% - 130px)" }}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.from === "user"
                          ? "bg-[#7B61FF] text-white rounded-br-md"
                          : "bg-muted/50 border border-border/30 rounded-bl-md"
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.from === "user" ? "text-white/60" : "text-muted-foreground"}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Pergunte ao seu consultor..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === "checkin" && (
          <motion.div key="checkin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Check-in Semanal</h3>
                  <p className="text-sm text-muted-foreground">Como foi sua semana nutricional?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { q: "Seguiu o plano alimentar?", options: ["Sim, 100%", "Maioria dos dias", "Parcialmente", "Pouco"] },
                  { q: "Nível de energia durante a semana?", options: ["Excelente", "Bom", "Regular", "Baixo"] },
                  { q: "Como está o sono?", options: ["Dormindo bem", "Razoável", "Irregular", "Insônia"] },
                  { q: "Hidratação?", options: ["2.5L+/dia", "2L/dia", "1.5L/dia", "Menos de 1.5L"] },
                ].map((item) => (
                  <div key={item.q} className="p-4 rounded-xl bg-card border border-border/50">
                    <p className="text-sm font-bold mb-3">{item.q}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.options.map((opt) => (
                        <button key={opt} className="px-3 py-2 rounded-lg text-xs font-medium border border-border/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left">
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast.success("Check-in semanal enviado! Seu consultor vai analisar e ajustar seu plano.")}
                className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20"
              >
                Enviar Check-in
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
