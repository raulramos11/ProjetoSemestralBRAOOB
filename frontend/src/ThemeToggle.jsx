import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Ajuste o caminho se necessário

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #94a3b8',
                cursor: 'pointer',
                backgroundColor: theme === 'light' ? '#1f2937' : '#ffffff',
                color: theme === 'light' ? '#ffffff' : '#1f2937',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
        </button>
    );
};

export default ThemeToggle;