/**
 * HistoricoMedico.jsx - Página de Histórico Médico, Hábitos e Exames
 */

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar, EditHistoricoModal, EditHabitosModal } from "../components";
import api from "../services/api";
import { Upload, FileText, Download, Trash2, Edit, ArrowLeft } from "lucide-react";
import "./HistoricoMedico.css";

function HistoricoMedico() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para dados
  const [paciente, setPaciente] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [habitos, setHabitos] = useState(null);
  const [exames, setExames] = useState([]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Estados para modais
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [showHabitosModal, setShowHabitosModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estado para drag and drop
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Carregar dados do paciente (nome, etc)
      const pRes = await api.get(`/pacientes/${id}`);
      setPaciente(pRes?.data?.data || pRes?.data);

      // 2. Carregar Histórico Médico
      // O endpoint devolve o objeto ou null
      const histRes = await api.get(`/pacientes/${id}/historico-medico`);
      setHistorico(histRes.data);

      // 3. Carregar Hábitos
      const habRes = await api.get(`/pacientes/${id}/habitos`);
      setHabitos(habRes.data);

      // 4. Carregar Exames
      const examRes = await api.get(`/pacientes/${id}/exames`);
      setExames(examRes.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Falha ao carregar dados do histórico.");
    } finally {
      setLoading(false);
    }
  };

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
      await api.post(`/pacientes/${id}/exames`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Recarregar lista
      const examRes = await api.get(`/pacientes/${id}/exames`);
      setExames(examRes.data || []);
      alert("Exame anexado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar exame:", err);
      alert("Erro ao enviar ficheiro.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Drag and Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Handlers para edição do Histórico
  const handleEditHistorico = () => {
    setShowHistoricoModal(true);
  };

  const handleSaveHistorico = async (formData) => {
    setSaving(true);
    try {
      // Backend usa PUT para criar e atualizar
      await api.put(`/pacientes/${id}/historico-medico`, formData);
      // Recarregar dados
      const histRes = await api.get(`/pacientes/${id}/historico-medico`);
      setHistorico(histRes.data);
      setShowHistoricoModal(false);
      alert("Histórico médico atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao guardar histórico:", err);
      alert("Erro ao guardar dados do histórico.");
    } finally {
      setSaving(false);
    }
  };

  // Handlers para edição dos Hábitos
  const handleEditHabitos = () => {
    setShowHabitosModal(true);
  };

  const handleSaveHabitos = async (formData) => {
    setSaving(true);
    try {
      // Backend usa PUT para criar e atualizar
      await api.put(`/pacientes/${id}/habitos`, formData);
      // Recarregar dados
      const habRes = await api.get(`/pacientes/${id}/habitos`);
      setHabitos(habRes.data);
      setShowHabitosModal(false);
      alert("Hábitos atualizados com sucesso!");
    } catch (err) {
      console.error("Erro ao guardar hábitos:", err);
      alert("Erro ao guardar dados dos hábitos.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="historico-page">
        <Navbar variant="gestor" />
        <main className="historico-main">
          <div className="loading-state">A carregar histórico...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historico-page">
        <Navbar variant="gestor" />
        <main className="historico-main">
          <div className="error-state">{error}</div>
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="historico-page">
      <Navbar variant="gestor" />

      <main className="historico-main">
        <header className="historico-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
            </button>
            <h1 className="page-title">HISTÓRICO MÉDICO</h1>
          </div>
          <h2 className="patient-name">{paciente?.nomeCompleto || "Utente"}</h2>
        </header>

        <div className="historico-content">
          {/* CARTÃO 1: HISTÓRICO GERAL */}
          <section className="info-card">
            <div className="card-header">
              <h3>Histórico</h3>
            </div>
            <div className="card-body grid-2-col">
              <div className="info-group">
                <label>Condições de Saúde</label>
                <p>{historico?.condicoesSaude || "Nenhuma"}</p>
              </div>
              <div className="info-group">
                <label>Alergias</label>
                <p>{historico?.alergias || "Nenhuma"}</p>
              </div>
              <div className="info-group">
                <label>Cirurgias Realizadas</label>
                <p>{historico?.cirurgiasRealizadas || "Nenhuma"}</p>
              </div>
              <div className="info-group">
                <label>Internações/Tratamentos</label>
                <p>{historico?.internacoes || "Nenhuma"}</p>
              </div>
              <div className="info-group">
                <label>Gravidez</label>
                <p>{historico?.gravidez || "N/A"}</p>
              </div>
              <div className="info-group">
                <label>Notas</label>
                <p>{historico?.omd || "Sem notas registadas."}</p>
              </div>
            </div>
            <div className="card-actions">
              <button className="edit-btn" onClick={handleEditHistorico}>
                Editar Dados <Edit size={14} />
              </button>
            </div>
          </section>

          {/* CARTÃO 2: HÁBITOS E ESTILO DE VIDA */}
          <section className="info-card">
            <div className="card-header">
              <h3>Hábitos e Estilo de Vida</h3>
            </div>
            <div className="card-body grid-2-col">
              <div className="info-group">
                <label>Escovagem dos dentes</label>
                <p>{habitos?.escovagem || "Sem informação"}</p>
              </div>
              <div className="info-group">
                <label>Alimentação</label>
                <p>{habitos?.alimentacao || "Sem informação"}</p>
              </div>
              <div className="info-group">
                <label>Consumo de Substâncias</label>
                <p>{habitos?.consumoSubstancias || "Não"}</p>
              </div>
              <div className="info-group">
                <label>Bruxismo</label>
                <p>{habitos?.bruxismo || "Não"}</p>
              </div>
              <div className="info-group full-width">
                <label>Atividade Física</label>
                <p>{habitos?.atividadeFisica || "Sem informação"}</p>
              </div>
            </div>
            <div className="card-actions">
              <button className="edit-btn" onClick={handleEditHabitos}>
                Editar Dados <Edit size={14} />
              </button>
            </div>
          </section>

          {/* CARTÃO 3: EXAMES */}
          <section
            className={`exames-section ${isDragging ? "drag-active" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="exames-header">
              <h3>EXAMES</h3>
            </div>

            <div className="exames-list">
              {exames.length === 0 ? (
                <p className="no-exames">Não há exames anexados.</p>
              ) : (
                exames.map((exame) => (
                  <div key={exame.id} className="exame-item">
                    <div className="exame-icon">
                      <FileText size={24} />
                    </div>
                    <span className="exame-name">{exame.anexo}</span>
                    <a
                      href={`${api.defaults.baseURL}${exame.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                ))
              )}
            </div>

            <div className="exames-upload">
              <div className="upload-drop-zone">
                <Upload size={24} />
                <span>Arraste ficheiros aqui ou</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <button
                className="anexar-btn"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                {uploading ? "A enviar..." : "Anexar Exame"}
                <Upload size={16} style={{ marginLeft: 8 }} />
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Modais de Edição */}
      <EditHistoricoModal
        isOpen={showHistoricoModal}
        onClose={() => setShowHistoricoModal(false)}
        onSave={handleSaveHistorico}
        data={historico}
        loading={saving}
      />

      <EditHabitosModal
        isOpen={showHabitosModal}
        onClose={() => setShowHabitosModal(false)}
        onSave={handleSaveHabitos}
        data={habitos}
        loading={saving}
      />

      <footer className="simple-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default HistoricoMedico;
