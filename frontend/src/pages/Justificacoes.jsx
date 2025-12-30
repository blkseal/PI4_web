import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import { Upload, FileText, Download, Trash2, ArrowLeft } from "lucide-react";
import "./HistoricoMedico.css"; // Reuse styles from HistoricoMedico

function Justificacoes() {
  const { id: pacienteId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Path logic
  const listPath = pacienteId
    ? `/pacientes/${pacienteId}/justificacoes`
    : "/documentacao/justificacoes";
  const uploadPath = pacienteId
    ? `/pacientes/${pacienteId}/justificacoes`
    : "/documentacao/justificacoes";

  useEffect(() => {
    loadData();
  }, [listPath]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await api.get(listPath);
      setItems(resp?.data || []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as justificações.");
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
    formData.append("anexo", file); // Consistent with Exames

    setUploading(true);
    try {
      await api.post(uploadPath, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      loadData();
      alert("Justificação anexada com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar justificação:", err);
      alert(err.response?.data?.mensagem || "Erro ao enviar ficheiro.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Eliminar justificação?")) return;
    try {
      const deletePath = pacienteId
        ? `/pacientes/${pacienteId}/justificacoes/${id}`
        : `/documentacao/justificacoes/${id}`;

      await api.delete(deletePath);
      loadData();
      alert("Justificação eliminada com sucesso.");
    } catch (err) {
      console.error(err);
      alert("Erro ao eliminar justificação.");
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

  const filteredItems = items.filter((it) =>
    `Justificação #${it.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDownloadUrl = (item) => {
    // Robust logic: try 'url', fallback to 'anexoUrl'
    const rawPath = item.url || item.anexoUrl;
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
            <h1 className="page-title">JUSTIFICAÇÕES</h1>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">A carregar justificações...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <div className="historico-content" style={{ display: 'block' }}> {/* Override grid for single column */}

            {/* SEARCH BAR */}
            <div style={{ marginBottom: "1rem", maxWidth: "400px" }}>
              <input
                type="text"
                placeholder="Pesquisar justificações..."
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
                <h3>Lista de Justificações</h3>
              </div>

              <div className="exames-list">
                {filteredItems.length === 0 ? (
                  <p className="no-exames">Não há justificações correspondentes.</p>
                ) : (
                  filteredItems.map((item) => (
                    <div key={item.id} className="exame-item">
                      <div className="exame-icon">
                        <FileText size={24} />
                      </div>
                      <div className="exame-name">
                        {item.anexo || `Justificação #${item.id}`}
                      </div>
                      <div className="exame-actions">
                        <a
                          href={getDownloadUrl(item)}
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
                            onClick={() => handleDelete(item.id)}
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
                    {uploading ? "A enviar..." : "Anexar Justificação"}
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

export default Justificacoes;
