import React, { useState } from 'react';
import { Navbar } from '../components';
import './PedidosConsulta.css';

const PedidosConsulta = () => {
    // Mock data based on the image provided
    const [pedidos] = useState([
        {
            id: 1,
            nome: 'Pedro Paiva Tomé',
            dia: '11/09/2025',
            horario: '9h',
            especialidade: 'Cirurgia',
            nUtente: '123456789',
            contacto: '+351 960 999 888',
            motivo: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            status: 'concluido'
        },
        {
            id: 2,
            nome: 'Pedro Paiva Tomé',
            dia: '11/09/2025',
            horario: '9h',
            especialidade: 'Cirurgia',
            nUtente: '123456789',
            contacto: '+351 960 999 888',
            motivo: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            status: 'concluido'
        },
        {
            id: 3,
            nome: 'Pedro Paiva Tomé',
            dia: '11/09/2025',
            horario: '9h',
            especialidade: 'Cirurgia',
            nUtente: '123456789',
            contacto: '+351 960 999 888',
            motivo: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            status: 'concluido'
        }
    ]);

    return (
        <div className="pedidos-consulta-page">
            <Navbar variant="gestor" />

            <main className="pedidos-consulta-content">
                <h1 className="page-title">PEDIDOS DE CONSULTA</h1>

                <div className="pedidos-list">
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className="pedido-card">
                            <div className="pedido-header">
                                <h2 className="pedido-name">{pedido.nome}</h2>
                                <div className="status-badge">
                                    CONCLUÍDO
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>

                            <div className="pedido-body">
                                <div className="pedido-info-column">
                                    <div className="info-row">
                                        <span className="info-label">Dia:</span>
                                        <span>{pedido.dia}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Horário:</span>
                                        <span>{pedido.horario}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Especialidade:</span>
                                        <span>{pedido.especialidade}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">NºUtente:</span>
                                        <span>{pedido.nUtente}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Contacto:</span>
                                        <span>{pedido.contacto}</span>
                                    </div>
                                </div>

                                <div className="pedido-info-column">
                                    <span className="motivo-label">Motivo:</span>
                                    <p className="motivo-text">{pedido.motivo}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="pedidos-footer">
                <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default PedidosConsulta;
