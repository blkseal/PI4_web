import React from 'react';
import { Navbar } from '../components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MeusDados.css';

function MeusDados() {
    const navigate = useNavigate();

    // Mock data matching the screenshot
    const utilizador = {
        dataNascimento: "22/04/2018",
        genero: "Masculino",
        morada: "Rua Dr. João Paulo Almeida, 25, Sótão",
        codigoPostal: "3099-888",
        numeroUtente: "123456789",
        nif: "987654321",
        estadoCivil: "Solteiro",
        email: "iamjosetrigo@mail.com",
        telemovel: "+351 969 898 797"
    };

    const fields = [
        { label: "Data de Nascimento", value: utilizador.dataNascimento },
        { label: "Género", value: utilizador.genero },
        { label: "Morada", value: utilizador.morada },
        { label: "Código Postal", value: utilizador.codigoPostal },
        { label: "Número de Utente", value: utilizador.numeroUtente },
        { label: "Número de Identificação Fiscal", value: utilizador.nif },
        { label: "Estado Civil", value: utilizador.estadoCivil },
        { label: "Email", value: utilizador.email },
        { label: "Telemóvel", value: utilizador.telemovel },
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
