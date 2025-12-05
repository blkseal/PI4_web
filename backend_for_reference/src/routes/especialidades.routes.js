import { Router } from 'express';
import * as EspecialidadesController from '../controllers/especialidades.controller.js';

const router = Router();

// Listar especialidades
router.get('/especialidades', EspecialidadesController.getEspecialidades);

// Listar médicos
router.get('/medicos', EspecialidadesController.getMedicos);

// Criar especialidade
router.post('/especialidades', EspecialidadesController.createEspecialidade);

export default router;
