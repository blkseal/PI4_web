import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import api from '../services/api';
import { Check, X, Edit3, ArrowLeft } from 'lucide-react';
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
                // Como não existe endpoint de detalhe individual, vamos buscar a lista
                // e encontrar a consulta pelo ID.
                const resp = await api.get('/admin/consultas', { params: { pageSize: 1000 } });
                const lista = Array.isArray(resp.data) ? resp.data : [];

                const found = lista.find(c => c.id.toString() === id.toString());

                if (found) {
                    setConsulta(found);
                } else {
                    setError('Consulta não encontrada na lista do sistema.');
                }
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
            // Mapping status name to ID
            const statusMap = {
                'pendente': 1,
                'por acontecer': 1,
                'concluida': 2,
                'concluída': 2,
                'cancelada': 3,
                'anulada': 4
            };

            const payload = {
                id_utente: consulta.id_utente || consulta.paciente?.id || consulta.utenteId,
                id_entidade_medica: consulta.id_entidade_medica || consulta.medico?.id || consulta.entidadeMedicaId,
                data: consulta.data,
                horaInicio: consulta.horaInicio,
                horaFim: consulta.horaFim,
                duracao: consulta.duracao || 30,
                notas: consulta.notas || consulta.titulo || '',
                id_estado: statusMap[novoStatus.toLowerCase()] || 1,
                estado: novoStatus
            };


            await api.put(`/admin/consultas/${id}`, payload);

            setConsulta(prev => ({ ...prev, estado: novoStatus }));
            alert(`Consulta marcada como ${novoStatus === 'concluida' ? 'concluída' : 'cancelada'}!`);
        } catch (err) {
            console.error('Erro ao atualizar estado:', err);
            alert('Não foi possível atualizar o estado. Tente novamente.');
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

    const isPastDate = (dateStr, timeStr) => {
        if (!dateStr) return false;
        const now = new Date();
        const consultDate = new Date(dateStr);
        if (consultDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) return true;
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
                    <button onClick={() => navigate('/gestor/consultas')} className="back-btn-icon">
                        <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
                    </button>
                </div>
            </div>
        );
    }

    // O backend usa 'estado', o teu código antigo usava 'status'
    const estadoAtual = consulta.estado || 'pendente';
    const showStatusQuestion = isPastDate(consulta.data, consulta.horaInicio) &&
        (estadoAtual === 'pendente' || estadoAtual === 'por acontecer');

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
                                    onClick={() => handleUpdateStatus('concluída')}
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
                            <span className="value">{consulta.associadoATratamento ? 'Sim' : 'Não'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Estado:</span>
                            <span className="value" style={{ textTransform: 'capitalize' }}>
                                {estadoAtual === 'pendente' ? 'Por Acontecer' : estadoAtual}
                            </span>
                        </div>

                        <div className="notas-box">
                            <span className="label">Notas:</span>
                            <p className="notas-text">
                                {consulta.titulo || consulta.notas || 'Sem notas adicionais.'}
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

            <footer className="consultas-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default ConsultaDetalhes;