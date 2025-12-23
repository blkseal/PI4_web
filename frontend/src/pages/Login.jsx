/**
 * Login.jsx - Página de login do CLINIMOLELOS
 *
 * Esta página permite aos utilizadores entrarem na sua conta
 * usando email e PIN. Comunica com o backend para autenticação.
 * Utiliza componentes reutilizáveis para consistência.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { storeTokens, clearTokens } from "../services/api";
import { Logo, InputField, Checkbox, InfoBox } from "../components";
import emailSvg from "../assets/email.svg?raw";
import lockSvg from "../assets/lock.svg?raw";
import arrowRightSvg from "../assets/arrow-right.svg?raw";
import "./Login.css";

const InlineSvg = ({ svg, className = "" }) => (
  <span
    className={className}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

const EmailIcon = () => <InlineSvg svg={emailSvg} />;
const LockIcon = () => <InlineSvg svg={lockSvg} />;
const ArrowIcon = () => <InlineSvg svg={arrowRightSvg} />;

function Login() {
  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  // Estados para as checkboxes de termos
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estados para controlo da UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hook para navegação programática
  const navigate = useNavigate();

  /**
   * Função que trata do envio do formulário de login
   * Envia os dados para o backend e guarda os tokens na localStorage
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpar erros anteriores
    setError("");

    // Validar campos obrigatórios
    if (!email || !pin) {
      setError("Por favor, preencha o email e o PIN.");
      return;
    }

    // Verificar se os termos foram aceites
    if (!privacyAccepted || !termsAccepted) {
      setError(
        "Deve aceitar a Política de Privacidade e os Termos e Condições."
      );
      return;
    }

    setLoading(true);

    try {
      // Enviar pedido de login para o backend
      const response = await api.post("/auth/login", { email, pin });

      // Extrair dados da resposta
      const { accessToken, refreshToken, utilizador } = response.data;

      // Guardar tokens de forma consistente
      storeTokens({ accessToken, refreshToken });
      localStorage.setItem("user", JSON.stringify(utilizador));

      // Redirecionar conforme o tipo de utilizador
      if (utilizador?.tipo === "gestor") {
        navigate("/agenda");
      } else {
        navigate("/home");
      }
    } catch (err) {
      // Tratar erros da API
      if (err.response?.status === 401) {
        setError("Credenciais inválidas. Verifique o email e o PIN.");
      } else if (err.response?.data?.mensagem) {
        setError(err.response.data.mensagem);
      } else {
        setError("Ocorreu um erro ao fazer login. Tente novamente.");
      }
      // Em qualquer erro, limpar tokens residuais
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Secção do Logo - usa o componente Logo reutilizável */}
      <div className="login-logo-section">
        <Logo size="medium" showText={true} />
      </div>

      {/* Secção do Formulário com fundo curvo */}
      <div className="login-form-section">
        {/* Fundo curvo castanho */}
        <div className="curved-background"></div>

        {/* Card do formulário */}
        <div className="login-card">
          <h1 className="login-title">Faça login na sua conta</h1>

          {/* Mostrar mensagem de erro se existir */}
          {error && <div className="error-message">{error}</div>}

          {/* Formulário de login */}
          <form onSubmit={handleSubmit}>
            {/* Campo de Email - usa componente InputField */}
            <InputField
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<EmailIcon />}
              variant="dark"
              required
            />

            {/* Campo de PIN - usa componente InputField */}
            <InputField
              type="password"
              id="pin"
              placeholder="Pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              icon={<LockIcon />}
              variant="dark"
              required
            />

            {/* Área das Checkboxes */}
            <div className="checkbox-area">
              {/* Checkbox da Política de Privacidade */}
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                variant="dark"
              >
                Eu aceito a <a href="/privacy">Política de Privacidade</a> da
                seguinte aplicação.
              </Checkbox>

              {/* Checkbox dos Termos e Condições */}
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                variant="dark"
              >
                Eu aceito os <a href="/terms">Termos e Condições</a> da seguinte
                aplicação.
              </Checkbox>
            </div>

            {/* Área de Acções */}
            <div className="action-area">
              {/* Link para recuperar PIN */}
              <button
                type="button"
                className="forgot-pin-link"
                onClick={() => navigate("/forgot-pin")}
              >
                Esqueceu-se do seu Pin?
              </button>

              {/* Botão de Login */}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "A entrar..." : "Entrar"}
                <ArrowIcon />
              </button>
            </div>
          </form>
        </div>

        {/* Box de Informação de Contacto - usa componente InfoBox */}
        <InfoBox variant="dark">
          <p className="info-text">
            Para criar uma conta, é necessário contactar a clínica primeiro.
          </p>
          <div className="phone-number">
            <span>Ligue para o</span>
            <a href="tel:+351239909607">+351 239 909 607</a>
          </div>
        </InfoBox>
      </div>
    </div>
  );
}

export default Login;
