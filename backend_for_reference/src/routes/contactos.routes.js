import { Router } from 'express';
import * as ContactosController from '../controllers/contactos.controller.js';

const router = Router();

// Obter contactos
router.get('/', ContactosController.getContactos);

export default router;
