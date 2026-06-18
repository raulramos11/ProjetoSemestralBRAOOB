import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        const errors = [];
        
        if (!fullName.trim()) errors.push('Nome completo é obrigatório');
        if (!nickname.trim()) errors.push('Nickname é obrigatório');
        if (!email.trim()) errors.push('Email é obrigatório');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.trim() && !emailRegex.test(email)) errors.push('Email inválido');
        
        if (!password) errors.push('Senha é obrigatória');
        if (password.length < 6) errors.push('Senha deve ter pelo menos 6 caracteres');
        if (password !== confirmPassword) errors.push('Senhas não coincidem');
        
        if (errors.length > 0) {
            setError(errors.join('. '));
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            await register({
                nome: fullName.trim(),
                nickname: nickname.trim(),
                email: email.trim(),
                senha: password,
                perfil: "ROLE_USER"
            });
            alert('Cadastro realizado com sucesso! Redirecionando para login...');
            navigate('/login');
        } catch (err) {
            const msg = err.message || 'Erro ao cadastrar';
            if (msg.includes('já cadastrado') || msg.includes('409')) {
                setError('Este email já está cadastrado');
            } else if (msg.includes('Network') || msg.includes('fetch')) {
                setError('Erro de conexão. Verifique se o backend está rodando.');
            } else {
                setError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = () => {
        if (!password) return { level: 0, label: '', color: '' };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score <= 1) return { level: 1, label: 'Fraca', color: '#ef4444' };
        if (score === 2) return { level: 2, label: 'Média', color: '#f59e0b' };
        if (score === 3) return { level: 3, label: 'Forte', color: '#22c55e' };
        return { level: 4, label: 'Muito Forte', color: '#10b981' };
    };

    const strength = passwordStrength();

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
                    <p className="subtitle">Crie sua conta de competidor</p>
                </div>

                <form onSubmit={handleRegister} className="auth-form" noValidate>
                    <h2>Nova Conta</h2>

                    {error && <div className="error-message" role="alert">{error}</div>}

                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="fullName">Nome Completo</label>
                            <input
                                id="fullName"
                                type="text"
                                autoComplete="name"
                                placeholder="João Silva"
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                    if (error) setError('');
                                }}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="nickname">Nickname</label>
                            <input
                                id="nickname"
                                type="text"
                                autoComplete="username"
                                placeholder="joaosilva"
                                value={nickname}
                                onChange={(e) => {
                                    setNickname(e.target.value);
                                    if (error) setError('');
                                }}
                                required
                                disabled={isLoading}
                                minLength={3}
                                maxLength={20}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="regEmail">Email</label>
                        <input
                            id="regEmail"
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
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="regPassword">Senha</label>
                        <div className="password-wrapper">
                            <input
                                id="regPassword"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                required
                                disabled={isLoading}
                                minLength={6}
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
                        {password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div 
                                        className="strength-fill" 
                                        style={{ 
                                            width: `${strength.level * 25}%`, 
                                            backgroundColor: strength.color 
                                        }} 
                                    />
                                </div>
                                <span className="strength-label" style={{ color: strength.color }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (error) setError('');
                            }}
                            required
                            disabled={isLoading}
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <span className="field-error">As senhas não coincidem</span>
                        )}
                    </div>

                    <button type="submit" className="btn-gradient" disabled={isLoading}>
                        {isLoading ? 'Criando conta...' : 'CRIAR CONTA'}
                    </button>

                    <p className="switch-auth">
                        Já tem conta? <span onClick={() => navigate('/login')}>Entrar</span>
                    </p>
                </form>
            </div>
        </div>
    );
}