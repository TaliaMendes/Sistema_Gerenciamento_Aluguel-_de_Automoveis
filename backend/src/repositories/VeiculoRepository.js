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

//Listar veículos de acordo com suas características e status/ Listar todos veículos 
export function listarVeiculos({ categoria, precoMax, status } = {}) {
  let sql = 'SELECT * FROM veiculos WHERE 1=1';
  const params = {};

  if (status) {
    sql += ' AND status = @status';
    params.status = status;
  }

  if (categoria) {
    sql += ' AND categoria = @categoria';
    params.categoria = categoria;
  }

  if (precoMax !== undefined && precoMax !== null && precoMax !== '') {
    sql += ' AND preco_diaria <= @precoMax';
    params.precoMax = Number(precoMax);
  }

  sql += ' ORDER BY id DESC';

  return db.prepare(sql).all(params);
}

//listar veículos disponíveis com as determinadas características (Categoria e preço) / Listar todos disponíveis 
export function listarDisponiveis({ categoria, precoMax } = {}) {
  return listarVeiculos({ categoria, precoMax, status: 'DISPONIVEL' });
}

//Editar dados do veículo
export function atualizarVeiculo(id, {modelo, categoria, preco_diaria}){
  const veiculo = buscarVeiculoPorId(id);

  if(!veiculo) return false; 

  const novoModelo = modelo ?? veiculo.modelo;
  const novaCategoria = categoria ?? veiculo.categoria;
  const novoPreco = preco_diaria ?? veiculo.preco_diaria;

  const info = db.prepare(`
    UPDATE veiculos 
    SET modelo = ?, categoria = ?, preco_diaria = ?
    WHERE id = ?
  `) .run(novoModelo, novaCategoria, novoPreco, id);

  return info.changes > 0;
}


