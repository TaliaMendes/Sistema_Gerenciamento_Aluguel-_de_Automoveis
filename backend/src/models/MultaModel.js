import { db } from '../database/database.js';

export function createMultaTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS multas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reserva_id INTEGER NOT NULL,
      descricao TEXT NOT NULL,
      valor REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(reserva_id) REFERENCES reservas(id)
    );
  `);
}
