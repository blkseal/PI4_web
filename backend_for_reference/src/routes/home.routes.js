import { Router } from 'express';
import * as HomeController from '../controllers/home.controller.js';

const router = Router();

// Rota para obter o resumo da home
// GET /home
router.get('/', HomeController.getHomeResumo);

export default router;
