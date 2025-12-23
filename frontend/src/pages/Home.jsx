/**
 * Home.jsx - Página Inicial da aplicação CLINIMOLELOS
 * 
 * Esta página apresenta a visão geral para o utente, incluindo:
 * - Cabeçalho com navegação
          <Plus size={14} className="plus-badge" />
 * - Lista de próximas consultas
 * - Botões de ação rápida (Marcar consulta, Ver consultas, etc.)
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare } from "lucide-react";
import {
  Navbar,
  ConsultationsList,
  ActionGrid,
  InlineSvg,
} from "../components";
import api from "../services/api";
import toothSvg from "../assets/tooth.svg?raw";
import documentSvg from "../assets/document.svg?raw";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [utilizador, setUtilizador] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Se for gestor, redireciona para a agenda
    // const storedUser = localStorage.getItem('user');
    // const parsed = storedUser ? JSON.parse(storedUser) : null;
    // if (parsed?.tipo === 'gestor') {
    //   navigate('/agenda', { replace: true });
    //   return;
    // }

    let cancelled = false;

    const fetchHome = async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await api.get("/home");
        if (cancelled) return;
        setUtilizador(resp?.data?.utilizador || null);
        setConsultas(resp?.data?.proximasConsultas || []);
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401) {
          setError("Sessão expirada. Inicie sessão novamente.");
        } else {
          setError("Não foi possível carregar os dados da home.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHome();
    return () => {
      cancelled = true;
    };
  }, []);

  const actionItems = [
    {
      title: "SOLICITAR UMA<br/>CONSULTA",
      icon: (
        <div className="tooth-icon-wrapper">
          <InlineSvg svg={toothSvg} className="tooth-svg" />
          <Plus size={12} className="plus-badge" />
        </div>
      ),
    },
    {
      title: "CONSULTAS",
      icon: <InlineSvg svg={toothSvg} className="tooth-svg" />,
      onClick: () => navigate("/consultas"),
    },
    {
      title: "DOCUMENTAÇÃO",
      icon: <InlineSvg svg={documentSvg} className="document-svg" />,
      onClick: () => navigate("/documentacao"),
    },
    {
      title: "CONTACTOS",
      icon: <MessageSquare size={40} color="white" fill="white" />,
    },
  ];

  return (
    <div className="home-container">
      <Navbar variant="utente" />

      {/* Banner do Utilizador */}
      <section className="user-banner">
        <h1 className="user-name">{utilizador?.nome || "—"}</h1>
        <p className="user-number">
          Nº Utente: {utilizador?.numeroUtente || "—"}
        </p>
      </section>

      {/* Conteúdo Principal */}
      <main className="main-content">
        {/* Secção de Próximas Consultas */}
        <ConsultationsList
          consultas={consultas}
          loading={loading}
          error={error}
        />

        {/* Grelha de Ações Rápidas */}
        <ActionGrid items={actionItems} />
      </main>

      {/* Rodapé */}
      <footer className="home-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
