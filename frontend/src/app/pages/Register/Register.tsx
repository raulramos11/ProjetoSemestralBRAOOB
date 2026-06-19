import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const validateForm = () => {
    if (!fullName.trim()) return "Nome completo é obrigatório";
    if (!nickname.trim()) return "Nickname é obrigatório";
    if (nickname.trim().length < 3) return "Nickname deve ter pelo menos 3 caracteres";
    if (!email.trim()) return "E-mail é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "E-mail inválido";
    if (!password) return "Senha é obrigatória";
    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (password !== confirmPassword) return "As senhas não coincidem";
    return null;
  };

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/usuarios/cadastro`, {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar");
      }

      // Login automático após cadastro
      const loginAfter successfulRegistration(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar";
      if (message.includes("já cadastrado") || message.includes("409")) {
        setError("Este e-mail já está cadastrado");
      } else if (message.includes("Network") || message.includes("fetch")) {
        setError("Erro de conexão. Verifique se o backend está rodando.");
      } else {
        setError(message);
      }
      setIsLoading(false);
    }
  };

  const successfulRegistration = async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cadastro OK, mas falha no login automático");
      }

      onLoginSuccess(data);
      navigate("/dashboard");
    } catch (err) {
      // Se login automático falhar, redireciona para login
      alert("Cadastro realizado! Redirecionando para login...");
      navigate("/login");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}>
      <div className="bg-[#0d0d1c] border border-[#7c3aed]/30 rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Chakra_Petch'] text-xl font-bold text-white">Criar Conta</h2>
            <p className="text-xs text-[#6b6b9a] mt-1">Junte-se à comunidade Rank It Up!</p>
          </div>
          <button onClick={() => navigate("/")} className="text-[#6b6b9a] hover:text-white transition-colors">
            <Shield className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-xs text-[#ef4444] font-['JetBrains_Mono'] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-1.5 tracking-wider">NOME COMPLETO</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b9a]" />
                <input
                  value={fullName}
                  onChange={e => { setFullName(e.target.value); if (error) setError(""); }}
                  className="w-full bg-[#07070f] border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:border-[#7c3aed] outline-none transition-colors pl-10"
                  placeholder="João Silva"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-1.5 tracking-wider">NICKNAME</label>
              <input
                value={nickname}
                onChange={e => { setNickname(e.target.value.slice(0, 20)); if (error) setError(""); }}
                className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#7c3aed] outline-none transition-colors uppercase"
                placeholder="JOGADOR"
                required
                disabled={isLoading}
                maxLength={20}
                minLength={3}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-1.5 tracking-wider">E-MAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b9a]" />
              <input
                value={email}
                onChange={e => { setEmail(e.target.value); if (error) setError(""); }}
                className="w-full bg-[#07070f] border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:border-[#7c3aed] outline-none transition-colors pl-10"
                placeholder="seu@email.com"
                type="email"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-1.5 tracking-wider">SENHA</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b9a]" />
              <input
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full bg-[#07070f] border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:border-[#7c3aed] outline-none transition-colors pl-10 pr-10"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b9a] hover:text-white transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password && (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 bg-white/5 rounded-full h-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${strength.level * 25}%`, background: strength.color }}
                  />
                </div>
                <span className="text-xs font-['JetBrains_Mono']" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-['JetBrains_Mono'] text-[#6b6b9a] mb-1.5 tracking-wider">CONFIRMAR SENHA</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b9a]" />
              <input
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); if (error) setError(""); }}
                className="w-full bg-[#07070f] border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:border-[#7c3aed] outline-none transition-colors pl-10"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <span className="text-[10px] text-[#ef4444] font-['JetBrains_Mono'] mt-1 block">
                As senhas não coincidem
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
          >
            {isLoading ? "Criando conta..." : <><Shield className="w-4 h-4" /> Criar Conta</>}
          </button>
        </form>

        <p className="text-center text-sm text-[#6b6b9a] mt-6">
          Já tem conta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#7c3aed] hover:text-[#c4b5fd] cursor-pointer font-medium transition-colors"
          >
            Entrar
          </span>
        </p>

        <div className="mt-4 p-3 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-xl">
          <p className="text-[10px] font-['JetBrains_Mono'] text-[#6b6b9a]/80 leading-5">
            O cadastro cria um jogador com ELO inicial 1500 (Silver)
          </p>
        </div>
      </div>
    </div>
  );
}