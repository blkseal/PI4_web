// Controlador de Perfil
// Dados do utilizador, dependentes e configurações.

export const getResumo = async (req, res) => {
  res.status(200).json({ nomeCompleto: "User Teste" });
};

export const getMeusDados = async (req, res) => {
  res.status(200).json({ nomeCompleto: "User Teste", email: "teste@teste.com" });
};

export const updateMeusDados = async (req, res) => {
  res.status(200).json(req.body);
};

export const updatePin = async (req, res) => {
  res.status(204).send();
};

// Dependentes
export const getDependentes = async (req, res) => {
  res.status(200).json([]);
};

export const addDependente = async (req, res) => {
  res.status(201).json({ id: 2, nome: "Filho Teste" });
};

export const getDependente = async (req, res) => {
  res.status(200).json({ id: req.params.id });
};

export const updateDependente = async (req, res) => {
  res.status(200).json({ id: req.params.id });
};

export const deleteDependente = async (req, res) => {
  res.status(204).send();
};

// Histórico Dentário
export const getHistoricoDentario = async (req, res) => {
  res.status(200).json({});
};

export const updateHistoricoDentario = async (req, res) => {
  res.status(200).json({});
};

export const downloadHistorico = async (req, res) => {
  res.send("PDF content");
};

export const getQr = async (req, res) => {
  res.status(200).json({ qrCodeSvg: "<svg>...</svg>" });
};
