import { Router } from 'express';
import * as VeiculoController from '../controllers/VeiculoController.js';

const router = Router();

router.post('/runcar/admin/veiculos', VeiculoController.criar);
router.get('/runcar/admin/veiculos', VeiculoController.listarVeiculosAdm);
router.get('/runcar/veiculos', VeiculoController.listarDisponiveis);

export default router;