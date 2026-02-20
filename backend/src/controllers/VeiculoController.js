import createHttpError from "http-errors";
import * as VeiculoService from '../services/VeiculoService.js';

export function criar (req, res, next ){
  try {

    // Se veio upload de arquivo, monta a URL da imagem
    let imagem_url = req.body.imagem_url || null;
    if (req.file) {
      imagem_url = `/uploads/veiculos/${req.file.filename}`;
    }

    const id = VeiculoService.criarVeiculos({
      ...req.body,
      preco_diaria: Number(req.body.preco_diaria),
      imagem_url,
    });

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
   
    let imagem_url = req.body.imagem_url;
    if (req.file) {
      imagem_url = `/uploads/veiculos/${req.file.filename}`;
    }

    const ok = VeiculoService.atualizarVeiculo(id, {
      ...req.body,
      preco_diaria: req.body.preco_diaria ? Number(req.body.preco_diaria) : undefined,
      imagem_url,
    });

    if (!ok) return next(createHttpError(404, 'Veículo não encontrado.'));
    res.json({ message: 'Veículo atualizado com sucesso.' });
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