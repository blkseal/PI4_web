import React from 'react';
import { X, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './NotificationsModal.css';

const NotificationsModal = ({ isOpen, onClose, variant = "utente", notifications = [], onDelete, loading }) => {
    const navigate = useNavigate();

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
                                    <Bell size={20} />
                                    <span className="notif-time">{notif.time}</span>
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
