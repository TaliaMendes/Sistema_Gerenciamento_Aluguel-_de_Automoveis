import createHttpError from "http-errors";
import * as MultaService from '../services/MultaService.js';

export function registrarMulta(req, res, next) {
  try {
    const result = MultaService.registrarMulta(req.body);
    res.status(201).json(result); 
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}