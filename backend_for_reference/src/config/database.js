import { Sequelize } from "sequelize";

// Configuração da ligação à base de dados PostgreSQL
// Os valores vêm do ficheiro .env (variáveis de ambiente)
const sequelize = new Sequelize(
  process.env.DB_NAME || "postgres",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "postgres",
    logging: false, // Desliga os logs de SQL no terminal
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;