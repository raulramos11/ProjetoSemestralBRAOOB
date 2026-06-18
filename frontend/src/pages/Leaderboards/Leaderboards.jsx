import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Leaderboards.css';

export default function Leaderboards() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTournament, setSelectedTournament] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, [selectedTournament]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            if (selectedTournament) {
                const data = await api.getInscriptionsByTournament(selectedTournament, 'APROVADO');
                // Sort by pontos_acumulados desc, then vitorias_totais desc
                const sorted = [...data].sort((a, b) => {
                    if (b.pontosAcumulados !== a.pontosAcumulados) {
                        return b.pontosAcumulados - a.pontosAcumulados;
                    }
                    return b.vitoriasTotais - a.vitoriasTotais;
                });
                setLeaderboard(sorted);
            } else {
                const data = await api.getInscriptions();
                const sorted = [...data].sort((a, b) => {
                    if (b.pontosAcumulados !== a.pontosAcumulados) {
                        return b.pontosAcumulados - a.pontosAcumulados;
                    }
                    return b.vitoriasTotais - a.vitoriasTotais;
                });
                setLeaderboard(sorted);
            }
        } catch (err) {
            setError('Erro ao carregar leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchTournaments = async () => {
        try {
            const data = await api.getTournaments();
            return data;
        } catch (err) {
            return [];
        }
    };

    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        fetchTournaments().then(setTournaments);
    }, []);

    if (loading) return <div className="loading">Carregando leaderboard...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="leaderboards-page">
            <div className="container">
                <div className="page-header">
                    <h1>Leaderboards</h1>
                </div>

                <div className="tournament-filter">
                    <label htmlFor="tournament-select">Filtrar por Torneio:</label>
                    <select
                        id="tournament-select"
                        value={selectedTournament}
                        onChange={(e) => setSelectedTournament(e.target.value)}
                        className="tournament-select"
                    >
                        <option value="">Todos os Torneios (Ranking Geral)</option>
                        {tournaments.map(t => (
                            <option key={t.idTorneio} value={t.idTorneio}>{t.nome}</option>
                        ))}
                    </select>
                </div>

                {leaderboard.length === 0 ? (
                    <div className="empty-state">
                        <p>Nenhum dado de ranking disponível.</p>
                        {selectedTournament && <p>Nenhum inscrito aprovado neste torneio.</p>}
                    </div>
                ) : (
                    <div className="leaderboard-table-wrapper">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th className="rank-col">Rank</th>
                                    <th>Jogador</th>
                                    <th>Equipe</th>
                                    <th className="points-col">Pontos</th>
                                    <th className="wins-col">Vitórias</th>
                                    <th className="kd-col">Saldo Kills</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, index) => (
                                    <tr key={entry.idInscricao} className={index < 3 ? 'top-three' : ''}>
                                        <td className="rank-col">
                                            <span className={`rank-badge rank-${index + 1}`}>#{index + 1}</span>
                                        </td>
                                        <td>
                                            <div className="player-cell">
                                                <span className="player-nickname">{entry.jogador?.nickname}</span>
                                                <span className="player-name">{entry.jogador?.nome}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {entry.equipe ? (
                                                <span className="team-tag">{entry.equipe.tagEquipe}</span>
                                            ) : (
                                                <span className="no-team">Solo</span>
                                            )}
                                        </td>
                                        <td className="points-col">{entry.pontosAcumulados || 0}</td>
                                        <td className="wins-col">{entry.vitoriasTotais || 0}</td>
                                        <td className="kd-col">
                                            {entry.saldoKills >= 0 ? '+' : ''}
                                            {entry.saldoKills || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}