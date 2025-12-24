import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import "./AgendaGestor.css";

const days = [
  "Segunda-feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
];
const hours = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
];

function AgendaGestor() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("week"); // 'week' | 'day'
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [consultas, setConsultas] = useState([]);
  const [agendaSlots, setAgendaSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ensure only gestores reach this page - handled by route but keep guard
    const storedUser = localStorage.getItem("user");
    const parsed = storedUser ? JSON.parse(storedUser) : null;
    if (parsed?.tipo !== "gestor") navigate("/home", { replace: true });
  }, [navigate]);

  // compute date range for API (ISO yyyy-mm-dd)
  const range = useMemo(() => {
    const start = new Date(currentDate);
    if (viewMode === "week") {
      // set to Monday
      const day = start.getDay();
      const diff = (day === 0 ? -6 : 1) - day; // Monday
      start.setDate(start.getDate() + diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 4); // Monday..Friday
      return {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        daysCount: 5,
        startDateObj: start,
      };
    }
    // day view
    return {
      start: start.toISOString().slice(0, 10),
      end: start.toISOString().slice(0, 10),
      daysCount: 1,
      startDateObj: start,
    };
  }, [currentDate, viewMode]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const resp = await api.get("/medicos");
        setDoctors(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error("Erro ao carregar médicos:", err);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    const loadConsultas = async () => {
      setLoading(true);
      try {
        const [cResp, aResp] = await Promise.all([
          api.get("/admin/consultas", {
            params: {
              dataInicio: range.start,
              dataFim: range.end,
              pageSize: 1000,
            },
          }),
          api.get("/agenda", {
            params: { dataInicio: range.start, dataFim: range.end },
          }),
        ]);

        setConsultas(Array.isArray(cResp.data) ? cResp.data : []);
        setAgendaSlots(Array.isArray(aResp.data) ? aResp.data : []);
      } catch (err) {
        console.error("Erro ao carregar consultas/agenda:", err);
        setConsultas([]);
        setAgendaSlots([]);
      } finally {
        setLoading(false);
      }
    };

    loadConsultas();
  }, [range.start, range.end]);

  return (
    <div className="agenda-page">
      <Navbar variant="gestor" />

      <main className="agenda-main">
        <div className="agenda-toolbar">
          <div className="toolbar-left">
            <button
              className="ghost-btn"
              type="button"
              onClick={() =>
                setCurrentDate((d) => {
                  const n = new Date(d);
                  n.setDate(n.getDate() - (viewMode === "week" ? 7 : 1));
                  return n;
                })
              }
            >
              {"<"}{" "}
            </button>
            <div className="date-range">
              {range.start} {range.start !== range.end ? `— ${range.end}` : ""}
            </div>
            <button
              className="ghost-btn"
              type="button"
              onClick={() =>
                setCurrentDate((d) => {
                  const n = new Date(d);
                  n.setDate(n.getDate() + (viewMode === "week" ? 7 : 1));
                  return n;
                })
              }
            >
              {" "}
              {">"}
            </button>
            <div style={{ marginLeft: 12 }}>
              <button
                className="ghost-btn"
                onClick={() => setViewMode("week")}
                disabled={viewMode === "week"}
              >
                Semana
              </button>
              <button
                className="ghost-btn"
                onClick={() => setViewMode("day")}
                disabled={viewMode === "day"}
              >
                Dia
              </button>
            </div>
          </div>
          <div className="toolbar-right">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="all">Todos os Médicos</option>
              {doctors.map((d) => (
                <option key={d.id_entidade_medica} value={d.id_entidade_medica}>
                  {d.omd}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="agenda-grid">
          <div className="grid-head">
            <div className="time-col" />
            {(() => {
              const arr = [];
              const start = new Date(range.startDateObj);
              for (let i = 0; i < range.daysCount; i++) {
                const d = new Date(start);
                d.setDate(start.getDate() + i);
                const label = d.toLocaleDateString("pt-PT", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                });
                arr.push(
                  <div key={i} className="day-col">
                    {label}
                  </div>
                );
              }
              return arr;
            })()}
          </div>
          <div className="grid-body">
            {hours.map((h) => (
              <div key={h} className="time-row">
                <div className="time-col">{h}</div>
                {(() => {
                  const cells = [];
                  const start = new Date(range.startDateObj);
                  for (let i = 0; i < range.daysCount; i++) {
                    const d = new Date(start);
                    d.setDate(start.getDate() + i);
                    const dateISO = d.toISOString().slice(0, 10);

                    // find consulta matching this date and hour
                    const match = consultas.find((c) => {
                      if (!c) return false;
                      if (selectedDoctor !== "all") {
                        const doc = doctors.find(
                          (md) =>
                            md.id_entidade_medica.toString() ===
                            selectedDoctor.toString()
                        );
                        if (doc && c.medico !== doc.omd) return false;
                      }
                      return (
                        c.data === dateISO &&
                        (c.horaInicio || "").slice(0, 5) === h
                      );
                    });

                    if (match) {
                      cells.push(
                        <div
                          key={`${i}-${h}`}
                          className="slot slot-consulta"
                          onClick={() =>
                            navigate(`/gestor/consultas/${match.id}`)
                          }
                        >
                          <div className="consulta-item">
                            <div className="c-title">
                              {match.paciente?.nomeCompleto || match.titulo}
                            </div>
                            <div className="c-sub">
                              {match.paciente?.numeroUtente
                                ? `NUS: ${match.paciente.numeroUtente}`
                                : ""}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // if there's an agenda slot for this date/hour, mark as available
                      const slotMatch = agendaSlots.find((s) => {
                        if (!s) return false;
                        if (selectedDoctor !== "all" && s.id_entidade_medica) {
                          return (
                            s.data === dateISO &&
                            (s.hora || "").slice(0, 5) === h &&
                            s.id_entidade_medica.toString() ===
                              selectedDoctor.toString()
                          );
                        }
                        return (
                          s.data === dateISO && (s.hora || "").slice(0, 5) === h
                        );
                      });

                      if (slotMatch) {
                        cells.push(
                          <div
                            key={`${i}-${h}`}
                            className="slot slot-available"
                          >
                            <div className="available-dot" />
                            <div className="available-text">Disponível</div>
                          </div>
                        );
                      } else {
                        cells.push(<div key={`${i}-${h}`} className="slot" />);
                      }
                    }
                  }
                  return cells;
                })()}
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
