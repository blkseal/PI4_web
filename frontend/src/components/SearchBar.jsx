/**
 * SearchBar.jsx - Componente de pesquisa reutilizável
 * 
 * Barra de pesquisa com campo de texto e botão de filtro.
 */

import React from 'react';
import { Filter } from 'lucide-react';
import './SearchBar.css';

function SearchBar({
    placeholder = 'Pesquisar...',
    value = '',
    onChange,
    onFilter
}) {
    return (
        <div className="search-bar">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
            <button
                type="button"
                className="filter-button"
                onClick={onFilter}
                aria-label="Filtrar"
            >
                <Filter size={18} color="white" />
            </button>
        </div>
    );
}

export default SearchBar;
