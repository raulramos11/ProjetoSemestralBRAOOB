import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, X, Mail, Lock, User, AlertCircle, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

interface RegisterProps {
  onLoginSuccess?: (token: string) => void;
}

export default function Register({ onLoginSuccess }: RegisterProps) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = () => {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { level: 1, label: "Fraca", color: "#ef4444" };
    if (score === 2) return { level: 2, label: "Média", color: "#f59e0b" };
    if (score === 3) return { level: 3, label: "Forte", color: "#22c55e" };
    return { level: 4, label: "Muito Forte", color: "#10b981" };
  };

  const strength = passwordStrength();

  const validateForm = () => {
    if (!fullName.trim()) { setError("Nome completo é obrigatório"); return false; }
    if (!nickname.trim()) { setError("Nickname é obrigatório"); return false; }
    if (!email.trim()) { setError("Email é obrigatório"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Email inválido"); return false; }
    if (!password) { setError("Senha é obrigatória"); return false; }
    if (password.length < 6) { setError("Senha deve ter pelo menos 6 caracteres"); return false; }
    if (password !== confirmPassword) { setError("As senhas não coincidem"); return false; }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/usuarios/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          senha: password,
          perfil: "ROLE_USER",
          nome: fullName.trim(),
          nickname: nickname.trim(),
        }),
      });

      const data = await response.text();
      
      if (!response.ok) {
        throw new Error(data || "Erro ao cadastrar");
      }

      // Auto-login after registration
      const loginResponse = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha: password }),
      });
      
      const token = await loginResponse.text();
      if (loginResponse.ok) {
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token);
        
        // Callback para o App
        if (onLoginSuccess) {
          onLoginSuccess(token);
        }
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
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

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg">
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
            <p className="text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mt-2 tracking-wider">Crie sua conta de competidor</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-['JetBrains_Mono']" 
                style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444" }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name & Nickname row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-2 tracking-wider">NOME COMPLETO</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b9a]/50 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); if (error) setError(""); }}
                    placeholder="João Silva"
                    className="w-full bg-[#07070f] border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white placeholder:text-[#6b6b9a]/40 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-2 tracking-wider">NICKNAME</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b9a]/50 pointer-events-none" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => { setNickname(e.target.value.slice(0, 20)); if (error) setError(""); }}
                    placeholder="joaosilva"
                    maxLength={20}
                    className="w-full bg-[#07070f] border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white placeholder:text-[#6b6b9a]/40 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

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
                  minLength={6}
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
              
              {/* Password Strength */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${strength.level * 25}%`, 
                          backgroundColor: strength.color 
                        }} 
                      />
                    </div>
                    <span className="text-xs font-['JetBrains_Mono'] font-medium" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-2 tracking-wider">CONFIRMAR SENHA</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b9a]/50 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(""); }}
                  placeholder="••••••••"
                  className="w-full bg-[#07070f] border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white placeholder:text-[#6b6b9a]/40 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-xs font-['JetBrains_Mono'] text-[#ef4444] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  As senhas não coincidem
                </p>
              )}
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
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Criar Conta</span>
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-[#6b6b9a] mt-6">
            Já tem conta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-['JetBrains_Mono'] font-medium hover:text-white transition-colors"
              style={{ color: "#c4b5fd" }}
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}