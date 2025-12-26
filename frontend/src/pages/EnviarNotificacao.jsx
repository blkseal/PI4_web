import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components';
import { User, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import './EnviarNotificacao.css';

const EnviarNotificacao = () => {
    const [pacientes, setPacientes] = useState([]);
    const [gestores, setGestores] = useState([]);
    const [pacienteSearch, setPacienteSearch] = useState("");
    const [showPacienteDropdown, setShowPacienteDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        tipoDestinatario: "individual_utente", // "individual_utente", "individual_gestor", "todos_utentes", "todos_gestores", "todos"
        pacienteId: "",
        pacienteNome: "",
        data: new Date().toISOString().split('T')[0],
        horario: "15:00",
        mensagem: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Utentes
                const respPac = await api.get("/pacientes", { params: { pageSize: 200 } });
                const dataPac = respPac?.data?.data || respPac?.data || [];
                setPacientes(Array.isArray(dataPac) ? dataPac : []);

                // Fetch Gestores/Medicos
                const respGest = await api.get("/admin/gestores");
                const dataGest = respGest?.data?.data || respGest?.data || [];
                setGestores(Array.isArray(dataGest) ? dataGest : []);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        };
        fetchData();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowPacienteDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear specific selection when type changes
        if (field === "tipoDestinatario") {
            setPacienteSearch("");
            setFormData(prev => ({ ...prev, [field]: value, pacienteId: "", pacienteNome: "" }));
        }
    };

    const getFilteredItems = () => {
        const list = formData.tipoDestinatario === "individual_utente" ? pacientes : gestores;
        return list.filter((p) => {
            const name = (p.nomeCompleto || p.nome || "").toLowerCase();
            const nus = String(p.nus || p.numeroUtente || p.omd || "").toLowerCase();
            return (
                name.includes(pacienteSearch.toLowerCase()) ||
                nus.includes(pacienteSearch.toLowerCase())
            );
        });
    };

    const selectItem = (p) => {
        setFormData(prev => ({
            ...prev,
            pacienteId: p.id,
            pacienteNome: p.nomeCompleto || p.nome
        }));
        setPacienteSearch(p.nomeCompleto || p.nome);
        setShowPacienteDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isIndividual = formData.tipoDestinatario.startsWith("individual");
        if (isIndividual && !formData.pacienteId) {
            setError("Por favor selecione um destinatário.");
            return;
        }
        if (!formData.mensagem) {
            setError("Por favor escreva uma mensagem.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const payload = {
                tipoDestinatario: formData.tipoDestinatario,
                id_destinatario: isIndividual ? formData.pacienteId : null,
                data: formData.data,
                hora: formData.horario,
                mensagem: formData.mensagem
            };

            await api.post('/admin/notificacoes', payload);
            alert('Notificação enviada com sucesso!');
            setFormData(prev => ({ ...prev, mensagem: "" }));
        } catch (err) {
            console.error('Erro ao enviar notificação:', err);
            setError('Erro ao enviar notificação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = getFilteredItems();
    const isIndividual = formData.tipoDestinatario.startsWith("individual");

    return (
        <div className="enviar-notificacao-page">
            <Navbar variant="gestor" />

            <main className="enviar-notificacao-main">
                <h1 className="page-title">Enviar Notificação</h1>

                <div className="enviar-notificacao-card">
                    <form className="enviar-notificacao-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-row-target">
                            <div className="form-group full-width">
                                <label>Enviar para:</label>
                                <select
                                    className="tipo-envio-select"
                                    value={formData.tipoDestinatario}
                                    onChange={(e) => handleChange('tipoDestinatario', e.target.value)}
                                >
                                    <optgroup label="Individual">
                                        <option value="individual_utente">Utente Específico</option>
                                        <option value="individual_gestor">Gestor/Médico Específico</option>
                                    </optgroup>
                                    <optgroup label="Coletivo">
                                        <option value="todos_utentes">Todos os Utentes</option>
                                        <option value="todos_gestores">Todos os Gestores</option>
                                        <option value="todos">Todos (Utentes e Gestores)</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group" ref={dropdownRef}>
                                <label>Destinatário</label>
                                <div className={`input-with-icon ${!isIndividual ? 'disabled' : ''}`}>
                                    <input
                                        type="text"
                                        placeholder={isIndividual ? "Escolher..." : "Todos os selecionados"}
                                        value={pacienteSearch}
                                        onChange={(e) => {
                                            if (!isIndividual) return;
                                            setPacienteSearch(e.target.value);
                                            setShowPacienteDropdown(true);
                                        }}
                                        onFocus={() => isIndividual && setShowPacienteDropdown(true)}
                                        disabled={!isIndividual}
                                    />
                                    <div className="icon-container">
                                        <User size={20} />
                                    </div>
                                    {isIndividual && showPacienteDropdown && (
                                        <div className="dropdown-results">
                                            {filteredItems.map(p => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    className="dropdown-item"
                                                    onClick={() => selectItem(p)}
                                                >
                                                    <span className="patient-name">{p.nomeCompleto || p.nome}</span>
                                                    <span className="patient-details">
                                                        {p.nus || p.numeroUtente ? `NUS: ${p.nus || p.numeroUtente}` : (p.omd ? `OMD: ${p.omd}` : p.email)}
                                                    </span>
                                                </button>
                                            ))}
                                            {filteredItems.length === 0 && (
                                                <div className="dropdown-item empty">Nenhum resultado encontrado</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Data</label>
                                <div className="input-with-icon">
                                    <input
                                        type="date"
                                        value={formData.data}
                                        onChange={(e) => handleChange('data', e.target.value)}
                                        required
                                    />
                                    <div className="icon-container">
                                        <Calendar size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Horário</label>
                                <div className="input-with-icon">
                                    <input
                                        type="time"
                                        value={formData.horario}
                                        onChange={(e) => handleChange('horario', e.target.value)}
                                        required
                                    />
                                    <div className="icon-container">
                                        <Clock size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Mensagem</label>
                            <textarea
                                placeholder="Escrever..."
                                value={formData.mensagem}
                                onChange={(e) => handleChange('mensagem', e.target.value)}
                                rows={6}
                                required
                            />
                        </div>

                        <div className="form-footer">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'A Submeter...' : 'Submeter'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="agenda-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default EnviarNotificacao;
