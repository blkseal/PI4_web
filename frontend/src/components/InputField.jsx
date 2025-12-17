/**
 * InputField.jsx - Componente de input reutilizável
 * 
 * Campo de input com ícone à esquerda.
 * Pode ser usado para email, password, texto, etc.
 */

import './InputField.css';

/**
 * Componente InputField
 * Exibe um campo de input estilizado com ícone
 * 
 * @param {string} type - Tipo de input (text, email, password, etc)
 * @param {string} id - ID único do input
 * @param {string} placeholder - Texto placeholder
 * @param {string} value - Valor atual do input
 * @param {function} onChange - Função chamada quando o valor muda
 * @param {React.ReactNode} icon - Elemento SVG para o ícone
 * @param {boolean} required - Se o campo é obrigatório
 * @param {string} variant - Variante visual: 'dark' (default) ou 'light'
 */
function InputField({
    type = 'text',
    id,
    placeholder,
    value,
    onChange,
    icon,
    required = false,
    variant = 'dark'
}) {
    return (
        <div className={`input-group input-${variant}`}>
            {/* Ícone à esquerda do input */}
            {icon && <span className="input-icon">{icon}</span>}

            {/* Campo de input */}
            <input
                type={type}
                id={id}
                className="input-field"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
}

export default InputField;
