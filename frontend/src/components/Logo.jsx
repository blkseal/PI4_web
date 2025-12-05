/**
 * Logo.jsx - Componente do logótipo CLINIMOLELOS
 * 
 * Este componente exibe o logótipo da clínica usando a imagem oficial.
 * Reutilizável em qualquer parte da aplicação.
 */

import logoImage from '../imgs/logo_clinimolelos.png';
import './Logo.css';

/**
 * Componente Logo
 * Exibe a imagem do logo e o texto CLINIMOLELOS
 * 
 * @param {string} size - Tamanho do logo: 'small', 'medium' (default), 'large'
 * @param {boolean} showText - Se deve mostrar o texto CLINIMOLELOS (default: true)
 */
function Logo({ size = 'medium', showText = true }) {
    return (
        <div className={`logo-container logo-${size}`}>
            {/* Imagem oficial do logótipo CLINIMOLELOS */}
            <img
                src={logoImage}
                alt="CLINIMOLELOS"
                className="logo-icon"
            />

            {/* Texto do nome da clínica - usa fonte Montserrat */}
            {showText && <span className="logo-text">CLINIMOLELOS</span>}
        </div>
    );
}

export default Logo;
