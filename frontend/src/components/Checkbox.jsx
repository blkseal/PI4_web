/**
 * Checkbox.jsx - Componente de checkbox reutilizável
 * 
 * Checkbox estilizada com label.
 * Usada para aceitar termos, políticas, etc.
 */

import './Checkbox.css';

/**
 * Componente Checkbox
 * Exibe uma checkbox estilizada com texto
 * 
 * @param {string} id - ID único da checkbox
 * @param {boolean} checked - Estado atual (marcada ou não)
 * @param {function} onChange - Função chamada quando muda o estado
 * @param {React.ReactNode} children - Conteúdo da label (pode incluir links)
 * @param {string} variant - Variante visual: 'dark' (default) ou 'light'
 */
function Checkbox({
    id,
    checked,
    onChange,
    children,
    variant = 'dark'
}) {
    return (
        <label className={`checkbox-item checkbox-${variant}`} htmlFor={id}>
            {/* Input checkbox escondido mas acessível */}
            <input
                type="checkbox"
                id={id}
                className="checkbox-input"
                checked={checked}
                onChange={onChange}
            />

            {/* Texto da label */}
            <span className="checkbox-label">{children}</span>
        </label>
    );
}

export default Checkbox;
