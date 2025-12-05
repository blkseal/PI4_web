import { Router } from 'express';
import * as TratamentosController from '../controllers/tratamentos.controller.js';

const router = Router();

// Tratamentos Atuais
router.get('/atuais', TratamentosController.getAtuais);

// Tipos de Tratamento
router.get('/tipos', TratamentosController.getTipos);

// Operações sobre um tratamento específico
router.get('/:id', TratamentosController.getTratamento);
router.put('/:id', TratamentosController.updateTratamento);

// Anexos
router.get('/:id/anexos', TratamentosController.getAnexos);
router.post('/:id/anexos', TratamentosController.addAnexo);

export default router;
