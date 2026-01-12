import { db } from '../database/database.js';

// Cria uma reserva (pagamento começa pendente)
export function criarReserva({
  usuario_id,
  veiculo_id,
  data_inicio,
  data_fim,
  pagamento_valor
}) {
  const reserva = db.prepare(`
    INSERT INTO reservas (
      usuario_id, veiculo_id, data_inicio, data_fim,
      status, pagamento_status, pagamento_valor
    )
    VALUES (?, ?, ?, ?, 'RESERVADA', 'PENDENTE', ?)
  `);

  const info = reserva.run(usuario_id, veiculo_id, data_inicio, data_fim, pagamento_valor);
  return info.lastInsertRowid;
}

export function reservaConflito(veiculo_id, data_inicio, data_fim) {
  const reserva = db.prepare(`
    SELECT 1
    FROM reservas
    WHERE veiculo_id = ?
      AND status = 'RESERVADA'
      AND (date(?) <= date(data_fim))
      AND (date(?) >= date(data_inicio))
    LIMIT 1
  `).get(veiculo_id, data_inicio, data_fim);

  return !!reserva;
}

export function listarPorUsuario(usuario_id, { status } = {}) {
  let sql = `
    SELECT *
    FROM reservas
    WHERE usuario_id = ?
  `;
  const params = [usuario_id];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC';

  return db.prepare(sql).all(...params);
}
