import React, { useState, useEffect } from 'react';
import { Navbar } from '../components';
import api from '../services/api';
import './Gestores.css';

const Gestores = () => {
    const [gestores, setGestores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        isMedico: null, // null, true, false
        omd: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGestores();
    }, []);

    const fetchGestores = async () => {
        try {
            setFetching(true);
            const response = await api.get('/admin/gestores');
            // Assuming response.data is an array of gestores
            const data = response.data?.data || response.data || [];
            setGestores(data);
        } catch (err) {
            console.error('Erro ao buscar gestores:', err);
            setError('Erro ao carregar a lista de gestores.');
        } finally {
            setFetching(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleToggleMedico = (isMedico) => {
        setFormData(prev => ({
            ...prev,
            isMedico,
            omd: isMedico ? prev.omd : ''
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem a certeza que deseja eliminar este gestor?')) {
            try {
                await api.delete(`/admin/gestores/${id}`);
                setGestores(prev => prev.filter(g => g.id !== id));
            } catch (err) {
                console.error('Erro ao eliminar gestor:', err);
                alert('Erro ao eliminar o gestor. Tente novamente.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nome || !formData.email || formData.isMedico === null) {
            setError('Por favor preencha todos os campos obrigatórios.');
            return;
        }
        if (formData.isMedico && !formData.omd) {
            setError('Por favor introduza o número da OMD.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = {
                nomeCompleto: formData.nome,
                email: formData.email,
                omd: formData.isMedico ? formData.omd : null,
                tipo: formData.isMedico ? 'medico' : 'gestor'
            };

            await api.post('/admin/gestores', payload);

            // Refresh list and clear form
            fetchGestores();
            setFormData({ nome: '', email: '', isMedico: null, omd: '' });
            alert('Gestor criado com sucesso!');
        } catch (err) {
            console.error('Erro ao criar gestor:', err);
            setError(err.response?.data?.message || 'Erro ao criar gestor. Tente novamente.');
        } finally {
            setLoading(true); // Manter coerente com o mock anterior ou usar false se preferir refresh suave
            setTimeout(() => setLoading(false), 500);
        }
    };

    const filteredGestores = gestores.filter(g =>
        (g.nomeCompleto || g.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="gestores-page">
            <Navbar variant="gestor" />

            <main className="gestores-main">
                <h1 className="page-title">GESTORES</h1>

                {/* Section: List */}
                <section className="gestores-section">
                    <div className="search-container">
                        <input
                            type="text"
                            className="gestores-search-input"
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="filter-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                            </svg>
                        </button>
                    </div>

                    <div className="gestores-list-card">
                        {fetching ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>A carregar gestores...</div>
                        ) : filteredGestores.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>Nenhum gestor encontrado.</div>
                        ) : (
                            filteredGestores.map(gestor => (
                                <div key={gestor.id} className="gestor-item">
                                    <div className="gestor-info">
                                        <span className="gestor-name">{gestor.nomeCompleto || gestor.nome}</span>
                                        {gestor.omd && <span className="gestor-omd">OMD: {gestor.omd}</span>}
                                    </div>
                                    <button className="delete-btn" onClick={() => handleDelete(gestor.id)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                        {filteredGestores.length > 0 && <div className="ver-mais">Ver Mais</div>}
                    </div>
                </section>

                <h1 className="page-title">CRIAR GESTOR</h1>

                {/* Section: Form */}
                <section className="gestores-section">
                    <div className="create-gestor-card">
                        <form className="gestor-form" onSubmit={handleSubmit}>
                            {error && <div className="error-message">{error}</div>}

                            <div className="form-group full-width">
                                <label>Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    placeholder="Escrever..."
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Escrever..."
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Médico?</label>
                                <div className="toggle-group">
                                    <button
                                        type="button"
                                        className={`toggle-btn ${formData.isMedico === true ? 'active' : ''}`}
                                        onClick={() => handleToggleMedico(true)}
                                    >
                                        Sim
                                    </button>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${formData.isMedico === false ? 'active' : ''}`}
                                        onClick={() => handleToggleMedico(false)}
                                    >
                                        Não
                                    </button>
                                </div>
                            </div>

                            {formData.isMedico === true && (
                                <div className="form-group full-width">
                                    <label>OMD</label>
                                    <input
                                        type="text"
                                        name="omd"
                                        placeholder="Ex: 1234567890"
                                        value={formData.omd}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            <div className="form-footer">
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'A Submeter...' : 'Submeter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="gestores-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Gestores;
