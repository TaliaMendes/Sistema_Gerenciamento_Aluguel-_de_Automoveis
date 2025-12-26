import { db } from '../database/database.js';

//Inserir um novo veículo no banco 
export function criarVeiculo({ modelo, categoria, preco_diaria, status = 'DISPONIVEL' }) {
  const insertVeiculo = db.prepare(`
    INSERT INTO veiculos (modelo, categoria, preco_diaria, status)
    VALUES (?, ?, ?, ?)
  `);

  const veiculo = insertVeiculo.run(modelo, categoria, preco_diaria, status);
  return veiculo.lastInsertRowid;
}

//Buscar o veiculo pelo seu Id
export function buscarVeiculoPorId(id) {
  return db.prepare('SELECT * FROM veiculos WHERE id = ?').get(id);
}

