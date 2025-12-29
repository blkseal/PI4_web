import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import api from '../services/api';
import { ArrowLeft, User, Calendar, Clock, Info, Paperclip } from 'lucide-react';


import './ConsultaDetalheUtente.css';

function ConsultaDetalheUtente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConsulta = async () => {
            setLoading(true);
            setError('');
            try {
                // Since there is no individual detail endpoint, we fetch the list
                // from /home which is the utente's upcoming consultations
                const resp = await api.get('/home');
                const data = resp?.data?.data || resp?.data || {};
                const list = Array.isArray(data.consultas) ? data.consultas : [];

                let found = list.find(c => String(c.id) === String(id));

                // If not found in home, try fetching all consultations (might need utente filtering)
                if (!found) {
                    const respAll = await api.get('/admin/consultas', { params: { pageSize: 1000 } });
                    const allList = Array.isArray(respAll.data) ? respAll.data : [];
                    // Usually utentes should only see their own. Ideally the backend has an endpoint for this.
                    // For now we trust the ID or the backend will error if unauthorized.
                    found = allList.find(c => String(c.id) === String(id));
                }

                if (found) {
                    setConsulta(found);
                } else {
                    setError('Consulta não encontrada.');
                }
            } catch (err) {
                console.error('Erro ao carregar consulta:', err);
                setError('Não foi possível carregar os detalhes da consulta.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchConsulta();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.slice(0, 5);
    };

    if (loading) {
        return (
            <div className="consulta-detalhe-utente-page">
                <Navbar variant="utente" />
                <div className="loading-container">A carregar detalhes...</div>
                <footer className="home-footer">
                    <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
                </footer>
            </div>
        );
    }

    if (error || !consulta) {
        return (
            <div className="consulta-detalhe-utente-page">
                <Navbar variant="utente" />
                <div className="error-container">
                    <p>{error || 'Consulta não encontrada.'}</p>
                    <button onClick={() => navigate(-1)} className="back-btn-classic">
                        <ArrowLeft size={18} /> Voltar
                    </button>
                </div>
                <footer className="home-footer">
                    <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
                </footer>
            </div>
        );
    }

    return (
        <div className="consulta-detalhe-utente-page">
            <Navbar variant="utente" />

            <main className="consulta-detalhe-main">
                <header className="page-header">
                    <button className="back-btn-classic" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Voltar
                    </button>
                    <h1 className="page-title">DETALHES DA CONSULTA</h1>
                </header>

                <div className="detalhe-card">
                    <div className="detalhe-section">
                        <div className="detalhe-item">
                            <span className="label"><User size={20} /> Médico:</span>
                            <span className="value">{consulta.medico || '—'}</span>
                        </div>
                        <div className="detalhe-item">
                            <span className="label"><Calendar size={20} /> Data:</span>
                            <span className="value">{formatDate(consulta.data)}</span>
                        </div>
                        <div className="detalhe-item">
                            <span className="label"><Clock size={20} /> Horário:</span>
                            <span className="value">
                                {formatTime(consulta.horaInicio)} - {formatTime(consulta.horaFim) || '—'}
                            </span>
                        </div>
                        <div className="detalhe-item">
                            <span className="label"><Info size={20} /> Estado:</span>
                            <span className="value">
                                {consulta.estado?.toLowerCase() === 'pendente' ? 'Por Acontecer' : (consulta.estado || 'Por Acontecer')}
                            </span>
                        </div>
                    </div>


                    <div className="notas-container">
                        <h3 className="section-subtitle">NOTAS</h3>
                        <p className="notas-text">
                            {consulta.titulo || consulta.notas || 'Sem notas adicionais para esta consulta.'}
                        </p>
                    </div>

                    {(consulta.valor_estado || consulta.estado || '').toLowerCase().includes('conclu') && (
                        <div className="anexos-container">
                            <h3 className="section-subtitle">ANEXOS</h3>
                            <div className="anexos-list">
                                {consulta.anexos && consulta.anexos.length > 0 ? (
                                    consulta.anexos.map((anexo, idx) => (
                                        <div key={idx} className="anexo-item">
                                            <Paperclip size={18} />
                                            <span>{anexo.nome || `Documento ${idx + 1}`}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-anexos">Sem anexos disponíveis para esta consulta.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default ConsultaDetalheUtente;
