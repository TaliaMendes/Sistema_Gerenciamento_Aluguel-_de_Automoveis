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