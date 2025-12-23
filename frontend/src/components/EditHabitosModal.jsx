/**
 * EditHabitosModal.jsx - Modal para editar dados de Hábitos e Estilo de Vida
 *
 * Permite editar: Escovagem, Alimentação, Consumo de Substâncias, Bruxismo, Atividade Física.
 */

import React, { useState } from "react";
import { X } from "lucide-react";
import "./Modal.css";

// Inner form component that initializes state from props
function EditHabitosForm({ data, onSave, onClose, loading }) {
  const [formData, setFormData] = useState({
    escovagem: data?.escovagem || "",
    alimentacao: data?.alimentacao || "",
    consumoSubstancias: data?.consumoSubstancias || "",
    bruxismo: data?.bruxismo || "",
    atividadeFisica: data?.atividadeFisica || "",
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
              <label htmlFor="escovagem">Escovagem dos Dentes</label>
              <select
                id="escovagem"
                value={formData.escovagem}
                onChange={handleChange("escovagem")}
              >
                <option value="">Selecionar frequência</option>
                <option value="Nunca">Nunca</option>
                <option value="1x por dia">1x por dia</option>
                <option value="2x por dia">2x por dia</option>
                <option value="3x por dia">3x por dia</option>
                <option value="Após cada refeição">Após cada refeição</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label htmlFor="alimentacao">Alimentação</label>
              <select
                id="alimentacao"
                value={formData.alimentacao}
                onChange={handleChange("alimentacao")}
              >
                <option value="">Selecionar tipo</option>
                <option value="Equilibrada">Equilibrada</option>
                <option value="Rica em açúcares">Rica em açúcares</option>
                <option value="Rica em proteínas">Rica em proteínas</option>
                <option value="Vegetariana">Vegetariana</option>
                <option value="Vegana">Vegana</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label htmlFor="consumoSubstancias">Consumo de Substâncias</label>
              <select
                id="consumoSubstancias"
                value={formData.consumoSubstancias}
                onChange={handleChange("consumoSubstancias")}
              >
                <option value="">Selecionar</option>
                <option value="Não">Não</option>
                <option value="Tabaco">Tabaco</option>
                <option value="Álcool">Álcool</option>
                <option value="Tabaco e Álcool">Tabaco e Álcool</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label htmlFor="bruxismo">Bruxismo</label>
              <select
                id="bruxismo"
                value={formData.bruxismo}
                onChange={handleChange("bruxismo")}
              >
                <option value="">Selecionar</option>
                <option value="Não">Não</option>
                <option value="Sim">Sim</option>
                <option value="Suspeita">Suspeita</option>
                <option value="Em tratamento">Em tratamento</option>
              </select>
            </div>
          </div>

          <div className="modal-form-group">
            <label htmlFor="atividadeFisica">Atividade Física</label>
            <select
              id="atividadeFisica"
              value={formData.atividadeFisica}
              onChange={handleChange("atividadeFisica")}
            >
              <option value="">Selecionar frequência</option>
              <option value="Sedentário">Sedentário</option>
              <option value="Leve (1-2x semana)">Leve (1-2x semana)</option>
              <option value="Moderada (3-4x semana)">
                Moderada (3-4x semana)
              </option>
              <option value="Intensa (5+ x semana)">
                Intensa (5+ x semana)
              </option>
              <option value="Atleta profissional">Atleta profissional</option>
            </select>
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

function EditHabitosModal({ isOpen, onClose, onSave, data, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Hábitos e Estilo de Vida</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Key prop ensures form state resets when modal reopens */}
        <EditHabitosForm
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

export default EditHabitosModal;
