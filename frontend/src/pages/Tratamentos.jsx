/**
 * Tratamentos.jsx - Página de gestão de tratamentos (Gestor)
 *
 * Menu principal com 4 opções:
 * - Lista de Tratamentos
 * - Criar Tratamento
 * - Começar Tratamento
 * - Tratamentos Atuais
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Navbar, ActionGrid, InlineSvg } from "../components";
import documentSvg from "../assets/document.svg?raw";
import tratamentoSvg from "../assets/tratamento.svg?raw";
import toothSvg from "../assets/tooth.svg?raw";
import "./Tratamentos.css";

function Tratamentos() {
  const navigate = useNavigate();

  const actionItems = [
    {
      title: "LISTA DE<br/>TRATAMENTOS",
      icon: (
        <InlineSvg svg={documentSvg} className="tratamentos-document-svg" />
      ),
      variant: "brown",
      onClick: () => navigate("/gestao/tratamentos/lista"),
    },
    {
      title: "CRIAR<br/>TRATAMENTO",
      icon: <Plus size={48} color="white" strokeWidth={2.5} />,
      variant: "burgundy",
      onClick: () => navigate("/gestao/tratamentos/criar"),
    },
    {
      title: "COMEÇAR<br/>TRATAMENTO",
      icon: <InlineSvg svg={tratamentoSvg} className="tratamentos-heart-svg" />,
      variant: "brown",
      onClick: () => navigate("/pacientes"),
    },
    {
      title: "TRATAMENTOS<br/>ATUAIS",
      icon: <InlineSvg svg={toothSvg} className="tratamentos-tooth-svg" />,
      variant: "olive",
      onClick: () => navigate("/gestao/tratamentos/atuais"),
    },
  ];

  return (
    <div className="tratamentos-page">
      <Navbar variant="gestor" />

      <main className="tratamentos-main">
        <h1 className="tratamentos-title">TRATAMENTOS</h1>

        <section className="tratamentos-grid">
          {actionItems.map((item) => (
            <button
              key={item.title}
              className={`tratamentos-card tratamentos-card--${item.variant}`}
              type="button"
              onClick={item.onClick}
            >
              <span
                className="tratamentos-card-title"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <div className="tratamentos-icon-circle">{item.icon}</div>
            </button>
          ))}
        </section>
      </main>

      <footer className="tratamentos-footer">
        Clinimolelos 2025 - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default Tratamentos;
