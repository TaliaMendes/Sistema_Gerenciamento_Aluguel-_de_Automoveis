import createHttpError from "http-errors";
import * as ReservaService from '../services/ReservaService.js';

export function criarReserva (req, res, next){
  try {
    const result = ReservaService.criarReserva(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function listarReservasUsuarios(req, res, next) {
  try {
    const { usuario_id, status } = req.query;
    const data = ReservaService.listarReservasUsuario(usuario_id, { status });
    res.json(data);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}