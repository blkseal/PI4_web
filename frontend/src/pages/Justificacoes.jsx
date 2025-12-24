import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import "./Documentacao.css";

function Justificacoes() {
  const { id: pacienteId } = useParams();
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const path = pacienteId
    ? `/documentacao/utente/${pacienteId}/justificacoes`
    : "/documentacao/justificacoes";

  useEffect(() => {
    let cancelled = false;
    const fetchItems = async () => {
      try {
        const resp = await api.get(path);
        if (cancelled) return;
        setItems(resp?.data || []);
      } catch (err) {
        if (cancelled) return;
        setError("Não foi possível carregar justificações.");
      }
    };
    fetchItems();
    return () => {
      cancelled = true;
    };
  }, [path]);

  const handleFileChange = (e) => setFile(e.target.files?.[0] || null);

  const handleUpload = async () => {
    if (!file) return setError("Selecione um ficheiro");
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("anexo", file);
      const uploadPath = pacienteId
        ? `/documentacao/utente/${pacienteId}/justificacoes`
        : "/documentacao/justificacoes";
      await api.post(uploadPath, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const resp = await api.get(path);
      setItems(resp?.data || []);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensagem || "Erro ao anexar justificação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-page">
      <Navbar variant={pacienteId ? "gestor" : "utente"} />
      <main className="doc-main">
        <h1 className="doc-title">Justificações</h1>

        <section className="doc-cards">
          <div className="doc-card">
            <div>
              <label style={{ display: "block", marginBottom: 8 }}>
                Anexar justificação
              </label>
              <input type="file" onChange={handleFileChange} />
              <div style={{ marginTop: 8 }}>
                <button
                  className="action-btn brown"
                  type="button"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? "A anexar..." : "Anexar ficheiro"}
                </button>
                {error && (
                  <div style={{ color: "#a54646", marginTop: 8 }}>{error}</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="doc-list-panel" style={{ marginTop: 16 }}>
          <h2>Justificações</h2>
          {items.length === 0 && (
            <p className="doc-empty">Nenhuma justificação disponível.</p>
          )}
          {items.length > 0 && (
            <div className="doc-list">
              {items.map((it) => (
                <a
                  key={it.id}
                  className="doc-list-item"
                  href={it.anexoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="doc-item-type">Justificação</span>
                  <span className="doc-item-label">Justificação #{it.id}</span>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Justificacoes;
