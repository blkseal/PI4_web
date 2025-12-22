/**
 * PatientCard.jsx - Componente de cartão de paciente
 * 
 * Exibe informações resumidas de um paciente numa lista.
 */

import React from 'react';
import './PatientCard.css';

/**
 * Calcula a idade a partir da data de nascimento
 */
function calculateAge(birthDate) {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

/**
 * Formata data para DD/MM/YYYY
 */
function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function PatientCard({ patient, onClick }) {
    const age = calculateAge(patient?.dataNascimento);
    const formattedDate = formatDate(patient?.dataNascimento);

    return (
        <button
            type="button"
            className="patient-card"
            onClick={onClick}
        >
            <div className="patient-name">{patient?.nomeCompleto || '—'}</div>
            <div className="patient-info">
                <span className="patient-birth">
                    Data de Nascimento: {formattedDate}
                    {age !== null && ` (${age})`}
                </span>
                <span className="patient-number">
                    Nº Utente: {patient?.numeroUtente || '—'}
                </span>
            </div>
        </button>
    );
}

export default PatientCard;
