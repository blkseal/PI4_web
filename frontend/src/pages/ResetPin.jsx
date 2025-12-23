/**
 * ResetPin.jsx - Página para redefinir o PIN usando token
 *
 * O utilizador recebe um token por email e usa-o para definir um novo PIN.
 * Endpoint: POST /auth/reset-pin
 */

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import { Logo, InputField, InfoBox } from "../components";
import lockSvg from "../assets/lock.svg?raw";
import arrowRightSvg from "../assets/arrow-right.svg?raw";
import "./ResetPin.css";

const InlineSvg = ({ svg, className = "" }) => (
  <span
    className={className}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

const LockIcon = () => <InlineSvg svg={lockSvg} />;
const ArrowIcon = () => <InlineSvg svg={arrowRightSvg} />;

function ResetPin() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [novoPin, setNovoPin] = useState("");
  const [confirmarPin, setConfirmarPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token de recuperação não encontrado. Solicite um novo link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!novoPin || !confirmarPin) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (novoPin.length < 4) {
      setError("O PIN deve ter pelo menos 4 dígitos.");
      return;
    }

    if (novoPin !== confirmarPin) {
      setError("Os PINs não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-pin", { token, novoPin });
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(
          "Token inválido ou expirado. Solicite um novo link de recuperação."
        );
      } else if (err.response?.data?.mensagem) {
        setError(err.response.data.mensagem);
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-pin-container">
      {/* Secção do Logo */}
      <div className="reset-pin-logo-section">
        <Logo size="medium" showText={true} />
      </div>

      {/* Secção do Formulário */}
      <div className="reset-pin-form-section">
        <div className="curved-background"></div>

        <div className="reset-pin-card">
          <h1 className="reset-pin-title">Redefinir PIN</h1>

          {success ? (
            <div className="success-content">
              <div className="success-message">
                <p>O seu PIN foi redefinido com sucesso!</p>
                <p>Já pode fazer login com o seu novo PIN.</p>
              </div>
              <Link to="/" className="back-to-login-btn">
                Ir para Login
              </Link>
            </div>
          ) : !token ? (
            <div className="error-content">
              <div className="error-message">{error}</div>
              <Link to="/forgot-pin" className="back-to-login-btn">
                Solicitar novo link
              </Link>
            </div>
          ) : (
            <>
              <p className="reset-pin-description">
                Insira o seu novo PIN de acesso.
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <InputField
                  type="password"
                  id="novoPin"
                  placeholder="Novo PIN"
                  value={novoPin}
                  onChange={(e) => setNovoPin(e.target.value)}
                  icon={<LockIcon />}
                  variant="dark"
                  required
                />

                <InputField
                  type="password"
                  id="confirmarPin"
                  placeholder="Confirmar PIN"
                  value={confirmarPin}
                  onChange={(e) => setConfirmarPin(e.target.value)}
                  icon={<LockIcon />}
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
                    {loading ? "A guardar..." : "Guardar"}
                    <ArrowIcon />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <InfoBox variant="dark">
          <p className="info-text">
            Se continuar a ter problemas, contacte a clínica.
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

export default ResetPin;
