import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import { ArrowLeft, Search, Calendar } from 'lucide-react';
import api from '../services/api';
import './HistoricoConsultasUtente.css';

const HistoricoConsultasUtente = () => {
    const navigate = useNavigate();
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                // Fetching all consultations and filtering for the current user's past ones
                const response = await api.get('/admin/consultas', { params: { pageSize: 1000 } });
                const list = Array.isArray(response.data) ? response.data : [];

                // Filter for past/concluded/canceled consultations
                const history = list.filter(c => {
                    const st = (c.valor_estado || c.estado || '').toLowerCase();
                    return st.includes('conclu') || st.includes('cancel') || st.includes('anula');


                }).map(c => {
                    const dataObj = c.data ? new Date(c.data) : null;
                    const dia = dataObj ? String(dataObj.getDate()).padStart(2, '0') : '--';
                    const mes = dataObj ? dataObj.toLocaleString('pt-PT', { month: 'short' }) : '--';

                    return {
                        id: c.id,
                        medico: c.medico || '—',
                        dia,
                        mes,
                        hora: c.horaInicio ? c.horaInicio.slice(0, 5) : '',
                        estado: c.estado || 'pendente',
                        titulo: (c.titulo || c.notas || 'Consulta').toUpperCase()
                    };
                });



                setConsultas(history);
            } catch (err) {
                console.error('Erro ao buscar histórico:', err);
                setError('Não foi possível carregar o histórico de consultas.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredHistory = useMemo(() => {
        return consultas.filter(c =>
            c.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [consultas, searchTerm]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-PT');
    };

    return (
        <div className="historico-utente-page">
            <Navbar variant="utente" />

            <main className="historico-utente-main">
                <header className="page-header">
                    <button className="back-btn-classic" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Voltar
                    </button>
                    <h1 className="page-title">HISTÓRICO DE CONSULTAS</h1>
                </header>

                <section className="search-section">
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Pesquisar por médico..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </section>

                <section className="list-section">
                    {loading ? (
                        <div className="loading-state">A carregar histórico...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="empty-state">Nenhuma consulta encontrada no seu histórico.</div>
                    ) : (
                        <div className="history-grid">
                            {filteredHistory.map(c => (
                                <div
                                    key={c.id}
                                    className="consulta-card-horizontal history-variant"
                                    onClick={() => navigate(`/consultas/${c.id}`)}
                                >
                                    <div className="consulta-date-badge">
                                        <span className="date-day">{c.dia}</span>
                                        <span className="date-month">{c.mes}</span>
                                    </div>
                                    <div className="consulta-details-content">
                                        <h3 className="consulta-title">{c.titulo}</h3>
                                        <div className="consulta-meta-info">
                                            <span className="consulta-time-range">{c.hora}</span>
                                            <span className="separator">•</span>
                                            <span className="consulta-medico">Dr. {c.medico}</span>
                                        </div>
                                    </div>
                                    <div className="card-right">
                                        <span className="status-badge-small" data-status={c.estado.toLowerCase()}>
                                            {c.estado}
                                        </span>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </section>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default HistoricoConsultasUtente;
