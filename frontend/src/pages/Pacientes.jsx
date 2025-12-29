/**
 * Pacientes.jsx - Página de gestão de pacientes (Gestor)
 *
 * Lista de pacientes com pesquisa e ações rápidas.
 */

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  SearchBar,
  PatientCard,
  ActionCard,
  FilterModal,
} from "../components";
import api from "../services/api";
import qrSvg from "../assets/qr.svg?raw";
import personPlusSvg from "../assets/mdi_person-plus.svg?raw";
import QRScannerModal from "../components/QRScannerModal";
import { Filter } from "lucide-react";
import "./Pacientes.css";

function Pacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    order: "az", // 'az' or 'za'
    creationDate: "", // 'newest' or 'oldest' or empty
    dependente: "", // 'sim', 'nao', or empty
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [scannerOpen, setScannerOpen] = useState(false);

  const pageSize = 7;

  const fetchPacientes = useCallback(
    async (searchQuery, pageNum, currentFilters) => {
      setLoading(true);
      setError("");
      try {
        const params = { page: pageNum, pageSize };
        if (searchQuery) params.q = searchQuery;

        const resp = await api.get("/pacientes", { params });
        // API returns { data: [...] } structure
        const data = resp?.data?.data || resp?.data || [];

        let normalize = Array.isArray(data) ? data : [];
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

        // Apply Filter: Dependente
        if (currentFilters?.dependente) {
          normalize = normalize.filter((p) => {
            if (currentFilters.dependente === "sim") {
              // Check if dependente is explicitly true or has responsavelId
              return p.dependente === true || !!p.responsavelId;
            } else if (currentFilters.dependente === "nao") {
              return p.dependente === false || !p.responsavelId;
            }
            return true;
          });
        }

        // Apply Sorting
        normalize.sort((a, b) => {
          // 1. Creation Date Priority (if selected)
          if (currentFilters?.creationDate) {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return currentFilters.creationDate === "newest"
              ? dateB - dateA
              : dateA - dateB;
          }

          // 2. Default Alphabetical
          const nameA = (a?.nomeCompleto || "").toLowerCase();
          const nameB = (b?.nomeCompleto || "").toLowerCase();
          return currentFilters?.order === "za"
            ? nameB.localeCompare(nameA, "pt", { sensitivity: "base" })
            : nameA.localeCompare(nameB, "pt", { sensitivity: "base" });
        });

        if (pageNum === 1) {
          setPacientes(normalize);
        } else {
          setPacientes((prev) => {
            // Re-sort and re-filter combined list if needed (mostly just sort)
            // Since we filter the fetched page, we append filtered results.
            // Note: if user changes filter, page resets to 1, so prev is empty.
            const combined = [...prev, ...normalize];
            combined.sort((a, b) => {
              if (currentFilters?.creationDate) {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return currentFilters.creationDate === "newest"
                  ? dateB - dateA
                  : dateA - dateB;
              }
              const nameA = (a?.nomeCompleto || "").toLowerCase();
              const nameB = (b?.nomeCompleto || "").toLowerCase();
              return currentFilters?.order === "za"
                ? nameB.localeCompare(nameA, "pt", { sensitivity: "base" })
                : nameA.localeCompare(nameB, "pt", { sensitivity: "base" });
            });
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
    },
    []
  ); // Removed specific filter dependcy to rely on args

  useEffect(() => {
    fetchPacientes(search, 1, filters);
    setPage(1);
  }, [search, filters, fetchPacientes]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPacientes(search, nextPage, filters);
  };

  const handlePatientClick = (patient) => {
    navigate(`/pacientes/${patient.id}`);
  };

  const handleScanQR = () => {
    setScannerOpen(true);
  };

  const handleNewPatient = () => {
    navigate("/pacientes/novo");
  };

  const openFilterModal = () => {
    setTempFilters({ ...filters });
    setIsFilterModalOpen(true);
  };

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setIsFilterModalOpen(false);
  };

  const handleFilterChange = (field, value) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pacientes-page">
      <Navbar variant="gestor" />

      <main className="pacientes-main">
        <h1 className="pacientes-title">PACIENTES</h1>

        <div className="pacientes-content">
          {/* Lista de Pacientes */}
          <div className="pacientes-list-section">
            <div className="pacientes-search-row">
              <div style={{ flex: 1 }}>
                <SearchBar
                  placeholder="Pesquisar..."
                  value={search}
                  onChange={setSearch}
                  onFilter={openFilterModal}
                />
              </div>
            </div>

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
              className="pacientes-action-card"
            />
            <ActionCard
              title="CRIAR UM NOVO<br/>REGISTO"
              icon={<div dangerouslySetInnerHTML={{ __html: personPlusSvg }} />}
              onClick={handleNewPatient}
              className="pacientes-action-card"
            />
          </aside>
        </div>
      </main>

      <footer className="pacientes-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={applyFilters}
        title="FILTRAR PACIENTES"
      >
        <div className="filter-group">
          <label className="filter-label">Dependente?</label>
          <select
            className="filter-select-modal"
            value={tempFilters.dependente}
            onChange={(e) => handleFilterChange("dependente", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Ordem Alfabética</label>
          <select
            className="filter-select-modal"
            value={tempFilters.order}
            onChange={(e) => handleFilterChange("order", e.target.value)}
          >
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Data de Criação</label>
          <select
            className="filter-select-modal"
            value={tempFilters.creationDate}
            onChange={(e) => handleFilterChange("creationDate", e.target.value)}
          >
            <option value="">Padrão</option>
            <option value="newest">Mais Recentes Primeiro</option>
            <option value="oldest">Mais Antigos Primeiro</option>
          </select>
        </div>
      </FilterModal>

      {scannerOpen && (
        <QRScannerModal
          onClose={() => setScannerOpen(false)}
          onDetected={async (decoded) => {
            setScannerOpen(false);
            try {
              const resp = await api.get("/pacientes", {
                params: { q: decoded },
              });
              const data = resp?.data?.data || resp?.data || [];
              const first = Array.isArray(data) ? data[0] : data;
              if (first && first.id) {
                navigate(`/pacientes/${first.id}`);
              } else {
                alert("Paciente não encontrado para o código lido.");
              }
            } catch (e) {
              alert("Erro ao procurar paciente. Tente manualmente.");
            }
          }}
        />
      )}
    </div>
  );
}

export default Pacientes;
