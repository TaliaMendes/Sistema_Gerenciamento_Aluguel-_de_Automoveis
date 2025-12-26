import { Router } from 'express';
import * as VeiculoController from '../controllers/VeiculoController.js';

const router = Router();

router.post('/admin/veiculos', VeiculoController.criar);

export default router;