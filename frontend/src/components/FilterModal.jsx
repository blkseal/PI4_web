import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose, onApply, children, title = "FILTRAR" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`filter-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className={`filter-modal-container ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="filter-modal-header">
                    <h2>{title}</h2>
                    <button className="filter-close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="filter-modal-content">
                    {children}
                </div>

                <div className="filter-modal-footer">
                    <button className="filter-apply-btn" onClick={onApply}>
                        APLICAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
