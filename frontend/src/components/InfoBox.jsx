/**
 * InfoBox.jsx - Componente de caixa de informação
 * 
 * Exibe informação destacada, como contactos ou avisos.
 * Usada na página de login para mostrar contacto da clínica.
 */

import './InfoBox.css';

/**
 * Componente InfoBox
 * Caixa com informação de destaque
 * 
 * @param {React.ReactNode} children - Conteúdo da caixa
 * @param {string} variant - Variante visual: 'dark' (default), 'light', 'warning'
 */
function InfoBox({ children, variant = 'dark' }) {
    return (
        <div className={`info-box info-box-${variant}`}>
            {children}
        </div>
    );
}

export default InfoBox;
