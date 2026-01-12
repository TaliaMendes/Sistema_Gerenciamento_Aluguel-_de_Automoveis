import createHttpError from "http-errors";
import * as UsuarioService from '../services/UsuarioService.js';

export function criarCliente(req, res, next) {
  try {
    const usuario = UsuarioService.criarCliente(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function buscarUsuario(req, res, next) {
  try {
    const usuario = UsuarioService.buscarUsuario(req.params.id);
    res.json(usuario);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}

export function login(req, res, next) {
  try {
    const usuario = UsuarioService.login(req.body);
    res.json(usuario);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
}