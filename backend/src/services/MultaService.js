import * as MultaRepository from '../repositories/MultaRepository.js';
import * as ReservaRepository from '../repositories/ReservaRepository.js';

function validarId(nome, id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`${nome} inválido.`);
  return n;
}

function validarTexto(campo, valor) {
  if (!valor || typeof valor !== 'string' || !valor.trim()) {
    throw new Error(`${campo} é obrigatório.`);
  }
  return valor.trim();
}

function validarValor(valor) {
  const n = Number(valor);
  if (!Number.isFinite(n) || n <= 0) throw new Error('valor deve ser um número maior que 0.');
  return n;
}

// ADMIN: registra multa em uma reserva
export function registrarMulta({ reserva_id, descricao, valor }) {
  const reservaId = validarId('reserva_id', reserva_id);
  const descValidada = validarTexto('descricao', descricao);
  const valorValidado = validarValor(valor);

  const reserva = ReservaRepository.buscarPorId(reservaId);
  if (!reserva) throw new Error('Reserva não encontrada.');

  const id = MultaRepository.criarMulta({
    reserva_id: reservaId,
    descricao: descValidada,
    valor: valorValidado
  });

  return { id };
}

// Listar multas de uma reserva
export function listarMultasPorReserva(reserva_id) {
  const reservaId = validarId('reserva_id', reserva_id);

  const reserva = ReservaRepository.buscarPorId(reservaId);
  if (!reserva) throw new Error('Reserva não encontrada.');

  return MultaRepository.listarPorReserva(reservaId);
}

// Listar todas as multas do usuário
export function listarMultasPorUsuario(usuario_id) {
  const usuarioId = validarId('usuario_id', usuario_id);
  return MultaRepository.listarPorUsuario(usuarioId);
}

// ADMIN: remover multa
export function removerMulta(id) {
  const multaId = validarId('multa_id', id);

  const multa = MultaRepository.buscarPorId(multaId);
  if (!multa) throw new Error('Multa não encontrada.');

  const multaRemovida = MultaRepository.removerMulta(multaId);
  if (!multaRemovida) throw new Error('Falha ao remover multa.');

  return true;
}