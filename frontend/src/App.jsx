import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1">
                    <Dashboard />
                </main>
            </div>
        </ThemeProvider>
    );
}

export default App;