import { Router } from 'express';
import * as ConsultasController from '../controllers/consultas.controller.js';

const router = Router();

// Listar próximas consultas
router.get('/proximas', ConsultasController.getProximas);

// Verificar disponibilidade
router.get('/disponibilidade', ConsultasController.getDisponibilidade);

// Histórico de consultas
router.get('/historico', ConsultasController.getHistorico);

// Submeter pedido de consulta
router.post('/solicitacao', ConsultasController.criarPedido);

// Detalhe da consulta
router.get('/:id', ConsultasController.getConsulta);

// Atualizar consulta
router.patch('/:id', ConsultasController.updateConsulta);

// Resumo da consulta
router.get('/:id/resumo', ConsultasController.getResumo);

// Anexar documento
router.post('/:id/documentos', ConsultasController.anexarDocumento);

export default router;
