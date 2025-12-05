// Carrega as variáveis de ambiente do ficheiro .env
import 'dotenv/config';

// Importa a aplicação e a configuração da base de dados
import app from './app.js';
import sequelize from './config/database.js';

// Define a porta. Usa a variável de ambiente ou 3000 se não existir.
const PORT = process.env.PORT || 3000;

// Função para iniciar o servidor
async function startServer() {
  try {
    // Tenta ligar à base de dados
    await sequelize.authenticate();
    console.log('✅ Ligação à base de dados estabelecida com sucesso.');

    // Sincroniza os modelos com a base de dados (opcional por agora)
    // await sequelize.sync(); 

    // Arranca o servidor à escuta na porta definida
    app.listen(PORT, () => {
      console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Não foi possível ligar à base de dados:', error);
    console.error('👉 Verifica se o ficheiro .env está correto (DB_USER, DB_PASS, etc.)');
  }
}

// Executa a função de arranque
startServer();
