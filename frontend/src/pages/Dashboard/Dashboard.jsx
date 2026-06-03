import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-wrapper min-h-screen p-8 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10 tracking-tight text-gray-800 dark:text-white">
                    Visão Geral
                </h1>

                {/* 🏆 GRID DOS CARDS DO MEIO (Agora mudando de tema dinamicamente) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Posição */}
                    <div className="bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-xl p-6 text-center shadow-md dark:shadow-xl transition-all duration-300">
                        <span className="block text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Sua Posição (Global)</span>
                        <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-500 mt-2 block">#42</span>
                    </div>

                    {/* Card 2: MMR */}
                    <div className="bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-xl p-6 text-center shadow-md dark:shadow-xl transition-all duration-300">
                        <span className="block text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Pontuação (MMR)</span>
                        <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-500 mt-2 block">2.150</span>
                    </div>

                    {/* Card 3: Win Rate */}
                    <div className="bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-xl p-6 text-center shadow-md dark:shadow-xl transition-all duration-300">
                        <span className="block text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Taxa de Vitória</span>
                        <span className="text-3xl font-extrabold text-green-600 dark:text-green-500 mt-2 block">68%</span>
                    </div>

                    {/* 🎮 CONTAINER DAS ÚLTIMAS PARTIDAS (Também adaptável) */}
                    <div className="bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-xl p-6 md:col-span-3 shadow-md dark:shadow-xl text-left transition-all duration-300">
                        <span className="block text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Últimas Partidas</span>

                        <div className="space-y-3">
                            {/* Item Partida 1 */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex justify-between items-center border border-gray-200 dark:border-gray-600">
                                <span className="font-medium text-gray-700 dark:text-gray-200">🎮 Valorant - Competitivo</span>
                                <span className="text-green-600 dark:text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-full text-sm">Vitória (+25 MMR)</span>
                            </div>

                            {/* Item Partida 2 */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex justify-between items-center border border-gray-200 dark:border-gray-600">
                                <span className="font-medium text-gray-700 dark:text-gray-200">🎮 League of Legends - Ranked</span>
                                <span className="text-red-600 dark:text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full text-sm">Derrota (-12 MMR)</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;