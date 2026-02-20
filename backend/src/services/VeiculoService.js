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

export function criarVeiculos({ modelo, categoria, preco_diaria, status = 'DISPONIVEL', imagem_url = null }) {
  validarTexto('modelo', modelo);
  validarTexto('categoria', categoria);

  const preco = validarPreco(preco_diaria);
  validarStatus(status);

  return VeiculoRepository.criarVeiculo({
    modelo: modelo.trim(),
    categoria: categoria.trim(),
    preco_diaria: preco,
    status,
    imagem_url: imagem_url?.trim() || null,
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

//Função para administrador do sistema, editar dados do veículo
export function atualizarVeiculo(id, { modelo, categoria, preco_diaria, imagem_url }) {

  if (!Number.isInteger(id)) throw new Error('ID inválido.');

  const veiculo = VeiculoRepository.buscarVeiculoPorId(id);
  if (!veiculo) throw new Error('Veículo não encontrado.');

  // valida os parametros passados 
  if (modelo !== undefined) validarTexto('modelo', modelo);
  if (categoria !== undefined) validarTexto('categoria', categoria);

  let preco;
  if (preco_diaria !== undefined) preco = validarPreco(preco_diaria);

  const ok = VeiculoRepository.atualizarVeiculo(id, {
    modelo: modelo?.trim(),
    categoria: categoria?.trim(),
    preco_diaria: preco,
    imagem_url: imagem_url !== undefined ? (imagem_url?.trim() || null) : undefined,
  });

  return ok;
}

export function inativarVeiculo(id) {

  if (!Number.isInteger(id)) throw new Error('ID inválido.');

  const veiculo = VeiculoRepository.buscarVeiculoPorId(id);
  if (!veiculo) throw new Error('Veículo não encontrado.');

  if (veiculo.status === 'LOCADO') {
    throw new Error('Não é possível inativar um veículo locado.');
  }

  return VeiculoRepository.inativarVeiculo(id);
}