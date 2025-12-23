import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, UserCheck } from "lucide-react";
import Logo from "./Logo";
import { clearTokens } from "../services/api";
import profileService from "../services/profile.service";
import "./Navbar.css";

const navItemsByVariant = {
  utente: [
    { label: "INÍCIO", to: "/home" },
    { label: "DOCUMENTAÇÃO", to: "/documentacao" },
    { label: "CONSULTAS", to: "/consultas" },
  ],
  gestor: [
    { label: 'AGENDA', to: '/agenda' },
    { label: 'PACIENTES', to: '/pacientes' },
    { label: 'CONSULTAS', to: '/gestor/consultas' },
    { label: "TRATAMENTOS", to: "/gestao/tratamentos" },
    { label: "GESTORES" },
  ],
};

// Helper to check if acting as dependent
const getActiveProfileInfo = () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.activeProfileId || null;
    }
  } catch {
    return null;
  }
  return null;
};

function Navbar({ variant = "utente" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState(
    getActiveProfileInfo()
  );
  const [switchingBack, setSwitchingBack] = useState(false);

  const navItems = navItemsByVariant[variant] || navItemsByVariant.utente;
  const brandTarget = variant === "gestor" ? "/agenda" : "/home";

  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const handleReturnToMainProfile = async () => {
    setSwitchingBack(true);
    try {
      await profileService.switchProfile(null);
      setActiveProfileId(null);
      navigate("/home");
      window.location.reload();
    } catch (err) {
      console.error("Erro ao voltar ao perfil principal:", err);
    } finally {
      setSwitchingBack(false);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
    // Update active profile state when location changes
    setActiveProfileId(getActiveProfileInfo());
  }, [location.pathname]);

  const isActive = (path) => path && location.pathname.startsWith(path);

  return (
    <>
      {/* Banner when acting as dependent */}
      {activeProfileId && variant === "utente" && (
        <div className="acting-as-banner">
          <span>
            <UserCheck
              size={16}
              style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
            />
            A visualizar como dependente
          </span>
          <button
            className="return-to-main-btn"
            onClick={handleReturnToMainProfile}
            disabled={switchingBack}
          >
            {switchingBack ? "A voltar..." : "Voltar ao perfil principal"}
          </button>
        </div>
      )}

      <header className="navbar">
        <button
          type="button"
          className="navbar-left"
          onClick={() => navigate(brandTarget)}
          aria-label="Voltar ao início"
        >
          <Logo size={variant === "gestor" ? "small" : "medium"} showText />
        </button>

        <nav className="navbar-nav">
          {navItems.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className={`navbar-link ${isActive(item.to) ? "active" : ""}`}
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
          )}
        </nav>

        <div className="navbar-actions">
          <button
            className="icon-button"
            aria-label="Notificações"
            type="button"
          >
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
                    navigate("/perfil");
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
    </>
  );
}

export default Navbar;
