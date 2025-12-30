/**
 * TratamentoDetalheUtente.jsx - Detalhe de tratamento do utente logado
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import { FileText, Download, ArrowLeft } from "lucide-react";
import profileService from "../services/profile.service";
import api from "../services/api";
import "./TratamentoDetalheUtente.css";

function TratamentoDetalheUtente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tratamento, setTratamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTratamento = async () => {
      try {
        const data = await profileService.getTratamentoDetails(id);
        setTratamento(data);
      } catch (err) {
        console.error("Erro ao carregar tratamento:", err);
        setError("Não foi possível carregar os detalhes do tratamento.");
      } finally {
        setLoading(false);
      }
    };

    fetchTratamento();
  }, [id]);

  if (loading) {
    return (
      <div className="tratamento-detalhe-utente-page">
        <Navbar variant="utente" />
        <main className="tratamento-detalhe-main">
          <div className="loading-state">A carregar tratamento...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tratamento-detalhe-utente-page">
        <Navbar variant="utente" />
        <main className="tratamento-detalhe-main">
          <div className="error-state">{error}</div>
        </main>
      </div>
    );
  }

  const tipoTratamento = tratamento?.tipoTratamento || {};
  const anexos =
    tipoTratamento?.anexosPredefinidos || tratamento?.anexosPredefinidos || [];

  return (
    <div className="tratamento-detalhe-utente-page">
      <Navbar variant="utente" />

      <main className="tratamento-detalhe-main">
        <header className="detalhe-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
            </button>
            <h1 className="page-title">TRATAMENTOS</h1>
          </div>
        </header>

        <div className="tratamento-card">
          <div className="tratamento-field">
            <span className="field-label">Nome:</span>
            <span className="field-value">
              {tipoTratamento?.nome || tratamento?.nome || "N/A"}
            </span>
          </div>

          <div className="tratamento-field">
            <span className="field-label">Duração:</span>
            <span className="field-value">
              {tipoTratamento?.duracao || tratamento?.duracao || "N/A"}
            </span>
          </div>

          <div className="tratamento-field">
            <span className="field-label">Número de consultas:</span>
            <span className="field-value">
              {tipoTratamento?.numeroConsultas ||
                tratamento?.numeroConsultas ||
                "N/A"}
            </span>
          </div>

          <div className="tratamento-section">
            <span className="field-label">Informações Úteis:</span>
            <p className="section-text">
              {tipoTratamento?.informacoes ||
                tratamento?.informacoes ||
                "Sem informações disponíveis."}
            </p>
          </div>

          <div className="tratamento-section">
            <span className="field-label">Observações Adicionais:</span>
            <p className="section-text">
              {tratamento?.observacoes ||
                tipoTratamento?.observacoes ||
                "Sem observações adicionais."}
            </p>
          </div>

          {anexos.length > 0 && (
            <div className="anexos-section">
              <span className="field-label">Anexos Predefinidos</span>
              <div className="anexos-list">
                {anexos.map((anexo, index) => (
                  <div key={index} className="anexo-item">
                    <FileText size={16} />
                    <span className="anexo-nome">{anexo.nome || anexo}</span>
                    {anexo.url && (
                      <a
                        href={() => {
                          const rawUrl = `${api.defaults.baseURL}${anexo.url}`;
                          const token = localStorage.getItem("token");
                          const sep = rawUrl.includes("?") ? "&" : "?";
                          return token ? `${rawUrl}${sep}token=${token}` : rawUrl;
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          const rawUrl = `${api.defaults.baseURL}${anexo.url}`;
                          const token = localStorage.getItem("token");
                          const sep = rawUrl.includes("?") ? "&" : "?";
                          const finalUrl = token ? `${rawUrl}${sep}token=${token}` : rawUrl;
                          window.open(finalUrl, "_blank");
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-link"
                      >
                        <Download size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="tratamento-detalhe-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default TratamentoDetalheUtente;
