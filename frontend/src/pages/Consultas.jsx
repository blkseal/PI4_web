import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  ConsultationsList,
  ActionGrid,
  InlineSvg,
} from "../components";
import api from "../services/api";
import toothSvg from "../assets/tooth.svg?raw";
import historicoSvg from "../assets/historico_consultas.svg?raw";
import documentSvg from "../assets/document.svg?raw";
import { MessageSquare, Plus } from "lucide-react";

import "./Consultas.css";

function Consultas() {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsed = storedUser ? JSON.parse(storedUser) : null;
    if (parsed?.tipo === 'gestor') {
    window.location.replace('/agenda');
      return;
    }

    let cancelled = false;
    const fetchConsultas = async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await api.get("/home");
        if (cancelled) return;
        const proximasRaw = resp?.data?.proximasConsultas || [];
        const filtered = proximasRaw.filter(c => {
          const st = (c.valor_estado || c.estado || '').toLowerCase();
          return st === 'pendente' || st === 'por acontecer';
        });


        setConsultas(filtered);

      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401) {
          setError("Sessão expirada. Inicie sessão novamente.");
        } else {
          setError("Não foi possível carregar as consultas.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchConsultas();
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
      onClick: () => navigate("/pedidos"),
    },
    {
      title: "HISTÓRICO DE<br/>CONSULTAS",
      icon: <InlineSvg svg={historicoSvg} />,
      onClick: () => navigate("/historico"),
    },
    {
      title: "TRATAMENTOS",
      icon: <InlineSvg svg={toothSvg} className="tooth-svg" />,
      onClick: () => navigate("/tratamentos"),
    },
    {
      title: "CONTACTOS",
      icon: <MessageSquare size={40} color="white" fill="white" />,
    },

  ];

  return (
    <div className="consultas-container">
      <Navbar variant="utente" />

      <main className="consultas-main">
        <header className="consultas-header">
          <h1 className="consultas-title">CONSULTAS</h1>
        </header>

        <ConsultationsList
          consultas={consultas}
          loading={loading}
          error={error}
          onClick={(id) => navigate(`/consultas/${id}`)}
        />


        <ActionGrid items={actionItems} />
      </main>

      <footer className="home-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Consultas;
