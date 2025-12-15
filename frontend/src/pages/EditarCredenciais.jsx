import React, { useState } from 'react';
import { Navbar } from '../components';
import { useNavigate } from 'react-router-dom';
import './EditarCredenciais.css';

function EditarCredenciais() {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would add validation and API call
        console.log("Password changed", { pin });
        alert("Credenciais atualizadas com sucesso! (Simulação)");
        navigate('/perfil/dados');
    };

    return (
        <div className="credenciais-container">
            <Navbar variant="utente" />

            <main className="credenciais-main">
                <h1 className="credenciais-page-title">EDITAR CREDENCIAIS</h1>

                <form className="credenciais-card" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="new-pin" className="input-label">Novo Pin</label>
                        <input
                            id="new-pin"
                            type="password"
                            className="input-field-custom"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
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
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Enviar
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
