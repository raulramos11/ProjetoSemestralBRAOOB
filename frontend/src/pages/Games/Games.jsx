import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Games.css';

export default function Games() {
    const { user, isAuthenticated } = useAuth();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [newGame, setNewGame] = useState({ 
        titulo: '', 
        genero: 'FPS', 
        desenvolvedora: '',
        imagemUrl: '',
        bannerUrl: '',
        descricao: ''
    });
    const [createError, setCreateError] = useState('');

    const generos = ['FPS', 'MOBA', 'BATTLE_ROYALLE', 'SHOOTER', 'TABULEIRO'];

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const data = await api.getGames();
            setGames(data);
        } catch (err) {
            setError('Erro ao carregar jogos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGame = async (e) => {
        e.preventDefault();
        setCreateError('');

        if (!newGame.titulo.trim() || !newGame.desenvolvedora.trim()) {
            setCreateError('Título e desenvolvedora são obrigatórios');
            return;
        }

        try {
            await api.createGame(newGame);
            alert('Jogo criado com sucesso!');
            setShowCreateModal(false);
            setNewGame({ titulo: '', genero: 'FPS', desenvolvedora: '', imagemUrl: '', bannerUrl: '', descricao: '' });
            fetchGames();
        } catch (err) {
            setCreateError(err.message || 'Erro ao criar jogo');
        }
    };

    const handleUpdateGame = async (e) => {
        e.preventDefault();
        setCreateError('');

        try {
            await api.updateGame(editingGame.idJogo, editingGame);
            alert('Jogo atualizado com sucesso!');
            setEditingGame(null);
            fetchGames();
        } catch (err) {
            setCreateError(err.message || 'Erro ao atualizar jogo');
        }
    };

    const handleDeleteGame = async (gameId) => {
        if (!window.confirm('Tem certeza que deseja excluir este jogo?')) return;
        
        try {
            await api.deleteGame(gameId);
            alert('Jogo excluído com sucesso!');
            fetchGames();
        } catch (err) {
            alert(err.message || 'Erro ao excluir jogo');
        }
    };

    const openEditModal = (game) => {
        setEditingGame({ ...game });
        setCreateError('');
    };

    const isAdmin = user?.perfil === 'ROLE_ADMIN';

    if (loading) return <div className="loading">Carregando jogos...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="games-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Jogos Cadastrados</h1>
                        <p className="page-subtitle">Gerencie os jogos disponíveis para torneios</p>
                    </div>
                    {isAdmin && (
                        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                            <span className="btn-icon">+</span> Novo Jogo
                        </button>
                    )}
                </div>

                {games.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎮</div>
                        <p>Nenhum jogo cadastrado.</p>
                        {isAdmin && <p>Clique em "Novo Jogo" para adicionar o primeiro.</p>}
                    </div>
                ) : (
                    <div className="games-grid">
                        {games.map(game => (
                            <GameCard 
                                key={game.idJogo} 
                                game={game} 
                                isAdmin={isAdmin}
                                onEdit={openEditModal}
                                onDelete={handleDeleteGame}
                                onSelect={setSelectedGame}
                            />
                        ))}
                    </div>
                )}

                {selectedGame && (
                    <GameDetailModal 
                        game={selectedGame} 
                        onClose={() => setSelectedGame(null)}
                        isAdmin={isAdmin}
                    />
                )}

                {showCreateModal && (
                    <GameFormModal 
                        title="Cadastrar Novo Jogo"
                        game={newGame}
                        onChange={setNewGame}
                        onSubmit={handleCreateGame}
                        onClose={() => setShowCreateModal(false)}
                        error={createError}
                        isEditing={false}
                    />
                )}

                {editingGame && (
                    <GameFormModal 
                        title="Editar Jogo"
                        game={editingGame}
                        onChange={setEditingGame}
                        onSubmit={handleUpdateGame}
                        onClose={() => setEditingGame(null)}
                        error={createError}
                        isEditing={true}
                    />
                )}
            </div>
        </div>
    );
}

function GameCard({ game, isAdmin, onEdit, onDelete, onSelect }) {
    const genreColors = {
        'FPS': '#ef4444',
        'MOBA': '#8b5cf6',
        'BATTLE_ROYALLE': '#f59e0b',
        'SHOOTER': '#ec4899',
        'TABULEIRO': '#10b981'
    };

    const genreIcons = {
        'FPS': '🎯',
        'MOBA': '⚔️',
        'BATTLE_ROYALLE': '🏆',
        'SHOOTER': '🔫',
        'TABULEIRO': '♟️'
    };

    const bgColor = genreColors[game.genero] || '#6366f1';

    return (
        <div 
            className="game-card"
            style={{ '--game-color': bgColor }}
            onClick={() => onSelect(game)}
        >
            <div className="game-card-bg" style={{ backgroundImage: game.imagemUrl ? `url(${game.imagemUrl})` : 'none' }}>
                <div className="game-card-overlay">
                    <span className="genre-badge" style={{ backgroundColor: bgColor }}>
                        {genreIcons[game.genero]} {game.genero}
                    </span>
                </div>
            </div>
            <div className="game-card-content">
                <h3>{game.titulo}</h3>
                <p className="developer">por {game.desenvolvedora}</p>
                {game.descricao && <p className="description">{game.descricao.substring(0, 100)}...</p>}
            </div>
            {isAdmin && (
                <div className="game-card-actions">
                    <button className="btn-icon edit" onClick={(e) => { e.stopPropagation(); onEdit(game); }} title="Editar">
                        ✏️
                    </button>
                    <button className="btn-icon delete" onClick={(e) => { e.stopPropagation(); onDelete(game.idJogo); }} title="Excluir">
                        🗑️
                    </button>
                </div>
            )}
        </div>
    );
}

function GameDetailModal({ game, onClose, isAdmin }) {
    const genreColors = {
        'FPS': '#ef4444',
        'MOBA': '#8b5cf6',
        'BATTLE_ROYALLE': '#f59e0b',
        'SHOOTER': '#ec4899',
        'TABULEIRO': '#10b981'
    };

    const bgColor = genreColors[game.genero] || '#6366f1';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()} style={{ '--game-color': bgColor }}>
                <div className="modal-header">
                    <div className="modal-game-info">
                        <span className="genre-badge" style={{ backgroundColor: bgColor }}>{game.genero}</span>
                        <h2>{game.titulo}</h2>
                        <p className="developer">Desenvolvedora: {game.desenvolvedora}</p>
                    </div>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {game.bannerUrl && (
                        <div className="game-banner" style={{ backgroundImage: `url(${game.bannerUrl})` }} />
                    )}
                    {game.descricao && (
                        <div className="game-description">
                            <h3>Sobre o Jogo</h3>
                            <p>{game.descricao}</p>
                        </div>
                    )}
                    <div className="game-meta">
                        <div className="meta-item">
                            <span className="meta-label">ID</span>
                            <span className="meta-value">#{game.idJogo}</span>
                        </div>
                    </div>
                </div>
                {(isAdmin) && (
                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={onClose}>Fechar</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function GameFormModal({ title, game, onChange, onSubmit, onClose, error, isEditing }) {
    const generos = ['FPS', 'MOBA', 'BATTLE_ROYALLE', 'SHOOTER', 'TABULEIRO'];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={onSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Título *</label>
                            <input
                                type="text"
                                placeholder="Ex: Counter-Strike 2"
                                value={game.titulo}
                                onChange={(e) => onChange({ ...game, titulo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Gênero *</label>
                            <select
                                value={game.genero}
                                onChange={(e) => onChange({ ...game, genero: e.target.value })}
                            >
                                {generos.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Desenvolvedora *</label>
                        <input
                            type="text"
                            placeholder="Ex: Valve"
                            value={game.desenvolvedora}
                            onChange={(e) => onChange({ ...game, desenvolvedora: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>URL da Imagem (Card)</label>
                        <input
                            type="url"
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={game.imagemUrl || ''}
                            onChange={(e) => onChange({ ...game, imagemUrl: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>URL do Banner (Detalhe)</label>
                        <input
                            type="url"
                            placeholder="https://exemplo.com/banner.jpg"
                            value={game.bannerUrl || ''}
                            onChange={(e) => onChange({ ...game, bannerUrl: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            placeholder="Descrição do jogo..."
                            value={game.descricao || ''}
                            onChange={(e) => onChange({ ...game, descricao: e.target.value })}
                            rows={4}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">
                            {isEditing ? 'Salvar Alterações' : 'Criar Jogo'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}