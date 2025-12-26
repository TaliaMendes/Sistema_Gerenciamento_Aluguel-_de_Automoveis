import * as VeiculoRepository from '../repositories/VeiculoRepository.js'

const STATUS_VALIDOS = new Set(['DISPONIVEL', 'LOCADO', 'INATIVO']);

function validarTexto(nomeCampo, valor) {
  if (!valor || typeof valor !== 'string' || !valor.trim()) {
    throw new Error(`${nomeCampo} é obrigatório.`);
  }
}

function validarPreco(valor) {
  const n = Number(valor);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error('preco_diaria deve ser um número maior que 0.');
  }
  return n;
}

function validarStatus(status) {
  if (!STATUS_VALIDOS.has(status)) {
    throw new Error(`status inválido. Use: ${Array.from(STATUS_VALIDOS).join(', ')}`);
  }
}

//Função para administrador do sistema, cadastrar veículos 
export function criarVeiculos({ modelo, categoria, preco_diaria, status = 'DISPONIVEL' }) {
  validarTexto('modelo', modelo);
  validarTexto('categoria', categoria);

  const preco = validarPreco(preco_diaria);
  validarStatus(status);

  return VeiculoRepository.criarVeiculo({
    modelo: modelo.trim(),
    categoria: categoria.trim(),
    preco_diaria: preco,
    status
  });
}

//Função para administrador do sistema , pode buscar todos veículos, mas tambem pode buscar por caracteríticas 
export function listarAdmin({ categoria, precoMax, status } = {}) {
  if (status) validarStatus(status);
  return VeiculoRepository.listarVeiculos({ categoria, precoMax, status });
}

//Função para usuários, filtra características mas somente os disponíveis  
export function listarDisponiveis({ categoria, precoMax } = {}) {
  return VeiculoRepository.listarDisponiveis({ categoria, precoMax });
}





