import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import logoImg from "figma:asset/941444256f7c55985c72f1ccbbb282a1128e3849.png";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logoAnimDone, setLogoAnimDone] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0B1A] via-[#1A1133] to-[#0D0B1A]">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#7B61FF]/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -20, 30, 0],
            y: [0, 20, -30, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#B14EFF]/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 15, -15, 0],
            y: [0, -15, 15, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#3B82F6]/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          onAnimationComplete={() => setLogoAnimDone(true)}
          className="flex flex-col items-center mb-10"
        >
          {/* Logo glow */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] rounded-2xl blur-xl"
            />
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30"
            >
              <img
                src={logoImg}
                alt="Lumiflow"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-3xl font-bold text-white mt-6 mb-2"
          >
            Lumiflow
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-white/60 text-center max-w-xs"
          >
            Organize ideias. Automatize projetos. Trabalhe com inteligência.
          </motion.p>
        </motion.div>

        {/* Login options */}
        <AnimatePresence mode="wait">
          {logoAnimDone && !showEmailForm && (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              {/* Google Login - Primary */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white text-gray-800 rounded-xl font-medium shadow-lg shadow-white/10 hover:shadow-white/20 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar com Google
              </motion.button>

              {/* Apple Login */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white/10 text-white rounded-xl font-medium border border-white/10 hover:bg-white/15 backdrop-blur-sm transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continuar com Apple
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/40 text-xs">ou</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Email Login */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white/5 text-white/80 rounded-xl font-medium border border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all"
              >
                <Mail className="w-5 h-5" />
                Continuar com email
              </motion.button>

              <p className="text-white/30 text-xs text-center pt-4">
                Ao continuar, você concorda com os{" "}
                <span className="text-white/50 underline cursor-pointer">
                  Termos de Uso
                </span>{" "}
                e{" "}
                <span className="text-white/50 underline cursor-pointer">
                  Política de Privacidade
                </span>
              </p>
            </motion.div>
          )}

          {logoAnimDone && showEmailForm && (
            <motion.form
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleEmailLogin}
              className="space-y-4"
            >
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/50 focus:border-[#7B61FF]/50 backdrop-blur-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/50 focus:border-[#7B61FF]/50 backdrop-blur-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7B61FF] focus:ring-[#7B61FF]/50"
                  />
                  Lembrar de mim
                </label>
                <button
                  type="button"
                  className="text-[#7B61FF] hover:text-[#B14EFF] transition-colors"
                >
                  Esqueci a senha
                </button>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all"
              >
                Entrar
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="w-full text-white/40 text-sm hover:text-white/60 transition-colors py-2"
              >
                Voltar para opções de login
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}