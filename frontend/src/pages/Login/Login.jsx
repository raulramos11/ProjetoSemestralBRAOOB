import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || '/profile';

    const validateForm = () => {
        if (!email.trim()) {
            setError('Email é obrigatório');
            return false;
        }
        if (!password) {
            setError('Senha é obrigatória');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email inválido');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        setIsLoading(true);

        try {
            const userData = await login(email.trim(), password);
            navigate(from, { replace: true });
        } catch (err) {
            const msg = err.message || 'Erro ao fazer login';
            if (msg.includes('401') || msg.includes('não encontrado') || msg.includes('incorreta')) {
                setError('Email ou senha incorretos');
            } else if (msg.includes('Network') || msg.includes('fetch')) {
                setError('Erro de conexão. Verifique se o backend está rodando.');
            } else {
                setError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="bg-grid" />
                <div className="bg-glow" />
                <div className="bg-particles">
                    <span style={{ top: '10%', left: '10%', animationDelay: '0s' }} />
                    <span style={{ top: '20%', left: '80%', animationDelay: '2s' }} />
                    <span style={{ top: '40%', left: '20%', animationDelay: '4s' }} />
                    <span style={{ top: '60%', left: '70%', animationDelay: '1s' }} />
                    <span style={{ top: '80%', left: '30%', animationDelay: '3s' }} />
                    <span style={{ top: '30%', left: '50%', animationDelay: '5s' }} />
                    <span style={{ top: '70%', left: '10%', animationDelay: '2.5s' }} />
                    <span style={{ top: '90%', left: '90%', animationDelay: '1.5s' }} />
                </div>
            </div>
            <div className="auth-box">
                <div className="logo-section">
                    <h1 className="logo-text">RANK IT UP!</h1>
                    <p className="subtitle">Entre para elevar seu jogo</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form" noValidate>
                    <h2>Bem-vindo de Volta</h2>

                    {error && <div className="error-message" role="alert">{error}</div>}

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            required
                            disabled={isLoading}
                            aria-describedby="email-error"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                required
                                disabled={isLoading}
                                aria-describedby="password-error"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                aria-pressed={showPassword}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <a href="#forgot" className="forgot-link">Esqueci a senha</a>
                    </div>

                    <button type="submit" className="btn-gradient" disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'ENTRAR'}
                    </button>

                    <div className="divider"><span>OU continue com</span></div>

                    <div className="social-icons">
                        <button type="button" className="social-btn" disabled>Google</button>
                        <button type="button" className="social-btn" disabled>Steam</button>
                        <button type="button" className="social-btn" disabled>Discord</button>
                    </div>

                    <p className="switch-auth">
                        Não tem conta? <span onClick={() => navigate('/register')}>Cadastre-se</span>
                    </p>
                </form>
            </div>
        </div>
    );
}