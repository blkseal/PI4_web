/**
 * TratamentosUtente.jsx - Lista de tratamentos do utente logado
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import profileService from "../services/profile.service";
import { ArrowLeft } from "lucide-react";
import "./TratamentosUtente.css";

function TratamentosUtente() {
  const navigate = useNavigate();
  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTratamentos = async () => {
      try {
        const data = await profileService.getTratamentos();
        setTratamentos(data || []);
      } catch (err) {
        console.error("Erro ao carregar tratamentos:", err);
        setError("Não foi possível carregar os tratamentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTratamentos();
  }, []);

  if (loading) {
    return (
      <div className="tratamentos-utente-page">
        <Navbar variant="utente" />
        <main className="tratamentos-utente-main">
          <div className="loading-state">A carregar tratamentos...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tratamentos-utente-page">
        <Navbar variant="utente" />
        <main className="tratamentos-utente-main">
          <div className="error-state">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="tratamentos-utente-page">
      <Navbar variant="utente" />

      <main className="tratamentos-utente-main">
        <header className="tratamentos-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
            </button>
            <h1 className="page-title">TRATAMENTOS</h1>
          </div>
        </header>

        {tratamentos.length === 0 ? (
          <div className="empty-state">Não existem tratamentos registados.</div>
        ) : (
          <div className="tratamentos-list">
            {tratamentos.map((tratamento) => (
              <div key={tratamento.id} className="tratamento-card">
                <div className="tratamento-card-content">
                  <div className="tratamento-card-left">
                    <h2 className="tratamento-nome">
                      {tratamento.tipoTratamento?.nome ||
                        tratamento.nome ||
                        "Tratamento"}
                    </h2>
                    <p className="tratamento-info">
                      <strong>Duração:</strong>{" "}
                      {tratamento.tipoTratamento?.duracao ||
                        tratamento.duracao ||
                        "N/A"}
                    </p>
                    <p className="tratamento-info">
                      <strong>Número de consultas:</strong>{" "}
                      {tratamento.tipoTratamento?.numeroConsultas ||
                        tratamento.numeroConsultas ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="tratamento-card-right">
                    <div className="tratamento-info-section">
                      <strong>Informações Úteis:</strong>
                      <p className="info-text">
                        {tratamento.tipoTratamento?.informacoes ||
                          tratamento.informacoes ||
                          "Sem informações adicionais."}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className="ver-tratamento-btn"
                  onClick={() => navigate(`/tratamentos/${tratamento.id}`)}
                >
                  Ver Tratamento
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="tratamentos-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default TratamentosUtente;
