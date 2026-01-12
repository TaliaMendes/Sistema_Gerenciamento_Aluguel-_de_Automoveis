import { Router } from 'express';
import * as MultaController from '../controllers/MultaController.js';

const router = Router();

router.post('/runcar/admin/multas', MultaController.registrarMulta);

export default router