import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import "./Documentacao.css";

function Exames() {
  const { id: pacienteId } = useParams();
  const [exames, setExames] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examesPath = pacienteId
    ? `/documentacao/utente/${pacienteId}/exames`
    : "/documentacao/exames";

  useEffect(() => {
    let cancelled = false;
    const fetchExames = async () => {
      try {
        const resp = await api.get(examesPath);
        if (cancelled) return;
        setExames(resp?.data || []);
      } catch (err) {
        if (cancelled) return;
        setError("Não foi possível carregar exames.");
      }
    };
    fetchExames();
    return () => {
      cancelled = true;
    };
  }, [examesPath]);

  const handleFileChange = (e) => setFile(e.target.files?.[0] || null);

  const handleUpload = async () => {
    if (!file) return setError("Selecione um ficheiro");
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("anexo", file);
      // If gestor attaching to a patient, send to patient-scoped endpoint
      const uploadPath = pacienteId
        ? `/documentacao/utente/${pacienteId}/exames`
        : "/documentacao/exames";
      await api.post(uploadPath, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // refresh list
      const resp = await api.get(examesPath);
      setExames(resp?.data || []);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensagem || "Erro ao anexar exame.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-page">
      <Navbar variant={pacienteId ? "gestor" : "utente"} />
      <main className="doc-main">
        <h1 className="doc-title">Exames</h1>

        <section className="doc-cards">
          <div className="doc-card">
            <div>
              <label style={{ display: "block", marginBottom: 8 }}>
                Anexar exame
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
          <h2>Exames</h2>
          {exames.length === 0 && (
            <p className="doc-empty">Nenhum exame disponível.</p>
          )}
          {exames.length > 0 && (
            <div className="doc-list">
              {exames.map((ex) => (
                <a
                  key={ex.id}
                  className="doc-list-item"
                  href={ex.anexoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="doc-item-type">Exame</span>
                  <span className="doc-item-label">Exame #{ex.id}</span>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Exames;
