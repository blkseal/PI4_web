/**
 * TratamentosAtuais.jsx - Lista de tratamentos em curso (Gestor)
 *
 * Mostra todos os tratamentos ativos com os utentes associados.
 * Endpoint: GET /tratamentos/atuais
 */

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import { ArrowLeft, Stethoscope, Hash, User } from "lucide-react";
import "./TratamentosAtuais.css";

function TratamentosAtuais() {
  const navigate = useNavigate();
  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 7;

  // Filtros
  const [filtroNomeTratamento, setFiltroNomeTratamento] = useState("");
  const [filtroNumeroUtente, setFiltroNumeroUtente] = useState("");
  const [filtroNomePaciente, setFiltroNomePaciente] = useState("");

  useEffect(() => {
    const fetchTratamentos = async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await api.get("/tratamentos/atuais");
        setTratamentos(resp?.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Sessão expirada. Inicie sessão novamente.");
        } else {
          setError("Não foi possível carregar os tratamentos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTratamentos();
  }, []);

  // Apply filters
  const filteredTratamentos = useMemo(() => {
    return tratamentos.filter((t) => {
      const nomeTratamento =
        t.id_t_p_tratamento_tipos_planos_tratamento?.nome || "";
      const numeroUtente =
        t.id_utente_utente?.numeroUtente || t.id_utente_utente?.nus || "";
      const nomePaciente = t.id_utente_utente?.nome_completo || "";

      const matchNomeTratamento =
        !filtroNomeTratamento ||
        nomeTratamento
          .toLowerCase()
          .includes(filtroNomeTratamento.toLowerCase());

      const matchNumeroUtente =
        !filtroNumeroUtente ||
        numeroUtente.toLowerCase().includes(filtroNumeroUtente.toLowerCase());

      const matchNomePaciente =
        !filtroNomePaciente ||
        nomePaciente.toLowerCase().includes(filtroNomePaciente.toLowerCase());

      return matchNomeTratamento && matchNumeroUtente && matchNomePaciente;
    });
  }, [
    tratamentos,
    filtroNomeTratamento,
    filtroNumeroUtente,
    filtroNomePaciente,
  ]);

  // Pagination
  const paginatedTratamentos = useMemo(() => {
    const start = 0;
    const end = page * pageSize;
    return filteredTratamentos.slice(start, end);
  }, [filteredTratamentos, page]);

  const hasMore = paginatedTratamentos.length < filteredTratamentos.length;

  const handleVerMais = () => {
    setPage((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT");
  };

  const handleRowClick = (tratamento) => {
    const pacienteId = tratamento.id_utente_utente?.id || tratamento.id_utente;
    const tratamentoId = tratamento.id_p_tratamento;
    navigate(`/pacientes/${pacienteId}/tratamentos/${tratamentoId}`);
  };

  return (
    <div className="tratamentos-atuais-page">
      <Navbar variant="gestor" />

      <main className="tratamentos-atuais-main">
        <header className="tratamentos-atuais-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
            </button>
            <h1 className="page-title">TRATAMENTOS ATUAIS</h1>
          </div>
        </header>

        {/* Filtros */}
        <section className="tratamentos-atuais-filtros">
          <h2 className="filtros-title">FILTROS</h2>
          <div className="filtros-row">
            <div className="filtro-input-wrapper">
              <input
                type="text"
                placeholder="Nome do Tratamento"
                value={filtroNomeTratamento}
                onChange={(e) => setFiltroNomeTratamento(e.target.value)}
                className="filtro-input"
              />
              <div className="filtro-icon">
                <Stethoscope size={18} />
              </div>
            </div>

            <div className="filtro-input-wrapper">
              <input
                type="text"
                placeholder="Nº de Utente..."
                value={filtroNumeroUtente}
                onChange={(e) => setFiltroNumeroUtente(e.target.value)}
                className="filtro-input"
              />
              <div className="filtro-icon">
                <Hash size={18} />
              </div>
            </div>

            <div className="filtro-input-wrapper">
              <input
                type="text"
                placeholder="Nome do Paciente"
                value={filtroNomePaciente}
                onChange={(e) => setFiltroNomePaciente(e.target.value)}
                className="filtro-input"
              />
              <div className="filtro-icon">
                <User size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* Lista */}
        <section className="tratamentos-atuais-lista-section">
          <h2 className="lista-title">LISTA</h2>

          <div className="tratamentos-lista-container">
            {loading && (
              <div className="tratamentos-atuais-loading">A carregar...</div>
            )}

            {error && <div className="tratamentos-atuais-error">{error}</div>}

            {!loading && !error && filteredTratamentos.length === 0 && (
              <div className="tratamentos-atuais-empty">
                Nenhum tratamento encontrado.
              </div>
            )}

            {!loading && !error && filteredTratamentos.length > 0 && (
              <>
                {paginatedTratamentos.map((t) => (
                  <div
                    key={t.id_p_tratamento}
                    className="tratamento-card"
                    onClick={() => handleRowClick(t)}
                  >
                    {/* Group 1: Patient */}
                    <div className="tratamento-info-group patient">
                      <div className="tratamento-patient-name">
                        {t.id_utente_utente?.nome_completo || "—"}
                      </div>
                      <div className="tratamento-patient-num">
                        Nº Utente: {
                          t.id_utente_utente?.numeroUtente ||
                          t.id_utente_utente?.nus ||
                          "—"
                        }
                      </div>
                    </div>

                    {/* Group 2: Treatment */}
                    <div className="tratamento-info-group treatment">
                      {t.id_t_p_tratamento_tipos_planos_tratamento?.nome ||
                        "Tratamento"}
                    </div>

                    {/* Group 3: Date */}
                    <div className="tratamento-info-group date">
                      Data de Inicio: {formatDate(t.data_inicio)}
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <div className="ver-mais-btn-container">
                    <button
                      type="button"
                      className="ver-mais-btn"
                      onClick={handleVerMais}
                    >
                      Ver Mais
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="tratamentos-atuais-footer">
        Clinimolelos 2025 - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default TratamentosAtuais;
