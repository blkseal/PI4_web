import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import api from '../services/api';
import { Check, X, Edit3 } from 'lucide-react';
import './ConsultaDetalhes.css';

function ConsultaDetalhes() {
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
                const resp = await api.get(`/admin/consultas/${id}`);
                setConsulta(resp.data);
            } catch (err) {
                console.error('Erro ao procurar consulta:', err);
                setError('Não foi possível carregar os detalhes da consulta.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchConsulta();
    }, [id]);

    const handleUpdateStatus = async (novoStatus) => {
        try {
            await api.put(`/admin/consultas/${id}/status`, { status: novoStatus });
            setConsulta(prev => ({ ...prev, status: novoStatus }));
            alert(`Consulta marcada como ${novoStatus === 'concluida' ? 'concluída' : 'cancelada'}!`);
        } catch (err) {
            console.error('Erro ao atualizar estado:', err);
            alert('Erro ao atualizar o estado da consulta.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.slice(0, 5);
    };

    // Helper to check if date has passed
    const isPastDate = (dateStr, timeStr) => {
        if (!dateStr) return false;
        const now = new Date();
        const consultDate = new Date(dateStr);

        // If it's a different day
        if (consultDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) return true;

        // If it's same day, compare time
        if (consultDate.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0) && timeStr) {
            const [hours, minutes] = timeStr.split(':');
            const consultTime = new Date();
            consultTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return consultTime < new Date();
        }

        return false;
    };

    if (loading) {
        return (
            <div className="consulta-detalhes-page">
                <Navbar variant="gestor" />
                <div className="loading-container">A carregar detalhes da consulta...</div>
            </div>
        );
    }

    if (error || !consulta) {
        return (
            <div className="consulta-detalhes-page">
                <Navbar variant="gestor" />
                <div className="error-container">
                    <p>{error || 'Consulta não encontrada.'}</p>
                    <button onClick={() => navigate('/gestor/consultas')}>Voltar</button>
                </div>
            </div>
        );
    }

    const showStatusQuestion = isPastDate(consulta.data, consulta.horaInicio) &&
        (consulta.status === 'pendente' || consulta.status === 'Por Acontecer');

    return (
        <div className="consulta-detalhes-page">
            <Navbar variant="gestor" />

            <main className="consulta-detalhes-main">
                <h1 className="consulta-detalhes-title">CONSULTA</h1>

                <div className="consulta-card-detalhes">
                    {showStatusQuestion && (
                        <div className="status-question-box">
                            <span>Esta consulta já aconteceu?</span>
                            <div className="question-actions">
                                <button
                                    className="btn-status-confirm sim"
                                    onClick={() => handleUpdateStatus('concluida')}
                                >
                                    SIM <Check size={14} />
                                </button>
                                <button
                                    className="btn-status-confirm nao"
                                    onClick={() => handleUpdateStatus('cancelada')}
                                >
                                    NÃO <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="consulta-info-list">
                        <div className="info-item">
                            <span className="label">Paciente:</span>
                            <span className="value">{consulta.paciente?.nomeCompleto || '—'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Data:</span>
                            <span className="value">{formatDate(consulta.data)}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Horário:</span>
                            <span className="value">
                                {formatTime(consulta.horaInicio)} - {formatTime(consulta.horaFim) || '—'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">Médico:</span>
                            <span className="value">{consulta.medico || '—'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Associada a um tratamento?:</span>
                            <span className="value">{consulta.tratamento ? 'Sim' : 'Não'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Estado:</span>
                            <span className="value" style={{ textTransform: 'capitalize' }}>
                                {consulta.status === 'pendente' ? 'Por Acontecer' : consulta.status}
                            </span>
                        </div>

                        <div className="notas-box">
                            <span className="label">Notas:</span>
                            <p className="notas-text">
                                {consulta.notas || consulta.motivo || 'Sem notas adicionais.'}
                            </p>
                        </div>
                    </div>

                    <button
                        className="edit-details-btn"
                        onClick={() => navigate(`/gestor/consultas/${id}/editar`)}
                    >
                        Editar Dados <Edit3 size={16} />
                    </button>
                </div>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default ConsultaDetalhes;
