// Controlador de Notificações
// Gere os avisos para o utilizador.

// Listar todas as notificações
export const getNotificacoes = async (req, res) => {
  res.status(200).json([
    { id: 1, mensagem: "Bem-vindo à app!", lida: false, data: new Date() }
  ]);
};

// Marcar notificação como lida
export const marcarComoLida = async (req, res) => {
  res.status(204).send();
};

// Criar notificação
export const createNotificacao = async (req, res) => {
  res.status(201).json({ id: 1 });
};
