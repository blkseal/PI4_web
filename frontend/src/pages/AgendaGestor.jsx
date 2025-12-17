import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components';
import './AgendaGestor.css';

const days = ['Segunda-feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira'];
const hours = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00'
];

function AgendaGestor() {
  const navigate = useNavigate();

  useEffect(() => {
    // const storedUser = localStorage.getItem('user');
    // const parsed = storedUser ? JSON.parse(storedUser) : null;
    // if (parsed?.tipo !== 'gestor') {
    //   navigate('/home', { replace: true });
    // }
  }, [navigate]);

  return (
    <div className="agenda-page">
      <Navbar variant="gestor" />

      <main className="agenda-main">
        <div className="agenda-toolbar">
          <div className="toolbar-left">
            <button className="ghost-btn" type="button">{'<'} </button>
            <div className="date-range">1-5 Janeiro de 2025</div>
            <button className="ghost-btn" type="button"> {'>'}</button>
          </div>
          <div className="toolbar-right">
            <button className="filter-btn" type="button">Todos os Médicos ▼</button>
          </div>
        </div>

        <section className="agenda-grid">
          <div className="grid-head">
            <div className="time-col" />
            {days.map((d) => (
              <div key={d} className="day-col">{d}</div>
            ))}
          </div>
          <div className="grid-body">
            {hours.map((h) => (
              <div key={h} className="time-row">
                <div className="time-col">{h}</div>
                {days.map((d) => (
                  <div key={`${d}-${h}`} className="slot" />
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="agenda-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default AgendaGestor;