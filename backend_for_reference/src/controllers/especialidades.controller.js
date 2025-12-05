// Controlador de Especialidades e Médicos

// Listar especialidades disponíveis
export const getEspecialidades = async (req, res) => {
  res.status(200).json([
    { id: 1, nome: "Dentista Geral" },
    { id: 2, nome: "Ortodontia" }
  ]);
};

// Listar médicos (pode filtrar por especialidade)
export const getMedicos = async (req, res) => {
  res.status(200).json([
    { id: 1, nome: "Dr. João", especialidadeId: 1 }
  ]);
};

// Criar especialidade
export const createEspecialidade = async (req, res) => {
  res.status(201).json({ id: 1 });
};