// Controlador de Documentação
// Exames, Justificações e Tratamentos do ponto de vista do Utente.

// Exames
export const getExames = async (req, res) => {
  res.status(200).json([]);
};

export const getExame = async (req, res) => {
  res.status(200).json({ id: req.params.id, nome: "Raio-X" });
};

// Justificações
export const getJustificacoes = async (req, res) => {
  res.status(200).json([]);
};

export const getJustificacao = async (req, res) => {
  res.status(200).json({ id: req.params.id, tipo: "Presença" });
};

// Tratamentos (Utente)
export const getTratamentos = async (req, res) => {
  res.status(200).json([]);
};

export const getTratamento = async (req, res) => {
  res.status(200).json({ id: req.params.id, nome: "Tratamento X" });
};
