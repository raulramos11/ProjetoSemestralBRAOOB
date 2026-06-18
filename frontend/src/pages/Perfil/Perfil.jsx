import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Perfil.css';

export default function Perfil() {
    const { user, isAuthenticated, updateUser, refreshUser, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        nickname: '',
        fotoPerfil: ''
    });
    const [passwordData, setPasswordData] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('perfil');

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData({
                nome: user.nome || '',
                nickname: user.nickname || '',
                fotoPerfil: user.fotoPerfil || ''
            });
            setLoading(false);
        } else if (!isAuthenticated) {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaveError('');
        setSaveSuccess('');

        try {
            const updated = await updateUser({
                nome: formData.nome,
                nickname: formData.nickname,
                fotoPerfil: formData.fotoPerfil
            });
            setSaveSuccess('Perfil atualizado com sucesso!');
            refreshUser();
            setEditMode(false);
        } catch (err) {
            setSaveError(err.message || 'Erro ao atualizar perfil');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSaveError('');
        setSaveSuccess('');

        if (passwordData.novaSenha !== passwordData.confirmarSenha) {
            setSaveError('As novas senhas não coincidem');
            return;
        }

        if (passwordData.novaSenha.length < 6) {
            setSaveError('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            await updateUser({ senha: passwordData.novaSenha });
            setSaveSuccess('Senha alterada com sucesso!');
            setPasswordData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
        } catch (err) {
            setSaveError(err.message || 'Erro ao alterar senha (senha atual incorreta?)');
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    if (loading) return <div className="loading">Carregando perfil...</div>;
    if (!isAuthenticated) return <div className="error">Você precisa estar logado para acessar esta página.</div>;

    const roleLabels = {
        ROLE_ADMIN: { label: 'ADMINISTRADOR', color: 'var(--color-danger)' },
        ROLE_USER: { label: 'JOGADOR', color: 'var(--color-primary)' },
        ROLE_SUPORTE: { label: 'SUPORTE', color: 'var(--color-warning)' }
    };
    const roleInfo = roleLabels[user?.perfil] || { label: user?.perfil, color: 'var(--color-text-muted)' };

    return (
        <div className="perfil-page">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-banner" style={{ backgroundImage: user?.fotoPerfil ? `url(${user.fotoPerfil})` : 'none' }} />
                    <div className="profile-info">
                        <div className="avatar-wrapper">
                            {user?.fotoPerfil ? (
                                <img src={user.fotoPerfil} alt={user.nickname} className="avatar" />
                            ) : (
                                <div className="avatar-placeholder">{user?.nickname?.[0]?.toUpperCase() || '?'}</div>
                            )}
                            {editMode && (
                                <label className="avatar-edit-label">
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setFormData(prev => ({ ...prev, fotoPerfil: reader.result }));
                                            reader.readAsDataURL(file);
                                        }
                                    }} style={{ display: 'none' }} />
                                    <span className="edit-icon">✎</span>
                                </label>
                            )}
                        </div>
                        <div className="profile-meta">
                            <h1>{user?.nickname}</h1>
                            <p className="real-name">{user?.nome}</p>
                            <p className="email">{user?.email}</p>
                            <span className="role-badge" style={{ background: roleInfo.color }}>
                                {roleInfo.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button className={activeTab === 'perfil' ? 'active' : ''} onClick={() => setActiveTab('perfil')}>
                        Perfil
                    </button>
                    <button className={activeTab === 'senha' ? 'active' : ''} onClick={() => setActiveTab('senha')}>
                        Segurança
                    </button>
                    {user?.perfil === 'ROLE_ADMIN' && (
                        <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}>
                            Admin
                        </button>
                    )}
                </div>

                <div className="profile-content">
                    {activeTab === 'perfil' && (
                        <div className="tab-content">
                            {editMode ? (
                                <form onSubmit={handleSaveProfile} className="profile-form">
                                    {saveError && <div className="alert error">{saveError}</div>}
                                    {saveSuccess && <div className="alert success">{saveSuccess}</div>}

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="nome">Nome Completo *</label>
                                            <input
                                                id="nome"
                                                name="nome"
                                                type="text"
                                                value={formData.nome}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nickname">Apelido (Nickname) *</label>
                                            <input
                                                id="nickname"
                                                name="nickname"
                                                type="text"
                                                value={formData.nickname}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="fotoPerfil">URL da Foto de Perfil</label>
                                        <input
                                            id="fotoPerfil"
                                            name="fotoPerfil"
                                            type="url"
                                            value={formData.fotoPerfil}
                                            onChange={handleInputChange}
                                            placeholder="https://exemplo.com/foto.jpg"
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" className="btn-secondary" onClick={() => { setEditMode(false); setFormData({ nome: user?.nome, nickname: user?.nickname, fotoPerfil: user?.fotoPerfil }); }}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-primary">Salvar Alterações</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-view">
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Nome Completo</span>
                                            <span className="info-value">{user?.nome || 'Não informado'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Apelido</span>
                                            <span className="info-value">{user?.nickname}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Email</span>
                                            <span className="info-value">{user?.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Função</span>
                                            <span className="info-value">
                                                <span className="role-badge" style={{ background: roleInfo.color }}>{roleInfo.label}</span>
                                            </span>
                                        </div>
                                        {user?.equipe && (
                                            <div className="info-item">
                                                <span className="info-label">Equipe</span>
                                                <span className="info-value">
                                                    {user.equipe.nomeEquipe} ({user.equipe.tagEquipe})
                                                </span>
                                            </div>
                                        )}
                                        {user?.elo !== undefined && (
                                            <div className="info-item">
                                                <span className="info-label">ELO</span>
                                                <span className="info-value elo-value">{user.elo}</span>
                                            </div>
                                        )}
                                        {user?.vitorias !== undefined && (
                                            <div className="info-item">
                                                <span className="info-label">Vitórias / Derrotas / Empates</span>
                                                <span className="info-value">{user.vitorias} / {user.derrotas} / {user.empates}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="profile-actions">
                                        <button className="btn-primary" onClick={() => setEditMode(true)}>Editar Perfil</button>
                                        <button className="btn-danger" onClick={handleLogout}>Sair</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'senha' && (
                        <div className="tab-content">
                            <form onSubmit={handleChangePassword} className="profile-form">
                                {saveError && <div className="alert error">{saveError}</div>}
                                {saveSuccess && <div className="alert success">{saveSuccess}</div>}

                                <div className="form-group">
                                    <label htmlFor="senhaAtual">Senha Atual *</label>
                                    <input
                                        id="senhaAtual"
                                        name="senhaAtual"
                                        type="password"
                                        value={passwordData.senhaAtual}
                                        onChange={handlePasswordChange}
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="novaSenha">Nova Senha *</label>
                                    <input
                                        id="novaSenha"
                                        name="novaSenha"
                                        type="password"
                                        value={passwordData.novaSenha}
                                        onChange={handlePasswordChange}
                                        required
                                        autoComplete="new-password"
                                        minLength={6}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmarSenha">Confirmar Nova Senha *</label>
                                    <input
                                        id="confirmarSenha"
                                        name="confirmarSenha"
                                        type="password"
                                        value={passwordData.confirmarSenha}
                                        onChange={handlePasswordChange}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">Alterar Senha</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'admin' && user?.perfil === 'ROLE_ADMIN' && (
                        <div className="tab-content">
                            <h2>Painel Administrativo</h2>
                            <p className="admin-notice">Funcionalidades de admin em desenvolvimento.</p>
                            <div className="admin-links">
                                <a href="/admin" className="btn-primary">Ir para Dashboard Admin</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}