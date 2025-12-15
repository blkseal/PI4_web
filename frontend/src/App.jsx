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
import Profile from './pages/Profile';
import MeusDados from './pages/MeusDados';
import HistoricoDentario from './pages/HistoricoDentario';
import Dependentes from './pages/Dependentes';
import EditarCredenciais from './pages/EditarCredenciais';
import './App.css';

const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem('accessToken');
  // if (!token) {
  //   return <Navigate to="/" replace />;
  // }
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
        <Route path="/" element={<Login />} />

        {/* Rota para documentação (protegida) */}
        <Route
          path="/documentacao"
          element={(
            <ProtectedRoute>
              <Documentacao />
            </ProtectedRoute>
          )}
        />

        {/* Rota para a página inicial (protegida) */}
        <Route
          path="/home"
          element={(
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/consultas"
          element={(
            <ProtectedRoute>
              <Consultas />
            </ProtectedRoute>
          )}
        />

        {/* Rota para agenda do gestor (protegida) */}
        <Route
          path="/agenda"
          element={(
            <ProtectedRoute>
              <AgendaGestor />
            </ProtectedRoute>
          )}
        />

        {/* Rota para perfil (protegida) */}
        <Route
          path="/perfil"
          element={(
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )}
        />

        {/* Rota para os meus dados (protegida) */}
        <Route
          path="/perfil/dados"
          element={(
            <ProtectedRoute>
              <MeusDados />
            </ProtectedRoute>
          )}
        />

        {/* Rota para histórico dentário (protegida) */}
        <Route
          path="/perfil/historico"
          element={(
            <ProtectedRoute>
              <HistoricoDentario />
            </ProtectedRoute>
          )}
        />

        {/* Rota para dependentes (protegida) */}
        <Route
          path="/perfil/dependentes"
          element={(
            <ProtectedRoute>
              <Dependentes />
            </ProtectedRoute>
          )}
        />

        {/* Rota para editar credenciais (protegida) */}
        <Route
          path="/perfil/credenciais"
          element={(
            <ProtectedRoute>
              <EditarCredenciais />
            </ProtectedRoute>
          )}
        />

        {/* Redirecionar rotas desconhecidas para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
