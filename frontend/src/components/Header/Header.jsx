import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Ajuste o caminho se necessário
import './Header.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="global-header">
            {/* Logo / Título */}
            <div className="text-xl font-black tracking-wider text-purple-600 dark:text-purple-400">
                RANK IT UP!
            </div>

            {/* Links de Navegação entre suas páginas */}
            <div className="flex gap-6 font-medium text-sm">
                <a href="/dashboard" className="hover:text-purple-500 transition-colors">Visão Geral</a>
                <a href="/leaderboards" className="hover:text-purple-500 transition-colors">Leaderboards</a>
                <a href="/tournaments" className="hover:text-purple-500 transition-colors">Torneios</a>
            </div>

            {/* Botão de Alternar Tema */}
            <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-full font-bold text-xs border border-gray-300 dark:border-gray-600 transition-all shadow-sm flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:scale-105"
            >
                {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
            </button>
        </nav>
    );
};

export default Header;