import { Router } from 'express';
import * as NotificacoesController from '../controllers/notificacoes.controller.js';

const router = Router();

// Listar notificações
router.get('/', NotificacoesController.getNotificacoes);

// Marcar como lida
router.post('/:id/ler', NotificacoesController.marcarComoLida);

// Criar notificação
router.post('/', NotificacoesController.createNotificacao);

export default router;
