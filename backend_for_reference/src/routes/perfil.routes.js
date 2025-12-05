import { Router } from 'express';
import * as PerfilController from '../controllers/perfil.controller.js';

const router = Router();

// Resumo
router.get('/', PerfilController.getResumo);

// Meus dados
router.get('/meus-dados', PerfilController.getMeusDados);
router.put('/meus-dados', PerfilController.updateMeusDados);

// Credenciais
router.put('/credenciais', PerfilController.updatePin);

// Dependentes
router.get('/dependentes', PerfilController.getDependentes);
router.post('/dependentes', PerfilController.addDependente);
router.get('/dependentes/:id', PerfilController.getDependente);
router.put('/dependentes/:id', PerfilController.updateDependente);
router.delete('/dependentes/:id', PerfilController.deleteDependente);

// Histórico Dentário
router.get('/historico-dentario', PerfilController.getHistoricoDentario);
router.put('/historico-dentario', PerfilController.updateHistoricoDentario);
router.get('/historico-dentario/ficheiro', PerfilController.downloadHistorico);

// QR Code
router.get('/qr', PerfilController.getQr);

export default router;
