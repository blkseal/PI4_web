import React, { useEffect, useState } from 'react';
import { Navbar } from '../components';
import { useNavigate } from 'react-router-dom';
import './HistoricoDentario.css';
import profileService from '../services/profile.service';

function HistoricoDentario() {
    const navigate = useNavigate();
    const [historico, setHistorico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await profileService.getDentalHistory();
                setHistorico(data);
            } catch (err) {
                console.error("Erro ao carregar histórico:", err);
                setError("Não foi possível carregar o histórico dentário.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="historico-container"><Navbar variant="utente" /><div className="loading">A carregar...</div></div>;
    if (error) return <div className="historico-container"><Navbar variant="utente" /><div className="error">{error}</div></div>;

    const sections = [
        { title: "Motivo da primeira consulta", content: historico?.motivoPrimeiraConsulta || "Sem informação" },
        { title: "Condições dentárias pré-existentes", content: historico?.condicoesDentarias || "Sem informação" },
        { title: "Tratamentos Passados", content: historico?.tratamentosPassados || "Sem informação" },
        { title: "Experiência com Anestesias", content: historico?.expAnestesia || "Sem informação" },
        { title: "Histórico de Dor, Desconforto e Sensibilidade", content: historico?.historicoDor || "Sem informação" },
    ];

    return (
        <div className="historico-container">
            <Navbar variant="utente" />

            <main className="historico-main">
                <h1 className="historico-page-title">HISTÓRICO DENTÁRIO</h1>

                <div className="historico-card">
                    <h2 className="card-inner-title">Histórico</h2>

                    <div className="sections-container">
                        {sections.map((section, index) => (
                            <div key={index} className="historico-section">
                                <h3 className="section-title">{section.title}</h3>
                                <p className="section-content">{section.content}</p>
                            </div>
                        ))}
                    </div>

                    <button className="download-btn">
                        Descarregar Históricos
                    </button>
                </div>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default HistoricoDentario;
