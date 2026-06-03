import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Pega o tema salvo no navegador ou usa 'light' como padrão
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    // Sempre que o tema mudar, atualiza a classe no body e salva no localStorage
    useEffect(() => {
        const root = window.document.body;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.backgroundColor = '#111827'; // Cor escura global
        } else {
            root.classList.remove('dark');
            root.style.backgroundColor = '#f3f4f6'; // Cor clara global
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);