/**
 * profile.service.js
 * Serviço para gestão de operações relacionadas com o perfil do utilizador.
 */
import api from "./api";

const profileService = {
  /**
   * Obtém o resumo do perfil para a página principal de Perfil.
   * @returns {Promise<Object>} Dados resumidos do perfil
   */
  getProfileSummary: async () => {
    const response = await api.get("/perfil");
    return response?.data?.data || response?.data;
  },

  /**
   * Obtém os dados pessoais detalhados do utilizador.
   * @returns {Promise<Object>} Dados pessoais completos
   */
  getPersonalData: async () => {
    const response = await api.get("/perfil/meus-dados");
    return response?.data?.data || response?.data;
  },

  /**
   * Obtém o histórico dentário do utilizador.
   * @returns {Promise<Object>} Objeto com o histórico dentário
   */
  getDentalHistory: async () => {
    const response = await api.get("/perfil/historico-dentario");
    return response?.data?.data || response?.data;
  },

  /**
   * Obtém a lista de dependentes do utilizador.
   * @returns {Promise<Array>} Lista de dependentes
   */
  getDependents: async () => {
    const response = await api.get("/perfil/dependentes");
    return response?.data?.data || response?.data;
  },

  /**
   * Obtém os detalhes de um dependente específico.
   * @param {number|string} id - ID do dependente
   * @returns {Promise<Object>} Detalhes do dependente
   */
  getDependentDetails: async (id) => {
    const response = await api.get(`/perfil/dependentes/${id}`);
    return response?.data?.data || response?.data;
  },

  /**
   * Obtém os tratamentos do utilizador atual.
   * @returns {Promise<Array>} Lista de tratamentos
   */
  getTratamentos: async () => {
    const response = await api.get("/documentacao/tratamentos");
    return response?.data?.data || response?.data;
  },

  /**
   * Obtém os detalhes de um tratamento específico.
   * @param {number|string} id - ID do tratamento
   * @returns {Promise<Object>} Detalhes do tratamento
   */
  getTratamentoDetails: async (id) => {
    const response = await api.get(`/documentacao/tratamentos/${id}`);
    return response?.data?.data || response?.data;
  },

  /**
   * Alterna para o perfil de um dependente (Act As).
   * O backend gera um novo token com o activeProfileId do dependente.
   * @param {number|string} profileId - ID do perfil (dependente) ou null para voltar ao principal
   * @returns {Promise<Object>} Novo token e dados do perfil
   */
  switchProfile: async (profileId) => {
    const response = await api.post("/perfil/switch", { profileId });
    // Atualizar tokens no localStorage
    if (response.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Atualiza o PIN (credenciais) do utilizador.
   * @param {Object} data - Objeto contendo { novoPin, confirmarNovoPin }
   * @returns {Promise<void>}
   */
  updatePin: async (data) => {
    await api.put("/perfil/credenciais", data);
  },
};

export default profileService;
