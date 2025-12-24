/**
 * FichaPaciente.jsx - Página de detalhes do paciente (Gestor)
 *
 * Exibe informações completas do paciente com ações disponíveis.
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import toothSvg from "../assets/tooth.svg?raw";
import { Heart, Stethoscope } from "lucide-react";
import "./FichaPaciente.css";

function FichaPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [responsavelCompleto, setResponsavelCompleto] = useState(null);
  const [dependentesCompletos, setDependentesCompletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaciente = async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await api.get(`/pacientes/${id}`);
        const data = resp?.data?.data || resp?.data || null;
        setPaciente(data);

        // Reset extra states
        setResponsavelCompleto(null);
        setDependentesCompletos([]);

        // Fetch full details for Responsável if exists
        if (data?.responsavel?.id) {
          try {
            const respResp = await api.get(`/pacientes/${data.responsavel.id}`);
            setResponsavelCompleto(respResp?.data?.data || respResp?.data);
          } catch (err) {
            console.error("Erro ao carregar responsável:", err);
          }
        }

        // Fetch full details for Dependentes if exist
        if (data?.dependentes?.length > 0) {
          try {
            const depsPromises = data.dependentes.map((d) =>
              api.get(`/pacientes/${d.id}`)
            );
            const depsResponses = await Promise.all(depsPromises);
            const depsData = depsResponses.map((r) => r?.data?.data || r?.data);
            setDependentesCompletos(depsData);
          } catch (err) {
            console.error("Erro ao carregar dependentes:", err);
          }
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Paciente não encontrado.");
        } else if (err.response?.status === 401) {
          setError("Sessão expirada.");
        } else {
          setError("Erro ao carregar dados do paciente.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPaciente();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleEnviarCredenciais = async () => {
    try {
      await api.post(`/pacientes/${id}/enviar-credenciais`);
      alert("Credenciais enviadas com sucesso!");
    } catch (err) {
      alert("Erro ao enviar credenciais.");
    }
  };

  if (loading) {
    return (
      <div className="ficha-paciente-page">
        <Navbar variant="gestor" />
        <main className="ficha-paciente-main">
          <div className="loading-state">A carregar...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ficha-paciente-page">
        <Navbar variant="gestor" />
        <main className="ficha-paciente-main">
          <div className="error-state">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="ficha-paciente-page">
      <Navbar variant="gestor" />

      <main className="ficha-paciente-main">
        <header className="ficha-header">
          <h1 className="ficha-title">FICHA PACIENTE</h1>
          <h2 className="ficha-nome">{paciente?.nomeCompleto || "—"}</h2>
        </header>

        <div className="ficha-content">
          {/* Dados pessoais */}
          <section className="dados-section">
            <div className="dados-grid">
              <div className="dado-item">
                <span className="dado-label">Data de Nascimento</span>
                <span className="dado-value">
                  {formatDate(paciente?.dataNascimento)}
                </span>
              </div>
              <div className="dado-item">
                <span className="dado-label">Género</span>
                <span className="dado-value">{paciente?.genero || "—"}</span>
              </div>
              <div className="dado-item">
                <span className="dado-label">Morada</span>
                <span className="dado-value">
                  {paciente?.morada?.morada || "—"}
                </span>
              </div>
              <div className="dado-item">
                <span className="dado-label">Código Postal</span>
                <span className="dado-value">
                  {paciente?.morada?.codigoPostal || "—"}
                </span>
              </div>
              <div className="dado-item">
                <span className="dado-label">Número de Utente</span>
                <span className="dado-value">
                  {paciente?.numeroUtente || paciente?.nus || "—"}
                </span>
              </div>
              <div className="dado-item">
                <span className="dado-label">
                  Número de Identificação Fiscal
                </span>
                <span className="dado-value">{paciente?.nif || "—"}</span>
              </div>
              <div className="dado-item">
                <span className="dado-label">Estado Civil</span>
                <span className="dado-value">
                  {paciente?.estadoCivil || "—"}
                </span>
              </div>
              <div className="dado-item">
                <span className="dado-label">Email</span>
                <span className="dado-value">{paciente?.email || "—"}</span>
              </div>
              <div className="dado-item">
                <span className="dado-label">Telemóvel</span>
                <span className="dado-value">{paciente?.telefone || "—"}</span>
              </div>
            </div>
            <button
              type="button"
              className="editar-btn"
              onClick={() => navigate(`/pacientes/${id}/editar`)}
            >
              Editar Dados ✎
            </button>
          </section>

          {/* Action buttons */}
          <aside className="actions-sidebar">
            {paciente?.responsavel && (
              <button
                type="button"
                className="action-btn light"
                onClick={() =>
                  alert("Funcionalidade de desvincular ainda não implementada.")
                }
              >
                DESVINCULAR DEPENDÊNCIA
              </button>
            )}

            <button
              type="button"
              className="action-btn light"
              onClick={handleEnviarCredenciais}
            >
              ENVIAR CREDENCIAIS
            </button>

            <button
              type="button"
              className="action-btn brown"
              onClick={() => navigate(`/pacientes/${id}/tratamentos/novo`)}
            >
              <span className="action-text">NOVO TRATAMENTO</span>
              <div className="action-icon novo-tratamento-icon">
                <Heart size={32} strokeWidth={1.5} />
              </div>
            </button>

            <button
              type="button"
              className="action-btn brown"
              onClick={() => navigate(`/pacientes/${id}/tratamentos`)}
            >
              <span className="action-text">TRATAMENTOS ATUAIS</span>
              <div
                className="action-icon"
                dangerouslySetInnerHTML={{ __html: toothSvg }}
              />
            </button>

            <button
              type="button"
              className="action-btn bronze"
              onClick={() => navigate(`/pacientes/${id}/historico-dentario`)}
            >
              <span className="action-text">HISTÓRICO DENTÁRIO</span>
              <div
                className="action-icon"
                dangerouslySetInnerHTML={{ __html: toothSvg }}
              />
            </button>

            <button
              type="button"
              className="action-btn dark"
              onClick={() => navigate(`/pacientes/${id}/historico-medico`)}
            >
              <span className="action-text">HISTÓRICO MÉDICO</span>
              <div className="action-icon" style={{ marginTop: "0.25rem" }}>
                <Stethoscope size={32} strokeWidth={1.5} />
              </div>
              {/* <span className="action-subtext">SOMENTE ACESSÍVEL A MÉDICOS</span> */}
            </button>
          </aside>
        </div>

        {/* Dependentes section */}
        {/* Dependentes section or Responsible section */}
        <section className="dependentes-section">
          {/* Caso tenha responsável (é dependente) */}
          {paciente?.responsavel ? (
            <>
              <div className="dependentes-header">
                <h3>Responsável</h3>
                <button
                  type="button"
                  className="editar-btn"
                  onClick={() => navigate(`/pacientes/${id}/editar`)}
                >
                  Editar Dados ✎
                </button>
              </div>
              <div className="dependentes-list">
                {responsavelCompleto ? (
                  <div
                    className="dependente-card clickable"
                    onClick={() =>
                      navigate(`/pacientes/${responsavelCompleto.id}`)
                    }
                  >
                    <span className="dep-nome">
                      {responsavelCompleto.nomeCompleto}
                    </span>
                    <span className="dep-info">
                      Data de Nascimento:{" "}
                      {formatDate(responsavelCompleto.dataNascimento)}{" "}
                      {calculateAge(responsavelCompleto.dataNascimento) !==
                        null &&
                        ` (${calculateAge(
                          responsavelCompleto.dataNascimento
                        )})`}
                    </span>
                    <span className="dep-info">
                      Nº Utente:{" "}
                      {responsavelCompleto.numeroUtente ||
                        responsavelCompleto.nus ||
                        "—"}
                    </span>
                    <span className="dep-info">Agregado: Pai/Mãe</span>
                  </div>
                ) : (
                  <p className="loading-state">A carregar responsável...</p>
                )}
              </div>
            </>
          ) : (
            /* Caso não tenha responsável (é titular/independente) -> Mostra dependentes */
            <>
              <div className="dependentes-header">
                <h3>Dependentes</h3>
                <button
                  type="button"
                  className="editar-btn"
                  onClick={() => navigate(`/pacientes/${id}/editar`)}
                >
                  Editar Dados ✎
                </button>
              </div>
              <div className="dependentes-list">
                {!dependentesCompletos || dependentesCompletos.length === 0 ? (
                  paciente?.dependentes?.length > 0 ? (
                    <p className="loading-state">A carregar dependentes...</p>
                  ) : (
                    <p className="no-dependentes">
                      Sem dependentes registados.
                    </p>
                  )
                ) : (
                  dependentesCompletos.map((dep) => (
                    <div
                      key={dep.id}
                      className="dependente-card clickable"
                      onClick={() => navigate(`/pacientes/${dep.id}`)}
                    >
                      <span className="dep-nome">{dep.nomeCompleto}</span>
                      <span className="dep-info">
                        Data de Nascimento: {formatDate(dep.dataNascimento)}
                        {calculateAge(dep.dataNascimento) !== null &&
                          ` (${calculateAge(dep.dataNascimento)})`}
                      </span>
                      <span className="dep-info">
                        Nº Utente: {dep.numeroUtente || dep.nus || "—"}
                      </span>
                      <span className="dep-info">Agregado: Filho(a)</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="ficha-paciente-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default FichaPaciente;
