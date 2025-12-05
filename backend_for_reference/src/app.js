import express from 'express';
import cors from 'cors';

// Importar as rotas
import authRoutes from './routes/auth.routes.js';
import homeRoutes from './routes/home.routes.js';
import consultasRoutes from './routes/consultas.routes.js';
import notificacoesRoutes from './routes/notificacoes.routes.js';
import contactosRoutes from './routes/contactos.routes.js';
import especialidadesRoutes from './routes/especialidades.routes.js';
import documentacaoRoutes from './routes/documentacao.routes.js';
import perfilRoutes from './routes/perfil.routes.js';
import pacientesRoutes from './routes/pacientes.routes.js';
import gestoresRoutes from './routes/gestores.routes.js';
import agendaRoutes from './routes/agenda.routes.js';
import adminRoutes from './routes/admin.routes.js';
import tratamentosRoutes from './routes/tratamentos.routes.js';

// Inicializa a aplicação Express
const app = express();

// Middleware
// CORS permite que o frontend (React) comunique com o backend
app.use(cors());

// Permite que a app entenda JSON nos pedidos (req.body)
app.use(express.json());

// Registar as rotas na aplicação
// O prefixo /v1 ajuda a versionar a API
app.use('/v1/auth', authRoutes);
app.use('/v1/home', homeRoutes);
app.use('/v1/consultas', consultasRoutes);
app.use('/v1/notificacoes', notificacoesRoutes);
app.use('/v1/contactos', contactosRoutes);
app.use('/v1', especialidadesRoutes); // /medicos e /especialidades estão na raiz do router
app.use('/v1/documentacao', documentacaoRoutes);
app.use('/v1/perfil', perfilRoutes);
app.use('/v1/pacientes', pacientesRoutes);
app.use('/v1/gestores', gestoresRoutes);
app.use('/v1/agenda', agendaRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/tratamentos', tratamentosRoutes);

// Rota de teste simples para ver se o servidor responde
app.get('/', (req, res) => {
  res.send('Servidor a funcionar! 🚀');
});

// Exportamos a app para ser usada no server.js
export default app;