import React, { useEffect, useState } from 'react';
import { Navbar } from '../components';
import './Profile.css';
import { Info, History, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profile.service';

function Profile() {
    const navigate = useNavigate();
    const [utilizador, setUtilizador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfileSummary();
                setUtilizador(data);
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
                setError("Não foi possível carregar os dados do perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="profile-container"><Navbar variant="utente" /><div className="loading">A carregar...</div></div>;
    if (error) return <div className="profile-container"><Navbar variant="utente" /><div className="error">{error}</div></div>;

    // Formatar data de YYYY-MM-DD para DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT');
    };

    return (
        <div className="profile-container">
            <Navbar variant="utente" />

            {/* Banner do Utilizador */}
            <section className="user-banner">
                <h1 className="user-name">{utilizador?.nomeCompleto || "Utilizador"}</h1>
                <p className="user-number">Nº Utente: {utilizador?.numeroUtente || "N/A"}</p>
                <p className="user-date">Data de Nascimento: {formatDate(utilizador?.dataNascimento)}</p>
            </section>

            <main className="profile-main">
                <h2 className="profile-page-title">PERFIL</h2>
                <p className="qr-instruction">Mostra este QR na clínica</p>

                {/* QR Code */}
                <div className="qr-code-container">
                    {utilizador?.qrCodeUrl ? (
                        <img
                            src={utilizador.qrCodeUrl}
                            alt="QR Code do Utente"
                            className="qr-code-img"
                        />
                    ) : (
                        <div className="qr-placeholder">QR Code indisponível</div>
                    )}
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
