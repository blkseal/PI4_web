import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import { ArrowLeft, Calendar, Clock, FileText, Send } from 'lucide-react';
import api from '../services/api';
import './PedidosConsultaUtente.css';

const PedidosConsultaUtente = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        data: '',
        horario: '',
        motivo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // O backend agora espera apenas: { data, motivo }
            // Onde 'data' é uma string que combina a data e o período
            const payload = {
                data: `${formData.data} - ${formData.horario}`,
                motivo: formData.motivo
            };

            // Rota correta no backend: /consultas/solicitacao
            await api.post('/consultas/solicitacao', payload);

            setSuccess(true);
            setTimeout(() => navigate('/home'), 3000);
        } catch (err) {
            console.error('Erro ao enviar pedido:', err);
            const msg = err.response?.data?.message || err.response?.data?.mensagem || 'Não foi possível enviar o pedido. Tente novamente.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="pedidos-utente-page">
                <Navbar variant="utente" />
                <main className="pedidos-utente-main">
                    <div className="success-overlay">
                        <div className="success-content">
                            <h1 className="success-title">Pedido Enviado!</h1>
                            <p>O seu pedido de consulta foi registado com sucesso. Entraremos em contacto em breve.</p>
                            <button className="cta-btn" onClick={() => navigate('/home')}>Voltar ao Início</button>
                        </div>
                    </div>
                </main>
                <footer className="home-footer">
                    <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
                </footer>
            </div>
        );
    }

    return (
        <div className="pedidos-utente-page">
            <Navbar variant="utente" />

            <main className="pedidos-utente-main">
                <header className="page-header">
                    <button className="back-btn-classic" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Voltar
                    </button>
                    <h1 className="page-title">SOLICITAR CONSULTA</h1>
                </header>

                <div className="form-card-centered">
                    <form className="solicitar-form" onSubmit={handleSubmit}>
                        {error && <div className="form-error-msg">{error}</div>}

                        <div className="form-group-utente">
                            <div className="input-icon-container">
                                <input
                                    type="date"
                                    name="data"
                                    value={formData.data}
                                    onChange={handleChange}
                                    placeholder="Escolha a data"
                                    required
                                />
                                <Calendar className="input-icon-float" size={18} />
                            </div>
                        </div>

                        <div className="form-group-utente">
                            <div className="input-icon-container">
                                <select
                                    name="horario"
                                    value={formData.horario}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Escolha o período</option>
                                    <option value="Manhã (09:00 - 13:00)">Manhã (09:00 - 13:00)</option>
                                    <option value="Tarde (14:00 - 19:00)">Tarde (14:00 - 19:00)</option>
                                    <option value="Qualquer horário">Qualquer horário</option>
                                </select>
                                <Clock className="input-icon-float" size={18} />
                            </div>
                        </div>

                        <div className="form-group-utente">
                            <label className="textarea-label">Motivo da Consulta</label>
                            <textarea
                                name="motivo"
                                value={formData.motivo}
                                onChange={handleChange}
                                placeholder="Descreva brevemente o motivo..."
                                required
                            />
                        </div>

                        <div className="form-actions-utente">
                            <button type="submit" className="enviar-btn" disabled={loading}>
                                {loading ? 'A enviar...' : 'Enviar'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default PedidosConsultaUtente;
