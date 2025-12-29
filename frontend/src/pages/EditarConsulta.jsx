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
        horaInicio: '09:00',
        horaFim: '10:00',
        medico: '',
        tratamento: '',

        notas: ''
    });
    const [medicos, setMedicos] = useState([]);
    const [tratamentos, setTratamentos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Medicos/Entidades Médicas
                const gResp = await api.get('/medicos');
                const gData = gResp?.data?.data || gResp?.data || [];
                setMedicos(Array.isArray(gData) ? gData : []);

                // Fetch Tratamentos
                const tResp = await api.get('/tratamentos/tipos');
                const tData = tResp?.data || [];
                setTratamentos(Array.isArray(tData) ? tData : []);

                // Default Specialties


                if (id) {
                    const resp = await api.get('/admin/consultas', { params: { pageSize: 1000 } });
                    const lista = Array.isArray(resp.data) ? resp.data : [];
                    const found = lista.find(c => c.id.toString() === id.toString());
                    if (found) {

                        let trat = '';
                        let nts = found.notas || found.titulo || '';
                        const parts = nts.split(' - ');
                        trat = parts[0] || '';
                        nts = parts.slice(1).join(' - ') || '';

                        setFormData({
                            pacienteId: found.paciente?.id || '',
                            pacienteNome: found.paciente?.nomeCompleto || '—',
                            data: found.data ? found.data.split('T')[0] : '',
                            horaInicio: found.horaInicio ? found.horaInicio.slice(0, 5) : '09:00',
                            horaFim: found.horaFim ? found.horaFim.slice(0, 5) : '10:00',
                            medico: found.id_entidade_medica || found.medico || '',
                            tratamento: trat || '',

                            notas: nts || ''
                        });
                    } else {
                        setError('Consulta não encontrada.');
                    }
                }
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Não foi possível carregar os dados da consulta.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const startMins = (h, m) => h * 60 + m;
            const parseTime = (t) => t.split(':').map(Number);
            const [hIni, mIni] = parseTime(formData.horaInicio);
            const [hFim, mFim] = parseTime(formData.horaFim);
            const duracao = startMins(hFim, mFim) - startMins(hIni, mIni);

            const payload = {
                id_utente: formData.pacienteId,
                id_entidade_medica: formData.medico,
                data: formData.data,
                hora: formData.horaInicio,
                horaInicio: formData.horaInicio,
                horaFim: formData.horaFim,
                duracao: duracao > 0 ? duracao : 30,
                id_estado: 1, // Defaulting to 1 for edits unless status field is added
                notas: `${formData.tratamento}${formData.notas ? ' - ' + formData.notas : ''}`
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
                            <label>Hora Início</label>
                            <div className="input-with-icon">
                                <input type="time" value={formData.horaInicio} onChange={(e) => handleChange('horaInicio', e.target.value)} required />
                                <div className="icon-container"><Clock size={20} /></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Hora Fim</label>
                            <div className="input-with-icon">
                                <input type="time" value={formData.horaFim} onChange={(e) => handleChange('horaFim', e.target.value)} required />
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
                                    {medicos.map(m => <option key={m.id || m.id_entidade_medica} value={m.id || m.id_entidade_medica}>{m.nome || m.nomeCompleto || m.omd || "Médico"}</option>)}
                                </select>
                                <div className="icon-container"><Stethoscope size={20} /></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tratamento</label>
                            <div className="input-with-icon">
                                <select value={formData.tratamento} onChange={(e) => handleChange('tratamento', e.target.value)} required>
                                    <option value="Nenhum">Nenhum</option>
                                    {tratamentos.map(t => <option key={t.id_t_p_tratamento} value={t.nome}>{t.nome}</option>)}
                                </select>
                                <div className="icon-container" dangerouslySetInnerHTML={{ __html: toothSvg }} style={{ width: '20px', height: '20px' }}></div>
                            </div>
                        </div>

                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Notas Extra</label>
                        <textarea placeholder="Escrever..." value={formData.notas} onChange={(e) => handleChange('notas', e.target.value)} />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="submit-btn"
                            onClick={() => navigate(`/gestor/consultas/${id}`)}
                            style={{
                                marginRight: "1rem",
                                background: "#ccc",
                                border: "none",
                                padding: "0.75rem 1.5rem",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontWeight: 600,
                                color: "#333",
                                height: "44px",
                            }}
                        >Cancelar</button>
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