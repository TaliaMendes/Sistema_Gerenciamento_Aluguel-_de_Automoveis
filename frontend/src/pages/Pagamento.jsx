import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reservaService } from '../services/reservaService';
import { useAuth } from '../contexts/AuthContext';
import './Pagamento.css';

export function Pagamento() {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [detalhes, setDetalhes] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carregarDetalhes();
  }, [reservaId]);

  const carregarDetalhes = async () => {
    try {
      const data = await reservaService.detalhes(reservaId, user.id);
      setDetalhes(data);
    } catch (err) {
      console.log('Erro ao carregar detalhes da reserva:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await reservaService.pagar(reservaId, { metodo: metodoPagamento });
      navigate('/minhas-reservas');
    } catch (err) {
      console.log('Erro ao processar pagamento:', err);
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

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    return new Date(dataStr).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!detalhes) {
    return (
      <div className="pagamento-container">
        <button onClick={() => navigate('/veiculos')} className="btn-secondary">
          Voltar para veículos
        </button>
      </div>
    );
  }

  return (
    <div className="pagamento-container">
      <h1>Pagamento da Reserva</h1>

      <div className="reserva-summary">
        <h2>Detalhes da Reserva #{detalhes.reserva.id}</h2>
        <div className="info-grid">
          <div className="info-item">
            <span>Veículo:</span>
            <strong>{detalhes.veiculo.modelo}</strong>
          </div>
          <div className="info-item">
            <span>Categoria:</span>
            <strong>{detalhes.veiculo.categoria}</strong>
          </div>
          <div className="info-item">
            <span>Período:</span>
            <strong>
              {formatarData(detalhes.reserva.data_inicio)} até{' '}
              {formatarData(detalhes.reserva.data_fim)}
            </strong>
          </div>
          <div className="info-item">
            <span>Valor:</span>
            <strong>{formatarPreco(detalhes.resumo.valor_reserva)}</strong>
          </div>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="pagamento-form">
        <h3>Selecione o método de pagamento</h3>
        <div className="metodos-pagamento">
          <label className={`metodo-option ${metodoPagamento === 'PIX' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="metodo"
              value="PIX"
              checked={metodoPagamento === 'PIX'}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              required
            />
            <span className="metodo-icon">📱</span>
            <span className="metodo-label">PIX</span>
          </label>

          <label className={`metodo-option ${metodoPagamento === 'CREDITO' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="metodo"
              value="CREDITO"
              checked={metodoPagamento === 'CREDITO'}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            />
            <span className="metodo-icon">💳</span>
            <span className="metodo-label">Cartão de Crédito</span>
          </label>

          <label className={`metodo-option ${metodoPagamento === 'DEBITO' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="metodo"
              value="DEBITO"
              checked={metodoPagamento === 'DEBITO'}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            />
            <span className="metodo-icon">💳</span>
            <span className="metodo-label">Cartão de Débito</span>
          </label>
        </div>

        <div className="total-section">
          <p>Total a pagar:</p>
          <h2>{formatarPreco(detalhes.resumo.valor_reserva)}</h2>
        </div>

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
            disabled={submitting || !metodoPagamento}
            className="btn-primary btn-pagar"
          >
            {submitting ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
        </div>
      </form>
    </div>
  );
}
