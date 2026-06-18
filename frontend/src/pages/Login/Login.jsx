import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

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
            // Redirect based on role
            if (userData.perfil === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
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