import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import api from '../services/api';
import { User, Calendar, Clock, ChevronDown, Stethoscope } from 'lucide-react';
import toothSvg from '../assets/tooth.svg?raw';
import './EditarConsulta.css';
function EditarConsulta() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        pacienteId: '',
        pacienteNome: '',
        data: '',
        horario: '09:00',
        medico: '',
        tratamento: '',
        especialidade: '',
        notas: ''
    });
    const medicos = ['Dr. Silva', 'Dra. Maria', 'Dr. Santos'];
    const tratamentos = ['Limpeza', 'Extração', 'Canal', 'Aparelho'];
    const especialidades = ['Ortodontia', 'Cirurgia Oral', 'Odontopediatria', 'Generalista'];
    useEffect(() => {
        const fetchConsulta = async () => {
            setLoading(true);
            try {
                // Buscamos na lista geral porque não existe endpoint individual de detalhe
                const resp = await api.get('/admin/consultas', { params: { pageSize: 1000 } });
                const lista = Array.isArray(resp.data) ? resp.data : [];
                const found = lista.find(c => c.id.toString() === id.toString());
                if (found) {
                    // Separar Especialidade e Tratamento das notas (ex: "Ortodontia - Limpeza - Notas extras")
                    let esp = '';
                    let trat = '';
                    let nts = found.notas || found.titulo || '';
                    if (nts && nts.includes(' - ')) {
                        const parts = nts.split(' - ');
                        esp = parts[0] || '';
                        trat = parts[1] || '';
                        nts = parts.slice(2).join(' - ') || '';
                    }
                    setFormData({
                        pacienteId: found.paciente?.id || '',
                        pacienteNome: found.paciente?.nomeCompleto || '—',
                        data: found.data ? found.data.split('T')[0] : '',
                        horario: found.horaInicio ? found.horaInicio.slice(0, 5) : '09:00',
                        medico: found.medico || '',
                        tratamento: trat || '',
                        especialidade: esp || '',
                        notas: nts || ''
                    });
                } else {
                    setError('Consulta não encontrada.');
                }
            } catch (err) {
                console.error('Erro ao carregar consulta:', err);
                setError('Não foi possível carregar os dados da consulta.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchConsulta();
    }, [id]);
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const payload = {
                id_utente: formData.pacienteId,
                id_entidade_medica: null,
                data: formData.data,
                hora: formData.horario,
                notas: `${formData.especialidade} - ${formData.tratamento}${formData.notas ? ' - ' + formData.notas : ''}`
            };
            // Lembra-te: Esta rota PUT /admin/consultas/:id tem de ser criada no servidor
            await api.put(`/admin/consultas/${id}`, payload);

            alert('Consulta atualizada com sucesso!');
            navigate(`/gestor/consultas/${id}`);
        } catch (err) {
            console.error('Erro ao atualizar consulta:', err);
            setError(err.response?.status === 404
                ? 'Erro: O backend ainda não tem a rota configurada para salvar alterações (PUT).'
                : (err.response?.data?.mensagem || 'Erro ao guardar alterações.'));
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) {
        return (
            <div className="editar-consulta-page">
                <Navbar variant="gestor" />
                <div className="loading-container">A carregar dados para edição...</div>
            </div>
        );
    }
    return (
        <div className="editar-consulta-page">
            <Navbar variant="gestor" />
            <main className="editar-consulta-main">
                <h1 className="editar-consulta-title">EDITAR CONSULTA</h1>
                <form className="editar-consulta-form" onSubmit={handleSubmit}>
                    {error && <div className="form-error" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Paciente (Não editável)</label>
                            <div className="input-with-icon">
                                <input type="text" value={formData.pacienteNome} disabled style={{ backgroundColor: '#f5f5f5', color: '#666' }} />
                                <div className="icon-container"><User size={20} /></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Data</label>
                            <div className="input-with-icon">
                                <input type="date" value={formData.data} onChange={(e) => handleChange('data', e.target.value)} required />
                                <div className="icon-container"><Calendar size={20} /></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Horário</label>
                            <div className="input-with-icon">
                                <input type="time" value={formData.horario} onChange={(e) => handleChange('horario', e.target.value)} required />
                                <div className="icon-container"><Clock size={20} /></div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Médico</label>
                            <div className="input-with-icon">
                                <select value={formData.medico} onChange={(e) => handleChange('medico', e.target.value)} required>
                                    <option value="">Dentista</option>
                                    {medicos.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <div className="icon-container"><Stethoscope size={20} /></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tratamento</label>
                            <div className="input-with-icon">
                                <select value={formData.tratamento} onChange={(e) => handleChange('tratamento', e.target.value)} required>
                                    <option value="">N/A</option>
                                    {tratamentos.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <div className="icon-container" dangerouslySetInnerHTML={{ __html: toothSvg }} style={{ width: '20px', height: '20px' }}></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Especialidade</label>
                            <div className="input-with-icon">
                                <select value={formData.especialidade} onChange={(e) => handleChange('especialidade', e.target.value)} required>
                                    <option value="">Especialidade</option>
                                    {especialidades.map(esp => <option key={esp} value={esp}>{esp}</option>)}
                                </select>
                                <div className="icon-container"><ChevronDown size={20} /></div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Notas Extra</label>
                        <textarea placeholder="Escrever..." value={formData.notas} onChange={(e) => handleChange('notas', e.target.value)} />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate(`/gestor/consultas/${id}`)}>Cancelar</button>
                        <button type="submit" className="submit-btn" disabled={submitting}>
                            {submitting ? 'A guardar...' : 'Guardar Alterações'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
export default EditarConsulta;