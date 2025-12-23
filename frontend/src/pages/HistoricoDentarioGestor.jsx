/**
 * HistoricoDentarioGestor.jsx - Página de Histórico Dentário para Gestores
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import { Edit, Clock } from "lucide-react";
import "./HistoricoDentarioGestor.css";

function HistoricoDentarioGestor() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para dados
  const [paciente, setPaciente] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [tratamentos, setTratamentos] = useState([]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Carregar dados do paciente
        const pRes = await api.get(`/pacientes/${id}`);
        setPaciente(pRes?.data?.data || pRes?.data);

        // 2. Carregar Histórico Dentário
        const histRes = await api.get(`/pacientes/${id}/historico-dentario`);
        setHistorico(histRes.data);

        // 3. Carregar Tratamentos
        const tratRes = await api.get(`/pacientes/${id}/tratamentos`);
        setTratamentos(tratRes.data || []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar dados do histórico dentário.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleEditHistorico = () => {
    setShowEditModal(true);
  };

  const handleSaveHistorico = async (formData) => {
    setSaving(true);
    try {
      await api.put(`/pacientes/${id}/historico-dentario`, formData);
      const histRes = await api.get(`/pacientes/${id}/historico-dentario`);
      setHistorico(histRes.data);
      setShowEditModal(false);
      alert("Histórico dentário atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao guardar histórico:", err);
      alert("Erro ao guardar dados do histórico.");
    } finally {
      setSaving(false);
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="hist-dent-page">
        <Navbar variant="gestor" />
        <main className="hist-dent-main">
          <div className="loading-state">A carregar histórico dentário...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hist-dent-page">
        <Navbar variant="gestor" />
        <main className="hist-dent-main">
          <div className="error-state">{error}</div>
          <button onClick={() => navigate(-1)} className="back-btn">
            Voltar
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="hist-dent-page">
      <Navbar variant="gestor" />

      <main className="hist-dent-main">
        <header className="hist-dent-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Voltar
            </button>
            <h1 className="page-title">HISTÓRICO DENTÁRIO</h1>
          </div>
          <h2 className="patient-name">{paciente?.nomeCompleto || "Utente"}</h2>
        </header>

        <div className="hist-dent-content">
          {/* CARTÃO 1: HISTÓRICO */}
          <section className="info-card">
            <div className="card-header">
              <h3>Histórico</h3>
            </div>
            <div className="card-body grid-2-col">
              <div className="info-group">
                <label>Motivo da primeira consulta</label>
                <p>{historico?.motivoPrimeiraConsulta || "Sem informação"}</p>
              </div>
              <div className="info-group">
                <label>Condições dentárias pré-existentes</label>
                <p>{historico?.condicoesDentarias || "Sem informação"}</p>
              </div>
              <div className="info-group">
                <label>Tratamentos Passados</label>
                <p>{historico?.tratamentosPassados || "Sem informação"}</p>
              </div>
              <div className="info-group">
                <label>Histórico de Dor, Desconforto e Sensibilidade</label>
                <p>{historico?.historicoDor || "Sem informação"}</p>
              </div>
              <div className="info-group full-width">
                <label>Experiência com Anestesias</label>
                <p>{historico?.expAnestesia || "Sem informação"}</p>
              </div>
            </div>
            <div className="card-actions">
              <button className="edit-btn" onClick={handleEditHistorico}>
                Editar Dados <Edit size={14} />
              </button>
            </div>
          </section>

          {/* CARTÃO 2: TRATAMENTOS ANTERIORES */}
          <section className="tratamentos-section">
            <div className="tratamentos-header">
              <h3>TRATAMENTOS ANTERIORES</h3>
              <div className="tratamentos-icon">
                <Clock size={48} />
              </div>
            </div>

            <div className="tratamentos-list">
              {tratamentos.length === 0 ? (
                <p className="no-tratamentos">Não há tratamentos registados.</p>
              ) : (
                tratamentos.map((trat) => (
                  <div
                    key={trat.id_plano_tratamento}
                    className="tratamento-item"
                  >
                    <span className="tratamento-nome">
                      {trat.id_t_p_tratamento_tipos_planos_tratamento
                        ?.descricao || "Tratamento"}
                    </span>
                    <span className="tratamento-data">
                      {formatDate(trat.data_inicio)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Modal de Edição */}
      {showEditModal && (
        <EditHistoricoDentarioModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveHistorico}
          data={historico}
          loading={saving}
        />
      )}

      <footer className="simple-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// Modal component inline para editar histórico dentário
function EditHistoricoDentarioModal({
  isOpen,
  onClose,
  onSave,
  data,
  loading,
}) {
  const [formData, setFormData] = useState({
    motivoPrimeiraConsulta: data?.motivoPrimeiraConsulta || "",
    condicoesDentarias: data?.condicoesDentarias || "",
    tratamentosPassados: data?.tratamentosPassados || "",
    expAnestesia: data?.expAnestesia || "",
    historicoDor: data?.historicoDor || "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Histórico Dentário</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-form">
              <div className="modal-form-grid">
                <div className="modal-form-group">
                  <label htmlFor="motivoPrimeiraConsulta">
                    Motivo da primeira consulta
                  </label>
                  <textarea
                    id="motivoPrimeiraConsulta"
                    value={formData.motivoPrimeiraConsulta}
                    onChange={handleChange("motivoPrimeiraConsulta")}
                    placeholder="Ex: Dor de dentes, limpeza..."
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="condicoesDentarias">
                    Condições dentárias pré-existentes
                  </label>
                  <textarea
                    id="condicoesDentarias"
                    value={formData.condicoesDentarias}
                    onChange={handleChange("condicoesDentarias")}
                    placeholder="Ex: Cáries, gengivite..."
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="tratamentosPassados">
                    Tratamentos Passados
                  </label>
                  <textarea
                    id="tratamentosPassados"
                    value={formData.tratamentosPassados}
                    onChange={handleChange("tratamentosPassados")}
                    placeholder="Ex: Aparelho ortodôntico..."
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="historicoDor">
                    Histórico de Dor, Desconforto e Sensibilidade
                  </label>
                  <textarea
                    id="historicoDor"
                    value={formData.historicoDor}
                    onChange={handleChange("historicoDor")}
                    placeholder="Ex: Sensibilidade ao frio..."
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label htmlFor="expAnestesia">Experiência com Anestesias</label>
                <textarea
                  id="expAnestesia"
                  value={formData.expAnestesia}
                  onChange={handleChange("expAnestesia")}
                  placeholder="Ex: Sempre reagiu bem..."
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-save"
              disabled={loading}
            >
              {loading ? "A guardar..." : "Guardar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HistoricoDentarioGestor;
