import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import { User, Calendar, Clock, ChevronDown, Stethoscope } from "lucide-react";
import toothSvg from "../assets/tooth.svg?raw";
import "./AgendarConsulta.css";
function AgendarConsulta() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pacientes, setPacientes] = useState([]);
  // Form state
  const [formData, setFormData] = useState({
    pacienteId: "",
    pacienteNome: "",
    pacienteNumero: "",
    data: "",
    horario: "09:00", // Definido um valor padrão seguro para o picker
    medico: "",
    tratamento: "",
    especialidade: "",
    notas: "",
  });
  // Dropdown state
  const [pacienteSearch, setPacienteSearch] = useState("");
  const [showPacienteDropdown, setShowPacienteDropdown] = useState(false);
  const dropdownRef = useRef(null);
  // Placeholder data for dropdowns
  const medicos = ["Dr. Silva", "Dra. Maria", "Dr. Santos"];
  const tratamentos = ["Limpeza", "Extração", "Canal", "Aparelho"];
  const especialidades = [
    "Ortodontia",
    "Cirurgia Oral",
    "Odontopediatria",
    "Generalista",
  ];
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const resp = await api.get("/pacientes", { params: { pageSize: 100 } });
        const data = resp?.data?.data || resp?.data || [];
        let lista = Array.isArray(data) ? data : [];
        // Enrich entries missing numeroUtente/nus by fetching details
        const need = lista.filter((p) => !(p?.numeroUtente || p?.nus) && p?.id);
        if (need.length > 0) {
          try {
            const details = await Promise.all(
              need.map((p) =>
                api
                  .get(`/pacientes/${p.id}`)
                  .then((r) => r?.data?.data || r?.data)
                  .catch(() => null)
              )
            );
            const byId = {};
            details.forEach((d) => {
              if (d && d.id) byId[d.id] = d;
            });
            lista = lista.map((p) =>
              p.id && byId[p.id] ? { ...p, ...byId[p.id] } : p
            );
          } catch (e) {
            // ignore
          }
        }
        setPacientes(lista);
      } catch (err) {
        console.error("Erro ao carregar pacientes:", err);
      }
    };
    fetchPacientes();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPacienteDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const filteredPacientes = pacientes.filter((p) => {
    const name = p.nomeCompleto?.toLowerCase() || "";
    const nus = String(p.nus || p.numeroUtente || "").toLowerCase();
    return (
      name.includes(pacienteSearch.toLowerCase()) ||
      nus.includes(pacienteSearch.toLowerCase())
    );
  });
  const selectPaciente = (p) => {
    setFormData((prev) => ({
      ...prev,
      pacienteId: p.id,
      pacienteNome: p.nomeCompleto,
      pacienteNumero: p.nus || p.numeroUtente || "",
    }));
    setPacienteSearch(
      `${p.nomeCompleto}${
        p.nus || p.numeroUtente ? " - " + (p.nus || p.numeroUtente) : ""
      }`
    );
    setShowPacienteDropdown(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        id_utente: formData.pacienteId,
        id_entidade_medica: null, // Pode ser expandido futuramente
        data: formData.data,
        hora: formData.horario, // O input[type="time"] já devolve "HH:MM"
        notas: `${formData.especialidade} - ${formData.tratamento}${
          formData.notas ? " - " + formData.notas : ""
        }`,
      };
      // Endpoint correto para gestão administrativa
      await api.post("/admin/consultas", payload);
      alert("Consulta agendada com sucesso!");
      navigate("/gestor/consultas");
    } catch (err) {
      console.error("Erro ao agendar consulta:", err);
      setError(
        err.response?.data?.mensagem ||
          "Erro ao agendar consulta. Verifique os dados."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="agendar-consulta-page">
      <Navbar variant="gestor" />
      <main className="agendar-consulta-main">
        <h1 className="agendar-consulta-title">AGENDAR UMA CONSULTA</h1>
        <form className="agendar-consulta-form" onSubmit={handleSubmit}>
          {error && (
            <div
              className="form-error"
              style={{
                color: "red",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <div className="form-row">
            {/* Paciente */}
            <div className="form-group">
              <label>Paciente</label>
              <div className="searchable-dropdown" ref={dropdownRef}>
                <div className="input-with-icon">
                  <input
                    type="text"
                    placeholder="Escolher..."
                    value={pacienteSearch}
                    onChange={(e) => {
                      setPacienteSearch(e.target.value);
                      setShowPacienteDropdown(true);
                    }}
                    onFocus={() => setShowPacienteDropdown(true)}
                    required
                  />
                  <div className="icon-container">
                    <User size={20} />
                  </div>
                </div>
                {showPacienteDropdown && (
                  <div className="dropdown-results">
                    {filteredPacientes.length > 0 ? (
                      filteredPacientes.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="dropdown-item"
                          onClick={() => selectPaciente(p)}
                        >
                          <span className="patient-name">{p.nomeCompleto}</span>
                          <span className="patient-details">
                            NUS: {p.numeroUtente || p.nus || "N/A"}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div
                        className="dropdown-item"
                        style={{ cursor: "default" }}
                      >
                        Nenhum paciente encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Data */}
            <div className="form-group">
              <label>Data</label>
              <div className="input-with-icon">
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleChange("data", e.target.value)}
                  required
                />
                <div className="icon-container">
                  <Calendar size={20} />
                </div>
              </div>
            </div>
            {/* Horário (Time Picker) */}
            <div className="form-group">
              <label>Horário</label>
              <div className="input-with-icon">
                <input
                  type="time"
                  value={formData.horario}
                  onChange={(e) => handleChange("horario", e.target.value)}
                  required
                  style={{ minHeight: "45px" }}
                />
                <div className="icon-container">
                  <Clock size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Médico</label>
              <div className="input-with-icon">
                <select
                  value={formData.medico}
                  onChange={(e) => handleChange("medico", e.target.value)}
                  required
                >
                  <option value="">Dentista</option>
                  {medicos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <div className="icon-container">
                  <Stethoscope size={20} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Tratamento</label>
              <div className="input-with-icon">
                <select
                  value={formData.tratamento}
                  onChange={(e) => handleChange("tratamento", e.target.value)}
                  required
                >
                  <option value="">N/A</option>
                  {tratamentos.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div
                  className="icon-container"
                  dangerouslySetInnerHTML={{ __html: toothSvg }}
                  style={{ width: "20px", height: "20px" }}
                ></div>
              </div>
            </div>
            <div className="form-group">
              <label>Especialidade</label>
              <div className="input-with-icon">
                <select
                  value={formData.especialidade}
                  onChange={(e) =>
                    handleChange("especialidade", e.target.value)
                  }
                  required
                >
                  <option value="">Especialidade</option>
                  {especialidades.map((esp) => (
                    <option key={esp} value={esp}>
                      {esp}
                    </option>
                  ))}
                </select>
                <div className="icon-container">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label>Notas</label>
            <textarea
              placeholder="Escrever..."
              value={formData.notas}
              onChange={(e) => handleChange("notas", e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "A submeter..." : "Submeter"}
            </button>
          </div>
        </form>
      </main>
      <footer className="consultas-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
export default AgendarConsulta;
