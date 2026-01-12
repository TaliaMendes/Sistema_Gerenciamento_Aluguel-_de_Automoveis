import * as ReservaRepository from '../repositories/ReservaRepository.js';
import * as VeiculoRepository from '../repositories/VeiculoRepository.js';

function validarId(nome, id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`${nome} inválido.`);
  return n;
}

// Aceita no formato YYYY-MM-DD 
function validarData(campo, data) {
  //validar o formato da data 
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new Error(`${campo} deve estar no formato YYYY-MM-DD.`);
  }

  // validar se a data enviada realmente existe
  const d = new Date(`${data}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`${campo} inválida.`);
 
  const [y, m, day] = data.split('-').map(Number);
  if (d.getUTCFullYear() !== y || d.getUTCMonth() + 1 !== m || d.getUTCDate() !== day) {
    throw new Error(`${campo} inválida.`);
  }

  return data;
}

function diasReserva(dataInicio, dataFim) {
  const start = new Date(`${dataInicio}T00:00:00Z`);
  const end = new Date(`${dataFim}T00:00:00Z`);
  const diffMs = end.getTime() - start.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDias + 1; 
}

export function criarReserva({ usuario_id, veiculo_id, data_inicio, data_fim }) {
  const usuarioId = validarId('usuario_id', usuario_id);
  const veiculoId = validarId('veiculo_id', veiculo_id);

  const inicio = validarData('data_inicio', data_inicio);
  const fim = validarData('data_fim', data_fim);

  const dias = diasReserva(inicio, fim);
  if (dias <= 0) throw new Error('data_fim deve ser maior ou igual a data_inicio.');

  const veiculo = VeiculoRepository.buscarVeiculoPorId(veiculoId);

  if (!veiculo) throw new Error('Veículo não encontrado.');
  if (veiculo.status === 'INATIVO') throw new Error('Veículo inativo.');
  if (veiculo.status === 'LOCADO') throw new Error('Veículo indisponível (locado).');

  const conflito = ReservaRepository.reservaConflito(veiculoId, inicio, fim);
  if (conflito) throw new Error('Já existe uma reserva para este veículo no período selecionado.');

  const valorTotal = Number(veiculo.preco_diaria) * dias;

  const reservaId = ReservaRepository.criarReserva({
    usuario_id: usuarioId,
    veiculo_id: veiculoId,
    data_inicio: inicio,
    data_fim: fim,
    pagamento_valor: valorTotal
  });

  return { reservaId, valorTotal, dias };
}