import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Segredo para assinar os tokens. 
// Em produção deve estar no .env. Se não estiver, usamos um fallback (apenas para dev).
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto_pi4';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'segredo_refresh_super_secreto_pi4';

// Gera um Access Token (curta duração, ex: 1 hora)
export const generateAccessToken = (user) => {
  // O payload guarda informações úteis para o frontend saber quem é o utilizador
  const payload = {
    id: user.id_utilizador,
    email: user.email_utilizador,
    tipo: user.id_tipo_utilizador
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Gera um Refresh Token (longa duração, ex: 7 dias)
export const generateRefreshToken = (user) => {
  const payload = {
    id: user.id_utilizador
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Verifica se um token é válido
export const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
