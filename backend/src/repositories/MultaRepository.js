import { db } from '../database/database.js';

export function criarMulta({ reserva_id, descricao, valor }) {
  const multa = db.prepare(`
    INSERT INTO multas (reserva_id, descricao, valor)
    VALUES (?, ?, ?)
  `);
  const info = multa.run(reserva_id, descricao, valor);
  return info.lastInsertRowid;
}

export function buscarPorId(id) {
  return db.prepare('SELECT * FROM multas WHERE id = ?').get(id);
}

export function listarPorReserva(reserva_id) {
  return db.prepare(`
    SELECT *
    FROM multas
    WHERE reserva_id = ?
    ORDER BY created_at DESC
  `).all(reserva_id);
}

export function listarPorUsuario(usuario_id) {
  return db.prepare(`
    SELECT m.*
    FROM multas m
    JOIN reservas r ON r.id = m.reserva_id
    WHERE r.usuario_id = ?
    ORDER BY m.created_at DESC
  `).all(usuario_id);
}

export function removerMulta(id) {
  const info = db.prepare('DELETE FROM multas WHERE id = ?').run(id);
  return info.changes > 0;
}