import { Router } from 'express';
import * as DocumentacaoController from '../controllers/documentacao.controller.js';

const router = Router();

// Exames
router.get('/exames', DocumentacaoController.getExames);
router.get('/exames/:id', DocumentacaoController.getExame);

// Justificações
router.get('/justificacoes', DocumentacaoController.getJustificacoes);
router.get('/justificacoes/:id', DocumentacaoController.getJustificacao);

// Tratamentos
router.get('/tratamentos', DocumentacaoController.getTratamentos);
router.get('/tratamentos/:id', DocumentacaoController.getTratamento);

export default router;
