import React, { useState } from 'react';
import { Navbar } from '../components';
import { useNavigate } from 'react-router-dom';
import './EditarCredenciais.css';
import profileService from '../services/profile.service';

function EditarCredenciais() {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (pin.length < 4 || pin.length > 12) {
            setError('O novo PIN deve ter entre 4 e 12 dígitos.');
            return;
        }

        if (pin !== confirmPin) {
            setError('Os PINs novos não coincidem.');
            return;
        }

        setLoading(true);

        try {
            await profileService.updatePin({
                novoPin: pin,
                confirmarNovoPin: confirmPin
            });
            setSuccess('Credenciais atualizadas com sucesso!');
            setPin('');
            setConfirmPin('');
            setTimeout(() => {
                navigate('/perfil/dados');
            }, 2000);
        } catch (err) {
            console.error("Erro ao atualizar PIN:", err);
            setError('Não foi possível atualizar o PIN. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="credenciais-container">
            <Navbar variant="utente" />

            <main className="credenciais-main">
                <h1 className="credenciais-page-title">EDITAR CREDENCIAIS</h1>

                <form className="credenciais-card" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div className="form-group">
                        <label htmlFor="new-pin" className="input-label">Novo Pin</label>
                        <input
                            id="new-pin"
                            type="password"
                            className="input-field-custom"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-pin" className="input-label">Confirmar Novo Pin</label>
                        <input
                            id="confirm-pin"
                            type="password"
                            className="input-field-custom"
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'A enviar...' : 'Enviar'}
                    </button>
                </form>
            </main>

            <footer className="home-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default EditarCredenciais;
