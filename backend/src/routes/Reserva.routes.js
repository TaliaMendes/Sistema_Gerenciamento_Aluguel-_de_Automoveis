import { Router } from 'express';
import * as ReservaController from '../controllers/ReservaController.js'

const router = Router();

router.post('/runcar/reservas', ReservaController.criarReserva);
router.get('/runcar/reservas/usuarios', ReservaController.listarReservasUsuarios);
router.post('/runcar/reservas/:id/pagamento', ReservaController.pagarReservas);
router.post('/runcar/reservas/:id/cancelar', ReservaController.cancelarReservas);

export default router;