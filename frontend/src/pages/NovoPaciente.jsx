/**
 * NovoPaciente.jsx - Página de criação de novo paciente (Gestor)
 * 
 * Formulário para criar um novo paciente com todos os campos obrigatórios.
 * - Se dependente = Não: mostra opção de enviar credenciais
 * - Se dependente = Sim: mostra dropdown para selecionar responsável
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import api from '../services/api';
import './NovoPaciente.css';

function NovoPaciente() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pacientes, setPacientes] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        dataNascimento: '',
        codigoPostal: '',
        email: '',
        genero: '',
        numeroUtente: '',
        telefone: '',
        morada: '',
        nif: '',
        estadoCivil: '',
        dependente: null, // null = not selected, true = Sim, false = Não
        enviarCredenciais: null,
        responsavelId: '',
    });

    // Responsável dropdown state
    const [responsavelSearch, setResponsavelSearch] = useState('');
    const [responsavelDropdownOpen, setResponsavelDropdownOpen] = useState(false);

    // Load pacientes for responsável dropdown
    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const resp = await api.get('/pacientes', { params: { pageSize: 200 } });
                // Ensure we always get an array
                const data = resp?.data?.data || resp?.data || [];
                setPacientes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erro ao carregar pacientes:', err);
            }
        };
        fetchPacientes();
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                nomeCompleto: formData.nomeCompleto,
                dataNascimento: formData.dataNascimento,
                genero: formData.genero,
                email: formData.email,
                telefone: formData.telefone,
                nus: formData.numeroUtente,
                nif: formData.nif,
                estadoCivil: formData.estadoCivil,
                dependente: formData.dependente,
                morada: {
                    rua: formData.morada,
                    codigoPostal: formData.codigoPostal,
                    localidade: '',
                },
                criarUtilizador: formData.dependente === false && formData.enviarCredenciais === true,
                enviarCredenciais: formData.dependente === false && formData.enviarCredenciais === true,
            };

            // If dependente, add responsavelId
            if (formData.dependente && formData.responsavelId) {
                payload.idResponsavel = parseInt(formData.responsavelId, 10);
            }

            await api.post('/pacientes', payload);
            navigate('/pacientes');
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Erro ao criar paciente. Verifique os dados.');
            }
        } finally {
            setLoading(false);
        }
    };

    const generoOptions = ['Masculino', 'Feminino', 'Outro'];
    const estadoCivilOptions = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União de Facto'];

    // Filter pacientes for responsável dropdown - with safety checks
    const filteredPacientes = React.useMemo(() => {
        if (!Array.isArray(pacientes)) return [];
        if (!responsavelSearch || responsavelSearch.trim() === '') return pacientes;

        try {
            const searchLower = String(responsavelSearch).toLowerCase();
            return pacientes.filter(p => {
                if (!p) return false;
                const nome = String(p.nomeCompleto || '').toLowerCase();
                const nus = String(p.numeroUtente || '').toLowerCase();
                return nome.includes(searchLower) || nus.includes(searchLower);
            });
        } catch (err) {
            console.error('Error filtering pacientes:', err);
            return pacientes;
        }
    }, [pacientes, responsavelSearch]);

    // Handle responsável selection
    const selectResponsavel = (paciente) => {
        handleChange('responsavelId', paciente.id.toString());
        setResponsavelSearch(`${paciente.nomeCompleto} - ${paciente.numeroUtente || 'N/A'}`);
        setResponsavelDropdownOpen(false);
    };

    // Get selected paciente name for display
    const getSelectedResponsavelDisplay = () => {
        if (formData.responsavelId) {
            const selected = pacientes.find(p => p.id.toString() === formData.responsavelId);
            if (selected) {
                return `${selected.nomeCompleto} - ${selected.numeroUtente || 'N/A'}`;
            }
        }
        return '';
    };

    return (
        <div className="novo-paciente-page">
            <Navbar variant="gestor" />

            <main className="novo-paciente-main">
                <h1 className="novo-paciente-title">NOVO REGISTO</h1>

                <form className="novo-paciente-form" onSubmit={handleSubmit}>
                    {error && <div className="form-error">{error}</div>}

                    {/* Nome Completo - full width */}
                    <div className="form-row full-width">
                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input
                                type="text"
                                placeholder="Escrever..."
                                value={formData.nomeCompleto}
                                onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Row: Data Nascimento, Código Postal, Email */}
                    <div className="form-row three-cols">
                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            <input
                                type="date"
                                value={formData.dataNascimento}
                                onChange={(e) => handleChange('dataNascimento', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Código Postal</label>
                            <input
                                type="text"
                                placeholder="Escrever..."
                                value={formData.codigoPostal}
                                onChange={(e) => handleChange('codigoPostal', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Escrever..."
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Row: Género, Número de Utente, Telemóvel */}
                    <div className="form-row three-cols">
                        <div className="form-group">
                            <label>Género</label>
                            <select
                                value={formData.genero}
                                onChange={(e) => handleChange('genero', e.target.value)}
                                required
                            >
                                <option value="">Escolher...</option>
                                {generoOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Número de Utente</label>
                            <input
                                type="text"
                                placeholder="1234567"
                                value={formData.numeroUtente}
                                onChange={(e) => handleChange('numeroUtente', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Telemóvel</label>
                            <input
                                type="tel"
                                placeholder="91......"
                                value={formData.telefone}
                                onChange={(e) => handleChange('telefone', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Row: Morada, NIF + Estado Civil, Dependente */}
                    <div className="form-row three-cols">
                        <div className="form-group">
                            <label>Morada</label>
                            <textarea
                                placeholder="Escrever..."
                                value={formData.morada}
                                onChange={(e) => handleChange('morada', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                        <div className="form-group stacked">
                            <div className="form-group">
                                <label>Número de Identificação Fiscal</label>
                                <input
                                    type="text"
                                    placeholder="9876543"
                                    value={formData.nif}
                                    onChange={(e) => handleChange('nif', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Estado Civil</label>
                                <select
                                    value={formData.estadoCivil}
                                    onChange={(e) => handleChange('estadoCivil', e.target.value)}
                                    required
                                >
                                    <option value="">Escolher...</option>
                                    {estadoCivilOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Dependente</label>
                            <div className="toggle-buttons">
                                <button
                                    type="button"
                                    className={`toggle-btn ${formData.dependente === true ? 'active' : ''}`}
                                    onClick={() => handleChange('dependente', true)}
                                >
                                    Sim
                                </button>
                                <button
                                    type="button"
                                    className={`toggle-btn ${formData.dependente === false ? 'active' : ''}`}
                                    onClick={() => handleChange('dependente', false)}
                                >
                                    Não
                                </button>
                            </div>

                            {/* If Dependente = Não: show Enviar Credenciais */}
                            {formData.dependente === false && (
                                <div className="conditional-field">
                                    <label>Enviar as Credenciais</label>
                                    <div className="toggle-buttons">
                                        <button
                                            type="button"
                                            className={`toggle-btn ${formData.enviarCredenciais === true ? 'active' : ''}`}
                                            onClick={() => handleChange('enviarCredenciais', true)}
                                        >
                                            Sim
                                        </button>
                                        <button
                                            type="button"
                                            className={`toggle-btn ${formData.enviarCredenciais === false ? 'active' : ''}`}
                                            onClick={() => handleChange('enviarCredenciais', false)}
                                        >
                                            Não
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* If Dependente = Sim: show Responsável searchable dropdown */}
                            {formData.dependente === true && (
                                <div className="conditional-field">
                                    <label>Responsável</label>
                                    <div className="searchable-dropdown">
                                        <input
                                            type="text"
                                            placeholder="Escrever para pesquisar..."
                                            value={responsavelSearch}
                                            onChange={(e) => {
                                                setResponsavelSearch(e.target.value);
                                                setResponsavelDropdownOpen(true);
                                                // Clear selection if user is typing
                                                if (formData.responsavelId) {
                                                    handleChange('responsavelId', '');
                                                }
                                            }}
                                            onFocus={() => setResponsavelDropdownOpen(true)}
                                        />
                                        {responsavelDropdownOpen && (
                                            <div className="dropdown-list">
                                                {filteredPacientes.length === 0 ? (
                                                    <div className="dropdown-empty">Nenhum resultado</div>
                                                ) : (
                                                    filteredPacientes.map(p => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            className="dropdown-item"
                                                            onClick={() => selectResponsavel(p)}
                                                        >
                                                            <span className="dropdown-name">{p.nomeCompleto}</span>
                                                            <span className="dropdown-nus">NUS: {p.numeroUtente || 'N/A'}</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* Hidden input to hold actual value for form validation */}
                                    <input
                                        type="hidden"
                                        value={formData.responsavelId}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'A submeter...' : 'Submeter'}
                        </button>
                    </div>
                </form>
            </main>

            <footer className="novo-paciente-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default NovoPaciente;
