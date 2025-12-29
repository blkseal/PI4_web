/**
 * EditarPaciente.jsx - Página de edição de paciente (Gestor)
 *
 * Permite editar os dados de um paciente existente.
 * Carrega os dados atuais e permite a submissão via PUT.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import "./NovoPaciente.css"; // Reutilizando estilos do NovoPaciente (mesmo layout)

function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    codigoPostal: "",
    email: "",
    genero: "",
    numeroUtente: "",
    telefone: "",
    morada: "",
    nif: "",
    estadoCivil: "",
    dependente: null,
    responsavelId: "",
  });

  const [pacientes, setPacientes] = useState([]);

  // Fetch patient data
  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      try {
        // 1. Fetch patient details
        const respPatient = await api.get(`/pacientes/${id}`);
        const p = respPatient?.data?.data || respPatient?.data;

        if (p) {
          setFormData({
            nomeCompleto: p.nomeCompleto || "",
            dataNascimento: p.dataNascimento
              ? p.dataNascimento.split("T")[0]
              : "",
            codigoPostal: p.morada?.codigoPostal || "",
            email: p.email || "",
            genero: p.genero || "",
            numeroUtente: p.numeroUtente || p.nus || "",
            telefone: p.telefone || "",
            morada: p.morada?.morada || "",
            nif: p.nif || "",
            estadoCivil: p.estadoCivil || "",
            dependente: false,
            responsavelId: "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados do paciente.");
      } finally {
        setFetching(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        nomeCompleto: formData.nomeCompleto,
        dataNascimento: formData.dataNascimento,
        genero: formData.genero,
        email: formData.email,
        telefone: formData.telefone,
        nus: formData.numeroUtente,
        nif: formData.nif,
        estadoCivil: formData.estadoCivil,
        morada: {
          rua: formData.morada,
          codigoPostal: formData.codigoPostal,
          localidade: "",
        },
      };

      await api.put(`/pacientes/${id}`, payload);
      navigate(`/pacientes/${id}`);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao atualizar paciente. Verifique os dados.");
      }
    } finally {
      setLoading(false);
    }
  };

  const generoOptions = ["Masculino", "Feminino", "Outro"];
  const estadoCivilOptions = [
    "Solteiro(a)",
    "Casado(a)",
    "Divorciado(a)",
    "Viúvo(a)",
    "União de Facto",
  ];

  if (fetching) {
    return (
      <div className="novo-paciente-page">
        <Navbar variant="gestor" />
        <main className="novo-paciente-main">
          <div className="loading-state">A carregar dados...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="novo-paciente-page">
      <Navbar variant="gestor" />

      <main className="novo-paciente-main">
        <h1 className="novo-paciente-title">EDITAR DADOS</h1>

        <form className="novo-paciente-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          {/* Nome Completo */}
          <div className="form-row full-width">
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                value={formData.nomeCompleto}
                onChange={(e) => handleChange("nomeCompleto", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row: Data Nascimento, Código Postal, Email */}
          <div className="form-row three-cols">
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Código Postal</label>
              <input
                type="text"
                value={formData.codigoPostal}
                onChange={(e) => handleChange("codigoPostal", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row: Género, Número de Utente, Telemóvel */}
          <div className="form-row three-cols">
            <div className="form-group">
              <label>Género</label>
              <select
                value={formData.genero}
                onChange={(e) => handleChange("genero", e.target.value)}
                required
              >
                <option value="">Escolher...</option>
                {generoOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Número de Utente</label>
              <input
                type="text"
                value={formData.numeroUtente}
                onChange={(e) => handleChange("numeroUtente", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Telemóvel</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row: Morada, NIF + Estado Civil */}
          <div className="form-row three-cols">
            <div className="form-group">
              <label>Morada</label>
              <textarea
                value={formData.morada}
                onChange={(e) => handleChange("morada", e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="form-group stacked">
              <div className="form-group">
                <label>Número de Identificação Fiscal</label>
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => handleChange("nif", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado Civil</label>
                <select
                  value={formData.estadoCivil}
                  onChange={(e) => handleChange("estadoCivil", e.target.value)}
                  required
                >
                  <option value="">Escolher...</option>
                  {estadoCivilOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Empty third column to match grid layout of NovoPaciente */}
            <div className="form-group"></div>
          </div>

          {/* Submit button */}
          <div className="form-actions">
            <button
              type="button"
              className="submit-btn"
              onClick={() => navigate(`/pacientes/${id}`)}
              style={{
                marginRight: "1rem",
                background: "#ccc",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                color: "#333",
                height: "44px",
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "A guardar..." : "Guardar Alterações"}
            </button>
          </div>
        </form>
      </main>

      <footer className="novo-paciente-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default EditarPaciente;
