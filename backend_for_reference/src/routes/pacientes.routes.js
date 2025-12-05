import { Router } from 'express';
import * as PacientesController from '../controllers/pacientes.controller.js';

const router = Router();

// Listar e Criar
router.get('/', PacientesController.getPacientes);
router.post('/', PacientesController.createPaciente);

// QR Code
router.get('/by-qr', PacientesController.getPacienteByQr);

// Detalhe e Atualização
router.get('/:id', PacientesController.getPaciente);
router.put('/:id', PacientesController.updatePaciente);

// Credenciais
router.post('/:id/enviar-credenciais', PacientesController.enviarCredenciais);

// Histórico Dentário
router.get('/:id/historico-dentario', PacientesController.getHistorico);
router.put('/:id/historico-dentario', PacientesController.updateHistorico);
router.get('/:id/historico-dentario/ficheiro', PacientesController.downloadHistorico);

// Tratamentos
router.get('/:id/tratamentos', PacientesController.getTratamentos);
router.post('/:id/tratamentos', PacientesController.createTratamento);

export default router;
