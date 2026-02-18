import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { veiculoService } from '../services/veiculoService';
import { reservaService } from '../services/reservaService';
import { useAuth } from '../contexts/AuthContext';
import './Reservar.css';

export function Reservar() {
  const { veiculoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [veiculo, setVeiculo] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    carregarVeiculo();
  }, [veiculoId]);

  useEffect(() => {
    if (dataInicio && dataFim && veiculo) {
      calcularResumo();
    }
  }, [dataInicio, dataFim, veiculo]);

  const carregarVeiculo = async () => {
    try {
      const veiculos = await veiculoService.listarDisponiveis();
      const v = veiculos.find((v) => v.id === Number(veiculoId));
      if (v) {
        setVeiculo(v);
      } else {
        console.log('Veículo não encontrado ou indisponível.');
      }
    } catch (err) {
      console.log('Erro ao carregar veículo:', err);
    } finally {
      setLoading(false);
    }
  };

  const calcularResumo = () => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffTime = fim - inicio;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > 0) {
      const valorTotal = diffDays * veiculo.preco_diaria;
      setResumo({
        dias: diffDays,
        valorTotal,
      });
    } else {
      setResumo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await reservaService.criar({
        usuario_id: user.id,
        veiculo_id: Number(veiculoId),
        data_inicio: dataInicio,
        data_fim: dataFim,
      });
      navigate(`/pagamento/${result.reservaId}`);
    } catch (err) {
      console.log('Erro ao criar reserva:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!veiculo) {
    return (
      <div className="reservar-container">
        <button onClick={() => navigate('/veiculos')} className="btn-secondary">
          Voltar para veículos
        </button>
      </div>
    );
  }

  return (
    <div className="reservar-container">
      <h1>Reservar Veículo</h1>

      <div className="veiculo-info">
        <h2>{veiculo.modelo}</h2>
        <p>Categoria: {veiculo.categoria}</p>
        <p>Preço: {formatarPreco(veiculo.preco_diaria)}/dia</p>
      </div>


      <form onSubmit={handleSubmit} className="reserva-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dataInicio">Data de Retirada</label>
            <input
              type="date"
              id="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dataFim">Data de Devolução</label>
            <input
              type="date"
              id="dataFim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              required
              min={dataInicio || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {resumo && (
          <div className="resumo-box">
            <h3>Resumo da Reserva</h3>
            <p>Quantidade de dias: {resumo.dias}</p>
            <p className="valor-total">Valor Total: {formatarPreco(resumo.valorTotal)}</p>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/veiculos')}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !resumo}
            className="btn-primary"
          >
            {submitting ? 'Processando...' : 'Continuar para Pagamento'}
          </button>
        </div>
      </form>
    </div>
  );
}
