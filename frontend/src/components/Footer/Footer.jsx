import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    produto: [
      { path: '/torneios', label: 'Torneios' },
      { path: '/jogos', label: 'Jogos' },
      { path: '/equipes', label: 'Equipes' },
      { path: '/leaderboard', label: 'Ranking' },
    ],
    empresa: [
      { path: '/sobre', label: 'Sobre Nós' },
      { path: '/contato', label: 'Contato' },
      { path: '/privacidade', label: 'Privacidade' },
      { path: '/termos', label: 'Termos de Uso' },
    ],
    suporte: [
      { path: '/ajuda', label: 'Central de Ajuda' },
      { path: '/regras', label: 'Regras dos Torneios' },
      { path: '/faq', label: 'Perguntas Frequentes' },
      { path: '/status', label: 'Status do Sistema' },
    ],
    social: [
      { href: 'https://discord.com', label: 'Discord', external: true },
      { href: 'https://github.com', label: 'GitHub', external: true },
      { href: 'https://twitch.tv', label: 'Twitch', external: true },
      { href: 'https://youtube.com', label: 'YouTube', external: true },
    ],
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <NavLink to="/" className="footer-logo" aria-label="Rank It Up - Início">
              <span className="logo-icon">◈</span>
              <span className="logo-text">Rank It Up</span>
            </NavLink>
            <p className="footer-tagline">Compita. Suba no Ranking. Domine.</p>
            <p className="footer-description">
              A principal plataforma de torneios e ranking de e-sports do Brasil.
              Junte-se a milhares de jogadores competindo em diversos jogos.
            </p>
          </div>

          <nav className="footer-links" aria-label="Navegação do rodapé">
            <div className="footer-column">
              <h4 className="footer-heading">Produto</h4>
              <ul className="footer-list">
                {footerLinks.produto.map((link) => (
                  <li key={link.path}>
                    <NavLink to={link.path} className="footer-link">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Empresa</h4>
              <ul className="footer-list">
                {footerLinks.empresa.map((link) => (
                  <li key={link.path}>
                    <NavLink to={link.path} className="footer-link">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Suporte</h4>
              <ul className="footer-list">
                {footerLinks.suporte.map((link) => (
                  <li key={link.path}>
                    <NavLink to={link.path} className="footer-link">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Comunidade</h4>
              <ul className="footer-list">
                {footerLinks.social.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} Rank It Up. Todos os direitos reservados.
          </p>
          <p className="footer-note">
            Feito com paixão pela comunidade competitiva de jogos no Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}