import createHttpError from "http-errors";
import * as ReservaService from '../services/ReservaService.js';

export function criarReserva (req, res, next){
  try {
    const result = ReservaService.criarReserva(req.body);
    res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
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

export function pagarReservas(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new Error('reserva_id inválido.');

    ReservaService.pagarReserva(id, req.body);
    res.json({ ok: true });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function cancelarReservas(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new Error('reserva_id inválido.');

    ReservaService.cancelarReserva(id);
    res.json({ ok: true });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function finalizarReservas(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new Error('reserva_id inválido.');

    ReservaService.finalizarReserva(id);
    res.json({ ok: true });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function detalhes(req, res, next) {
  try {
    const { id } = req.params;
    const { usuario_id } = req.query;

    const data = ReservaService.obterDetalhesReserva(id, usuario_id);
    res.json(data);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}