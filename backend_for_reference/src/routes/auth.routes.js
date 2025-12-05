import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';

const router = Router();

// Rota para login
// POST /auth/login
router.post('/login', AuthController.login);

// Rota para logout
// POST /auth/logout
router.post('/logout', AuthController.logout);

// Rota para refresh token
// POST /auth/refresh
router.post('/refresh', AuthController.refresh);

export default router;
