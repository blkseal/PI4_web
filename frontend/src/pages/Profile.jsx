import React from 'react';
import { Navbar } from '../components';
import './Profile.css';
import { Info, History, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();

    // Mock user data for development since auth is disabled
    const utilizador = {
        nome: "José Trigo",
        numeroUtente: "123456789",
        dataNascimento: "18/05/2000"
    };

    return (
        <div className="profile-container">
            <Navbar variant="utente" />

            {/* Banner do Utilizador */}
            <section className="user-banner">
                <h1 className="user-name">{utilizador.nome}</h1>
                <p className="user-number">Nº Utente: {utilizador.numeroUtente}</p>
                <p className="user-date">Data de Nascimento: {utilizador.dataNascimento}</p>
            </section>

            <main className="profile-main">
                <h2 className="profile-page-title">PERFIL</h2>
                <p className="qr-instruction">Mostra este QR na clínica</p>

                {/* QR Code Placeholder */}
                <div className="qr-code-container">
                    <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ClinimolelosUser123456789"
                        alt="QR Code do Utente"
                        className="qr-code-img"
                    />
                </div>

                <div className="profile-actions-grid">
                    {/* Card 1: Os Meus Dados */}
                    <button
                        className="profile-card"
                        type="button"
                        onClick={() => navigate('/perfil/dados')}
                    >
                        <span className="card-title">OS MEUS DADOS</span>
                        <div className="card-icon-circle">
                            <Info size={64} color="white" />
                        </div>
                    </button>

                    {/* Card 2: Histórico Dentário */}
                    <button className="profile-card" type="button" onClick={() => navigate('/perfil/historico')}>
                        <span className="card-title">HISTÓRICO<br />DENTÁRIO</span>
                        <div className="card-icon-circle">
                            <History size={48} color="white" />
                        </div>
                    </button>

                    {/* Card 3: Dependentes */}
                    <button className="profile-card" type="button" onClick={() => navigate('/perfil/dependentes')}>
                        <span className="card-title">DEPENDENTES</span>
                        <div className="card-icon-circle">
                            <Users size={48} color="white" />
                        </div>
                    </button>
                </div>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default Profile;
