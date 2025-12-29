import React from 'react';
import './ConsultaCard.css';

const ConsultaCard = ({ nome, data, horario, onClick }) => {
    return (
        <div className="consulta-card" onClick={onClick}>
            <h3 className="consulta-card-name">{nome}</h3>
            <div className="consulta-card-details">
                <span>Dia: {data}</span>
                <span>Horário: {horario}</span>

            </div>
        </div>
    );
};

export default ConsultaCard;
