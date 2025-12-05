import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';
import initModels from '../models/init-models.js';

// Inicializar os modelos da base de dados
const models = initModels(sequelize);
const { utente, gestor, utilizadores, tipos_utilizador, consultas, estados, entidade_medica, pedidos_contacto_utilizador, pedidos_contacto_nao_utilizador } = models;

// Controlador Admin (Utilizadores e Pedidos)

// Criar utilizador para entidade existente
// Esta função recebe um email e um tipo de utilizador (ex: 'Utente' ou 'Gestor').
// Verifica se a entidade existe e cria uma conta de acesso (login) para ela.
export const createUtilizador = async (req, res) => {
  try {
    // Recebemos o email e o tipo de utilizador do corpo do pedido (request body)
    const { email, tipo_utilizador } = req.body;

    // Validação básica para garantir que os dados foram enviados
    if (!email || !tipo_utilizador) {
      return res.status(400).json({ mensagem: "Email e tipo de utilizador são obrigatórios." });
    }

    // 1. Verificar se o Tipo de Utilizador existe na base de dados.
    // Procuramos na tabela 'tipos_utilizador' se existe um registo com a designação enviada.
    // Usamos 'lower' para comparar sem diferenciar maiúsculas de minúsculas (ex: 'Utente' == 'utente').
    const tipoRegisto = await tipos_utilizador.findOne({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('designacao_tipo_utilizador')),
        tipo_utilizador.toLowerCase()
      )
    });

    // Se o tipo não existir (ex: enviaram 'Administrador' mas não temos esse tipo), retornamos erro.
    if (!tipoRegisto) {
      return res.status(400).json({ mensagem: "Tipo de utilizador inválido ou inexistente." });
    }

    // 2. Verificar se a Entidade (Pessoa) existe na tabela correspondente.
    // Dependendo do tipo de utilizador, vamos procurar na tabela 'utente' ou 'gestor'.
    let entidadeEncontrada = null;
    const tipoNormalizado = tipo_utilizador.toLowerCase();

    if (tipoNormalizado === 'utente') {
      // Se for Utente, procura na tabela de utentes pelo email
      entidadeEncontrada = await utente.findOne({ where: { email } });
    } else if (tipoNormalizado === 'gestor') {
      // Se for Gestor, procura na tabela de gestores pelo email
      entidadeEncontrada = await gestor.findOne({ where: { email } });
    } else {
      // Se for um tipo válido na tabela tipos_utilizador, mas que não temos lógica para criar conta automaticamente
      return res.status(400).json({ mensagem: "Criação de conta automática não suportada para este tipo de utilizador." });
    }

    // Se não encontrarmos a pessoa na tabela específica, retornamos erro 404.
    if (!entidadeEncontrada) {
      return res.status(404).json({ mensagem: `${tipo_utilizador} não encontrado com este email.` });
    }

    // 3. Verificar se já existe um Utilizador (Login) associado a este email.
    // A tabela 'utilizadores' guarda as credenciais. O email deve ser único aqui também.
    const utilizadorExistente = await utilizadores.findOne({ where: { email_utilizador: email } });

    if (utilizadorExistente) {
      // Se já existe login, não criamos novo. Enviamos um email com as credenciais ou instruções de recuperação.
      // Mock por enquanto
      console.log(`[INFO] Utilizador já existe para ${email}. Email de recuperação enviado.`);
      return res.status(200).json({ mensagem: "Utilizador já existe, email enviado com instruções." });
    }

    // 4. Gerar PIN e criar o Utilizador.
    // Geramos um PIN numérico aleatório de 6 dígitos.
    const pinOriginal = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Criptografamos o PIN com bcrypt para guardar na base de dados de forma segura.
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pinOriginal, salt);

    // Usamos uma transação para garantir que criamos o utilizador E atualizamos a entidade ao mesmo tempo.
    // Uma transação é basicamente dizer - Eu quero que aconteça tudo ou nada.
    await sequelize.transaction(async (t) => {
      // Cria o registo na tabela 'utilizadores'
      const novoUtilizador = await utilizadores.create({
        email_utilizador: email,
        pin_utilizador: pinHash,
        id_tipo_utilizador: tipoRegisto.id_tipo_utilizador
      }, { transaction: t });

      // Atualiza a tabela da entidade (utente ou gestor) com o ID do novo utilizador criado.
      // Isto faz a ligação entre a pessoa e o seu login.
      entidadeEncontrada.id_utilizador = novoUtilizador.id_utilizador;
      await entidadeEncontrada.save({ transaction: t });
      console.log(`[INFO] Utilizador criado para ${email}.`);
    });

    // 5. Enviar email com as credenciais (Mock).
    console.log(`[EMAIL] Enviado para ${email}. O seu PIN é: ${pinOriginal}`);

    return res.status(201).json({ mensagem: "Utilizador criado com sucesso. Verifique o seu email." });

  } catch (error) {
    console.error("Erro ao criar utilizador:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

// Consultas (Gestão)
// Retorna todas as consultas com suporte a filtros e paginação.
// Suporta parâmetros: dataInicio, dataFim, page, pageSize
export const getConsultas = async (req, res) => {
  try {
    // Extrair parâmetros de query
    const { dataInicio, dataFim, page = 1, pageSize = 10 } = req.query;
    
    // Configurar filtros
    const whereClause = {};
    if (dataInicio || dataFim) {
      whereClause.data = {};
      if (dataInicio) whereClause.data[sequelize.Op.gte] = dataInicio;
      if (dataFim) whereClause.data[sequelize.Op.lte] = dataFim;
    }
    
    // Calcular paginação
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;
    
    // Buscar consultas com todas as associações necessárias
    const listaConsultas = await consultas.findAll({
      where: whereClause,
      include: [
        { 
          model: utente, 
          as: 'id_utente_utente', 
          attributes: ['id_utente', 'nome_completo', 'nus', 'data_nasc']
        },
        { 
          model: entidade_medica, 
          as: 'id_entidade_medica_entidade_medica',
          include: [{
            model: gestor,
            as: 'gestors',
            attributes: ['nome']
          }]
        },
        { 
          model: estados, 
          as: 'id_estado_estado',
          attributes: ['valor_estado']
        }
      ],
      limit,
      offset,
      order: [['data', 'ASC'], ['hora', 'ASC']]
    });
    
    // Transformar para schema OpenAPI (ConsultaAdminItem)
    const consultasFormatadas = listaConsultas.map(consulta => {
      // Calcular horaFim baseado em hora + duracao (minutos)
      let horaFim = null;
      if (consulta.hora && consulta.duracao) {
        const [horas, minutos] = consulta.hora.split(':');
        const dataHora = new Date();
        dataHora.setHours(parseInt(horas), parseInt(minutos) + consulta.duracao);
        horaFim = dataHora.toTimeString().slice(0, 5); // Formato HH:MM
      }
      
      return {
        id: consulta.id_consulta,
        titulo: consulta.notas ? consulta.notas.slice(0, 50) : 'Consulta', // Usar notas como título ou padrão
        data: consulta.data,
        horaInicio: consulta.hora,
        horaFim: horaFim,
        especialidade: null, // Não disponível na BD atual
        medico: consulta.id_entidade_medica_entidade_medica?.gestors?.[0]?.nome || null,
        estado: consulta.id_estado_estado?.valor_estado?.toLowerCase() || 'pendente',
        associadoATratamento: false, // Não disponível na BD atual
        // Dados do paciente (PacienteResumo)
        paciente: consulta.id_utente_utente ? {
          id: consulta.id_utente_utente.id_utente,
          nomeCompleto: consulta.id_utente_utente.nome_completo,
          numeroUtente: consulta.id_utente_utente.nus,
          dataNascimento: consulta.id_utente_utente.data_nasc
        } : null
      };
    });
    
    res.status(200).json(consultasFormatadas);
  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    res.status(500).json({ mensagem: "Erro ao buscar consultas." });
  }
};

// Agendar uma nova consulta manualmente (pelo admin/gestor)
export const agendarConsulta = async (req, res) => {
  try {
    const { id_utente, id_entidade_medica, data, hora, notas } = req.body;

    // Tenta encontrar o estado inicial para uma nova consulta, que é sempre 'Pendente'.
    // Isto garante que a consulta começa no estado correto assim que é agendada.
    const estadoInicial = await estados.findOne({ where: { valor_estado: 'Pendente' } });
    
    const novaConsulta = await consultas.create({
      id_utente,
      id_entidade_medica,
      data,
      hora,
      notas,
      id_estado: estadoInicial ? estadoInicial.id_estado : 1 // Fallback para 1 se não encontrar
    });

    res.status(201).json(novaConsulta);
  } catch (error) {
    console.error("Erro ao agendar consulta:", error);
    res.status(500).json({ mensagem: "Erro ao agendar consulta." });
  }
};

// Pedidos de Consulta
// Retorna todos os pedidos de contacto (utilizadores e não utilizadores).
export const getPedidosConsulta = async (req, res) => {
  try {
    // 1. Pedidos de utilizadores registados (inclui dados do utente)
    const pedidosUtilizadores = await pedidos_contacto_utilizador.findAll({
      include: [
        { model: utente, as: 'id_utente_utente', attributes: ['nome_completo', 'telemovel', 'email'] }
      ]
    });

    // 2. Pedidos de não utilizadores (site público)
    const pedidosNaoUtilizadores = await pedidos_contacto_nao_utilizador.findAll();

    // Retorna ambos os grupos
    res.status(200).json({
      utilizadores: pedidosUtilizadores,
      nao_utilizadores: pedidosNaoUtilizadores
    });

  } catch (error) {
    console.error("Erro ao buscar pedidos de consulta:", error);
    res.status(500).json({ mensagem: "Erro ao buscar pedidos de consulta." });
  }
};

// Apagar um pedido de consulta
// Recebe o ID e o tipo ('utilizador' ou 'nao_utilizador')
export const deletePedidoConsulta = async (req, res) => {
  try {
    const { id, tipo } = req.params;

    if (!id || !tipo) {
      return res.status(400).json({ mensagem: "ID e tipo são obrigatórios." });
    }

    let deletedCount = 0;

    if (tipo === 'utilizador') {
      // Apaga da tabela de utilizadores
      deletedCount = await pedidos_contacto_utilizador.destroy({
        where: { id_pedido: id }
      });
    } else if (tipo === 'nao_utilizador') {
      // Apaga da tabela de não utilizadores
      deletedCount = await pedidos_contacto_nao_utilizador.destroy({
        where: { id_pedido_contacto: id }
      });
    } else {
      return res.status(400).json({ mensagem: "Tipo de pedido inválido. Use 'utilizador' ou 'nao_utilizador'." });
    }

    if (deletedCount > 0) {
      return res.status(200).json({ mensagem: "Pedido apagado com sucesso." });
    } else {
      return res.status(404).json({ mensagem: "Pedido não encontrado." });
    }

  } catch (error) {
    console.error("Erro ao apagar pedido de consulta:", error);
    res.status(500).json({ mensagem: "Erro ao apagar pedido de consulta." });
  }
};
