import { createUsuarioTable } from './UsuarioModel.js';
import { createVeiculoTable } from './VeiculoModel.js';
import { createReservaTable } from './ReservaModel.js';
import { createMultaTable } from './MultaModel.js';

export function initModels() {
  createUsuarioTable();
  createVeiculoTable();
  createReservaTable();
  createMultaTable();
}
