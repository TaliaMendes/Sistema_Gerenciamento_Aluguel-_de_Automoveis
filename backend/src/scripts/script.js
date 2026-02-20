import 'dotenv/config';
import { db } from '../database/database.js';
import { initModels } from '../models/initModels.js';

initModels();
const veiculos = [
  {
    modelo: 'Range Rover Evoque',
    categoria: 'LUXO',
    preco_diaria: 450.00,
    imagem_url: '/uploads/veiculos/1771603666689-228709.png',
  },
  {
    modelo: 'VW Voyage',
    categoria: 'ECONOMICO',
    preco_diaria: 95.00,
    imagem_url: '/uploads/veiculos/1771604235644-845360.png',
  },
  {
    modelo: 'VW T-Cross',
    categoria: 'SUV',
    preco_diaria: 230.00,
    imagem_url: '/uploads/veiculos/1771604260611-747020.png',
  },
  {
    modelo: 'RAM Rampage',
    categoria: 'SUV',
    preco_diaria: 380.00,
    imagem_url: '/uploads/veiculos/1771604301707-474070.png',
  },
  {
    modelo: 'Nissan Kicks',
    categoria: 'SUV',
    preco_diaria: 210.00,
    imagem_url: '/uploads/veiculos/1771604341462-499470.png',
  },
  {
    modelo: 'Fiat Fastback',
    categoria: 'INTERMEDIARIO',
    preco_diaria: 220.00,
    imagem_url: '/uploads/veiculos/1771604366646-672811.png',
  },
  {
    modelo: 'Chevrolet Onix',
    categoria: 'ECONOMICO',
    preco_diaria: 110.00,
    imagem_url: '/uploads/veiculos/1771604386121-69025.png',
  },
  {
    modelo: 'Toyota Corolla',
    categoria: 'INTERMEDIARIO',
    preco_diaria: 200.00,
    imagem_url: '/uploads/veiculos/1771604413001-557265.png',
  },
  {
    modelo: 'Hyundai Creta',
    categoria: 'SUV',
    preco_diaria: 240.00,
    imagem_url: '/uploads/veiculos/1771604434121-500085.png',
  },
  {
    modelo: 'Fiat Toro',
    categoria: 'SUV',
    preco_diaria: 260.00,
    imagem_url: '/uploads/veiculos/1771610401109-801843.png',
  },
];

function scriptBD() {
  const insertVeiculo = db.prepare(`
    INSERT INTO veiculos (modelo, categoria, preco_diaria, status, imagem_url)
    VALUES (?, ?, ?, 'DISPONIVEL', ?)
  `);

  const transaction = db.transaction(() => {
    for (const v of veiculos) {
      insertVeiculo.run(v.modelo, v.categoria, v.preco_diaria, v.imagem_url);
    }
    console.log('Dados de teste inseridos com sucesso!');
  });

  transaction();
}

scriptBD();