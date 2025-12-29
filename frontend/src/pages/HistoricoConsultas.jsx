import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import ConsultaCard from '../components/ConsultaCard';
import api from '../services/api';
import './HistoricoConsultas.css';
import { Calendar, User, Stethoscope, ChevronDown } from 'lucide-react';
import toothSvg from '../assets/tooth.svg';

const HistoricoConsultas = () => {
    const navigate = useNavigate();
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayLimit, setDisplayLimit] = useState(7);

    // Filter states
    const [filterUtente, setFilterUtente] = useState('');
    const [filterData, setFilterData] = useState('');
    const [filterDentista, setFilterDentista] = useState('');
    const [filterEspecialidade, setFilterEspecialidade] = useState('');

    useEffect(() => {
        fetchConsultas();
    }, []);

    const fetchConsultas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/admin/consultas', { params: { pageSize: 1000 } });
            // Format and filter data for display
            const formatted = response.data
                .filter(c => {
                    const st = (c.estado || '').toLowerCase();
                    return st.includes('conclu') || st.includes('cancel') || st.includes('anula');
                })
                .map(c => ({
                    id: c.id,
                    nUtente: c.paciente?.numeroUtente || '', // Corrigido para numeroUtente
                    nome: c.paciente?.nomeCompleto || 'Desconhecido',
                    data: c.data,
                    horaInicio: c.horaInicio,
                    horaFim: c.horaFim,
                    especialidade: c.especialidade || 'Geral',
                    dentista: c.medico || 'Não atribuído', // Corrigido: médico já é uma string
                    estado: c.estado || ''
                }));
            setConsultas(formatted);
        } catch (err) {
            console.error('Erro ao buscar histórico:', err);
            setError('Não foi possível carregar o histórico de consultas.');
        } finally {
            setLoading(false);
        }
    };

    const formatDateForCard = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('pt-PT');
    };

    const formatTimeForCard = (start, end) => {
        const s = (start || '').slice(0, 5);
        const e = (end || '').slice(0, 5);
        if (s && e) return `${s}-${e}`;
        if (s) return s;
        return '';
    };

    // Derived filtered list
    const filteredConsultas = useMemo(() => {
        return consultas.filter(c => {
            const matchesUtente = filterUtente === '' || c.nUtente.toString().includes(filterUtente);
            const matchesData = filterData === '' || c.data === filterData;
            const matchesDentista = filterDentista === '' ||
                c.dentista.toLowerCase().includes(filterDentista.toLowerCase());
            const matchesEspecialidade = filterEspecialidade === '' ||
                c.especialidade.toLowerCase() === filterEspecialidade.toLowerCase();

            return matchesUtente && matchesData && matchesDentista && matchesEspecialidade;
        });
    }, [consultas, filterUtente, filterData, filterDentista, filterEspecialidade]);

    const handleVerMais = () => {
        setDisplayLimit(prev => prev + 7);
    };

    return (
        <div className="historico-consultas-page">
            <Navbar variant="gestor" />

            <main className="historico-consultas-content">
                <h1 className="page-title">HISTÓRICO DE CONSULTAS</h1>

                <section className="filters-container">
                    <h2 className="section-label">FILTROS</h2>
                    <div className="filters-section">
                        <div className="filter-input-wrapper">
                            <input
                                type="text"
                                className="filter-input"
                                placeholder="Nº de Utente..."
                                value={filterUtente}
                                onChange={(e) => setFilterUtente(e.target.value)}
                            />
                        </div>

                        <div className="filter-input-wrapper">
                            <input
                                type="date"
                                className="filter-input"
                                value={filterData}
                                onChange={(e) => setFilterData(e.target.value)}
                            />
                            <div className="filter-icon"><Calendar size={18} /></div>
                        </div>

                        <div className="filter-input-wrapper">
                            <input
                                type="text"
                                className="filter-input"
                                placeholder="Dentista"
                                value={filterDentista}
                                onChange={(e) => setFilterDentista(e.target.value)}
                            />
                            <div className="filter-icon">
                                <img src={toothSvg} alt="" width="16" height="16" />
                            </div>
                        </div>

                        <div className="filter-input-wrapper">
                            <select
                                className="filter-input"
                                value={filterEspecialidade}
                                onChange={(e) => setFilterEspecialidade(e.target.value)}
                                style={{ appearance: 'none' }}
                            >
                                <option value="">Especialidade</option>
                                <option value="Cirurgia">Cirurgia</option>
                                <option value="Ortodontia">Ortodontia</option>
                                <option value="Implantes">Implantes</option>
                                <option value="Geral">Geral</option>
                            </select>
                            <div className="filter-icon"><ChevronDown size={18} /></div>
                        </div>
                    </div>
                </section>

                <section className="list-container">
                    <h2 className="section-label">LISTA</h2>

                    <div className="history-list-container">
                        {loading ? (
                            <div className="loading-state">A carregar diagnóstico...</div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : filteredConsultas.length === 0 ? (
                            <div className="empty-state">Nenhuma consulta encontrada com estes filtros.</div>
                        ) : (
                            <>
                                {filteredConsultas.slice(0, displayLimit).map(c => (
                                    <ConsultaCard
                                        key={c.id}
                                        nome={c.nome}
                                        data={formatDateForCard(c.data)}
                                        horario={formatTimeForCard(c.horaInicio, c.horaFim)}
                                        especialidade={c.especialidade}
                                        onClick={() => navigate(`/gestor/consultas/${c.id}/resumo`)}
                                    />
                                ))}

                                {filteredConsultas.length > displayLimit && (
                                    <div className="ver-mais-btn-container">
                                        <button className="ver-mais-link" onClick={handleVerMais}>
                                            Ver Mais
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>

            <footer className="consultas-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default HistoricoConsultas;
