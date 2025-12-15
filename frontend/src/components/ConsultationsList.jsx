import React, { useMemo } from 'react';

function ConsultationsList({ consultas = [], loading = false, error = '', emptyMessage = 'Sem consultas próximas.' }) {
  const consultasFormatadas = useMemo(() => {
    return (consultas || []).map((c) => {
      const data = c.data ? new Date(c.data) : null;
      const dia = data ? String(data.getDate()).padStart(2, '0') : '--';
      const mes = data ? data.toLocaleString('pt-PT', { month: 'short' }) : '--';
      const horaInicio = c.hora || c.horaInicio || '';
      const horaFim = c.horaFim || '';
      const horario = horaFim ? `${horaInicio} - ${horaFim}` : horaInicio;
      const tipo = c.titulo || c.especialidade || 'Consulta';
      return {
        id: c.id || c.id_consulta || Math.random(),
        dia,
        mes,
        tipo,
        horario
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
        <div className="consultations-list">
          {consultasFormatadas.map((consulta) => (
            <div key={consulta.id} className="consulta-card">
              <div className="consulta-date">
                <span className="date-day">{consulta.dia}</span>
                <span className="date-month">{consulta.mes}</span>
              </div>
              <div className="consulta-info">
                <h3 className="consulta-type">{consulta.tipo}</h3>
                <span className="consulta-time">{consulta.horario}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ConsultationsList;
