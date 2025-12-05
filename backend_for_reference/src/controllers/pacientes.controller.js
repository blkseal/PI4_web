// Controlador de Pacientes (Gestão)

export const getPacientes = async (req, res) => {
  res.status(200).json([]);
};

export const createPaciente = async (req, res) => {
  // Cuidado, não pode haver emails iguais, verificar em todas as entidades
  res.status(201).json({ id: 100 });
};

export const getPacienteByQr = async (req, res) => {
  res.status(200).json({ id: 100, nome: "Paciente QR" });
};

export const getPaciente = async (req, res) => {
  res.status(200).json({ id: req.params.id });
};

export const updatePaciente = async (req, res) => {
  res.status(200).json({ id: req.params.id });
};

export const enviarCredenciais = async (req, res) => {
  res.status(202).send();
};

// Histórico do Paciente (visto pelo Gestor)
export const getHistorico = async (req, res) => {
  res.status(200).json({});
};

export const updateHistorico = async (req, res) => {
  res.status(200).json({});
};

export const downloadHistorico = async (req, res) => {
  res.send("PDF");
};

// Tratamentos do Paciente
export const getTratamentos = async (req, res) => {
  res.status(200).json([]);
};

export const createTratamento = async (req, res) => {
  res.status(201).json({ id: 50 });
};
