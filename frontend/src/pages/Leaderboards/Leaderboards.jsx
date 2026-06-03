import React from 'react';
import './Leaderboards.css';

const Leaderboards = () => {
    const players = [
        { rank: 1, name: 'Shroud', mmr: '2.950', winRate: '74%' },
        { rank: 2, name: 'GhostRaven', mmr: '2.150', winRate: '68%' },
        { rank: 3, name: 'Fallen', mmr: '2.050', winRate: '61%' },
    ];

    return (
        <div className="leaderboard-wrapper">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10 tracking-tight">Leaderboards</h1>

                <div className="table-custom rounded-xl shadow-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-purple-600 text-white font-bold">
                            <th className="p-4 w-20 text-center">Rank</th>
                            <th className="p-4">Jogador</th>
                            <th className="p-4">MMR</th>
                            <th className="p-4 text-center">Taxa de Vitória</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players.map((player) => (
                            <tr key={player.rank} className="table-row-custom hover:bg-gray-500/10 transition-colors">
                                <td className="p-4 text-center font-bold text-purple-500">#{player.rank}</td>
                                <td className="p-4 font-semibold">{player.name}</td>
                                <td className="p-4 font-mono text-indigo-500 dark:text-indigo-400">{player.mmr}</td>
                                <td className="p-4 text-center text-green-500 font-bold">{player.winRate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboards;