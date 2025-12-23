/**
 * profile.service.js
 * Serviço para gestão de operações relacionadas com o perfil do utilizador.
 */
import api from './api';

const profileService = {
    /**
     * Obtém o resumo do perfil para a página principal de Perfil.
     * @returns {Promise<Object>} Dados resumidos do perfil
     */
    getProfileSummary: async () => {
        const response = await api.get('/perfil');
        return response.data;
    },

    /**
     * Obtém os dados pessoais detalhados do utilizador.
     * @returns {Promise<Object>} Dados pessoais completos
     */
    getPersonalData: async () => {
        const response = await api.get('/perfil/meus-dados');
        return response.data;
    },

    /**
     * Obtém o histórico dentário do utilizador.
     * @returns {Promise<Object>} Objeto com o histórico dentário
     */
    getDentalHistory: async () => {
        const response = await api.get('/perfil/historico-dentario');
        return response.data;
    },

    /**
     * Obtém a lista de dependentes do utilizador.
     * @returns {Promise<Array>} Lista de dependentes
     */
    getDependents: async () => {
        const response = await api.get('/perfil/dependentes');
        return response.data;
    },

    /**
     * Obtém os detalhes de um dependente específico.
     * @param {number|string} id - ID do dependente
     * @returns {Promise<Object>} Detalhes do dependente
     */
    getDependent: async (id) => {
        const response = await api.get(`/perfil/dependentes/${id}`);
        return response.data;
    },

    /**
     * Atualiza o PIN (credenciais) do utilizador.
     * @param {Object} data - Objeto contendo { novoPin, confirmarNovoPin }
     * @returns {Promise<void>}
     */
    updatePin: async (data) => {
        await api.put('/perfil/credenciais', data);
    }
};

export default profileService;
