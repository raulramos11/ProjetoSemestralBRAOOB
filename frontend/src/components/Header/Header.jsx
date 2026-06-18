import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

export default function Header() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/torneios', label: 'Torneios' },
    { path: '/jogos', label: 'Jogos' },
    { path: '/equipes', label: 'Equipes' },
    { path: '/leaderboard', label: 'Ranking' },
  ];

  const authLinks = isAuthenticated
    ? [
        { path: '/perfil', label: 'Meu Perfil' },
        ...(user?.perfil === 'ROLE_ADMIN' ? [{ path: '/admin', label: 'Admin' }] : []),
      ]
    : [];

  if (isLoading) {
    return (
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <NavLink to="/" className="logo" aria-label="Rank It Up - Início">
            <span className="logo-icon">◈</span>
            <span className="logo-text">Rank It Up</span>
          </NavLink>
          <div className="header-spacer" />
        </div>
      </header>
    );
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} role="banner">
      <div className="header-container">
        <NavLink to="/" className="logo" aria-label="Rank It Up - Início" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-icon">◈</span>
          <span className="logo-text">Rank It Up</span>
        </NavLink>

        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Navegação principal">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <>
                <li className="nav-divider" aria-hidden="true"></li>
                {authLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => { navigate('/perfil'); setMobileMenuOpen(false); }}
                aria-label="Meu perfil"
              >
                {user?.fotoPerfil ? (
                  <img src={user.fotoPerfil} alt="" />
                ) : (
                  <span className="avatar-placeholder">{user?.nickname?.[0]?.toUpperCase() || '?'}</span>
                )}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="btn btn-ghost btn-sm" onClick={() => setMobileMenuOpen(false)}>
                Entrar
              </NavLink>
              <NavLink to="/cadastro" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                Cadastrar
              </NavLink>
            </div>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className="hamburger" aria-hidden="true">
              <span className={mobileMenuOpen ? 'open' : ''}></span>
              <span className={mobileMenuOpen ? 'open' : ''}></span>
              <span className={mobileMenuOpen ? 'open' : ''}></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}