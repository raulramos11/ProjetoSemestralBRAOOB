import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './TournamentDetail.css';

export default function TournamentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [tournament, setTournament] = useState(null);
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showInscriptionModal, setShowInscriptionModal] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetchTournament();
        fetchInscriptions();
        if (isAuthenticated) fetchTeams();
    }, [id, isAuthenticated]);

    const fetchTournament = async () => {
        try {
            const data = await api.getTournament(id);
            setTournament(data);
        } catch (err) {
            setError('Erro ao carregar torneio');
        } finally {
            setLoading(false);
        }
    };

    const fetchInscriptions = async () => {
        try {
            const data = await api.getInscriptionsByTournament(id, 'APROVADO');
            setInscriptions(data);
        } catch (err) {
            console.error('Erro ao carregar inscrições:', err);
        }
    };

    const fetchTeams = async () => {
        try {
            const data = await api.getTeams();
            setTeams(data);
        } catch (err) {
            console.error('Erro ao carregar equipes:', err);
        }
    };

    const handleInscribe = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!user.equipe && teams.length > 0 && !selectedTeamId) {
            setShowInscriptionModal(true);
            return;
        }

        try {
            await api.createInscription({
                torneio: { idTorneio: parseInt(id) },
                jogador: { idUsuario: user.idUsuario },
                ...(selectedTeamId && { equipe: { idEquipe: parseInt(selectedTeamId) } })
            });
            alert('Inscrição realizada com sucesso! Aguardando aprovação.');
            setShowInscriptionModal(false);
            fetchInscriptions();
        } catch (err) {
            alert(err.message || 'Erro ao inscrever');
        }
    };

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!tournament) return <div className="error">Torneio não encontrado</div>;

    const isAdmin = user?.perfil === 'ROLE_ADMIN';
    const isCreator = user && tournament.criador?.idUsuario === user.idUsuario;

    return (
        <div className="tournament-detail">
            <div className="container">
                <div className="tournament-header">
                    <h1>{tournament.nome}</h1>
                    <div className="tournament-meta">
                        <span className="badge">{tournament.jogo?.titulo}</span>
                        <span className="prize">Premiação: R$ {tournament.premiacaoTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span className="date">Criado em: {new Date(tournament.dataCriacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>

                <div className="tournament-actions">
                    {isAuthenticated && !isAdmin && (
                        <button className="btn-primary" onClick={handleInscribe} disabled={showInscriptionModal}>
                            {showInscriptionModal ? 'Selecione a equipe...' : 'Inscrever-se'}
                        </button>
                    )}
                    {isAdmin && isCreator && (
                        <div className="admin-actions">
                            <button className="btn-secondary">Gerenciar Partidas</button>
                            <button className="btn-secondary">Ver Inscrições Pendentes</button>
                        </div>
                    )}
                </div>

                {showInscriptionModal && (
                    <div className="modal-overlay" onClick={() => setShowInscriptionModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Inscrever com Equipe</h3>
                            <p>Selecione a equipe para inscrição:</p>
                            <select value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)} className="team-select">
                                <option value="">-- Jogar solo --</option>
                                {teams.map(team => (
                                    <option key={team.idEquipe} value={team.idEquipe}>{team.nomeEquipe} ({team.tagEquipe})</option>
                                ))}
                            </select>
                            <div className="modal-actions">
                                <button className="btn-primary" onClick={handleInscribe} disabled={!selectedTeamId && teams.length > 0}>Confirmar</button>
                                <button className="btn-secondary" onClick={() => setShowInscriptionModal(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="tournament-content">
                    <section className="inscriptions-section">
                        <h2>Inscritos ({inscriptions.length})</h2>
                        {inscriptions.length === 0 ? (
                            <p className="empty-state">Nenhum inscrito aprovado ainda.</p>
                        ) : (
                            <div className="inscriptions-grid">
                                {inscriptions.map(inc => (
                                    <div key={inc.idInscricao} className="inscription-card">
                                        <div className="player-info">
                                            <span className="player-name">{inc.jogador?.nickname}</span>
                                            <span className="player-realname">{inc.jogador?.nome}</span>
                                        </div>
                                        {inc.equipe && (
                                            <span className="team-tag">{inc.equipe.tagEquipe} - {inc.equipe.nomeEquipe}</span>
                                        )}
                                        <span className="status-badge status-{inc.status.toLowerCase()}">{inc.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="matches-section">
                        <h2>Partidas</h2>
                        <p className="empty-state">Funcionalidade de partidas em desenvolvimento.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}