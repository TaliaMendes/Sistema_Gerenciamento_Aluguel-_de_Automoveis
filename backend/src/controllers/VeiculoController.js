import createHttpError from "http-errors";
import * as VeiculoService from '../services/VeiculoService.js';

export function criar (req, res){
  try {
    const id = VeiculoService.criarVeiculos(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function listarVeiculosAdm(req, res, next) {
  try {
    const data = VeiculoService.listarAdmin(req.query);
    res.json(data);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function listarDisponiveis(req, res, next) {
  try {
    const data = VeiculoService.listarDisponiveis(req.query);
    res.json(data);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
   
    const veiculo = VeiculoService.atualizarVeiculo(id, req.body);
    if (!veiculo) {
      return next(createError(404, 'Veículo não encontrado.'));
    }
    res.status(201).json({ id });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function inativar(req, res, next) {
  try {
    const id = Number(req.params.id);

    VeiculoService.inativarVeiculo(id);
    res.status(201).json({ id });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}
