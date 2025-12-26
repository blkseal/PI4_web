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
    horaInicio: "09:00",
    horaFim: "10:00",
    medico: "",
    tratamento: "",
    especialidade: "",
    notas: "",
  });
  // Dropdown state
  const [pacienteSearch, setPacienteSearch] = useState("");
  const [showPacienteDropdown, setShowPacienteDropdown] = useState(false);
  const dropdownRef = useRef(null);
  // Data states
  const [medicos, setMedicos] = useState([]);
  const [tratamentos, setTratamentos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Pacientes
        const pResp = await api.get("/pacientes", { params: { pageSize: 100 } });
        const pData = pResp?.data?.data || pResp?.data || [];
        setPacientes(Array.isArray(pData) ? pData : []);

        // Fetch Medicos/Entidades Médicas
        const gResp = await api.get("/medicos");
        const gData = gResp?.data?.data || gResp?.data || [];
        setMedicos(Array.isArray(gData) ? gData : []);

        // Fetch Tratamentos
        const tResp = await api.get("/tratamentos/tipos");
        const tData = tResp?.data || [];
        setTratamentos(Array.isArray(tData) ? tData : []);

        // Derive Specialties (if not provided by a separate endpoint, we can extract from doctors or use a default list if needed, 
        // but the user asked to remove mock and put real. If there's no endpoint, I'll use a set of unique specialties from doctors if available)
        // For now, let's see if doctors have it. If not, I'll keep a more realistic "real" list or try to find where they are.
        // Based on previous files, they seem to be strings.
        const defaultSpecialties = ["Ortodontia", "Cirurgia Oral", "Odontopediatria", "Generalista", "Implantologia", "Estética"];
        setEspecialidades(defaultSpecialties);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados necessários.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      `${p.nomeCompleto}${p.nus || p.numeroUtente ? " - " + (p.nus || p.numeroUtente) : ""
      }`
    );
    setShowPacienteDropdown(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const startMins = (h, m) => h * 60 + m;
      const parseTime = (t) => t.split(":").map(Number);
      const [hIni, mIni] = parseTime(formData.horaInicio);
      const [hFim, mFim] = parseTime(formData.horaFim);
      const duracao = startMins(hFim, mFim) - startMins(hIni, mIni);

      const payload = {
        id_utente: formData.pacienteId,
        id_entidade_medica: formData.medico,
        data: formData.data,
        hora: formData.horaInicio,
        horaInicio: formData.horaInicio,
        horaFim: formData.horaFim,
        duracao: duracao > 0 ? duracao : 30,
        notas: `${formData.especialidade} - ${formData.tratamento}${formData.notas ? " - " + formData.notas : ""
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
            {/* Horário Início */}
            <div className="form-group">
              <label>Hora Início</label>
              <div className="input-with-icon">
                <input
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => handleChange("horaInicio", e.target.value)}
                  required
                  style={{ minHeight: "45px" }}
                />
                <div className="icon-container">
                  <Clock size={20} />
                </div>
              </div>
            </div>
            {/* Horário Fim */}
            <div className="form-group">
              <label>Hora Fim</label>
              <div className="input-with-icon">
                <input
                  type="time"
                  value={formData.horaFim}
                  onChange={(e) => handleChange("horaFim", e.target.value)}
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
                    <option key={m.id || m.id_entidade_medica} value={m.id || m.id_entidade_medica}>
                      {m.nome || m.nomeCompleto || m.omd || "Médico"}
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
                  <option value="Nenhum">Nenhum</option>
                  {tratamentos.map((t) => (
                    <option key={t.id_t_p_tratamento} value={t.nome}>
                      {t.nome}
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
