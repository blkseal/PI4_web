import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components';
import api from '../services/api';
import examSvg from '../assets/exam.svg?raw';
import justificacaoSvg from '../assets/justificacao.svg?raw';
import tratamentoSvg from '../assets/tratamento.svg?raw';
import './Documentacao.css';

const InlineSvg = ({ svg, className = '' }) => (
  <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
);

const DocCard = ({ icon, title, description }) => (
  <div className="doc-card">
    <div className="doc-card-icon">
      {icon}
    </div>
    <div className="doc-card-text">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

function Documentacao() {
  const [exames, setExames] = useState([]);
  const [justificacoes, setJustificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchDocs = async () => {
      setLoading(true);
      setError('');
      try {
        const [examesResp, justificacoesResp] = await Promise.all([
          api.get('/documentacao/exames'),
          api.get('/documentacao/justificacoes')
        ]);

        if (cancelled) return;

        setExames(examesResp?.data || []);
        setJustificacoes(justificacoesResp?.data || []);
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401) {
          setError('Sessão expirada. Inicie sessão novamente.');
          // Mantém o utilizador na página em vez de redirecionar automaticamente.
        } else {
          setError('Não foi possível carregar os anexos. Tente novamente.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDocs();
    return () => { cancelled = true; };
  }, []);

  const latestAnexos = useMemo(() => {
    const items = [];

    (exames || []).forEach((exame) => {
      if (!exame?.anexoUrl) return;
      items.push({
        id: exame.id,
        type: 'Exame',
        label: `Exame #${exame.id}`,
        url: exame.anexoUrl
      });
    });

    (justificacoes || []).forEach((jus) => {
      if (!jus?.anexoUrl) return;
      items.push({
        id: jus.id,
        type: 'Justificação',
        label: `Justificação #${jus.id}`,
        url: jus.anexoUrl
      });
    });

    return items
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 8);
  }, [exames, justificacoes]);

  return (
    <div className="doc-page">
      <Navbar variant="utente" />

      <main className="doc-main">
        <h1 className="doc-title">Documentação</h1>

        <div className="doc-content">
          <div className="doc-cards">
            <DocCard
              icon={<InlineSvg svg={examSvg} className="doc-inline-svg" />}
              title="Exames"
              description="Consulte os seus exames realizados"
            />
            <DocCard
              icon={<InlineSvg svg={justificacaoSvg} className="doc-inline-svg" />}
              title="Justificações"
              description="Consulte as suas justificações"
            />
            <DocCard
              icon={<InlineSvg svg={tratamentoSvg} className="doc-inline-svg" />}
              title="Tratamentos anteriores"
              description="Veja os seus tratamentos anteriores"
            />
          </div>

          <div className="doc-list-panel">
            <h2>Últimos anexos</h2>

            {loading && <p className="doc-status">A carregar anexos...</p>}
            {error && !loading && <p className="doc-error">{error}</p>}

            {!loading && !error && latestAnexos.length === 0 && (
              <p className="doc-empty">Nenhum exame ou justificação</p>
            )}

            {!loading && !error && latestAnexos.length > 0 && (
              <div className="doc-list">
                {latestAnexos.map((item) => (
                  <a
                    key={`${item.type}-${item.id}`}
                    className="doc-list-item"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="doc-item-type">{item.type}</span>
                    <span className="doc-item-label">{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="doc-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Documentacao;
