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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await profileService.getPersonalData();
                setUtilizador(data);
            } catch (err) {
                console.error("Erro ao carregar dados pessoais:", err);
                setError("Não foi possível carregar os dados.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                <h1 className="meus-dados-title">OS MEUS DADOS</h1>

                <div className="data-card">
                    <div className="fields-container">
                        {fields.map((field, index) => (
                            <div key={index} className="data-field">
                                <label className="field-label">{field.label}</label>
                                <p className="field-value">{field.value}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        className="edit-credentials-btn"
                        onClick={() => navigate('/perfil/credenciais')}
                    >
                        Editar Credenciais
                    </button>
                </div>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default MeusDados;
