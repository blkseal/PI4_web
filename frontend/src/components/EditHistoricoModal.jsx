/**
 * EditHistoricoModal.jsx - Modal para editar dados do Histórico Médico
 *
 * Permite editar: Condições de Saúde, Alergias, Cirurgias, Internações, Gravidez, Notas.
 */

import React, { useState } from "react";
import { X } from "lucide-react";
import "./Modal.css";

// Inner form component that initializes state from props
function EditHistoricoForm({ data, onSave, onClose, loading }) {
  const [formData, setFormData] = useState({
    condicoesSaude: data?.condicoesSaude || "",
    alergias: data?.alergias || "",
    cirurgiasRealizadas: data?.cirurgiasRealizadas || "",
    internacoes: data?.internacoes || "",
    gravidez: data?.gravidez || "",
    omd: data?.omd || "", // Campo "notas" no backend chama-se "omd"
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="modal-form">
          <div className="modal-form-grid">
            <div className="modal-form-group">
              <label htmlFor="condicoesSaude">Condições de Saúde</label>
              <textarea
                id="condicoesSaude"
                value={formData.condicoesSaude}
                onChange={handleChange("condicoesSaude")}
                placeholder="Ex: Diabetes, Hipertensão..."
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="alergias">Alergias</label>
              <textarea
                id="alergias"
                value={formData.alergias}
                onChange={handleChange("alergias")}
                placeholder="Ex: Penicilina, Látex..."
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="cirurgiasRealizadas">Cirurgias Realizadas</label>
              <textarea
                id="cirurgiasRealizadas"
                value={formData.cirurgiasRealizadas}
                onChange={handleChange("cirurgiasRealizadas")}
                placeholder="Ex: Apendicectomia (2020)..."
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="internacoes">Internações/Tratamentos</label>
              <textarea
                id="internacoes"
                value={formData.internacoes}
                onChange={handleChange("internacoes")}
                placeholder="Ex: Pneumonia (2019)..."
              />
            </div>

            <div className="modal-form-group">
              <label htmlFor="gravidez">Gravidez</label>
              <select
                id="gravidez"
                value={formData.gravidez}
                onChange={handleChange("gravidez")}
              >
                <option value="">Selecionar</option>
                <option value="N/A">N/A</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
                <option value="Possibilidade">Possibilidade</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label htmlFor="omd">Notas Adicionais</label>
              <textarea
                id="omd"
                value={formData.omd}
                onChange={handleChange("omd")}
                placeholder="Observações gerais..."
              />
            </div>
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
  );
}

function EditHistoricoModal({ isOpen, onClose, onSave, data, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Histórico Médico</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Key prop ensures form state resets when modal reopens */}
        <EditHistoricoForm
          key={isOpen ? "open" : "closed"}
          data={data}
          onSave={onSave}
          onClose={onClose}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default EditHistoricoModal;
