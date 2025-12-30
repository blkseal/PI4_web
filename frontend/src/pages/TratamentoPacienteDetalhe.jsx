/**
 * TratamentoPacienteDetalhe.jsx - Detalhe de um tratamento de paciente (Gestor)
 *
 * Mostra os detalhes completos de um tratamento incluindo consultas associadas.
 * Endpoint: GET /tratamentos/:id
 * Endpoint: PUT /tratamentos/:id (atualizar)
 */

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Upload, ArrowLeft, Download, Trash2 } from "lucide-react";
import { Navbar } from "../components";
import api from "../services/api";
import "./TratamentoPacienteDetalhe.css";

function TratamentoPacienteDetalhe() {
  const { id: pacienteId, tratamentoId } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [tratamento, setTratamento] = useState(null);
  const [anexos, setAnexos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    dataInicio: "",
    observacoesAdicionais: "",
  });
  const [saving, setSaving] = useState(false);

  // File upload
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  // Anexo modal state
  const [showAnexoModal, setShowAnexoModal] = useState(false);
  const [selectedAnexo, setSelectedAnexo] = useState(null);

  // Consultas associadas (empty for now, will be fetched later)
  const consultas = [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch paciente info
        const pacienteResp = await api.get(`/pacientes/${pacienteId}`);
        setPaciente(pacienteResp?.data?.data || pacienteResp?.data || null);

        // Fetch tratamento details
        const tratamentoResp = await api.get(`/tratamentos/${tratamentoId}`);
        const tratamentoData = tratamentoResp?.data || null;
        setTratamento(tratamentoData);

        // Initialize edit data
        if (tratamentoData) {
          setEditData({
            dataInicio: tratamentoData.data_inicio?.split("T")[0] || "",
            observacoesAdicionais: tratamentoData.observacoes || "",
          });
        }

        // Fetch anexos
        try {
          const anexosResp = await api.get(
            `/tratamentos/${tratamentoId}/anexos`
          );
          setAnexos(anexosResp?.data || []);
        } catch {
          // Anexos may not exist, ignore error
          setAnexos([]);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Tratamento não encontrado.");
        } else {
          setError("Erro ao carregar dados.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (pacienteId && tratamentoId) fetchData();
  }, [pacienteId, tratamentoId]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT");
  };

  const handleEditar = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tipo = tratamento?.id_t_p_tratamento_tipos_planos_tratamento;

      const payload = {
        tipoTratamentoId: tipo?.id_t_p_tratamento || null,
        dataInicio: editData.dataInicio,
        observacoesAdicionais: editData.observacoesAdicionais,
      };

      await api.put(`/tratamentos/${tratamentoId}`, payload);

      // Reload tratamento data
      const tratamentoResp = await api.get(`/tratamentos/${tratamentoId}`);
      setTratamento(tratamentoResp?.data || null);

      setShowEditModal(false);
      alert("Tratamento atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar tratamento:", err);
      alert("Erro ao atualizar tratamento.");
    } finally {
      setSaving(false);
    }
  };

  // File upload handlers
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("ficheiro", file);

    setUploading(true);
    try {
      await api.post(`/tratamentos/${tratamentoId}/anexos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Reload anexos
      const anexosResp = await api.get(`/tratamentos/${tratamentoId}/anexos`);
      setAnexos(anexosResp?.data || []);
      alert("Anexo adicionado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar anexo:", err);
      alert("Erro ao enviar ficheiro.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="tratamento-paciente-detalhe-page">
        <Navbar variant="gestor" />
        <main className="tratamento-paciente-detalhe-main">
          <div className="loading-state">A carregar...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tratamento-paciente-detalhe-page">
        <Navbar variant="gestor" />
        <main className="tratamento-paciente-detalhe-main">
          <div className="error-state">{error}</div>
        </main>
      </div>
    );
  }

  const tipo = tratamento?.id_t_p_tratamento_tipos_planos_tratamento;
  const numeroConsultas = tipo?.numero_consultas || 0;

  return (
    <div className="tratamento-paciente-detalhe-page">
      <Navbar variant="gestor" />

      <main className="tratamento-paciente-detalhe-main">
        <header className="tratamento-detalhe-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: "8px" }} /> Voltar
            </button>
            <h1 className="page-title">TRATAMENTOS ATUAIS</h1>
          </div>
          <h2 className="patient-name">{paciente?.nomeCompleto || "Utente"}</h2>
        </header>

        {/* Detalhes do Tratamento */}
        <section className="tratamento-detalhe-card">
          <div className="detalhe-row">
            <div className="detalhe-field">
              <span className="field-label">Nome:</span>
              <span className="field-value">{tipo?.nome || "—"}</span>
            </div>
            <div className="detalhe-field">
              <span className="field-label">Data de Início:</span>
              <span className="field-value">
                {formatDate(tratamento?.data_inicio)}
              </span>
            </div>
            <div className="detalhe-field">
              <span className="field-label">Duração:</span>
              <span className="field-value">{tipo?.duracao || "—"}</span>
            </div>
            <div className="detalhe-field">
              <span className="field-label">Número de consultas:</span>
              <span className="field-value">{numeroConsultas}</span>
            </div>
          </div>

          <div className="detalhe-columns-container">
            {/* Left Column: Info + Anexos */}
            <div className="detalhe-col-left">
              <div className="detalhe-section">
                <span className="section-label">INFORMAÇÕES ÚTEIS:</span>
                <p className="section-text">{tipo?.informacoes || "—"}</p>
              </div>

              <div className="detalhe-anexos">
                <div className="anexos-header">
                  <span className="section-label">ANEXOS</span>
                </div>
                <div className="anexos-list">
                  {anexos.length > 0 ? (
                    anexos.map((anexo) => (
                      <div key={anexo.id} className="anexo-item">
                        <button
                          type="button"
                          className="anexo-name"
                          onClick={() => {
                            setSelectedAnexo(anexo);
                            setShowAnexoModal(true);
                          }}
                        >
                          {anexo.nome}
                        </button>
                        <div className="anexo-actions">
                          <a
                            href={() => {
                              const rawUrl = anexo.url
                                ? anexo.url.startsWith("http")
                                  ? anexo.url
                                  : `${api.defaults.baseURL}${anexo.url}`
                                : anexo.anexoUrl || "#";
                              const token = localStorage.getItem("token");
                              const sep = rawUrl.includes("?") ? "&" : "?";
                              return token ? `${rawUrl}${sep}token=${token}` : rawUrl;
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              const rawUrl = anexo.url
                                ? anexo.url.startsWith("http")
                                  ? anexo.url
                                  : `${api.defaults.baseURL}${anexo.url}`
                                : anexo.anexoUrl || "#";
                              const token = localStorage.getItem("token");
                              const sep = rawUrl.includes("?") ? "&" : "?";
                              const finalUrl = token ? `${rawUrl}${sep}token=${token}` : rawUrl;
                              window.open(finalUrl, "_blank");
                            }}
                            target="_blank"
                            rel="noreferrer"
                            className="download-link"
                            title="Download"
                          >
                            <Download size={14} />
                          </a>
                          <button
                            type="button"
                            className="delete-btn"
                            title="Eliminar"
                            onClick={async () => {
                              if (!confirm("Eliminar anexo?")) return;
                              try {
                                await api.delete(
                                  `/tratamentos/${tratamentoId}/anexos/${anexo.id}`
                                );
                                const resp = await api.get(
                                  `/tratamentos/${tratamentoId}/anexos`
                                );
                                setAnexos(resp?.data || []);
                                alert("Anexo eliminado com sucesso.");
                              } catch (err) {
                                console.error(err);
                                alert("Erro ao eliminar anexo.");
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="anexo-placeholder">
                      Nenhum anexo disponível.
                    </div>
                  )}
                </div>
                <div className="anexos-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="btn-upload"
                    onClick={handleUploadClick}
                    disabled={uploading}
                  >
                    <Upload size={14} />
                    {uploading ? "A enviar..." : "Anexar ficheiro"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Observações */}
            <div className="detalhe-col-right">
              <div className="detalhe-section">
                <span className="section-label">OBSERVAÇÕES ADICIONAIS:</span>
                <p className="section-text">{tratamento?.observacoes || "—"}</p>
              </div>
            </div>
          </div>

          <div className="detalhe-actions">
            <button type="button" className="btn-editar" onClick={handleEditar}>
              Editar Dados <Edit size={14} />
            </button>
          </div>
        </section>

        {/* Consultas Associadas */}
        <section className="consultas-section">
          <h3 className="consultas-title">Consultas</h3>
          <div className="consultas-grid">
            {consultas.length > 0 ? (
              consultas.map((consulta) => (
                <div key={consulta.id} className="consulta-card">
                  <span className="consulta-medico">{consulta.medico}</span>
                  <div className="consulta-info">
                    <span>Dia: {consulta.data}</span>
                    <span>Horário: {consulta.horario}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="consultas-empty">
                Nenhuma consulta marcada para este tratamento.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Editar Tratamento</h3>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-form-group">
                <label>Data de Início</label>
                <input
                  type="date"
                  value={editData.dataInicio}
                  onChange={(e) =>
                    handleEditChange("dataInicio", e.target.value)
                  }
                />
              </div>
              <div className="modal-form-group">
                <label>Observações Adicionais</label>
                <textarea
                  value={editData.observacoesAdicionais}
                  onChange={(e) =>
                    handleEditChange("observacoesAdicionais", e.target.value)
                  }
                  rows={4}
                  placeholder="Observações..."
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar" disabled={saving}>
                  {saving ? "A guardar..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="tratamento-paciente-detalhe-footer">
        Clinimolelos 2025 - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default TratamentoPacienteDetalhe;
