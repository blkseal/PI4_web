import React, { useState, useEffect } from "react";
import { Navbar } from "../components";
import api from "../services/api";
import "./PedidosConsulta.css";

const PedidosConsulta = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/pedidos-consulta");

      const data = response.data || { utilizadores: [], nao_utilizadores: [] };
      const listUtilizadores = data.utilizadores || [];
      const listVisitantes = data.nao_utilizadores || [];

      const formattedUtilizadores = await Promise.all(
        listUtilizadores.map(async (pedido) => {
          let nUtente = "N/A";
          if (pedido.id_utente) {
            try {
              const respP = await api.get(`/pacientes/${pedido.id_utente}`);
              const p = respP?.data?.data || respP?.data || null;
              nUtente = p?.nus || p?.numeroUtente || "N/A";
            } catch (e) {
              nUtente = String(pedido.id_utente);
            }
          }
          return {
            id: pedido.id_pedido,
            nome: pedido.id_utente_utente?.nome_completo || "Utente Registado",
            horario: pedido.horario || "A definir",
            nUtente,
            contacto: pedido.id_utente_utente?.telemovel || pedido.id_utente_utente?.email || "N/A",
            motivo: pedido.motivo,
            tipo: "registado",
          };
        })
      );

      const formattedVisitantes = listVisitantes.map((pedido) => ({
        id: pedido.id_pedido_contacto,
        nome: pedido.nome || "Visitante",
        horario: "A definir",
        nUtente: `V-${pedido.id_pedido_contacto}`,
        contacto: pedido.telemovel || "N/A",
        motivo: pedido.motivo,
        tipo: "nao_utilizador",
      }));

      setPedidos([...formattedUtilizadores, ...formattedVisitantes]);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError(
        "Não foi possível carregar os pedidos de consulta."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, tipo) => {
    if (!window.confirm("Tem a certeza que deseja eliminar este pedido?"))
      return;
    try {
      // O backend espera 'utilizador' em vez de 'registado'
      const apiTipo = tipo === "registado" ? "utilizador" : tipo;
      await api.delete(`/admin/pedidos-consulta/${apiTipo}/${id}`);
      setPedidos((prev) =>
        prev.filter((p) => !(p.id === id && p.tipo === tipo))
      );
    } catch (err) {
      console.error("Erro ao eliminar pedido:", err);
      alert("Não foi possível eliminar o pedido.");
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <div className="pedidos-consulta-page">
      <Navbar variant="gestor" />
      <main className="pedidos-consulta-content">
        <h1 className="page-title">PEDIDOS DE CONSULTA</h1>
        {loading ? (
          <div className="loading-state">
            <p>A carregar pedidos...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchPedidos} className="retry-button">
              Tentar novamente
            </button>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="empty-state">
            <p>Não foram encontrados pedidos de consulta.</p>
          </div>
        ) : (
          <div className="pedidos-list">
            {pedidos.map((pedido) => (
              <div key={`${pedido.tipo}-${pedido.id}`} className="pedido-card">
                <div className="pedido-header">
                  <h2 className="pedido-name">{pedido.nome}</h2>
                  <div className="header-actions">
                    <div className={`status-badge ${pedido.tipo}`}>
                      {pedido.tipo === "registado" ? "UTENTE" : "VISITANTE"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <button
                      className="delete-pedido-btn"
                      onClick={() => handleDelete(pedido.id, pedido.tipo)}
                      title="Eliminar pedido"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="pedido-body">
                  <div className="pedido-info-column">
                    <div className="info-row">
                      <span className="info-label">Preferência:</span>
                      <span>{pedido.horario}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">
                        {pedido.tipo === "registado" ? "NºUtente:" : "ID:"}
                      </span>
                      <span>{pedido.nUtente}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Contacto:</span>
                      <span>{pedido.contacto}</span>
                    </div>
                  </div>
                  <div className="pedido-info-column">
                    <span className="motivo-label">Motivo:</span>
                    <p className="motivo-text">{pedido.motivo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="pedidos-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default PedidosConsulta;
