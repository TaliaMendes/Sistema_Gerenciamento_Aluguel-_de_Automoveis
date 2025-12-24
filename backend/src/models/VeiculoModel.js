import { db } from '../database/database.js';

export function createVeiculoTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      modelo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      preco_diaria REAL NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('DISPONIVEL','LOCADO','INATIVO')) DEFAULT 'DISPONIVEL'
    );
  `);
}
