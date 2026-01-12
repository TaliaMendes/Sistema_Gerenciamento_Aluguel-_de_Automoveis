import { Router } from 'express';
import * as MultaController from '../controllers/MultaController.js';

const router = Router();

router.post('/runcar/admin/multas', MultaController.registrarMulta);
router.get('/runcar/multas/reserva/:reservaId', MultaController.listarPorReserva);

export default router