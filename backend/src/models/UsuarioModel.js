import { db } from '../database/database.js';

export function createUsuarioTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('CLIENTE','ADMIN'))
    );
  `);
}
