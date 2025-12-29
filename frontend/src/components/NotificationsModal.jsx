import React, { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './NotificationsModal.css';

const NotificationsModal = ({ isOpen, onClose, variant = "utente" }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const resp = await api.get("/admin/notificacoes");
            const data = resp?.data?.data || resp?.data || [];

            const formatted = data.map(n => {
                const msg = n.mensagem || n.message || "";
                let dateStr = "";
                let timeStr = "";

                if (n.data) {
                    const [y, m, d] = n.data.split('T')[0].split('-');
                    dateStr = `${d}/${m}/${y}`;
                    if (n.hora) timeStr = n.hora.slice(0, 5);
                } else if (n.createdAt) {
                    const dObj = new Date(n.createdAt);
                    dateStr = dObj.toLocaleDateString('pt-PT');
                    timeStr = dObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
                }

                return {
                    id: n.id,
                    message: msg,
                    date: dateStr,
                    time: timeStr
                };
            });
            setNotifications(formatted);
        } catch (err) {
            console.error("Erro ao carregar notificações:", err);
            if (err.response) {
                console.log("DADOS DO ERRO (Backend):", JSON.stringify(err.response.data, null, 2));
            }
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id) => {
        try {
            await api.delete(`/notificacoes/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error("Erro ao apagar notificação:", err);
        }
    };

    if (!isOpen) return null;

    const handleCreateClick = () => {
        onClose();
        navigate('/gestao/notificacoes/enviar');
    };

    return (
        <div className="notifications-overlay" onClick={onClose}>
            <div className="notifications-container" onClick={(e) => e.stopPropagation()}>
                <div className="notifications-header">
                    <h2>Notificações</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="notifications-list">
                    {loading ? (
                        <div className="no-notifications">A carregar...</div>
                    ) : notifications.length === 0 ? (
                        <div className="no-notifications">Não tem notificações novas.</div>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif.id} className="notification-item">
                                <div className="notification-icon-wrapper">
                                    <Bell size={22} className="notif-bell-icon" />
                                    <div className="notif-time-group">
                                        <span className="notif-date">{notif.date}</span>
                                        <span className="notif-time">{notif.time}</span>
                                    </div>
                                </div>
                                <div className="notification-content">
                                    <p>{notif.message}</p>
                                </div>
                                <button
                                    className="delete-notif-btn"
                                    onClick={() => onDelete && onDelete(notif.id)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {variant === "gestor" && (
                    <div className="notifications-footer">
                        <button className="create-notif-btn" onClick={handleCreateClick}>
                            Criar Notificações
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsModal;
