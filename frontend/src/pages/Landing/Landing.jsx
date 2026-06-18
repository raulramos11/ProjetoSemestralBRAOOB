import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Landing.css';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'Torneios',
    description: 'Crie e participe de torneios competitivos em múltiplos jogos com geração automática de chaves.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Ranking ELO',
    description: 'Acompanhe sua progressão de habilidade com ratings ELO dinâmicos que atualizam após cada partida.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Sistema de Equipes',
    description: 'Monte seu time, gerencie elencos e compita como equipe em torneios ranqueados.',
  },
];

const steps = [
  { number: '01', title: 'Cadastre-se', description: 'Crie sua conta e personalize seu perfil de competidor.' },
  { number: '02', title: 'Entre no Torneio', description: 'Navegue pelos torneios ativos e inscreva-se solo ou com seu time.' },
  { number: '03', title: 'Compita e Suba', description: 'Jogue partidas, ganhe ELO e suba nos rankings globais.' },
];

const stats = [
  { label: 'Jogadores', value: 500, suffix: '+' },
  { label: 'Torneios', value: 120, suffix: '+' },
  { label: 'Jogos', value: 30, suffix: '+' },
];

const gamesShowcase = [
  { title: 'Counter-Strike 2', genre: 'FPS', prize: 'R$ 15.000', players: 2847, progress: 68, color: '#fbbf24' },
  { title: 'Valorant', genre: 'FPS', prize: 'R$ 25.000', players: 3421, progress: 45, color: '#ef4444' },
  { title: 'League of Legends', genre: 'MOBA', prize: 'R$ 10.000', players: 5123, progress: 78, color: '#8b5cf6' },
  { title: 'Dota 2', genre: 'MOBA', prize: 'R$ 20.000', players: 1876, progress: 32, color: '#06b6d4' },
];

export default function Landing() {
  const [animatedStats, setAnimatedStats] = useState({});
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.5)));
        setParallaxOffset(scrollProgress * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat) => {
              animateValue(stat.value, 2000).then((val) => {
                setAnimatedStats((prev) => ({ ...prev, [stat.label]: val }));
              });
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const animateValue = (target, duration) => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * eased);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve(target);
        }
      };
      requestAnimationFrame(animate);
    });
  };

  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate('/torneios');
    } else {
      navigate('/cadastro');
    }
  };

  return (
    <div className="landing">
      <header className="hero" ref={heroRef}>
        <div className="hero-background" aria-hidden="true">
          <div className="hero-glow" style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }} />
          <div className="hero-grid" style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }} />
          <div className="hero-particles" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 12}s`
              }} />
            ))}
          </div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge animate-fade-in">🚀 Nova Temporada Iniciando em Breve</span>
            <h1 className="hero-title animate-fade-in" style={{ animationDelay: '100ms' }}>
              Compita. <span className="highlight">Suba no Ranking.</span> Domine.
            </h1>
            <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '200ms' }}>
              A principal plataforma de torneios e ranking de e-sports do Brasil.
              Junte-se a milhares de jogadores, compita em torneios organizados e prove sua habilidade no cenário competitivo.
            </p>
            <div className="hero-actions animate-fade-in" style={{ animationDelay: '300ms' }}>
              <NavLink to={isAuthenticated ? '/torneios' : '/cadastro'} className="btn btn-primary btn-lg">
                {isAuthenticated ? 'Ver Torneios' : 'Começar Grátis'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </NavLink>
              <NavLink to="/torneios" className="btn btn-ghost btn-lg">
                Explorar Torneios
              </NavLink>
            </div>
            <div className="hero-trust animate-fade-in" style={{ animationDelay: '400ms' }}>
              <span>Confiado por mais de <strong>500+ jogadores</strong> no Brasil</span>
            </div>
          </div>
          <div className="hero-visual animate-fade-in" style={{ animationDelay: '200ms' }} aria-hidden="true">
            <div className="hero-carousel">
              {gamesShowcase.map((game, index) => (
                <div key={game.title} className="hero-card" style={{ 
                  borderColor: game.color,
                  boxShadow: `0 0 30px ${game.color}33`
                }}>
                  <div className="hero-card-header">
                    <span className="badge badge-live" style={{ background: game.color }}>Ao Vivo</span>
                    <span className="hero-card-title">{game.title}</span>
                    <span className="hero-card-genre">{game.genre}</span>
                  </div>
                  <div className="hero-card-stats">
                    <div className="stat">
                      <span className="stat-value">{game.players.toLocaleString()}</span>
                      <span className="stat-label">Inscritos</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                      <span className="stat-value">{game.prize}</span>
                      <span className="stat-label">Premiação</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                      <span className="stat-value">{game.progress}%</span>
                      <span className="stat-label">Preenchido</span>
                    </div>
                  </div>
                  <div className="hero-card-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${game.progress}%`, background: game.color }} />
                    </div>
                    <span className="progress-text">Inscrições {game.progress}% Completas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </header>

      <section className="features" aria-labelledby="features-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="features-heading" className="section-title">Por que Rank It Up?</h2>
            <p className="section-subtitle">Tudo que você precisa para competir no mais alto nível</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <article key={feature.title} className="feature-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="how-heading" className="section-title">Como Funciona</h2>
            <p className="section-subtitle">Comece em três passos simples</p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={step.number} className="step animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="step-connector" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-bar" ref={statsRef} aria-labelledby="stats-heading">
        <div className="container">
          <h2 id="stats-heading" className="visually-hidden">Estatísticas da Plataforma</h2>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item animate-fade-in">
                <span className="stat-value-large">
                  {animatedStats[stat.label] !== undefined ? animatedStats[stat.label] : 0}
                  <span className="stat-suffix">{stat.suffix}</span>
                </span>
                <span className="stat-label-large">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-card animate-fade-in">
            <h2 id="cta-heading" className="cta-title">Pronto para Competir?</h2>
            <p className="cta-description">Junte-se à comunidade de gamers competitivos e comece sua jornada ao topo.</p>
            <NavLink to={isAuthenticated ? '/torneios' : '/cadastro'} className="btn btn-primary btn-lg cta-button">
              {isAuthenticated ? 'Ir para Torneios' : 'Criar Conta Grátis'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}