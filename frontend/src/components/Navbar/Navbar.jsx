import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/tournaments', label: 'Torneios' },
    { path: '/games', label: 'Jogos' },
    { path: '/teams', label: 'Equipes' },
    { path: '/leaderboard', label: 'Ranking' },
  ];

  const authLinks = isAuthenticated
    ? [
        { path: '/profile', label: 'Perfil' },
        ...(user?.perfil === 'ROLE_ADMIN' ? [{ path: '/admin', label: 'Admin' }] : []),
      ]
    : [];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-background">
        <div className="navbar-grid" />
        <div className="navbar-glow" />
      </div>
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" aria-label="Rank It Up Home">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Rank It Up</span>
        </NavLink>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-list">
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
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => navigate('/profile')}
                aria-label="User menu"
              >
                {user?.fotoPerfil ? (
                  <img src={user.fotoPerfil} alt="" />
                ) : (
                  user?.nickname?.[0]?.toUpperCase() || '?'
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
              <NavLink to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
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
    </nav>
  );
};

export default Navbar;