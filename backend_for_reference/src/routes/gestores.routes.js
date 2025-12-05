import { Router } from 'express';
import * as GestoresController from '../controllers/gestores.controller.js';

const router = Router();

router.get('/', GestoresController.getGestores);
router.post('/', GestoresController.createGestor);
router.get('/:id', GestoresController.getGestor);
router.put('/:id', GestoresController.updateGestor);

export default router;
