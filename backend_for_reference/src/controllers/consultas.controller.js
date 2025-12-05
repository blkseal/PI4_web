// Controlador de Consultas
// Gere tudo o que tem a ver com marcações e histórico.

// Lista as próximas consultas do utente
export const getProximas = async (req, res) => {
  res.status(200).json([]);
};

// Verifica disponibilidade de horários
export const getDisponibilidade = async (req, res) => {
  res.status(200).json([]);
};

// Histórico de consultas passadas
export const getHistorico = async (req, res) => {
  res.status(200).json([]);
};

// Submeter um pedido de consulta
export const criarPedido = async (req, res) => {
  res.status(201).json({ idPedido: 1, status: "recebido" });
};

// Detalhe de uma consulta específica
export const getConsulta = async (req, res) => {
  res.status(200).json({ id: req.params.id, titulo: "Consulta Teste" });
};

// Atualizar consulta (ex: cancelar)
export const updateConsulta = async (req, res) => {
  res.status(200).json({ id: req.params.id, status: "atualizado" });
};

// Resumo da consulta (pós-consulta)
export const getResumo = async (req, res) => {
  res.status(200).json({ notas: "Tudo ok." });
};

// Anexar documento (ex: justificativo)
export const anexarDocumento = async (req, res) => {
  res.status(201).json({ id: 1, url: "http://exemplo.com/doc.pdf" });
};
