/**
 * ForgotPin.jsx - Página para solicitar recuperação de PIN
 *
 * O utilizador insere o email e recebe um link para redefinir o PIN.
 * Endpoint: POST /auth/forgot-pin
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Logo, InputField, InfoBox } from "../components";
import emailSvg from "../assets/email.svg?raw";
import arrowRightSvg from "../assets/arrow-right.svg?raw";
import "./ForgotPin.css";

const InlineSvg = ({ svg, className = "" }) => (
  <span
    className={className}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

const EmailIcon = () => <InlineSvg svg={emailSvg} />;
const ArrowIcon = () => <InlineSvg svg={arrowRightSvg} />;

function ForgotPin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Por favor, insira o seu email.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-pin", { email });
      setSuccess(true);
    } catch (err) {
      if (err.response?.data?.mensagem) {
        setError(err.response.data.mensagem);
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-pin-container">
      {/* Secção do Logo */}
      <div className="forgot-pin-logo-section">
        <Logo size="medium" showText={true} />
      </div>

      {/* Secção do Formulário */}
      <div className="forgot-pin-form-section">
        <div className="curved-background"></div>

        <div className="forgot-pin-card">
          <h1 className="forgot-pin-title">Recuperar PIN</h1>

          {success ? (
            <div className="success-content">
              <div className="success-message">
                <p>
                  Se o email estiver registado, receberá instruções para
                  redefinir o seu PIN.
                </p>
                <p>Verifique a sua caixa de entrada e spam.</p>
              </div>
              <Link to="/" className="back-to-login-btn">
                Voltar ao Login
              </Link>
            </div>
          ) : (
            <>
              <p className="forgot-pin-description">
                Insira o seu email para receber instruções de recuperação do
                PIN.
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
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

                <div className="action-area">
                  <Link to="/" className="back-link">
                    ← Voltar ao Login
                  </Link>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? "A enviar..." : "Enviar"}
                    <ArrowIcon />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <InfoBox variant="dark">
          <p className="info-text">
            Se não conseguir recuperar o acesso, contacte a clínica.
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

export default ForgotPin;
