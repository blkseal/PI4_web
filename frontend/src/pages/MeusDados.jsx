import React, { useEffect, useState } from 'react';
import { Navbar } from '../components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MeusDados.css';
import profileService from '../services/profile.service';

function MeusDados() {
    const navigate = useNavigate();
    const [utilizador, setUtilizador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dependents, setDependents] = useState([]);
    const [isViewingDependent, setIsViewingDependent] = useState(false);
    const [responsibleName, setResponsibleName] = useState("");

    const loadData = async () => {
        setLoading(true);
        try {
            // Load my data
            const myData = await profileService.getPersonalData();
            // Normalizar telemovel/telefone se necessário (backend envia telemovel, frontend usa telefone)
            if (myData.telemovel && !myData.telefone) myData.telefone = myData.telemovel;

            setUtilizador(myData);
            setResponsibleName(myData.nomeCompleto);
            setIsViewingDependent(false);

            // Load dependents
            const deps = await profileService.getDependents();
            setDependents(deps || []);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            setError("Não foi possível carregar os dados.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSwitchToDependent = async (id) => {
        setLoading(true);
        try {
            const depData = await profileService.getDependent(id);
            setUtilizador(depData);
            setIsViewingDependent(true);
        } catch (err) {
            console.error("Erro ao mudar perfil:", err);
            setError("Erro ao carregar perfil do dependente.");
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchToResponsible = async () => {
        // Reload everything (simplest reset)
        loadData();
    };

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT');
    };

    if (loading) return <div className="meus-dados-container"><Navbar variant="utente" /><div className="loading">A carregar...</div></div>;
    if (error) return <div className="meus-dados-container"><Navbar variant="utente" /><div className="error">{error}</div></div>;

    const moradaCompleta = utilizador?.morada ? `${utilizador.morada.rua || ''}, ${utilizador.morada.localidade || ''}` : "N/A";
    const codigoPostal = utilizador?.morada?.codigoPostal || "N/A";

    const fields = [
        { label: "Data de Nascimento", value: formatDate(utilizador?.dataNascimento) },
        { label: "Género", value: utilizador?.genero || "N/A" },
        { label: "Morada", value: moradaCompleta.replace(/^, /, '') },
        { label: "Código Postal", value: codigoPostal },
        { label: "Número de Utente", value: utilizador?.numeroUtente || "N/A" },
        { label: "Número de Identificação Fiscal", value: utilizador?.nif || "N/A" },
        { label: "Estado Civil", value: utilizador?.estadoCivil || "N/A" },
        { label: "Email", value: utilizador?.email || "N/A" },
        { label: "Telemóvel", value: utilizador?.telefone || "N/A" },
    ];

    return (
        <div className="meus-dados-container">
            <Navbar variant="utente" />

            <main className="meus-dados-main">
                <h1 className="meus-dados-title">
                    {isViewingDependent ? `PERFIL: ${utilizador?.nomeCompleto}` : "OS MEUS DADOS"}
                </h1>

                <div className="data-card">
                    <div className="fields-container">
                        {fields.map((field, index) => (
                            <div key={index} className="data-field">
                                <label className="field-label">{field.label}</label>
                                <p className="field-value">{field.value}</p>
                            </div>
                        ))}
                    </div>

                    {!isViewingDependent && (
                        <button
                            className="edit-credentials-btn"
                            onClick={() => navigate('/perfil/credenciais')}
                        >
                            Editar Credenciais
                        </button>
                    )}
                </div>

                {/* Secção de Dependentes ou Link para Responsável */}
                <div className="dependents-section">
                    {!isViewingDependent ? (
                        /* Mostrar lista de Dependentes */
                        <div className="dependents-card">
                            <h2>Dependentes</h2>
                            {dependents.length === 0 ? (
                                <p style={{ color: '#666' }}>Não tem dependentes associados.</p>
                            ) : (
                                <div className="dependents-list">
                                    {dependents.map(dep => (
                                        <div
                                            key={dep.id}
                                            className="dependent-item"
                                            onClick={() => handleSwitchToDependent(dep.id)}
                                        >
                                            <div>
                                                <strong className="dep-name">{dep.nomeCompleto}</strong>
                                                <span className="dep-meta">Data de Nascimento: {formatDate(dep.dataNascimento)}</span>
                                            </div>
                                            <span className="view-profile-link">Ver Perfil &rarr;</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Mostrar Link para Responsável */
                        <div className="responsible-card">
                            <h2>Responsável</h2>
                            <div
                                className="responsible-item"
                                onClick={handleSwitchToResponsible}
                            >
                                <div className="responsible-avatar">
                                    {responsibleName.charAt(0)}
                                </div>
                                <div>
                                    <strong className="dep-name">{responsibleName} (Eu)</strong>
                                    <span className="dep-meta">Voltar ao meu perfil</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default MeusDados;
