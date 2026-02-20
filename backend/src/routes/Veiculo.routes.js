import { Router } from 'express';
import * as VeiculoController from '../controllers/VeiculoController.js';
import adminAuth from '../middlewares/adminAuth.js';
import { upload } from '../middlewares/uploadConfig.js';

const router = Router();

router.post('/runcar/admin/veiculos', adminAuth, upload.single('imagem'), VeiculoController.criar);
router.get('/runcar/admin/veiculos', adminAuth, VeiculoController.listarVeiculosAdm);
router.get('/runcar/veiculos', VeiculoController.listarDisponiveis);
router.put('/runcar/admin/veiculos/:id', adminAuth, upload.single('imagem'), VeiculoController.atualizar);
router.patch('/runcar/admin/veiculos/:id', adminAuth,  VeiculoController.inativar);

export default router;