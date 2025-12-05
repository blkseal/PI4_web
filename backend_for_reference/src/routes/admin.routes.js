import { Router } from 'express';
import * as AdminController from '../controllers/admin.controller.js';

const router = Router();

// Utilizadores
router.post('/utilizadores', AdminController.createUtilizador);

// Consultas (Gestão)
router.get('/consultas', AdminController.getConsultas);
router.post('/consultas', AdminController.agendarConsulta);

// Pedidos de Consulta
router.get('/pedidos-consulta', AdminController.getPedidosConsulta);
router.delete('/pedidos-consulta/:tipo/:id', AdminController.deletePedidoConsulta);

export default router;
