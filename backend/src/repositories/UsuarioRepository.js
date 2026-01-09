import { db } from '../database/database.js';

export function buscarPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
}

export function criarUsuario({ nome, email, senha_hash, tipo = 'CLIENTE' }) {
  const usuario = db.prepare(`
    INSERT INTO usuarios (nome, email, senha_hash, tipo)
    VALUES (?, ?, ?, ?)
  `);

  const info = usuario.run(nome, email, senha_hash, tipo);
  return info.lastInsertRowid;
}

export function buscarPorId(id) {
  return db.prepare('SELECT id, nome, email, tipo FROM usuarios WHERE id = ?').get(id);
}