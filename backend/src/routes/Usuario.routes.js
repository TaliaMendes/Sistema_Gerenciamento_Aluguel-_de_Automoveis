import { Router } from 'express';
import * as UsuarioController from '../controllers/UsuarioController.js';

const router = Router();

router.post('/runcar/clientes', UsuarioController.criarCliente);

export default router