import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, X, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginProps {
  onLoginSuccess?: (token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim() || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha: password }),
      });

      const data = await response.text();
      
      if (!response.ok) {
        throw new Error(data || "Erro ao fazer login");
      }

      // Salvar token
      localStorage.setItem("token", data);
      localStorage.setItem("authToken", data);
      
      // Callback para o App
      if (onLoginSuccess) {
        onLoginSuccess(data);
      } else {
        // Redirecionar para dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" style={{ background: "#07070f" }}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-30" style={{ 
        backgroundImage: `
          linear-gradient(rgba(124, 58, 237, 0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124, 58, 237, 0.15) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        animation: "gridMove 20s linear infinite"
      }} />
      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.4) 0%, transparent 70%)" }} />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <span key={i} className="absolute w-1.5 h-1.5 rounded-full opacity-50 animate-float"
            style={{ 
              top: `${10 + i * 12}%`, 
              left: `${5 + (i * 13) % 90}%`,
              background: "#7c3aed",
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${8 + i}s`
            }} />
        ))}
      </div>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-150vh) scale(0); opacity: 0; }
        }
      `}</style>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0d0d1c] border border-[#7c3aed]/30 rounded-2xl p-8">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => navigate("/")}
              className="text-[#6b6b9a] hover:text-white transition-colors p-1"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-['Chakra_Petch'] text-3xl font-bold text-white tracking-tight" style={{ 
              background: "linear-gradient(135deg, #ffffff, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              RANK IT UP!
            </h1>
            <p className="text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mt-2 tracking-wider">Acesso à plataforma</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-['JetBrains_Mono']" 
                style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444" }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-2 tracking-wider">E-MAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b9a]/50 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  placeholder="seu@email.com"
                  className="w-full bg-[#07070f] border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white placeholder:text-[#6b6b9a]/40 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-2 tracking-wider">SENHA</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b9a]/50 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                  placeholder="••••••••"
                  className="w-full bg-[#07070f] border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white placeholder:text-[#6b6b9a]/40 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b9a]/50 hover:text-white transition-colors p-1"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-[#6b6b9a] mt-6">
            Não tem conta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-['JetBrains_Mono'] font-medium hover:text-white transition-colors"
              style={{ color: "#c4b5fd" }}
            >
              Cadastre-se
            </button>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl border border-white/5 bg-[#07070f]/50">
            <p className="text-[10.10px] font-['JetBrains_Mono'] text-[#6b6b9a]/70 text-center leading-relaxed">
              <strong className="text-[#7c3aed]">Demo:</strong> admin@rankitup.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}