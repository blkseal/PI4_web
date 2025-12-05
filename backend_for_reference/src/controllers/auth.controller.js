import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/auth.js';
import sequelize from '../config/database.js';
import initModels from '../models/init-models.js';

// Inicializar os modelos
const models = initModels(sequelize);
const { utilizadores, utente, gestor, tipos_utilizador } = models;

// Controlador de Autenticação
// Aqui tratamos do login, logout e refresh de tokens.

// Função de login
// Recebe email e pin, verifica se estão corretos e devolve o token.
export const login = async (req, res) => {
  try {
    const { email, pin } = req.body;

    // 1. Validar input
    if (!email || !pin) {
      return res.status(400).json({ mensagem: "Email e PIN são obrigatórios." });
    }

    // 2. Procurar o email primeiro na tabela utente, depois na tabela gestor
    // O email está nas tabelas utente/gestor, não na tabela utilizadores
    let perfilEncontrado = null;
    let tipo = null;

    // Tentar encontrar na tabela utente
    const perfilUtente = await utente.findOne({ 
      where: { email },
      include: [{ 
        model: utilizadores, 
        as: 'id_utilizador_utilizadore',
        include: [{ model: tipos_utilizador, as: 'id_tipo_utilizador_tipos_utilizador' }]
      }]
    });

    if (perfilUtente && perfilUtente.id_utilizador_utilizadore) {
      perfilEncontrado = perfilUtente;
      tipo = 'utente';
    } else {
      // Tentar encontrar na tabela gestor
      const perfilGestor = await gestor.findOne({ 
        where: { email },
        include: [{ 
          model: utilizadores, 
          as: 'id_utilizador_utilizadore',
          include: [{ model: tipos_utilizador, as: 'id_tipo_utilizador_tipos_utilizador' }]
        }]
      });

      if (perfilGestor && perfilGestor.id_utilizador_utilizadore) {
        perfilEncontrado = perfilGestor;
        tipo = 'gestor';
      }
    }

    // 3. Se não encontrou nenhum perfil com utilizador associado
    if (!perfilEncontrado) {
      return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    const utilizador = perfilEncontrado.id_utilizador_utilizadore;

    // 4. Verificar o PIN (comparar hash)
    // O pin_utilizador na BD já deve estar encriptado com bcrypt
    const pinValido = await bcrypt.compare(String(pin), utilizador.pin_utilizador);

    if (!pinValido) {
      return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    // 5. Preparar dados do perfil para resposta
    let dadosPerfil = {};
    if (tipo === 'utente') {
      dadosPerfil = {
        nome: perfilEncontrado.nome_completo,
        numeroUtente: perfilEncontrado.nus,
        idPerfil: perfilEncontrado.id_utente
      };
    } else if (tipo === 'gestor') {
      dadosPerfil = {
        nome: perfilEncontrado.nome,
        idPerfil: perfilEncontrado.id_gestor
      };
    }

    // 6. Gerar Tokens
    const accessToken = generateAccessToken(utilizador);
    const refreshToken = generateRefreshToken(utilizador);

    // 7. Responder com sucesso
    res.status(200).json({
      accessToken,
      tokenType: "Bearer",
      expiresIn: 3600,
      refreshToken,
      utilizador: {
        id: utilizador.id_utilizador,
        email: email,
        tipo: tipo,
        ...dadosPerfil
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ mensagem: "Erro interno ao fazer login." });
  }
};

// Função de logout
// Invalida o token (na prática, no frontend apagam o token).
// Se tivéssemos blacklist de tokens, adicionávamos aqui.
export const logout = async (req, res) => {
  try {
    // Por agora é stateless, basta o cliente apagar o token.
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao fazer logout" });
  }
};

// Função de refresh token
// Renova o access token usando um refresh token válido.
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ mensagem: "Refresh token obrigatório." });
    }

    // 1. Verificar se o refresh token é válido
    const decoded = verifyToken(refreshToken, true); // true indica que é refresh secret

    if (!decoded) {
      return res.status(401).json({ mensagem: "Refresh token inválido ou expirado." });
    }

    // 2. Verificar se o utilizador ainda existe
    const utilizador = await utilizadores.findByPk(decoded.id);
    if (!utilizador) {
      return res.status(401).json({ mensagem: "Utilizador não encontrado." });
    }

    // 3. Gerar novo access token
    const newAccessToken = generateAccessToken(utilizador);

    res.status(200).json({
      accessToken: newAccessToken,
      tokenType: "Bearer",
      expiresIn: 3600,
      // Opcional: rodar o refresh token também (security best practice)
    });

  } catch (error) {
    console.error("Erro no refresh:", error);
    res.status(500).json({ mensagem: "Erro ao renovar token" });
  }
};
