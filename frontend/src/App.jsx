/**
 * App.jsx - Componente principal da aplicação CLINIMOLELOS
 * 
 * Define as rotas da aplicação usando React Router.
 * A página de login é a rota principal.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Documentacao from './pages/Documentacao';
import Consultas from './pages/Consultas';
import AgendaGestor from './pages/AgendaGestor';
import Pacientes from './pages/Pacientes';
import NovoPaciente from './pages/NovoPaciente';
import FichaPaciente from './pages/FichaPaciente';
import Profile from './pages/Profile';
import MeusDados from './pages/MeusDados';
import HistoricoDentario from './pages/HistoricoDentario';
import Dependentes from './pages/Dependentes';
import EditarCredenciais from './pages/EditarCredenciais';
import EditarPaciente from './pages/EditarPaciente';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Rota exclusiva para gestores - redireciona não-gestores para /home
const GestorRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user?.tipo !== 'gestor') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Rota exclusiva para utentes - redireciona gestores para /agenda
const UtenteRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user?.tipo === 'gestor') {
    return <Navigate to="/agenda" replace />;
  }

  return children;
};

// Rota para a página de login - redireciona utilizadores logados
const LoginRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('user');

  if (token && storedUser) {
    const user = JSON.parse(storedUser);
    if (user.tipo === 'gestor') {
      return <Navigate to="/agenda" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

/**
 * Componente App
 * Configura o sistema de rotas da aplicação
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal - Página de Login */}
        <Route path="/" element={
          <LoginRoute>
            <Login />
          </LoginRoute>
        } />

        {/* Rota para documentação (utente) */}
        <Route
          path="/documentacao"
          element={(
            <UtenteRoute>
              <Documentacao />
            </UtenteRoute>
          )}
        />

        {/* Rota para a página inicial (utente) */}
        <Route
          path="/home"
          element={(
            <UtenteRoute>
              <Home />
            </UtenteRoute>
          )}
        />

        {/* Rota para consultas (utente) */}
        <Route
          path="/consultas"
          element={(
            <UtenteRoute>
              <Consultas />
            </UtenteRoute>
          )}
        />

        {/* Rota para agenda do gestor (gestor only) */}
        <Route
          path="/agenda"
          element={(
            <GestorRoute>
              <AgendaGestor />
            </GestorRoute>
          )}
        />

        {/* Rota para pacientes (gestor only) */}
        <Route
          path="/pacientes"
          element={(
            <GestorRoute>
              <Pacientes />
            </GestorRoute>
          )}
        />

        {/* Rota para criar novo paciente (gestor only) */}
        <Route
          path="/pacientes/novo"
          element={(
            <GestorRoute>
              <NovoPaciente />
            </GestorRoute>
          )}
        />

        {/* Rota para detalhes do paciente (gestor only) */}
        <Route
          path="/pacientes/:id"
          element={(
            <GestorRoute>
              <FichaPaciente />
            </GestorRoute>
          )}
        />

        {/* Rota para editar paciente (gestor only) */}
        <Route
          path="/pacientes/:id/editar"
          element={(
            <GestorRoute>
              <EditarPaciente />
            </GestorRoute>
          )}
        />

        {/* Rota para perfil (utente) */}
        <Route
          path="/perfil"
          element={(
            <UtenteRoute>
              <Profile />
            </UtenteRoute>
          )}
        />

        {/* Rota para os meus dados (utente) */}
        <Route
          path="/perfil/dados"
          element={(
            <UtenteRoute>
              <MeusDados />
            </UtenteRoute>
          )}
        />

        {/* Rota para histórico dentário (utente) */}
        <Route
          path="/perfil/historico"
          element={(
            <UtenteRoute>
              <HistoricoDentario />
            </UtenteRoute>
          )}
        />

        {/* Rota para dependentes (utente) */}
        <Route
          path="/perfil/dependentes"
          element={(
            <UtenteRoute>
              <Dependentes />
            </UtenteRoute>
          )}
        />

        {/* Rota para editar credenciais (utente) */}
        <Route
          path="/perfil/credenciais"
          element={(
            <UtenteRoute>
              <EditarCredenciais />
            </UtenteRoute>
          )}
        />

        {/* Redirecionar rotas desconhecidas para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
