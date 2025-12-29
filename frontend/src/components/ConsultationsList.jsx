import React, { useMemo } from 'react';
import { useNavigate } from "react-router-dom";


function ConsultationsList({ consultas = [], loading = false, error = '', emptyMessage = 'Sem consultas próximas.', onClick }) {
  const navigate = useNavigate();

  const consultasFormatadas = useMemo(() => {
    return (consultas || []).map((c) => {
      const data = c.data ? new Date(c.data) : null;
      const dia = data ? String(data.getDate()).padStart(2, '0') : '--';
      const mes = data ? data.toLocaleString('pt-PT', { month: 'short' }) : '--';
      const horaInicio = c.hora || c.horaInicio || '';
      const horaFim = c.horaFim || '';
      const horario = horaFim ? `${horaInicio} - ${horaFim}` : horaInicio;
      const tipo = c.titulo || 'Consulta';
      return {

        id: c.id || c.id_consulta || Math.random(),
        dia,
        mes,
        tipo,
        horario,
        estado: c.estado || 'por acontecer'
      };
    });
  }, [consultas]);

  return (
    <section className="consultations-section">
      <h2 className="section-title">PRÓXIMAS CONSULTAS</h2>
      {loading && <p className="consultas-status">A carregar consultas...</p>}
      {error && !loading && <p className="consultas-status error">{error}</p>}

      {!loading && !error && consultasFormatadas.length === 0 && (
        <p className="consultas-status">{emptyMessage}</p>
      )}

      {!loading && !error && consultasFormatadas.length > 0 && (
        <div className="consultations-group-container">
          <div className="consultations-list-horizontal">
            {consultasFormatadas.map((consulta) => (
              <div
                key={consulta.id}
                className="consulta-card-horizontal"
                onClick={() => onClick ? onClick(consulta.id) : null}
                style={{ cursor: onClick ? 'pointer' : 'default' }}
              >

                <div className="consulta-date-badge">
                  <span className="date-day">{consulta.dia}</span>
                  <span className="date-month">{consulta.mes}</span>
                </div>
                <div className="consulta-details-content">
                  <h3 className="consulta-title">{consulta.tipo}</h3>
                  <span className="consulta-time-range">{consulta.horario}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ConsultationsList;
