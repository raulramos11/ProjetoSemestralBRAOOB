import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/Toast/Toast';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Tournaments from './pages/Tournaments/Tournaments';
import TournamentDetail from './pages/TournamentDetail/TournamentDetail';
import Games from './pages/Games/Games';
import Teams from './pages/Teams/Teams';
import Leaderboard from './pages/Leaderboards/Leaderboards';
import Profile from './pages/Perfil/Perfil';
import Admin from './pages/Dashboard/Dashboard';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/tournaments/:id" element={<TournamentDetail />} />
      <Route path="/games" element={<Games />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;