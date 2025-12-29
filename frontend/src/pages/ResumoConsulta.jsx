import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import api from '../services/api';
import './ResumoConsulta.css';
import { Edit3, ArrowLeft } from 'lucide-react';

const ResumoConsulta = () => {
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
                // Following the pattern of fetching list and finding ID
                const resp = await api.get('/admin/consultas', { params: { pageSize: 1000 } });
                const lista = Array.isArray(resp.data) ? resp.data : [];
                const found = lista.find(c => c.id.toString() === id.toString());

                if (found) {
                    setConsulta(found);
                } else {
                    setError('Consulta não encontrada no sistema.');
                }
            } catch (err) {
                console.error('Erro ao procurar consulta:', err);
                setError('Não foi possível carregar os detalhes da consulta.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsulta();
    }, [id]);

    if (loading) {
        return (
            <div className="resumo-consulta-page">
                <Navbar variant="gestor" />
                <main className="resumo-consulta-main">
                    <p>A carregar resumo...</p>
                </main>
            </div>
        );
    }

    if (error || !consulta) {
        return (
            <div className="resumo-consulta-page">
                <Navbar variant="gestor" />
                <main className="resumo-consulta-main">
                    <div className="error-message">
                        <p>{error || 'Ocorreu um erro ao carregar.'}</p>
                        <button onClick={() => navigate(-1)} className="retry-button">
                            <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-PT');
    };

    const formatTime = (start, end) => {
        const s = (start || '').slice(0, 5);
        const e = (end || '').slice(0, 5);
        return s && e ? `${s}-${e}` : (s || '');
    };

    return (
        <div className="resumo-consulta-page">
            <Navbar variant="gestor" />

            <main className="resumo-consulta-main">
                <h1 className="resumo-title">RESUMO DA CONSULTA</h1>

                <div className="resumo-card">
                    <div className="resumo-info-list">
                        <div className="info-item">
                            <span className="label">Paciente:</span>
                            <span className="value">{consulta.paciente?.nomeCompleto || 'Desconhecido'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Data:</span>
                            <span className="value">{formatDate(consulta.data)}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Horário:</span>
                            <span className="value">{formatTime(consulta.horaInicio, consulta.horaFim)}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Médico:</span>
                            <span className="value">{consulta.medico || 'Não atribuído'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Associada a um tratamento?:</span>
                            <span className="value">{consulta.associadoATratamento ? 'Sim' : 'Não'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Estado:</span>
                            <span className="value" style={{ textTransform: 'capitalize' }}>{consulta.estado}</span>
                        </div>

                        <div className="info-item notas-block">
                            <span className="label">Notas:</span>
                            <p className="notas-text">
                                {consulta.titulo || consulta.notas || 'Sem notas adicionais para esta consulta.'}
                            </p>
                        </div>

                        <div className="documents-section">
                            <h3 className="documents-title">Documentos</h3>
                            <button className="doc-btn">Anexar Atestado</button>
                            <button className="doc-btn">Anexar Justificação</button>
                        </div>
                    </div>

                    <div className="resumo-actions">
                        <button className="editar-dados-btn" onClick={() => navigate(`/gestor/consultas/${id}/editar`)}>
                            Editar Dados <Edit3 size={16} />
                        </button>
                    </div>
                </div>
            </main>

            <footer className="resumo-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default ResumoConsulta;
