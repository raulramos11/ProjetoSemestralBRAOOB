import React from 'react';
import './Perfil.css';

const Perfil = () => {
    return (
        <div className="perfil-wrapper flex justify-center items-start pt-10">
            <div className="w-full max-w-3xl bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <div className="p-8 relative">
                    <div className="absolute -top-16 left-8 w-32 h-32 bg-gray-700 border-4 border-gray-800 rounded-full flex items-center justify-center text-5xl shadow-xl">
                        👾
                    </div>
                    <div className="mt-16">
                        <h1 className="text-3xl font-bold text-white m-0">GhostRaven</h1>
                        <p className="text-gray-400 text-sm mt-1 mb-6">ghostraven@rankitup.com</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-700/40 p-4 rounded-xl border border-gray-600">
                                <span className="text-gray-400 text-xs font-semibold uppercase block">Equipe</span>
                                <span className="text-lg font-bold text-white mt-1 block">Team Zenith</span>
                            </div>
                            <div className="bg-gray-700/40 p-4 rounded-xl border border-gray-600">
                                <span className="text-gray-400 text-xs font-semibold uppercase block">Cargo</span>
                                <span className="text-lg font-bold text-purple-400 mt-1 block">JOGADOR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;