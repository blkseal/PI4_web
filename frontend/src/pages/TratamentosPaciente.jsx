/**
 * TratamentosPaciente.jsx - Lista de tratamentos de um paciente (Gestor)
 *
 * Mostra todos os tratamentos associados a um paciente específico.
 * Endpoint: GET /pacientes/:id/tratamentos
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import "./TratamentosPaciente.css";

function TratamentosPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch paciente info
        const pacienteResp = await api.get(`/pacientes/${id}`);
        setPaciente(pacienteResp?.data?.data || pacienteResp?.data || null);

        // Fetch tratamentos do paciente
        const tratamentosResp = await api.get(`/pacientes/${id}/tratamentos`);
        setTratamentos(tratamentosResp?.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Paciente não encontrado.");
        } else {
          setError("Erro ao carregar dados.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT");
  };

  const handleVerTratamento = (tratamentoId) => {
    navigate(`/pacientes/${id}/tratamentos/${tratamentoId}`);
  };

  if (loading) {
    return (
      <div className="tratamentos-paciente-page">
        <Navbar variant="gestor" />
        <main className="tratamentos-paciente-main">
          <div className="loading-state">A carregar...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="tratamentos-paciente-page">
      <Navbar variant="gestor" />

      <main className="tratamentos-paciente-main">
        <header className="tratamentos-paciente-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Voltar
            </button>
            <h1 className="page-title">TRATAMENTOS ATUAIS</h1>
          </div>
          <h2 className="patient-name">{paciente?.nomeCompleto || "Utente"}</h2>
        </header>

        {error && <div className="tratamentos-error">{error}</div>}

        {!error && tratamentos.length === 0 && (
          <div className="tratamentos-empty">
            Nenhum tratamento encontrado para este paciente.
          </div>
        )}

        <div className="tratamentos-list">
          {tratamentos.map((t) => {
            const tipo = t.id_t_p_tratamento_tipos_planos_tratamento;
            return (
              <div key={t.id_p_tratamento} className="tratamento-card">
                <div className="tratamento-card-content">
                  <div className="tratamento-card-left">
                    <h2 className="tratamento-nome">
                      {tipo?.nome || "Tratamento"}
                    </h2>
                    <p className="tratamento-info">
                      Data de Início: {formatDate(t.data_inicio)}
                    </p>
                    <p className="tratamento-info">
                      Duração: {tipo?.duracao || "—"}
                    </p>
                    <p className="tratamento-info">
                      Número de consultas: {tipo?.numero_consultas || "—"}
                    </p>
                  </div>
                  <div className="tratamento-card-right">
                    <div className="tratamento-informacoes">
                      <strong>Informações Úteis:</strong>
                      <p>
                        {tipo?.informacoes
                          ? tipo.informacoes.length > 150
                            ? `${tipo.informacoes.substring(0, 150)}...`
                            : tipo.informacoes
                          : t.observacoes
                          ? t.observacoes.length > 150
                            ? `${t.observacoes.substring(0, 150)}...`
                            : t.observacoes
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="ver-tratamento-btn"
                  onClick={() => handleVerTratamento(t.id_p_tratamento)}
                >
                  Ver Tratamento
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="tratamentos-paciente-footer">
        Clinimolelos 2025 - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default TratamentosPaciente;
