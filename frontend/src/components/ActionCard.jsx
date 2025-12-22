/**
 * ActionCard.jsx - Componente de cartão de ação
 * 
 * Botão de ação estilizado com título e ícone.
 * Usado na sidebar de páginas do gestor.
 */

import React from 'react';
import './ActionCard.css';

function ActionCard({ title, icon, onClick }) {
    return (
        <button
            type="button"
            className="action-card"
            onClick={onClick}
        >
            <div
                className="action-title"
                dangerouslySetInnerHTML={{ __html: title }}
            />
            <div className="action-icon">
                {icon}
            </div>
        </button>
    );
}

export default ActionCard;
