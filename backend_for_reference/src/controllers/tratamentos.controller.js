// Controlador de Tratamentos (Gestão)

// Listar tratamentos atuais (em curso)
export const getAtuais = async (req, res) => {
  res.status(200).json([]);
};

// Obter detalhe de um tratamento
export const getTratamento = async (req, res) => {
  res.status(200).json({ id: req.params.id, nome: "Tratamento Exemplo" });
};

// Atualizar tratamento
export const updateTratamento = async (req, res) => {
  res.status(200).json({ id: req.params.id, status: "atualizado" });
};

// Listar anexos do tratamento
export const getAnexos = async (req, res) => {
  res.status(200).json([]);
};

// Adicionar anexo ao tratamento
export const addAnexo = async (req, res) => {
  res.status(201).json({ id: 1, nome: "Anexo Novo" });
};

// Listar tipos de tratamento
export const getTipos = async (req, res) => {
  res.status(200).json([
    { id: 1, nome: "Ortodontia" },
    { id: 2, nome: "Implantes" }
  ]);
};
