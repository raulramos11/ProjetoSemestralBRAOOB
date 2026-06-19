import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      onLoginSuccess(data);
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao fazer login";
      if (message.includes("não encontrado") || message.includes("incorreta") || message.includes("401")) {
        setError("E-mail ou senha incorretos");
      } else if (message.includes("Network") || message.includes("fetch")) {
        setError("Erro de conexão. Verifique se o backend está rodando.");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}>
      <div className="bg-[#0d0d1c] border border-[#7c3aed]/30 rounded-2xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Chakra_Petch'] text-xl font-bold text-white">Entrar</h2>
            <p className="text-xs text-[#6b6b9a] mt-1">Acesse sua conta de competidor</p>
          </div>
          <button onClick={() => navigate("/")} className="text-[#6b6b9a] hover:text-white transition-colors">
            <Shield className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-xs text-[#ef4444] font-['JetBrains_Mono'] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </div>
          )}

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
                onChange={e => { setPassword(e.target.value); if (error) setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin(e)}
                className="w-full bg-[#07070f] border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:border-[#7c3aed] outline-none transition-colors pl-10 pr-10"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
          >
            {isLoading ? "Entrando..." : <><Shield className="w-4 h-4" /> Entrar</>}
          </button>
        </form>

        <p className="text-center text-sm text-[#6b6b9a] mt-6">
          Não tem conta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#7c3aed] hover:text-[#c4b5fd] cursor-pointer font-medium transition-colors"
          >
            Cadastre-se
          </span>
        </p>

        <div className="mt-4 p-3 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-xl">
          <p className="text-[10px] font-['JetBrains_Mono'] text-[#6b6b9a]/80 leading-5">
            <strong className="text-[#7c3aed]">Demo:</strong> admin@rankitup.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}