// Componente de Notificações
// Painel flutuante acionado pelo Navbar
// Layout igual ao Figma (bordas brancas, ícones, botões X)

import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import api from "../services/api";
import "./Notifications.css";

function Notifications({ onClose }) {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    // 🔹 Mock visual (podes ligar ao backend depois)
    setNotificacoes([
      {
        id: 1,
        mensagem: "O seu pedido de consulta foi enviado com sucesso.",
        tempo: "há 1 h",
      },
      {
        id: 2,
        mensagem: "O seu código Pin foi alterado com sucesso!",
        tempo: "há 1 d",
      },
      {
        id: 3,
        mensagem:
          "A justificação da sua consulta mais recente já está disponível.",
        tempo: "há 2 d",
      },
    ]);
  }, []);

  // Remove notificação ao clicar no X
  const removerNotificacao = (id) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="notifications-overlay">
      <div className="notifications-panel">
        {/* Header */}
        <div className="notifications-header">
          <h3>Notificações</h3>
          <button className="close-panel" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Lista */}
        <div className="notifications-list">
          {notificacoes.map((n) => (
            <div key={n.id} className="notification-box">
              <Bell size={18} className="notification-icon" />

              <div className="notification-text">
                <p>{n.mensagem}</p>
                <span>{n.tempo}</span>
              </div>

              <button
                className="close-notification"
                onClick={() => removerNotificacao(n.id)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
