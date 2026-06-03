import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';

export default function Register() {
    const navigate = useNavigate();

    // Estados para capturar os inputs do formulário
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }


        const novoUsuario = {
            email: email,
            senha: password,
            perfil: "ROLE_USER" // 🌟 CORRIGIDO PARA BATER COM O ENUM DO JAVA
        };

        try {
            // ⚠️ Certifique-se de alinhar a URL abaixo com a rota do seu Controller no Java (ex: /api/usuarios ou /auth/register)
            const response = await fetch('http://localhost:8080/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoUsuario),
            });

            if (response.ok) {
                alert("Cadastro realizado com sucesso no MySQL!");
                navigate('/login');
            } else {
                alert("Erro ao cadastrar. Verifique o console do Spring Boot.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Não foi possível conectar ao servidor backend.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box" style={{ maxWidth: '550px' }}>
                <div className="logo-section">
                    <h1 className="logo-text">RANK IT UP!</h1>
                </div>

                <form onSubmit={handleRegister} className="auth-form">
                    <h2 style={{ marginBottom: '30px' }}>Create Your Competitor Account</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

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
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-gradient" style={{ marginTop: '20px' }}>Create Account</button>

                    <p className="switch-auth" style={{ marginTop: '20px' }}>
                        Already have an account? <span onClick={() => navigate('/login')}>Log in.</span>
                    </p>
                </form>
            </div>
        </div>
    );
}