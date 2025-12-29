/**
 * TratamentoDetalhe.jsx - Página de detalhes de um tipo de tratamento (Gestor)
 *
 * Mostra os detalhes completos de um tipo de tratamento.
 * Endpoint: GET /tratamentos/:id (para plano) ou usando dados do tipo
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Navbar } from "../components";
import api from "../services/api";
import "./TratamentoDetalhe.css";

function TratamentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tratamento, setTratamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTratamento = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all tipos and find the one we need
        const resp = await api.get("/tratamentos/tipos");
        const tipos = resp?.data || [];
        const tipo = tipos.find(
          (t) => t.id_t_p_tratamento === parseInt(id, 10)
        );

        if (tipo) {
          setTratamento(tipo);
        } else {
          setError("Tratamento não encontrado.");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Sessão expirada. Inicie sessão novamente.");
        } else if (err.response?.status === 404) {
          setError("Tratamento não encontrado.");
        } else {
          setError("Não foi possível carregar os dados do tratamento.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTratamento();
  }, [id]);

  const handleApagar = async () => {
    if (!window.confirm("Tem a certeza que deseja apagar este tratamento?")) {
      return;
    }
    // TODO: Implement DELETE endpoint when available
    alert("Funcionalidade de apagar ainda não implementada no backend.");
  };

  const handleEditar = () => {
    navigate(`/tratamentos/tipo/${id}/editar`);
  };

  if (loading) {
    return (
      <div className="tratamento-detalhe-page">
        <Navbar variant="gestor" />
        <main className="tratamento-detalhe-main">
          <div className="tratamento-detalhe-loading">A carregar...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tratamento-detalhe-page">
        <Navbar variant="gestor" />
        <main className="tratamento-detalhe-main">
          <div className="tratamento-detalhe-error">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="tratamento-detalhe-page">
      <Navbar variant="gestor" />

      <main className="tratamento-detalhe-main">
        <header className="tratamento-detalhe-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
            </button>
            <h1 className="page-title">TRATAMENTO</h1>
          </div>
        </header>

        <div className="tratamento-detalhe-card">
          {/* Row 1: Nome, Data de Início, Duração, Número de consultas */}
          <div className="tratamento-detalhe-row">
            <div className="tratamento-detalhe-field">
              <span className="field-label">Nome:</span>
              <span className="field-value">{tratamento?.nome || "—"}</span>
            </div>
            <div className="tratamento-detalhe-field">
              <span className="field-label">Data de Início:</span>
              <span className="field-value">—</span>
            </div>
            <div className="tratamento-detalhe-field">
              <span className="field-label">Duração:</span>
              <span className="field-value">{tratamento?.duracao || "—"}</span>
            </div>
            <div className="tratamento-detalhe-field">
              <span className="field-label">Número de consultas:</span>
              <span className="field-value">
                {tratamento?.numero_consultas || "—"}
              </span>
            </div>
          </div>

          {/* Row 2: Informações Úteis e Observações Adicionais */}
          <div className="tratamento-detalhe-row two-cols">
            <div className="tratamento-detalhe-section">
              <span className="section-label">Informações Úteis:</span>
              <p className="section-text">{tratamento?.informacoes || "—"}</p>
            </div>
            <div className="tratamento-detalhe-section">
              <span className="section-label">Observações Adicionais:</span>
              <p className="section-text">—</p>
            </div>
          </div>

          {/* Row 3: Anexos */}
          <div className="tratamento-detalhe-anexos">
            <span className="section-label">Anexos</span>
            <div className="anexos-list">
              <div className="anexo-placeholder">
                Nenhum anexo associado a este tipo de tratamento.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="tratamento-detalhe-actions">
            <button type="button" className="btn-apagar" onClick={handleApagar}>
              Apagar
            </button>
            <button type="button" className="btn-editar" onClick={handleEditar}>
              Editar Dados <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </main>

      <footer className="tratamento-detalhe-footer">
        Clinimolelos 2025 - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default TratamentoDetalhe;
