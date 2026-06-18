import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Dashboard.css';

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentMatches, setRecentMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Get user stats from inscriptions
            const inscriptions = await api.getInscriptions();
            const userInscriptions = inscriptions.filter(i => i.jogador?.idUsuario === user?.idUsuario);
            
            let totalPontos = 0;
            let totalVitorias = 0;
            let totalDerrotas = 0;
            let totalEmpates = 0;

            userInscriptions.forEach(inc => {
                totalPontos += inc.pontosAcumulados || 0;
                totalVitorias += inc.vitoriasTotais || 0;
            });

            // Calculate win rate
            const totalGames = totalVitorias + totalDerrotas + totalEmpates;
            const winRate = totalGames > 0 ? Math.round((totalVitorias / totalGames) * 100) : 0;

            setStats({
                pontos: totalPontos,
                vitorias: totalVitorias,
                winRate: winRate,
                inscricoes: userInscriptions.length
            });

            // For recent matches, we'd need a separate endpoint
            // For now, show empty state
            setRecentMatches([]);
        } catch (err) {
            setError('Erro ao carregar dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Carregando dashboard...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!isAuthenticated) return <div className="error">Você precisa estar logado.</div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Meu Dashboard</h1>
                    <p className="welcome-text">Bem-vindo, {user?.nickname}!</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon pontos">
                            <span>🏆</span>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Pontos Totais</span>
                            <span className="stat-value">{stats?.pontos || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon vitorias">
                            <span>⚔️</span>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Vitórias</span>
                            <span className="stat-value">{stats?.vitorias || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon winrate">
                            <span>📊</span>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Taxa de Vitória</span>
                            <span className="stat-value">{stats?.winRate || 0}%</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon inscricoes">
                            <span>🎫</span>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Torneios Inscrito</span>
                            <span className="stat-value">{stats?.inscricoes || 0}</span>
                        </div>
                    </div>
                </div>

                <section className="recent-section">
                    <div className="section-header">
                        <h2>Minhas Inscrições Recentes</h2>
                        <a href="/tournaments" className="view-all">Ver todos</a>
                    </div>

                    {recentMatches.length === 0 && stats?.inscricoes === 0 ? (
                        <div className="empty-state">
                            <p>Nenhuma inscrição ainda.</p>
                            <a href="/tournaments" className="btn-primary">Explorar Torneios</a>
                        </div>
                    ) : (
                        <div className="inscriptions-list">
                            {/* This would show user's inscriptions */}
                            <p className="empty-state">Suas inscrições aparecerão aqui após participar de torneios.</p>
                        </div>
                    )}
                </section>

                <section className="recent-section">
                    <div className="section-header">
                        <h2>Últimas Partidas</h2>
                    </div>
                    <div className="empty-state">
                        <p>Histórico de partidas será exibido aqui.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}