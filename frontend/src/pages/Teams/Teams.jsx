import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Teams.css';

export default function Teams() {
    const { user, isAuthenticated } = useAuth();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeam, setNewTeam] = useState({ nomeEquipe: '', tagEquipe: '', paisOrigem: 'Brasil' });
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const data = await api.getTeams();
            setTeams(data);
        } catch (err) {
            setError('Erro ao carregar equipes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setCreateError('');

        if (!newTeam.nomeEquipe.trim() || !newTeam.tagEquipe.trim()) {
            setCreateError('Nome da equipe e tag são obrigatórios');
            return;
        }

        if (newTeam.tagEquipe.length > 10) {
            setCreateError('Tag deve ter no máximo 10 caracteres');
            return;
        }

        try {
            await api.createTeam(newTeam);
            alert('Equipe criada com sucesso!');
            setShowCreateModal(false);
            setNewTeam({ nomeEquipe: '', tagEquipe: '', paisOrigem: 'Brasil' });
            fetchTeams();
        } catch (err) {
            setCreateError(err.message || 'Erro ao criar equipe (tag pode já existir)');
        }
    };

    const isAdmin = user?.perfil === 'ROLE_ADMIN';

    if (loading) return <div className="loading">Carregando equipes...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="teams-page">
            <div className="container">
                <div className="page-header">
                    <h1>Equipes</h1>
                    {isAuthenticated && (
                        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                            + Nova Equipe
                        </button>
                    )}
                </div>

                {teams.length === 0 ? (
                    <div className="empty-state">
                        <p>Nenhuma equipe cadastrada.</p>
                        {isAuthenticated && <p>Clique em "Nova Equipe" para criar a primeira.</p>}
                    </div>
                ) : (
                    <div className="teams-grid">
                        {teams.map(team => (
                            <div key={team.idEquipe} className="team-card">
                                <div className="team-header">
                                    <div className="team-tag-badge">{team.tagEquipe}</div>
                                    <div className="team-flag">{getFlagEmoji(team.paisOrigem)}</div>
                                </div>
                                <h3 className="team-name">{team.nomeEquipe}</h3>
                                <p className="team-country">{team.paisOrigem}</p>
                            </div>
                        ))}
                    </div>
                )}

                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>Criar Nova Equipe</h2>
                            <form onSubmit={handleCreateTeam}>
                                {createError && <div className="error-message">{createError}</div>}
                                <div className="form-group">
                                    <label>Nome da Equipe *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Team Alpha"
                                        value={newTeam.nomeEquipe}
                                        onChange={(e) => setNewTeam({ ...newTeam, nomeEquipe: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tag (máx. 10 chars) *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: ALPH"
                                        value={newTeam.tagEquipe}
                                        onChange={(e) => setNewTeam({ ...newTeam, tagEquipe: e.target.value.toUpperCase() })}
                                        maxLength={10}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>País de Origem</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Brasil"
                                        value={newTeam.paisOrigem}
                                        onChange={(e) => setNewTeam({ ...newTeam, paisOrigem: e.target.value })}
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="submit" className="btn-primary">Criar</button>
                                    <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getFlagEmoji(country) {
    const flags = {
        'Brasil': '🇧🇷',
        'Argentina': '🇦🇷',
        'Chile': '🇨🇱',
        'EUA': '🇺🇸',
        'USA': '🇺🇸',
        'Estados Unidos': '🇺🇸',
    };
    return flags[country] || '🏳️';
}