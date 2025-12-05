import sequelize from '../config/database.js';
import initModels from '../models/init-models.js';

// Inicializar os modelos
const models = initModels(sequelize);
const { gestor, utente, entidade_medica } = models;

// Controlador de Gestores (Admin)
// CRUD para gestores da clínica

// Listar todos os gestores
// GET /gestores
export const getGestores = async (req, res) => {
  try {
    // Buscar todos os gestores da BD
    const listaGestores = await gestor.findAll({
      include: [{
        model: entidade_medica,
        as: 'id_entidade_medica_entidade_medica',
        attributes: ['nome']
      }]
    });

    // Formatamos a resposta conforme o schema Gestor do OpenAPI
    const gestoresFormatados = listaGestores.map(g => ({
      id: g.id_gestor,
      nome: g.nome,
      email: g.email,
      medico: g.id_entidade_medica ? true : false // Se tem entidade médica, é médico
    }));

    res.status(200).json(gestoresFormatados);
  } catch (error) {
    console.error("Erro ao listar gestores:", error);
    res.status(500).json({ mensagem: "Erro ao listar gestores." });
  }
};

// Criar um novo gestor
// POST /gestores
// Body: { nome, email, medico }
export const createGestor = async (req, res) => {
  try {
    const { nome, email, medico } = req.body;

    // 1. Validação básica
    if (!nome || !email) {
      return res.status(400).json({ mensagem: "Nome e email são obrigatórios." });
    }

    // 2. Verificar se o email já existe (noutro gestor OU utente)
    // Isto evita conflitos quando depois criarmos utilizador
    const gestorExistente = await gestor.findOne({ where: { email } });
    if (gestorExistente) {
      return res.status(400).json({ mensagem: "Já existe um gestor com este email." });
    }

    const utenteExistente = await utente.findOne({ where: { email } });
    if (utenteExistente) {
      return res.status(400).json({ mensagem: "Já existe um utente com este email." });
    }

    // 3. Criar o gestor
    const novoGestor = await gestor.create({
      nome,
      email,
      // Se for médico, podemos associar a uma entidade médica depois
      // Por agora apenas guardamos os dados básicos
    });

    res.status(201).json({
      id: novoGestor.id_gestor,
      nome: novoGestor.nome,
      email: novoGestor.email,
      medico: medico || false
    });

  } catch (error) {
    console.error("Erro ao criar gestor:", error);
    res.status(500).json({ mensagem: "Erro ao criar gestor." });
  }
};

// Obter um gestor específico
// GET /gestores/:id
export const getGestor = async (req, res) => {
  try {
    const { id } = req.params;

    const gestorEncontrado = await gestor.findByPk(id, {
      include: [{
        model: entidade_medica,
        as: 'id_entidade_medica_entidade_medica',
        attributes: ['nome']
      }]
    });

    if (!gestorEncontrado) {
      return res.status(404).json({ mensagem: "Gestor não encontrado." });
    }

    res.status(200).json({
      id: gestorEncontrado.id_gestor,
      nome: gestorEncontrado.nome,
      email: gestorEncontrado.email,
      medico: gestorEncontrado.id_entidade_medica ? true : false
    });

  } catch (error) {
    console.error("Erro ao obter gestor:", error);
    res.status(500).json({ mensagem: "Erro ao obter gestor." });
  }
};

// Atualizar um gestor
// PUT /gestores/:id
// Body: { nome, email, medico }
export const updateGestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, medico } = req.body;

    // 1. Verificar se o gestor existe
    const gestorExistente = await gestor.findByPk(id);
    if (!gestorExistente) {
      return res.status(404).json({ mensagem: "Gestor não encontrado." });
    }

    // 2. Se o email mudou, verificar unicidade
    if (email && email !== gestorExistente.email) {
      const emailEmUso = await gestor.findOne({ where: { email } });
      if (emailEmUso) {
        return res.status(400).json({ mensagem: "Já existe um gestor com este email." });
      }

      const utenteComEmail = await utente.findOne({ where: { email } });
      if (utenteComEmail) {
        return res.status(400).json({ mensagem: "Já existe um utente com este email." });
      }
    }

    // 3. Atualizar os campos
    if (nome) gestorExistente.nome = nome;
    if (email) gestorExistente.email = email;
    
    await gestorExistente.save();

    res.status(200).json({
      id: gestorExistente.id_gestor,
      nome: gestorExistente.nome,
      email: gestorExistente.email,
      medico: medico !== undefined ? medico : (gestorExistente.id_entidade_medica ? true : false)
    });

  } catch (error) {
    console.error("Erro ao atualizar gestor:", error);
    res.status(500).json({ mensagem: "Erro ao atualizar gestor." });
  }
};
