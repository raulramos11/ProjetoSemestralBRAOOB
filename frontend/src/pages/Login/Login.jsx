import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulação de login indo para o Dashboard
        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="logo-section">
                    <h1 className="logo-text">RANK IT UP!</h1>
                    <p className="subtitle">Sign in to elevate your game</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    <h2>Welcome Back</h2>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="alex.smith@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <a href="#forgot" className="forgot-link">Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn-gradient">LOGIN</button>

                    <div className="divider"><span>OR Continue with</span></div>

                    <div className="social-icons">
                        <button type="button" className="social-btn">Google</button>
                        <button type="button" className="social-btn">Steam</button>
                        <button type="button" className="social-btn">PlayStation</button>
                    </div>

                    <p className="switch-auth">
                        Don't have an account? <span onClick={() => navigate('/register')}>Sign Up</span>
                    </p>
                </form>
            </div>
        </div>
    );
}