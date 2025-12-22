import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import Logo from './Logo';
import { clearTokens } from '../services/api';
import './Navbar.css';

const navItemsByVariant = {
  utente: [
    { label: 'INÍCIO', to: '/home' },
    { label: 'DOCUMENTAÇÃO', to: '/documentacao' },
    { label: 'CONSULTAS', to: '/consultas' },
  ],
  gestor: [
    { label: 'AGENDA', to: '/agenda' },
    { label: 'PACIENTES', to: '/pacientes' },
    { label: 'CONSULTAS' },
    { label: 'TRATAMENTOS' },
    { label: 'GESTORES' },
  ],
};

function Navbar({ variant = 'utente' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = navItemsByVariant[variant] || navItemsByVariant.utente;
  const brandTarget = variant === 'gestor' ? '/agenda' : '/home';

  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem('user');
    setMenuOpen(false);
    navigate('/', { replace: true });
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => path && location.pathname.startsWith(path);

  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar-left"
        onClick={() => navigate(brandTarget)}
        aria-label="Voltar ao início"
      >
        <Logo
          size={variant === 'gestor' ? 'small' : 'medium'}
          showText
        />
      </button>

      <nav className="navbar-nav">
        {navItems.map((item) => (
          item.to ? (
            <Link
              key={item.label}
              to={item.to}
              className={`navbar-link ${isActive(item.to) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              className="navbar-link disabled"
              disabled
            >
              {item.label}
            </button>
          )
        ))}
      </nav>

      <div className="navbar-actions">
        <button className="icon-button" aria-label="Notificações" type="button">
          <Bell size={22} color="white" />
        </button>
        <div className="navbar-user">
          <button
            className="icon-button"
            aria-label="Perfil"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <User size={22} color="white" />
          </button>
          {menuOpen && (
            <div className="navbar-user-menu">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/perfil');
                }}
              >
                Ver Perfil
              </button>
              <button type="button" onClick={handleLogout}>
                Terminar sessão
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
