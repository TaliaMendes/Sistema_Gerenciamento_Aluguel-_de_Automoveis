import { db } from '../database/database.js';

export function createReservaTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      veiculo_id INTEGER NOT NULL,
      data_inicio TEXT NOT NULL,
      data_fim TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('RESERVADA','CANCELADA','FINALIZADA')) DEFAULT 'RESERVADA',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY(veiculo_id) REFERENCES veiculos(id)
    );
  `);
}
