import { Router } from 'express';
import * as AgendaController from '../controllers/agenda.controller.js';

const router = Router();

router.get('/semana', AgendaController.getSemana);

export default router;
