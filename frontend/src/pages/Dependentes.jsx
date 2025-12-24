import React, { useEffect, useState } from "react";
import { Navbar } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { UserCheck } from "lucide-react";
import "./Dependentes.css";
import profileService from "../services/profile.service";

function Dependentes() {
  const navigate = useNavigate();
  const { id: urlDependentId } = useParams(); // Get ID from URL if provided
  const [dependents, setDependents] = useState([]);
  const [selectedDependent, setSelectedDependent] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [switchingProfile, setSwitchingProfile] = useState(false);
  const [error, setError] = useState(null);

  // Check if currently acting as a dependent
  const getActiveProfileInfo = () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.activeProfileId || null;
      }
    } catch {
      return null;
    }
    return null;
  };

  const activeProfileId = getActiveProfileInfo();

  // Fetch list of dependents on mount
  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await profileService.getDependents();
        setDependents(data);

        // If URL has a dependent ID, auto-select that dependent
        if (urlDependentId) {
          const details = await profileService.getDependentDetails(
            urlDependentId
          );
          setSelectedDependent(details);
        }
      } catch (err) {
        console.error("Erro ao carregar dependentes:", err);
        setError("Não foi possível carregar a lista de dependentes.");
      } finally {
        setLoadingList(false);
      }
    };

    fetchList();
  }, [urlDependentId]);

  const handleSelectDependent = async (id) => {
    setLoadingDetails(true);
    setError(null);
    try {
      const details = await profileService.getDependentDetails(id);
      setSelectedDependent(details);
      // Update URL to reflect selection
      navigate(`/perfil/dependentes/${id}`, { replace: true });
    } catch (err) {
      console.error("Erro ao carregar detalhes do dependente:", err);
      setError("Não foi possível carregar os detalhes do dependente.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSwitchToDependent = async () => {
    if (!selectedDependent) return;

    setSwitchingProfile(true);
    setError(null);
    try {
      await profileService.switchProfile(selectedDependent.id);
      // Redirect to home after switching
      navigate("/home");
      // Force page reload to update navbar and other components
      window.location.reload();
    } catch (err) {
      console.error("Erro ao alternar perfil:", err);
      setError("Não foi possível alternar para o perfil do dependente.");
    } finally {
      setSwitchingProfile(false);
    }
  };

  const handleBack = () => {
    if (selectedDependent) {
      setSelectedDependent(null);
      setError(null);
      // Update URL to remove the ID
      navigate("/perfil/dependentes", { replace: true });
    } else {
      navigate(-1);
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT");
  };

  // Prepare structure for details view
  const moradaCompleta = selectedDependent?.morada
    ? `${selectedDependent.morada.rua || ""}, ${
        selectedDependent.morada.localidade || ""
      }`
    : "N/A";
  const codigoPostal = selectedDependent?.morada?.codigoPostal || "N/A";

  const fields = selectedDependent
    ? [
        {
          label: "Data de Nascimento",
          value: formatDate(selectedDependent.dataNascimento),
        },
        { label: "Género", value: selectedDependent.genero || "N/A" },
        { label: "Morada", value: moradaCompleta.replace(/^, /, "") },
        { label: "Código Postal", value: codigoPostal },
        {
          label: "Número de Utente",
          value:
            selectedDependent.numeroUtente || selectedDependent.nus || "N/A",
        },
        {
          label: "Número de Identificação Fiscal",
          value: selectedDependent.nif || "N/A",
        },
        {
          label: "Estado Civil",
          value: selectedDependent.estadoCivil || "N/A",
        },
        { label: "Email", value: selectedDependent.email || "N/A" },
        { label: "Telemóvel", value: selectedDependent.telefone || "N/A" }, // API uses 'telefone'
      ]
    : [];

  return (
    <div className="dependentes-page">
      <Navbar variant="utente" />

      <main className="dependentes-main">
        <header className="dependentes-header">
          <div className="header-row">
            <button className="back-btn" onClick={handleBack}>
              ← Voltar
            </button>
            <h1 className="dependentes-title">DEPENDENTES</h1>
          </div>
        </header>

        {error && <div className="error-state">{error}</div>}

        {loadingList ? (
          <div className="loading-state">A carregar lista...</div>
        ) : !selectedDependent ? (
          /* Initial View: List of buttons */
          <div className="dependents-list">
            {dependents.length === 0 ? (
              <p className="empty-state">Não existem dependentes associados.</p>
            ) : (
              dependents.map((dep) => (
                <button
                  key={dep.id}
                  className="dependent-btn"
                  onClick={() => handleSelectDependent(dep.id)}
                >
                  {dep.nomeCompleto}
                </button>
              ))
            )}
          </div>
        ) : (
          /* Detailed View */
          <div className="detail-card">
            {loadingDetails ? (
              <div className="loading-state">A carregar detalhes...</div>
            ) : (
              <>
                <h2 className="dependent-name">
                  {selectedDependent.nomeCompleto}
                </h2>
                <div className="fields-grid">
                  {fields.map((field, index) => (
                    <div key={index} className="field-item">
                      <label className="field-label">{field.label}</label>
                      <p className="field-value">{field.value}</p>
                    </div>
                  ))}
                </div>
                {/* Only show switch button if NOT already acting as this dependent */}
                {!activeProfileId && (
                  <div className="detail-actions">
                    <button
                      className="switch-profile-btn"
                      onClick={handleSwitchToDependent}
                      disabled={switchingProfile}
                    >
                      <UserCheck size={18} />
                      {switchingProfile
                        ? "A alternar..."
                        : "Gerir como este dependente"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dependentes;
