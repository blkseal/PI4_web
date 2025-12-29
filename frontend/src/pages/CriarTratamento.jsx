/**
 * CriarTratamento.jsx - Página para criar tipo de tratamento (Gestor)
 *
 * Formulário para criar um novo tipo de tratamento com:
 * - Nome do Tratamento
 * - Duração (ex: "6 meses")
 * - Número de consultas
 * - Informações Úteis
 *
 * NOTA: Backend ainda não tem endpoint POST para /tratamentos/tipos
 * Endpoint esperado: POST /tratamentos/tipos
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";
import "./CriarTratamento.css";

function CriarTratamento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    duracao: "",
    numeroConsultas: "",
    informacoes: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        nome: formData.nome,
        duracao: formData.duracao,
        numeroConsultas: formData.numeroConsultas
          ? parseInt(formData.numeroConsultas, 10)
          : null,
        informacoes: formData.informacoes || null,
      };

      // TODO: Backend endpoint POST /tratamentos/tipos não existe ainda
      await api.post("/tratamentos/tipos", payload);
      navigate("/gestao/tratamentos");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Endpoint não disponível. Backend ainda não implementado.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao criar tratamento. Verifique os dados.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-tratamento-page">
      <Navbar variant="gestor" />

      <main className="criar-tratamento-main">
        <header className="criar-tratamento-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
            </button>
            <h1 className="page-title">CRIAR TRATAMENTO</h1>
          </div>
        </header>

        <form className="criar-tratamento-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-row three-cols">
            {/* Nome do Tratamento */}
            <div className="form-group">
              <label>Nome do Tratamento</label>
              <input
                type="text"
                placeholder="Tratamento P1"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                required
              />
            </div>

            {/* Duração */}
            <div className="form-group">
              <label>Duração</label>
              <input
                type="text"
                placeholder="6 meses"
                value={formData.duracao}
                onChange={(e) => handleChange("duracao", e.target.value)}
              />
            </div>

            {/* Número de consultas */}
            <div className="form-group">
              <label>Número de consultas</label>
              <input
                type="number"
                placeholder="12"
                min="1"
                value={formData.numeroConsultas}
                onChange={(e) =>
                  handleChange("numeroConsultas", e.target.value)
                }
              />
            </div>
          </div>

          {/* Informações Úteis */}
          <div className="form-group">
            <label>Informações Úteis</label>
            <textarea
              placeholder=""
              value={formData.informacoes}
              onChange={(e) => handleChange("informacoes", e.target.value)}
              rows={5}
            />
          </div>

          {/* Submit button */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "A submeter..." : "Submeter"}
            </button>
          </div>
        </form>
      </main>

      <footer className="criar-tratamento-footer">
        Clinimolelos 2025 - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default CriarTratamento;
