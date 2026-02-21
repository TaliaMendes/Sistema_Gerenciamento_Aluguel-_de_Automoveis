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
    SELECT v.modelo , r.id, r.usuario_id , r.veiculo_id, r.data_inicio, r.data_fim, r.status, r.pagamento_valor, r.pagamento_status, r.pagamento_metodo, r.pagamento_em 
    FROM reservas r LEFT JOIN veiculos v ON r.veiculo_id = v.id
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

export function buscarPorId(id) {
  return db.prepare('SELECT * FROM reservas WHERE id = ?').get(id);
}

export function confirmarPagamento(reserva_id,  { metodo, valor } ) {
  const pagamento = db.prepare(`
    UPDATE reservas
    SET pagamento_status = 'PAGO',
        pagamento_metodo = ?,
        pagamento_valor = ?,
        pagamento_em = datetime('now')
    WHERE id = ?
      AND status = 'RESERVADA'
  `).run(metodo, valor, reserva_id);

  return pagamento.changes > 0;
}

export function atualizarStatusVeiculo(id, status) {
  const atualizaStatus = db.prepare(`
    UPDATE veiculos
    SET status = ?
    WHERE id = ?
  `).run(status, id);

  return atualizaStatus.changes > 0;
}

export function cancelarReserva(reserva_id) {
  const info = db.prepare(`
    UPDATE reservas
    SET status = 'CANCELADA',
        pagamento_status = CASE
          WHEN pagamento_status = 'PAGO' THEN pagamento_status
          ELSE 'CANCELADO'
        END
    WHERE id = ?
      AND status = 'RESERVADA'
  `).run(reserva_id);

  return info.changes > 0;
}

export function finalizarReserva(reserva_id) {
  const info = db.prepare(`
    UPDATE reservas
    SET status = 'FINALIZADA'
    WHERE id = ?
      AND status = 'RESERVADA'
  `).run(reserva_id);

  return info.changes > 0;
}

export function buscarDetalhes(reserva_id) {
  return db.prepare(`
    SELECT
      r.*,
      v.modelo AS veiculo_modelo,
      v.categoria AS veiculo_categoria,
      v.preco_diaria AS veiculo_preco_diaria,
      v.status AS veiculo_status
    FROM reservas r
    JOIN veiculos v ON v.id = r.veiculo_id
    WHERE r.id = ?
  `).get(reserva_id);
}