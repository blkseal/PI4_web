/**
 * NovoTratamentoPaciente.jsx - Criar novo tratamento para um paciente (Gestor)
 *
 * Permite criar um tratamento usando:
 * - Geral: Selecionar um tipo de tratamento existente
 * - Personalizado: Criar um tratamento customizado
 *
 * Endpoint: POST /pacientes/:id/tratamentos
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import { Navbar } from "../components";
import api from "../services/api";
import "./NovoTratamentoPaciente.css";

function NovoTratamentoPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [tiposTratamento, setTiposTratamento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state - Geral
  const [geralData, setGeralData] = useState({
    tipoTratamentoId: "",
    dataInicio: "",
    observacoesAdicionais: "",
  });

  // Form state - Personalizado
  const [personalizadoData, setPersonalizadoData] = useState({
    nome: "",
    dataInicio: "",
    duracao: "",
    numeroConsultas: "",
    informacoesUteis: "",
    observacoesAdicionais: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch paciente info
        const pacienteResp = await api.get(`/pacientes/${id}`);
        setPaciente(pacienteResp?.data?.data || pacienteResp?.data || null);

        // Fetch tipos de tratamento
        const tiposResp = await api.get("/tratamentos/tipos");
        setTiposTratamento(tiposResp?.data || []);
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

  const handleGeralChange = (field, value) => {
    setGeralData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePersonalizadoChange = (field, value) => {
    setPersonalizadoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitGeral = async (e) => {
    e.preventDefault();
    if (!geralData.tipoTratamentoId) {
      setError("Selecione um tipo de tratamento.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        tipoTratamentoId: parseInt(geralData.tipoTratamentoId, 10),
        dataInicio:
          geralData.dataInicio || new Date().toISOString().split("T")[0],
        observacoesAdicionais: geralData.observacoesAdicionais || null,
      };

      await api.post(`/pacientes/${id}/tratamentos`, payload);
      navigate(`/pacientes/${id}/tratamentos`);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar tratamento.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPersonalizado = async (e) => {
    e.preventDefault();
    if (!personalizadoData.nome) {
      setError("O nome do tratamento é obrigatório.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        nome: personalizadoData.nome,
        dataInicio:
          personalizadoData.dataInicio ||
          new Date().toISOString().split("T")[0],
        duracaoMeses: personalizadoData.duracao
          ? parseInt(personalizadoData.duracao, 10)
          : null,
        numeroConsultas: personalizadoData.numeroConsultas
          ? parseInt(personalizadoData.numeroConsultas, 10)
          : null,
        informacoesUteis: personalizadoData.informacoesUteis || null,
        observacoesAdicionais: personalizadoData.observacoesAdicionais || null,
      };

      await api.post(`/pacientes/${id}/tratamentos`, payload);
      navigate(`/pacientes/${id}/tratamentos`);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar tratamento.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="novo-tratamento-paciente-page">
        <Navbar variant="gestor" />
        <main className="novo-tratamento-paciente-main">
          <div className="loading-state">A carregar...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="novo-tratamento-paciente-page">
      <Navbar variant="gestor" />

      <main className="novo-tratamento-paciente-main">
        <header className="novo-tratamento-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
            </button>
            <h1 className="page-title">NOVO TRATAMENTO</h1>
          </div>
          <h2 className="patient-name">{paciente?.nomeCompleto || "Utente"}</h2>
        </header>

        {error && <div className="form-error">{error}</div>}

        {/* Seção Geral */}
        <section className="tratamento-section">
          <h3 className="section-title">Geral</h3>
          <form className="tratamento-form" onSubmit={handleSubmitGeral}>
            <div className="form-row three-cols">
              <div className="form-group">
                <label>Tipo de tratamento</label>
                <select
                  value={geralData.tipoTratamentoId}
                  onChange={(e) =>
                    handleGeralChange("tipoTratamentoId", e.target.value)
                  }
                >
                  <option value="">Selecionar...</option>
                  {tiposTratamento.map((tipo) => (
                    <option
                      key={tipo.id_t_p_tratamento}
                      value={tipo.id_t_p_tratamento}
                    >
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Data de Início</label>
                <input
                  type="date"
                  value={geralData.dataInicio}
                  onChange={(e) =>
                    handleGeralChange("dataInicio", e.target.value)
                  }
                  placeholder={getTodayDate()}
                />
              </div>
              <div className="form-group textarea-group">
                <label>Observações Adicionais</label>
                <textarea
                  value={geralData.observacoesAdicionais}
                  onChange={(e) =>
                    handleGeralChange("observacoesAdicionais", e.target.value)
                  }
                  rows={4}
                />
              </div>
            </div>

            <div className="form-group anexos-group">
              <label>Anexos</label>
              <div className="anexos-dropzone">
                <p>Arraste para aqui o ficheiro.</p>
                <p>Ou clique para selecionar um ficheiro</p>
                <Upload size={32} color="#a48356" />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "A submeter..." : "Submeter"}
              </button>
            </div>
          </form>
        </section>

        {/* Seção Personalizado */}
        <section className="tratamento-section">
          <h3 className="section-title">Personalizado</h3>
          <form
            className="tratamento-form"
            onSubmit={handleSubmitPersonalizado}
          >
            <div className="form-row four-cols">
              <div className="form-group">
                <label>Nome do Tratamento</label>
                <input
                  type="text"
                  placeholder="Tratamento P1"
                  value={personalizadoData.nome}
                  onChange={(e) =>
                    handlePersonalizadoChange("nome", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Data de Início</label>
                <input
                  type="date"
                  value={personalizadoData.dataInicio}
                  onChange={(e) =>
                    handlePersonalizadoChange("dataInicio", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Duração</label>
                <input
                  type="text"
                  placeholder="6 meses"
                  value={personalizadoData.duracao}
                  onChange={(e) =>
                    handlePersonalizadoChange("duracao", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Número de consultas</label>
                <input
                  type="number"
                  placeholder="12"
                  min="1"
                  value={personalizadoData.numeroConsultas}
                  onChange={(e) =>
                    handlePersonalizadoChange("numeroConsultas", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-row two-cols">
              <div className="form-group">
                <label>Informações Úteis</label>
                <textarea
                  value={personalizadoData.informacoesUteis}
                  onChange={(e) =>
                    handlePersonalizadoChange(
                      "informacoesUteis",
                      e.target.value
                    )
                  }
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Observações Adicionais</label>
                <textarea
                  value={personalizadoData.observacoesAdicionais}
                  onChange={(e) =>
                    handlePersonalizadoChange(
                      "observacoesAdicionais",
                      e.target.value
                    )
                  }
                  rows={4}
                />
              </div>
            </div>

            <div className="form-group anexos-group">
              <label>Anexos</label>
              <div className="anexos-dropzone">
                <p>Arraste para aqui o ficheiro.</p>
                <p>Ou clique para selecionar um ficheiro</p>
                <Upload size={32} color="#a48356" />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "A submeter..." : "Submeter"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer className="novo-tratamento-paciente-footer">
        Clinimolelos 2025 - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default NovoTratamentoPaciente;
