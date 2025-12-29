/**
 * ListaTratamentos.jsx - Lista de tipos de tratamentos (Gestor)
 *
 * Mostra todos os tipos de tratamento disponíveis na clínica.
 * Endpoint: GET /tratamentos/tipos
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";
import "./ListaTratamentos.css";

function ListaTratamentos() {
  const navigate = useNavigate();
  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTratamentos = async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await api.get("/tratamentos/tipos");
        setTratamentos(resp?.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Sessão expirada. Inicie sessão novamente.");
        } else {
          setError("Não foi possível carregar os tratamentos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTratamentos();
  }, []);

  const handleVerTratamento = (id) => {
    navigate(`/gestao/tratamentos/tipo/${id}`);
  };

  return (
    <div className="lista-tratamentos-page">
      <Navbar variant="gestor" />

      <main className="lista-tratamentos-main">
        <header className="lista-tratamentos-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
            </button>
            <h1 className="page-title">LISTA DE TRATAMENTOS</h1>
          </div>
        </header>

        {loading && (
          <div className="lista-tratamentos-loading">A carregar...</div>
        )}

        {error && <div className="lista-tratamentos-error">{error}</div>}

        {!loading && !error && tratamentos.length === 0 && (
          <div className="lista-tratamentos-empty">
            Nenhum tratamento encontrado.
          </div>
        )}

        <div className="lista-tratamentos-list">
          {tratamentos.map((t) => (
            <div key={t.id_t_p_tratamento} className="tratamento-card">
              <div className="tratamento-card-content">
                <div className="tratamento-card-left">
                  <h2 className="tratamento-nome">{t.nome}</h2>
                  <p className="tratamento-info">
                    <strong>Duração:</strong> {t.duracao || "—"}
                  </p>
                  <p className="tratamento-info">
                    <strong>Número de consultas:</strong>{" "}
                    {t.numero_consultas || "—"}
                  </p>
                </div>
                <div className="tratamento-card-right">
                  <div className="tratamento-informacoes">
                    <strong>Informações Úteis:</strong>
                    <p>
                      {t.informacoes
                        ? t.informacoes.length > 150
                          ? `${t.informacoes.substring(0, 150)}...`
                          : t.informacoes
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="ver-tratamento-btn"
                onClick={() => handleVerTratamento(t.id_t_p_tratamento)}
              >
                Ver Tratamento
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="lista-tratamentos-footer">
        Clinimolelos 2025 - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default ListaTratamentos;
