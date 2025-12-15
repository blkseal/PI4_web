import React, { useState } from 'react';
import { Navbar } from '../components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dependentes.css';

function Dependentes() {
    const navigate = useNavigate();
    const [selectedDependent, setSelectedDependent] = useState(null);

    // Mock dependents data
    const dependents = [
        {
            id: 1,
            name: "Fátima Trigo",
            dataNascimento: "22/04/2018",
            genero: "Feminino",
            morada: "Rua Dr. João Paulo Almeida, 25, Sótão",
            codigoPostal: "3099-888",
            numeroUtente: "987654321",
            nif: "123456789",
            estadoCivil: "Solteira",
            email: "fatimatrigo@mail.com",
            telemovel: "+351 912 345 678"
        },
        {
            id: 2,
            name: "João Trigo",
            dataNascimento: "15/06/2020",
            genero: "Masculino",
            morada: "Rua Dr. João Paulo Almeida, 25, Sótão",
            codigoPostal: "3099-888",
            numeroUtente: "456789123",
            nif: "456123789",
            estadoCivil: "Solteiro",
            email: "joaotrigo@mail.com",
            telemovel: "+351 919 876 543"
        }
    ];

    const fields = selectedDependent ? [
        { label: "Data de Nascimento", value: selectedDependent.dataNascimento },
        { label: "Género", value: selectedDependent.genero },
        { label: "Morada", value: selectedDependent.morada },
        { label: "Código Postal", value: selectedDependent.codigoPostal },
        { label: "Número de Utente", value: selectedDependent.numeroUtente },
        { label: "Número de Identificação Fiscal", value: selectedDependent.nif },
        { label: "Estado Civil", value: selectedDependent.estadoCivil },
        { label: "Email", value: selectedDependent.email },
        { label: "Telemóvel", value: selectedDependent.telemovel },
    ] : [];

    const handleBack = () => {
        if (selectedDependent) {
            setSelectedDependent(null);
        } else {
            navigate('/perfil');
        }
    };

    return (
        <div className="dependentes-container">
            <Navbar variant="utente" />

            <main className="dependentes-main">
                <h1 className="dependentes-page-title">DEPENDENTES</h1>

                {!selectedDependent ? (
                    /* Initial View: List of buttons */
                    <div className="dependents-list">
                        {dependents.map(dep => (
                            <button
                                key={dep.id}
                                className="dependent-btn"
                                onClick={() => setSelectedDependent(dep)}
                            >
                                {dep.name}
                            </button>
                        ))}
                    </div>
                ) : (
                    /* Detailed View: Similar to Meus Dados */
                    <div className="data-card">
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
