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
import ConsultasGestor from './pages/ConsultasGestor';
import PedidosConsulta from './pages/PedidosConsulta';
import AgendarConsulta from './pages/AgendarConsulta';
import ConsultaDetalhes from './pages/ConsultaDetalhes';
import EditarConsulta from './pages/EditarConsulta';
import HistoricoConsultas from './pages/HistoricoConsultas';
import ResumoConsulta from './pages/ResumoConsulta';
import HistoricoMedico from "./pages/HistoricoMedico";
import HistoricoDentarioGestor from "./pages/HistoricoDentarioGestor";
import Tratamentos from "./pages/Tratamentos";
import CriarTratamento from "./pages/CriarTratamento";
import ListaTratamentos from "./pages/ListaTratamentos";
import TratamentoDetalhe from "./pages/TratamentoDetalhe";
import TratamentosAtuais from "./pages/TratamentosAtuais";
import NovoTratamentoPaciente from "./pages/NovoTratamentoPaciente";
import TratamentosPaciente from "./pages/TratamentosPaciente";
import TratamentoPacienteDetalhe from "./pages/TratamentoPacienteDetalhe";
import TratamentosUtente from "./pages/TratamentosUtente";
import TratamentoDetalheUtente from "./pages/TratamentoDetalheUtente";
import ForgotPin from "./pages/ForgotPin";
import ResetPin from "./pages/ResetPin";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Rota exclusiva para gestores - redireciona não-gestores para /home
const GestorRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user?.tipo !== "gestor") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Rota exclusiva para utentes - redireciona gestores para /agenda
const UtenteRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user?.tipo === "gestor") {
    return <Navigate to="/agenda" replace />;
  }

  return children;
};

// Rota para a página de login - redireciona utilizadores logados
const LoginRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("user");

  if (token && storedUser) {
    const user = JSON.parse(storedUser);
    if (user.tipo === "gestor") {
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
        <Route
          path="/"
          element={
            <LoginRoute>
              <Login />
            </LoginRoute>
          }
        />

        {/* Rota para recuperação de PIN */}
        <Route path="/forgot-pin" element={<ForgotPin />} />

        {/* Rota para redefinir PIN */}
        <Route path="/reset-pin" element={<ResetPin />} />

        {/* Rota para documentação (utente) */}
        <Route
          path="/documentacao"
          element={
            <UtenteRoute>
              <Documentacao />
            </UtenteRoute>
          }
        />

        {/* Rota para a página inicial (utente) */}
        <Route
          path="/home"
          element={
            <UtenteRoute>
              <Home />
            </UtenteRoute>
          }
        />

        {/* Rota para consultas (utente) */}
        <Route
          path="/consultas"
          element={
            <UtenteRoute>
              <Consultas />
            </UtenteRoute>
          }
        />

        {/* Rota para agenda do gestor (gestor only) */}
        <Route
          path="/agenda"
          element={
            <GestorRoute>
              <AgendaGestor />
            </GestorRoute>
          }
        />

        {/* Rota para pacientes (gestor only) */}
        <Route
          path="/pacientes"
          element={
            <GestorRoute>
              <Pacientes />
            </GestorRoute>
          }
        />

        {/* Rota para criar novo paciente (gestor only) */}
        <Route
          path="/pacientes/novo"
          element={
            <GestorRoute>
              <NovoPaciente />
            </GestorRoute>
          }
        />

        {/* Rota para detalhes do paciente (gestor only) */}
        <Route
          path="/pacientes/:id"
          element={
            <GestorRoute>
              <FichaPaciente />
            </GestorRoute>
          }
        />

        {/* Rota para editar paciente (gestor only) */}
        <Route
          path="/pacientes/:id/editar"
          element={
            <GestorRoute>
              <EditarPaciente />
            </GestorRoute>
          }
        />

        {/* Rota para consultas do gestor (gestor only) */}
        <Route
          path="/gestor/consultas"
          element={(
            <GestorRoute>
              <ConsultasGestor />
            </GestorRoute>
          )}
        />

        {/* Rota para pedidos de consulta do gestor (gestor only) */}
        <Route
          path="/gestor/pedidos"
          element={(
            <GestorRoute>
              <PedidosConsulta />
            </GestorRoute>
          )}
        />

        {/* Rota para detalhes da consulta (gestor only) */}
        <Route
          path="/gestor/consultas/:id"
          element={(
            <GestorRoute>
              <ConsultaDetalhes />
            </GestorRoute>
          )}
        />

        {/* Rota para editar consulta (gestor only) */}
        <Route
          path="/gestor/consultas/:id/editar"
          element={(
            <GestorRoute>
              <EditarConsulta />
            </GestorRoute>
          )}
        />

        {/* Rota para histórico de consultas (gestor only) */}
        <Route
          path="/gestor/historico"
          element={(
            <GestorRoute>
              <HistoricoConsultas />
            </GestorRoute>
          )}
        />

        {/* Rota para resumo da consulta (gestor only) */}
        <Route
          path="/gestor/consultas/:id/resumo"
          element={(
            <GestorRoute>
              <ResumoConsulta />
            </GestorRoute>
          )}
        />

        {/* Rota para agendar consulta (gestor only) */}
        <Route
          path="/gestor/agendar"
          element={(
            <GestorRoute>
              <AgendarConsulta />
            </GestorRoute>
          )}
        />

        {/* Rota para perfil (utente) */}
        <Route
          path="/perfil"
          element={
            <UtenteRoute>
              <Profile />
            </UtenteRoute>
          }
        />

        {/* Rota para os meus dados (utente) */}
        <Route
          path="/perfil/dados"
          element={
            <UtenteRoute>
              <MeusDados />
            </UtenteRoute>
          }
        />

        {/* Rota para histórico dentário (utente) */}
        <Route
          path="/perfil/historico"
          element={
            <UtenteRoute>
              <HistoricoDentario />
            </UtenteRoute>
          }
        />

        {/* Rota para dependentes (utente) */}
        <Route
          path="/perfil/dependentes"
          element={
            <UtenteRoute>
              <Dependentes />
            </UtenteRoute>
          }
        />
        <Route
          path="/perfil/dependentes/:id"
          element={
            <UtenteRoute>
              <Dependentes />
            </UtenteRoute>
          }
        />

        {/* Rota para editar credenciais (utente) */}
        <Route
          path="/perfil/credenciais"
          element={
            <UtenteRoute>
              <EditarCredenciais />
            </UtenteRoute>
          }
        />

        {/* Rota para tratamentos do utente (utente) */}
        <Route
          path="/tratamentos"
          element={
            <UtenteRoute>
              <TratamentosUtente />
            </UtenteRoute>
          }
        />

        {/* Rota para detalhe de tratamento do utente (utente) */}
        <Route
          path="/tratamentos/:id"
          element={
            <UtenteRoute>
              <TratamentoDetalheUtente />
            </UtenteRoute>
          }
        />

        {/* Rota para Histórico Médico (Gestor only) */}
        <Route
          path="/pacientes/:id/historico-medico"
          element={
            <GestorRoute>
              <HistoricoMedico />
            </GestorRoute>
          }
        />

        {/* Rota para Histórico Dentário (Gestor only) */}
        <Route
          path="/pacientes/:id/historico-dentario"
          element={
            <GestorRoute>
              <HistoricoDentarioGestor />
            </GestorRoute>
          }
        />

        {/* Rota para Tratamentos do Paciente (Gestor only) */}
        <Route
          path="/pacientes/:id/tratamentos"
          element={
            <GestorRoute>
              <TratamentosPaciente />
            </GestorRoute>
          }
        />

        {/* Rota para Criar Novo Tratamento para Paciente (Gestor only) */}
        <Route
          path="/pacientes/:id/tratamentos/novo"
          element={
            <GestorRoute>
              <NovoTratamentoPaciente />
            </GestorRoute>
          }
        />

        {/* Rota para Detalhe de Tratamento do Paciente (Gestor only) */}
        <Route
          path="/pacientes/:id/tratamentos/:tratamentoId"
          element={
            <GestorRoute>
              <TratamentoPacienteDetalhe />
            </GestorRoute>
          }
        />

        {/* Rota para Tratamentos (Gestor only) */}
        <Route
          path="/gestao/tratamentos"
          element={
            <GestorRoute>
              <Tratamentos />
            </GestorRoute>
          }
        />

        {/* Rota para Criar Tratamento (Gestor only) */}
        <Route
          path="/gestao/tratamentos/criar"
          element={
            <GestorRoute>
              <CriarTratamento />
            </GestorRoute>
          }
        />

        {/* Rota para Lista de Tratamentos (Gestor only) */}
        <Route
          path="/gestao/tratamentos/lista"
          element={
            <GestorRoute>
              <ListaTratamentos />
            </GestorRoute>
          }
        />

        {/* Rota para Detalhe de Tipo de Tratamento (Gestor only) */}
        <Route
          path="/gestao/tratamentos/tipo/:id"
          element={
            <GestorRoute>
              <TratamentoDetalhe />
            </GestorRoute>
          }
        />

        {/* Rota para Tratamentos Atuais (Gestor only) */}
        <Route
          path="/gestao/tratamentos/atuais"
          element={
            <GestorRoute>
              <TratamentosAtuais />
            </GestorRoute>
          }
        />

        {/* Redirecionar rotas desconhecidas para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
