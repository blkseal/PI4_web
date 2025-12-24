/**
 * Pacientes.jsx - Página de gestão de pacientes (Gestor)
 *
 * Lista de pacientes com pesquisa e ações rápidas.
 */

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, SearchBar, PatientCard, ActionCard } from "../components";
import api from "../services/api";
import qrSvg from "../assets/qr.svg?raw";
import personPlusSvg from "../assets/mdi_person-plus.svg?raw";
import "./Pacientes.css";

function Pacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 7;

  const fetchPacientes = useCallback(async (searchQuery, pageNum) => {
    setLoading(true);
    setError("");
    try {
      const params = { page: pageNum, pageSize };
      if (searchQuery) params.q = searchQuery;

      const resp = await api.get("/pacientes", { params });
      // API returns { data: [...] } structure
      const data = resp?.data?.data || resp?.data || [];

      const normalize = Array.isArray(data) ? data : [];
      // If some patients in the list are missing a numeroUtente/nus, fetch details for them
      const needDetails = normalize.filter(
        (p) => !(p?.numeroUtente || p?.nus) && p?.id
      );
      if (needDetails.length > 0) {
        try {
          const detailsResponses = await Promise.all(
            needDetails.map((p) =>
              api
                .get(`/pacientes/${p.id}`)
                .then((r) => r?.data?.data || r?.data)
                .catch(() => null)
            )
          );
          const detailsById = {};
          detailsResponses.forEach((d) => {
            if (d && d.id) detailsById[d.id] = d;
          });
          // Merge back into normalize
          for (let i = 0; i < normalize.length; i++) {
            const p = normalize[i];
            if (p?.id && !(p.numeroUtente || p.nus)) {
              const d = detailsById[p.id];
              if (d) normalize[i] = { ...p, ...d };
            }
          }
        } catch (e) {
          // ignore extra detail failures
        }
      }
      // Sort alphabetically by nomeCompleto (case-insensitive)
      normalize.sort((a, b) =>
        (a?.nomeCompleto || "").localeCompare(b?.nomeCompleto || "", "pt", {
          sensitivity: "base",
        })
      );

      if (pageNum === 1) {
        setPacientes(normalize);
      } else {
        setPacientes((prev) => {
          const combined = [...prev, ...normalize];
          combined.sort((a, b) =>
            (a?.nomeCompleto || "").localeCompare(b?.nomeCompleto || "", "pt", {
              sensitivity: "base",
            })
          );
          return combined;
        });
      }

      setHasMore(data.length === pageSize);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Sessão expirada. Inicie sessão novamente.");
      } else {
        setError("Não foi possível carregar os pacientes.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacientes(search, 1);
    setPage(1);
  }, [search, fetchPacientes]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPacientes(search, nextPage);
  };

  const handlePatientClick = (patient) => {
    navigate(`/pacientes/${patient.id}`);
  };

  const handleScanQR = () => {
    // TODO: Implementar scan de QR
    console.log("Scan QR clicked");
  };

  const handleNewPatient = () => {
    navigate("/pacientes/novo");
  };

  return (
    <div className="pacientes-page">
      <Navbar variant="gestor" />

      <main className="pacientes-main">
        <h1 className="pacientes-title">PACIENTES</h1>

        <div className="pacientes-content">
          {/* Lista de Pacientes */}
          <div className="pacientes-list-section">
            <SearchBar
              placeholder="Pesquisar..."
              value={search}
              onChange={setSearch}
            />

            <div className="pacientes-list">
              {error && <div className="pacientes-error">{error}</div>}

              {!error &&
                pacientes.map((p) => (
                  <PatientCard
                    key={p.id}
                    patient={p}
                    onClick={() => handlePatientClick(p)}
                  />
                ))}

              {loading && (
                <div className="pacientes-loading">A carregar...</div>
              )}

              {!loading && !error && pacientes.length === 0 && (
                <div className="pacientes-empty">
                  Nenhum paciente encontrado.
                </div>
              )}
            </div>

            {hasMore && !loading && pacientes.length > 0 && (
              <button
                type="button"
                className="load-more-btn"
                onClick={handleLoadMore}
              >
                Ver Mais
              </button>
            )}
          </div>

          {/* Sidebar de Ações */}
          <aside className="pacientes-sidebar">
            <ActionCard
              title="FAZER SCAN DE UMA<br/>FICHA"
              icon={<div dangerouslySetInnerHTML={{ __html: qrSvg }} />}
              onClick={handleScanQR}
            />
            <ActionCard
              title="CRIAR UM NOVO<br/>REGISTO"
              icon={<div dangerouslySetInnerHTML={{ __html: personPlusSvg }} />}
              onClick={handleNewPatient}
            />
          </aside>
        </div>
      </main>

      <footer className="pacientes-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Pacientes;
