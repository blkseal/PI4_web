import React from 'react';
import { Navbar } from '../components';
import { useNavigate } from 'react-router-dom';
import './HistoricoDentario.css';

function HistoricoDentario() {
    const navigate = useNavigate();

    // Mock data matching the screenshot
    const historico = {
        motivo: "Necessidade de manutenção dentária regular. Mudança para Tondela.",
        condicoes: "Cerca de 3 cáries.",
        tratamentos: "Uso de aparelho expansor durante 6 meses. Uso de aparelho ortodôntico durante 1 ano.",
        anestesias: "Sempre reagiu bem.",
        dor: "Dores nos dentes do ciso superiores ocasionais. Sensibilidade a bebidas muito frias."
    };

    const sections = [
        { title: "Motivo da primeira consulta", content: historico.motivo },
        { title: "Condições dentárias pré-existentes", content: historico.condicoes },
        { title: "Tratamentos Passados", content: historico.tratamentos },
        { title: "Experiência com Anestesias", content: historico.anestesias },
        { title: "Histórico de Dor, Desconforto e Sensibilidade", content: historico.dor },
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
