/**
 * App.jsx - Componente principal da aplicação CLINIMOLELOS
 * 
 * Define as rotas da aplicação usando React Router.
 * A página de login é a rota principal.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

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

        {/* Rota para a página inicial após login */}
        <Route path="/home" element={<Home />} />

        {/* Redirecionar rotas desconhecidas para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
