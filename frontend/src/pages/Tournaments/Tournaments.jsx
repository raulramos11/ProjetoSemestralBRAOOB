import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Tournaments.css';

export default function Tournaments() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTournament, setNewTournament] = useState({
        nome: '',
        premiacaoTotal: '',
        idJogo: '',
        dataInicio: '',
        dataFim: '',
        formato: 'ELIMINACAO_SIMPLES',
        maxEquipes: 16,
        descricao: '',
        regras: ''
    });
    const [games, setGames] = useState([]);
    const [createError, setCreateError] = useState('');

    const formatos = [
        { value: 'ELIMINACAO_SIMPLES', label: 'Eliminação Simples' },
        { value: 'ELIMINACAO_DUPLA', label: 'Eliminação Dupla' },
        { value: 'GRUPOS_ELIMINACAO', label: 'Fase de Grupos + Eliminação' },
        { value: 'SUICO', label: 'Suiço (Swiss)' },
        { value: 'LIGA', label: 'Liga (Todos contra Todos)' }
    ];

    useEffect(() => {
        fetchTournaments();
        fetchGames();
    }, []);

    const fetchTournaments = async () => {
        try {
            const data = await api.getTournaments();
            setTournaments(data);
        } catch (err) {
            setError('Erro ao carregar torneios');
        } finally {
            setLoading(false);
        }
    };

    const fetchGames = async () => {
        try {
            const data = await api.getGames();
            setGames(data);
        } catch (err) {
            console.error('Erro ao carregar jogos:', err);
        }
    };

    const handleCreateTournament = async (e) => {
        e.preventDefault();
        setCreateError('');

        if (!newTournament.nome.trim() || !newTournament.idJogo) {
            setCreateError('Nome e jogo são obrigatórios');
            return;
        }

        try {
            const tournamentData = {
                nome: newTournament.nome,
                premiacaoTotal: parseFloat(newTournament.premiacaoTotal) || 0,
                idJogo: parseInt(newTournament.idJogo),
                dataInicio: newTournament.dataInicio ? new Date(newTournament.dataInicio).toISOString() : null,
                dataFim: newTournament.dataFim ? new Date(newTournament.dataFim).toISOString() : null,
                formato: newTournament.formato,
                maxEquipes: parseInt(newTournament.maxEquipes) || 16,
                descricao: newTournament.descricao,
                regras: newTournament.regras
            };

            await api.createTournament(tournamentData);
            alert('Torneio criado com sucesso!');
            setShowCreateModal(false);
            setNewTournament({
                nome: '',
                premiacaoTotal: '',
                idJogo: '',
                dataInicio: '',
                dataFim: '',
                formato: 'ELIMINACAO_SIMPLES',
                maxEquipes: 16,
                descricao: '',
                regras: ''
            });
            fetchTournaments();
        } catch (err) {
            setCreateError(err.message || 'Erro ao criar torneio');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'A definir';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        if (!value || value === 0) return 'Sem premiação';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusConfig = (tournament) => {
        const now = new Date();
        const inicio = tournament.dataInicio ? new Date(tournament.dataInicio) : null;
        const fim = tournament.dataFim ? new Date(tournament.dataFim) : null;
        
        if (inicio && inicio > now) return { label: 'Inscrições Abertas', className: 'status-open' };
        if (inicio && fim && inicio <= now && fim >= now) return { label: 'Em Andamento', className: 'status-live' };
        if (fim && fim < now) return { label: 'Finalizado', className: 'status-finished' };
        return { label: 'A Definir', className: 'status-pending' };
    };

    const isAdmin = user?.perfil === 'ROLE_ADMIN';

    if (loading) return <div className="loading">Carregando torneios...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="tournaments-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Torneios</h1>
                        <p className="page-subtitle">Competições ativas, passadas e futuras</p>
                    </div>
                    {isAdmin && (
                        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                            <span className="btn-icon">+</span> Novo Torneio
                        </button>
                    )}
                </div>

                {tournaments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🏆</div>
                        <p>Nenhum torneio cadastrado.</p>
                        {isAdmin && <p>Clique em "Novo Torneio" para criar o primeiro.</p>}
                    </div>
                ) : (
                    <div className="tournaments-grid">
                        {tournaments.map(tournament => (
                            <TournamentCard 
                                key={tournament.idTorneio} 
                                tournament={tournament}
                                formatDate={formatDate}
                                formatCurrency={formatCurrency}
                                getStatusConfig={getStatusConfig}
                                onNavigate={navigate}
                            />
                        ))}
                    </div>
                )}

                {showCreateModal && (
                    <TournamentFormModal
                        title="Criar Novo Torneio"
                        tournament={newTournament}
                        onChange={setNewTournament}
                        onSubmit={handleCreateTournament}
                        onClose={() => setShowCreateModal(false)}
                        error={createError}
                        games={games}
                        formatos={formatos}
                    />
                )}
            </div>
        </div>
    );
}

function TournamentCard({ tournament, formatDate, formatCurrency, getStatusConfig, onNavigate }) {
    const status = getStatusConfig(tournament);
    
    return (
        <article className="tournament-card" onClick={() => onNavigate(`/tournaments/${tournament.idTorneio}`)}>
            {tournament.jogo?.bannerUrl && (
                <div 
                    className="tournament-banner"
                    style={{ backgroundImage: `url(${tournament.jogo.bannerUrl})` }}
                >
                    <div className="tournament-banner-overlay" />
                </div>
            )}
            <div className="tournament-content">
                <div className="tournament-header">
                    <span className={`status-badge ${status.className}`}>{status.label}</span>
                    {tournament.jogo && (
                        <span className="game-tag" style={{ backgroundImage: tournament.jogo.imagemUrl ? `url(${tournament.jogo.imagemUrl})` : 'none' }}>
                            {tournament.jogo.titulo}
                        </span>
                    )}
                </div>
                <h2 className="tournament-name">{tournament.nome}</h2>
                <div className="tournament-meta">
                    <div className="meta-item">
                        <span className="meta-icon">💰</span>
                        <span>{formatCurrency(tournament.premiacaoTotal)}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>Início: {formatDate(tournament.dataInicio)}</span>
                    </div>
                    {tournament.dataFim && (
                        <div className="meta-item">
                            <span className="meta-icon">🏁</span>
                            <span>Fim: {formatDate(tournament.dataFim)}</span>
                        </div>
                    )}
                    {tournament.formato && (
                        <div className="meta-item">
                            <span className="meta-icon">📋</span>
                            <span>{tournament.formato.replace(/_/g, ' ')}</span>
                        </div>
                    )}
                </div>
                <div className="tournament-footer">
                    <span className="view-detail">Ver detalhes →</span>
                </div>
            </div>
        </article>
    );
}

function TournamentFormModal({ title, tournament, onChange, onSubmit, onClose, error, games, formatos }) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={onSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-section">
                        <h3>Informações Básicas</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nome do Torneio *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Copa Brasil CS2 2026"
                                    value={tournament.nome}
                                    onChange={(e) => onChange({ ...tournament, nome: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Jogo *</label>
                                <select
                                    value={tournament.idJogo}
                                    onChange={(e) => onChange({ ...tournament, idJogo: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione um jogo</option>
                                    {games.map(game => (
                                        <option key={game.idJogo} value={game.idJogo}>{game.titulo}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Premiação Total (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={tournament.premiacaoTotal}
                                    onChange={(e) => onChange({ ...tournament, premiacaoTotal: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Máx. Equipes</label>
                                <input
                                    type="number"
                                    min="2"
                                    max="128"
                                    value={tournament.maxEquipes}
                                    onChange={(e) => onChange({ ...tournament, maxEquipes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Data de Início</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={tournament.dataInicio}
                                    onChange={(e) => onChange({ ...tournament, dataInicio: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Data de Término</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={tournament.dataFim}
                                    onChange={(e) => onChange({ ...tournament, dataFim: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Formato</label>
                            <select
                                value={tournament.formato}
                                onChange={(e) => onChange({ ...tournament, formato: e.target.value })}
                            >
                                {formatos.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Detalhes Adicionais</h3>
                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea
                                placeholder="Descreva o torneio, formato detalhado, prêmios por colocação..."
                                value={tournament.descricao || ''}
                                onChange={(e) => onChange({ ...tournament, descricao: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="form-group">
                            <label>Regras</label>
                            <textarea
                                placeholder="Regras específicas, mapas, configurações de servidor, horários..."
                                value={tournament.regras || ''}
                                onChange={(e) => onChange({ ...tournament, regras: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">
                            <span className="btn-icon">✓</span> Criar Torneio
                        </button>
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}