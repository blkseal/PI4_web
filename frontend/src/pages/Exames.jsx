import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import { Upload, FileText, Download, Trash2, ArrowLeft } from "lucide-react";
import "./HistoricoMedico.css"; // Reuse styles from HistoricoMedico

function Exames() {
  const { id: pacienteId } = useParams();
  const navigate = useNavigate();

  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Path logic
  const listPath = pacienteId
    ? `/pacientes/${pacienteId}/exames`
    : "/documentacao/exames";
  const uploadPath = pacienteId
    ? `/pacientes/${pacienteId}/exames`
    : "/documentacao/exames";

  useEffect(() => {
    loadData();
  }, [listPath]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await api.get(listPath);
      setExames(resp?.data || []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os exames.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("ficheiro", file); // Backend expects 'ficheiro' or 'file' for Exames

    setUploading(true);
    try {
      await api.post(uploadPath, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      loadData();
      alert("Exame anexado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar exame:", err);
      // Try 'ficheiro' if 'anexo' fails? Or stick to what worked. 
      // Previous Exames.jsx used 'anexo'.
      alert(err.response?.data?.mensagem || "Erro ao enviar ficheiro.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Eliminar exame?")) return;
    try {
      // If patientId is present, typical path is /pacientes/:pid/exames/:eid
      // If not (User view), path is /documentacao/exames/:eid
      const deletePath = pacienteId
        ? `/pacientes/${pacienteId}/exames/${id}`
        : `/documentacao/exames/${id}`;

      await api.delete(deletePath);
      loadData();
      alert("Exame eliminado com sucesso.");
    } catch (err) {
      console.error(err);
      alert("Erro ao eliminar exame.");
    }
  };

  // Drag and Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const filteredExames = exames.filter((ex) =>
    `Exame #${ex.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDownloadUrl = (ex) => {
    // Robust logic: try 'url', fallback to 'anexoUrl'
    const rawPath = ex.url || ex.anexoUrl;
    if (!rawPath) return "#";

    // If it's an absolute URL (e.g. from Supabase), return directly
    if (rawPath.startsWith("http")) return rawPath;

    // Handle potential /v1 prefix
    const fullPath = rawPath.startsWith("/v1")
      ? rawPath
      : `${api.defaults.baseURL}${rawPath}`;

    // Append token for authentication (needed for Utente routes)
    const token = localStorage.getItem("accessToken");
    if (token) {
      const separator = fullPath.includes("?") ? "&" : "?";
      return `${fullPath}${separator}token=${token}`;
    }
    return fullPath;
  };

  return (
    <div className="historico-page">
      <Navbar variant={pacienteId ? "gestor" : "utente"} />

      <main className="historico-main">
        <header className="historico-header">
          <div className="header-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} style={{ marginRight: "8px" }} /> Voltar
            </button>
            <h1 className="page-title">EXAMES</h1>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">A carregar exames...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <div className="historico-content" style={{ display: 'block' }}>
            {/* SEARCH BAR */}
            <div style={{ marginBottom: "1rem", maxWidth: "400px" }}>
              <input
                type="text"
                placeholder="Pesquisar exames..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc"
                }}
              />
            </div>

            <section
              className={`exames-section ${isDragging ? "drag-active" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="exames-header">
                <h3>Lista de Exames</h3>
              </div>

              <div className="exames-list">
                {filteredExames.length === 0 ? (
                  <p className="no-exames">Não há exames correspondentes.</p>
                ) : (
                  filteredExames.map((exame) => (
                    <div key={exame.id} className="exame-item">
                      <div className="exame-icon">
                        <FileText size={24} />
                      </div>
                      <div className="exame-name">
                        {exame.anexo || `Exame #${exame.id}`}
                      </div>
                      <div className="exame-actions">
                        <a
                          href={getDownloadUrl(exame)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-link"
                          title="Download"
                        >
                          <Download size={18} />
                        </a>
                        {pacienteId && (
                          <button
                            type="button"
                            className="delete-btn"
                            title="Eliminar"
                            onClick={() => handleDelete(exame.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {pacienteId && (
                <div className="exames-upload">
                  <div className="upload-drop-zone">
                    <Upload size={24} />
                    <span>Arraste ficheiros aqui ou</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <button
                    className="anexar-btn"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                  >
                    {uploading ? "A enviar..." : "Anexar Exame"}
                    <Upload size={16} style={{ marginLeft: 8 }} />
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="simple-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Exames;
