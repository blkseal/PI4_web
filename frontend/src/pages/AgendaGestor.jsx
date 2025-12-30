import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components";
import api from "../services/api";
import "./AgendaGestor.css";

const WEEK_DAYS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

function pad(n) {
  return n.toString().padStart(2, "0");
}

const DOCTOR_COLORS = [
  "#2ecc71", // green
  "#3498db", // blue
  "#f1c40f", // yellow
  "#e74c3c", // red
  "#9b59b6", // purple
  "#e67e22", // orange
  "#16a085", // teal
  "#34495e", // dark blue
  "#7f8c8d", // gray
];

function hashString(s) {
  let h = 0;
  for (let i = 0; i < (s || "").length; i++)
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function colorFor(name) {
  if (!name) return DOCTOR_COLORS[0];
  return DOCTOR_COLORS[hashString(name) % DOCTOR_COLORS.length];
}

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function generateTimes(startHour = 8, endHour = 19, stepMins = 30) {
  const times = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMins) {
      if (h === endHour && m > 0) break;
      times.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return times;
}

const TIMES = generateTimes(8, 23, 30);

function timeToIndex(timeStr) {
  const [hh, mm] = timeStr.split(":").map((x) => parseInt(x, 10));
  return hh * 2 + (mm === 30 ? 1 : 0);
}

function AgendaGestor() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("week");
  const [baseDate, setBaseDate] = useState(() => getMonday(new Date()));
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsed = storedUser ? JSON.parse(storedUser) : null;
    if (parsed?.tipo !== "gestor") navigate("/home", { replace: true });
  }, [navigate]);

  const weekStart = useMemo(() => getMonday(baseDate), [baseDate]);
  const days = useMemo(() => {
    const arr = [];
    if (viewMode === "week") {
      for (let i = 0; i < 7; i++) {
        const d = new Date(getMonday(baseDate));
        d.setDate(d.getDate() + i);
        arr.push(d);
      }
    } else {
      // day view should show the selected baseDate only
      arr.push(new Date(baseDate));
    }
    return arr;
  }, [baseDate, viewMode]);

  const range = useMemo(() => {
    const start = days[0];
    const end = days[days.length - 1];
    return { start: formatDateISO(start), end: formatDateISO(end) };
  }, [days]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const resp = await api.get("/medicos");
        // normalize to array of doctor names
        let raw = resp.data;
        let arr = [];
        if (Array.isArray(raw)) arr = raw;
        else if (Array.isArray(raw?.rows)) arr = raw.rows;
        else if (Array.isArray(raw?.data)) arr = raw.data;
        else if (raw && typeof raw === "object") arr = [raw];
        const names = arr
          .map((d) => d.nome || d.omd || d.label)
          .filter(Boolean);
        setDoctors(names);
      } catch (e) {
        console.error(e);
      }
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await api.get("/admin/consultas", {
          params: {
            dataInicio: range.start,
            dataFim: range.end,
            pageSize: 2000,
          },
        });
        setConsultas(Array.isArray(resp.data) ? resp.data : []);
      } catch (e) {
        console.error(e);
        setConsultas([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range.start, range.end]);

  const eventsByDay = useMemo(() => {
    const map = {};
    for (const d of days) map[formatDateISO(d)] = [];

    for (const c of consultas) {
      const date =
        c.data || c.dataConsulta || c.data_agendada || c.data_consulta || null;
      if (!date) continue;
      if (!map[date]) continue;

      // flexible doctor id/name extraction
      const consultaDoctorId = String(
        c.id_entidade_medica || c.id_medico || c.medicoId || ""
      );
      const consultaDoctorName = String(
        c.medico ||
        c.medicoNome ||
        c.entidade_medica?.nome ||
        c.entidade_medica?.omd ||
        ""
      );
      if (selectedDoctor !== "all") {
        if (
          selectedDoctor !== consultaDoctorName &&
          selectedDoctor !== consultaDoctorId
        )
          continue;
      }

      const startStr = (
        c.horaInicio ||
        c.hora ||
        c.horaConsulta ||
        c.hora_agendada ||
        ""
      ).slice(0, 5);
      const endStr = (c.horaFim || "").slice(0, 5);

      let duration = c.duracao || c.duracaoMin || c.duracao_min;
      if (!duration && startStr && endStr) {
        const [h1, m1] = startStr.split(":").map(Number);
        const [h2, m2] = endStr.split(":").map(Number);
        duration = (h2 * 60 + m2) - (h1 * 60 + m1);
      }
      if (!duration) duration = 30;
      if (!startStr) continue;
      const startIdx = timeToIndex(startStr);
      const span = Math.max(1, Math.round(duration / 30));

      // display names
      const doctorName =
        c.entidade_medica?.omd ||
        c.medico?.omd ||
        c.medico?.nome ||
        c.medicoNome ||
        c.medico ||
        "Médico";
      const patientName =
        c.paciente?.nomeCompleto ||
        c.utente?.nome ||
        c.pacienteNome ||
        c.nome_paciente ||
        c.nome ||
        "Utente";

      // color for this doctor
      const color = colorFor(doctorName || c.medico || c.medicoName || "");
      map[date].push({
        consulta: c,
        startIdx,
        span,
        doctorName,
        patientName,
        color,
      });
    }
    return map;
  }, [consultas, days, selectedDoctor]);

  const BASE_INDEX = timeToIndex(TIMES[0]);

  function goPrev() {
    const n = new Date(baseDate);
    n.setDate(n.getDate() - (viewMode === "week" ? 7 : 1));
    setBaseDate(n);
  }

  function goNext() {
    const n = new Date(baseDate);
    n.setDate(n.getDate() + (viewMode === "week" ? 7 : 1));
    setBaseDate(n);
  }

  return (
    <div className="agenda-page">
      <Navbar variant="gestor" />
      <main className="agenda-main">
        <div className="agenda-toolbar">
          <div className="toolbar-left">
            <button className="btn" onClick={goPrev}>
              {"<"}
            </button>
            <div className="date-range">
              {range.start} {range.start !== range.end ? `— ${range.end}` : ""}
            </div>
            <button className="btn" onClick={goNext}>
              {">"}
            </button>
            <div className="view-toggle">
              <button
                className={`btn ${viewMode === "week" ? "active" : ""}`}
                onClick={() => setViewMode("week")}
              >
                Semana
              </button>
              <button
                className={`btn ${viewMode === "day" ? "active" : ""}`}
                onClick={() => setViewMode("day")}
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
              {doctors.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <div className="toolbar-legend">
              {doctors.map((name) => (
                <div key={name} className="legend-item">
                  <span
                    className="legend-color"
                    style={{ background: colorFor(name) }}
                  />
                  <span className="legend-label">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="agenda-grid-wrap">
          <div className="time-column">
            <div className="time-header" />
            <div className="time-body">
              {TIMES.map((t) => (
                <div key={t} className="time-slot">
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className={`days-grid ${viewMode === "day" ? "single" : ""}`}>
            {days.map((d) => {
              const iso = formatDateISO(d);
              const weekdayInitials = ["D", "S", "T", "Q", "Q", "S", "S"]; // Sun..Sat
              const weekdayFull = [
                "Domingo",
                "Segunda-feira",
                "Terça-feira",
                "Quarta-feira",
                "Quinta-feira",
                "Sexta-feira",
                "Sábado",
              ];
              const initial = weekdayInitials[d.getDay()] || "D";
              const fullName = weekdayFull[d.getDay()] || "Dia";
              const label = `${initial} ${d.getDate()}/${d.getMonth() + 1}`;
              return (
                <div key={iso} className="day-column">
                  <div
                    className="day-header"
                    title={fullName}
                    onClick={() => {
                      setViewMode("day");
                      setBaseDate(d);
                    }}
                  >
                    {label}
                  </div>
                  <div className="day-body">
                    {(eventsByDay[iso] || []).map((ev, i) => {
                      const startRow = Math.max(
                        1,
                        ev.startIdx - BASE_INDEX + 1
                      );
                      const endRow = Math.min(
                        TIMES.length + 1,
                        startRow + ev.span
                      );
                      const offset = (i % 6) * 6; // tighter horizontal staggering for overlapping
                      return (
                        <div
                          key={
                            ev.consulta?.id ||
                            `${iso}-${ev.startIdx}-${ev.span}-${i}`
                          }
                          className="event-card compact"
                          style={{
                            gridRowStart: startRow,
                            gridRowEnd: endRow,
                            transform: `translateX(${offset}px)`,
                          }}
                          onClick={() => {
                            setTooltip(null);
                            navigate(`/gestor/consultas/${ev.consulta?.id}`);
                          }}
                          onMouseEnter={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              left: rect.right + 8,
                              top: rect.top + rect.height / 2,
                              doctor:
                                ev.doctorName ||
                                ev.consulta?.medico ||
                                "Médico",
                              patient:
                                ev.patientName ||
                                ev.consulta?.paciente?.nomeCompleto ||
                                "Utente",
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          onFocus={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              left: rect.right + 8,
                              top: rect.top + rect.height / 2,
                              doctor:
                                ev.doctorName ||
                                ev.consulta?.medico ||
                                "Médico",
                              patient:
                                ev.patientName ||
                                ev.consulta?.paciente?.nomeCompleto ||
                                "Utente",
                            });
                          }}
                          onBlur={() => setTooltip(null)}
                          role="button"
                          tabIndex={0}
                        >
                          <div
                            className="event-chip"
                            style={{ background: ev.color || "#8b6b4a" }}
                            aria-label={`${ev.doctorName || "Médico"} — ${ev.patientName || "Utente"
                              }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {tooltip && (
          <div
            className="global-event-tooltip"
            style={{ left: tooltip.left, top: tooltip.top }}
          >
            <strong>{tooltip.doctor}</strong>
            <div style={{ marginTop: 6 }}>{tooltip.patient}</div>
          </div>
        )}

        {loading && <div className="agenda-loading">Carregando...</div>}
      </main>
    </div>
  );
}

export default AgendaGestor;
