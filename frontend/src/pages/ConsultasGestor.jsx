import React, { useState, useEffect } from 'react';
import { Navbar } from '../components';
import ConsultaCard from '../components/ConsultaCard';
import { FilterModal } from '../components';
import './ConsultasGestor.css';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ConsultasGestor = () => {
    const navigate = useNavigate();
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayLimit, setDisplayLimit] = useState(6);

    // Filter State
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        dataInicio: '',
        dataFim: '',
        medico: '',
        paciente: ''
    });
    const [tempFilters, setTempFilters] = useState(filters);

    // Fetch consultas from backend
    useEffect(() => {
        fetchConsultas();
    }, [filters]); // Re-fetch/filter when filters change

    const fetchConsultas = async () => {
        try {
            setLoading(true);
            setError(null);
            // UPDATED: Changed endpoint to /admin/consultas which lists all consultations
            const response = await api.get('/admin/consultas');

            // Transform and filter data
            const formattedConsultas = response.data
                .filter(consulta => {
                    // 1. Filter: Pendente or Por Acontecer only
                    const st = (consulta.estado || '').toLowerCase();
                    if (st !== 'pendente' && st !== 'por acontecer') return false;

                    // 2. Filter by Medico (loose match)
                    const medicoMatch = !filters.medico ||
                        (consulta.medico || '').toLowerCase().includes(filters.medico.toLowerCase());

                    // 3. Filter by Paciente (loose match)
                    const pacienteMatch = !filters.paciente ||
                        (consulta.paciente?.nomeCompleto || '').toLowerCase().includes(filters.paciente.toLowerCase());

                    // 4. Filter by Date Range
                    let dateMatch = true;
                    if (filters.dataInicio || filters.dataFim) {
                        const consultaDateVal = new Date(consulta.data);
                        consultaDateVal.setHours(0, 0, 0, 0);

                        if (filters.dataInicio) {
                            const startDate = new Date(filters.dataInicio);
                            startDate.setHours(0, 0, 0, 0);
                            if (consultaDateVal < startDate) dateMatch = false;
                        }
                        if (filters.dataFim && dateMatch) {
                            const endDate = new Date(filters.dataFim);
                            endDate.setHours(0, 0, 0, 0);
                            if (consultaDateVal > endDate) dateMatch = false;
                        }
                    }

                    return medicoMatch && pacienteMatch && dateMatch;
                })
                .map(consulta => ({
                    id: consulta.id,
                    nome: consulta.paciente?.nomeCompleto || 'Nome não disponível',
                    data: formatDate(consulta.data),
                    horario: `${(consulta.horaInicio || '').slice(0, 5)} - ${(consulta.horaFim || '').slice(0, 5)}`,
                    estado: consulta.estado || 'pendente'
                }));

            setConsultas(formattedConsultas);
        } catch (err) {
            console.error('Erro ao buscar consultas:', err);
            setError('Erro ao carregar consultas. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Format date from YYYY-MM-DD or ISO string to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return 'Data não disponível';
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) return dateString; // Fallback to original string if invalid
        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleVerMais = () => {
        setDisplayLimit(prev => prev + 6);
    };

    const openFilterModal = () => {
        setTempFilters({ ...filters });
        setIsFilterModalOpen(true);
    };

    const applyFilters = () => {
        setFilters({ ...tempFilters });
        setIsFilterModalOpen(false);
        // Reset display limit when filtering
        setDisplayLimit(6);
    };

    const handleFilterChange = (field, value) => {
        setTempFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="consultas-gestor-page">
            <Navbar variant="gestor" />
            <main className="consultas-gestor-content">
                <h1 className="page-title">CONSULTAS</h1>
                <div className="consultas-gestor-grid">
                    {/* Left Column: List */}
                    <section className="consultas-list-section">
                        <div className="section-header">
                            <h2>CONSULTAS</h2>
                            <button
                                className="filter-button"
                                aria-label="Filter"
                                onClick={openFilterModal}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                                </svg>
                            </button>
                        </div>
                        <div className="consultas-list-container">
                            {loading ? (
                                <div className="loading-state">
                                    <p>A carregar consultas...</p>
                                </div>
                            ) : error ? (
                                <div className="error-state">
                                    <p>{error}</p>
                                    <button onClick={() => fetchConsultas()} className="retry-button">Tentar novamente</button>
                                </div>
                            ) : consultas.length === 0 ? (
                                <div className="empty-state">
                                    <p>Nenhuma consulta encontrada.</p>
                                </div>
                            ) : (
                                <>
                                    {consultas.slice(0, displayLimit).map((consulta) => (
                                        <ConsultaCard
                                            key={consulta.id}
                                            {...consulta}
                                            onClick={() => navigate(`/gestor/consultas/${consulta.id}`)}
                                        />
                                    ))}
                                    {displayLimit < consultas.length && (
                                        <div className="ver-mais-container">
                                            <button className="ver-mais-button" onClick={handleVerMais}>
                                                Ver Mais
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                    {/* Right Column: Actions */}
                    <section className="consultas-actions-section">
                        <button
                            type="button"
                            className="action-btn brown"
                            onClick={() => navigate('/gestor/agendar')}
                        >
                            <span className="action-text">AGENDAR UMA CONSULTA</span>
                            <div className="action-icon">
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </div>
                        </button>
                        <button
                            type="button"
                            className="action-btn bronze"
                            onClick={() => navigate('/gestor/historico')}
                        >
                            <span className="action-text">HISTÓRICO DE CONSULTAS</span>
                            <div className="action-icon">
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                    <path d="M12 7v5l4 2" />
                                </svg>
                            </div>
                        </button>
                        <button
                            type="button"
                            className="action-btn dark"
                            onClick={() => navigate('/gestor/pedidos')}
                        >
                            <span className="action-text">PEDIDOS DE CONSULTAS</span>
                            <div className="action-icon">
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </div>
                        </button>
                    </section>
                </div>
            </main>
            <footer className="consultas-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={applyFilters}
                title="FILTRAR CONSULTAS"
            >
                <div className="filter-group">
                    <label className="filter-label">Intervalo de Datas</label>
                    <div className="filter-date-row">
                        <div className="filter-date-col">
                            <input
                                type="date"
                                className="filter-input-modal"
                                value={tempFilters.dataInicio}
                                onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                                placeholder="De"
                            />
                        </div>
                        <div className="filter-date-col">
                            <input
                                type="date"
                                className="filter-input-modal"
                                value={tempFilters.dataFim}
                                onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                                placeholder="Até"
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Paciente</label>
                    <input
                        type="text"
                        className="filter-input-modal"
                        value={tempFilters.paciente}
                        onChange={(e) => handleFilterChange('paciente', e.target.value)}
                        placeholder="Nome do paciente..."
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Dentista</label>
                    <input
                        type="text"
                        className="filter-input-modal"
                        value={tempFilters.medico}
                        onChange={(e) => handleFilterChange('medico', e.target.value)}
                        placeholder="Nome do dentista..."
                    />
                </div>
            </FilterModal>
        </div>
    );
};
export default ConsultasGestor;