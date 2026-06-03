import React from 'react';
import './Tournaments.css';

const Tournaments = () => {
    return (
        <div className="tournaments-wrapper">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10 tracking-tight">Torneios Ativos</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card Torneio 1 */}
                    <div className="tournament-card rounded-2xl p-6 shadow-xl flex flex-col justify-between border">
                        <div>
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Inscrições Abertas</span>
                            <h2 className="text-2xl font-bold mt-3">Challenger de Valorant - Amador</h2>
                            <p className="text-gray-400 text-sm mt-1">Premiação: R$ 1.500,00 + Troféu Virtual</p>
                        </div>
                        <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer">
                            Inscrever Minha Equipe
                        </button>
                    </div>

                    {/* Card Torneio 2 */}
                    <div className="tournament-card rounded-2xl p-6 shadow-xl flex flex-col justify-between border">
                        <div>
                            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Em Andamento</span>
                            <h2 className="text-2xl font-bold mt-3">Copa das Lendas - League of Legends</h2>
                            <p className="text-gray-400 text-sm mt-1">Premiação: 10.000 RP para o Squad</p>
                        </div>
                        <button className="w-full mt-6 bg-gray-500 text-white font-bold py-3 rounded-xl cursor-not-allowed opacity-60" disabled>
                            Torneio Já Iniciado
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tournaments;