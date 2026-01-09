import { Router } from 'express';
import * as UsuarioController from '../controllers/UsuarioController.js';

const router = Router();

router.post('/runcar/usuarios', UsuarioController.criarCliente);
router.get('/runcar/usuarios/:id', UsuarioController.buscarUsuario);
router.post('/runcar/usuarios/login', UsuarioController.login);

export default router