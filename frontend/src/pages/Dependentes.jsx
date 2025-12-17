import React, { useEffect, useState } from 'react';
import { Navbar } from '../components';
import { useNavigate } from 'react-router-dom';
import './Dependentes.css';
import profileService from '../services/profile.service';

function Dependentes() {
    const navigate = useNavigate();
    const [dependents, setDependents] = useState([]);
    const [selectedDependent, setSelectedDependent] = useState(null);
    const [loadingList, setLoadingList] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [error, setError] = useState(null);

    // Fetch list of dependents on mount
    useEffect(() => {
        const fetchList = async () => {
            try {
                const data = await profileService.getDependents();
                setDependents(data);
            } catch (err) {
                console.error("Erro ao carregar dependentes:", err);
                setError("Não foi possível carregar a lista de dependentes.");
            } finally {
                setLoadingList(false);
            }
        };

        fetchList();
    }, []);

    const handleSelectDependent = async (id) => {
        setLoadingDetails(true);
        setError(null);
        try {
            const details = await profileService.getDependentDetails(id);
            setSelectedDependent(details);
        } catch (err) {
            console.error("Erro ao carregar detalhes do dependente:", err);
            setError("Não foi possível carregar os detalhes do dependente.");
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleBack = () => {
        if (selectedDependent) {
            setSelectedDependent(null);
            setError(null);
        } else {
            navigate('/perfil');
        }
    };

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT');
    };

    // Prepare structure for details view
    const moradaCompleta = selectedDependent?.morada ? `${selectedDependent.morada.rua || ''}, ${selectedDependent.morada.localidade || ''}` : "N/A";
    const codigoPostal = selectedDependent?.morada?.codigoPostal || "N/A";

    const fields = selectedDependent ? [
        { label: "Data de Nascimento", value: formatDate(selectedDependent.dataNascimento) },
        { label: "Género", value: selectedDependent.genero || "N/A" },
        { label: "Morada", value: moradaCompleta.replace(/^, /, '') },
        { label: "Código Postal", value: codigoPostal },
        { label: "Número de Utente", value: selectedDependent.numeroUtente || "N/A" },
        { label: "Número de Identificação Fiscal", value: selectedDependent.nif || "N/A" },
        { label: "Estado Civil", value: selectedDependent.estadoCivil || "N/A" },
        { label: "Email", value: selectedDependent.email || "N/A" },
        { label: "Telemóvel", value: selectedDependent.telefone || "N/A" }, // API uses 'telefone'
    ] : [];

    return (
        <div className="dependentes-container">
            <Navbar variant="utente" />

            <main className="dependentes-main">
                <h1 className="dependentes-page-title">DEPENDENTES</h1>

                {error && <div className="error-message">{error}</div>}

                {loadingList ? (
                    <div className="loading">A carregar lista...</div>
                ) : !selectedDependent ? (
                    /* Initial View: List of buttons */
                    <div className="dependents-list">
                        {dependents.length === 0 ? (
                            <p className="no-data">Não existem dependentes associados.</p>
                        ) : (
                            dependents.map(dep => (
                                <button
                                    key={dep.id}
                                    className="dependent-btn"
                                    onClick={() => handleSelectDependent(dep.id)}
                                >
                                    {dep.nomeCompleto}
                                </button>
                            ))
                        )}
                    </div>
                ) : (
                    /* Detailed View */
                    <div className="data-card">
                        {loadingDetails ? (
                            <div className="loading">A carregar detalhes...</div>
                        ) : (
                            <>
                                <button className="back-btn-inline" onClick={handleBack}>
                                    &larr; Voltar à lista
                                </button>
                                <div className="fields-container">
                                    {fields.map((field, index) => (
                                        <div key={index} className="data-field">
                                            <label className="field-label">{field.label}</label>
                                            <p className="field-value">{field.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="switch-profile-btn">
                                    Alterar para este perfil
                                </button>
                            </>
                        )}
                    </div>
                )}
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default Dependentes;
