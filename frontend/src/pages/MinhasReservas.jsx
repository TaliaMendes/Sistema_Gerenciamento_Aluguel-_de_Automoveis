import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reservaService } from '../services/reservaService';
import { multaService } from '../services/multaService';
import { useAuth } from '../contexts/AuthContext';
import './MinhasReservas.css';

export function MinhasReservas() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [multas, setMultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    carregarDados();
  }, [filtroStatus]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [reservasData, multasData] = await Promise.all([
        reservaService.listarPorUsuario(user.id, { status: filtroStatus || undefined }),
        multaService.listarPorUsuario(user.id),
      ]);
      setReservas(reservasData);
      setMultas(multasData);
    } catch (err) {
      console.log('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (reservaId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    try {
      await reservaService.cancelar(reservaId);
      carregarDados();
    } catch (err) {
      console.log('Erro ao cancelar reserva:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'RESERVADA':
        return 'status-reservada';
      case 'CANCELADA':
        return 'status-cancelada';
      case 'FINALIZADA':
        return 'status-finalizada';
      default:
        return '';
    }
  };

  const getPagamentoBadgeClass = (status) => {
    switch (status) {
      case 'PAGO':
        return 'pago';
      case 'PENDENTE':
        return 'pendente';
      case 'CANCELADO':
        return 'cancelado';
      default:
        return '';
    }
  };

  const totalMultas = multas.reduce((acc, m) => acc + Number(m.valor || 0), 0);

  return (
    <div className="minhas-reservas-container">
      <header className="page-header">
        <h1>Minhas Reservas</h1>
        <div className="header-actions">
          <Link to="/veiculos" className="btn-secondary">
            Ver Veículos
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </header>

      {multas.length > 0 && (
        <div className="alert alert-warning">
          Você possui {multas.length} multa(s) pendente(s). Total: {formatarPreco(totalMultas)}
        </div>
      )}

      <div className="filtros">
        <label htmlFor="filtroStatus">Filtrar por status:</label>
        <select
          id="filtroStatus"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="RESERVADA">Reservada</option>
          <option value="CANCELADA">Cancelada</option>
          <option value="FINALIZADA">Finalizada</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : reservas.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não tem reservas.</p>
          <Link to="/veiculos" className="btn-primary">
            Fazer uma Reserva
          </Link>
        </div>
      ) : (
        <div className="reservas-list">
          {reservas.map((reserva) => (
            <div key={reserva.id} className="reserva-card">
              <div className="reserva-header">
                <h3>Reserva #{reserva.id}</h3>
                <span className={`status-badge ${getStatusBadgeClass(reserva.status)}`}>
                  {reserva.status}
                </span>
              </div>

              <div className="reserva-details">
                <div className="detail-row">
                  <span>Veículo:</span>
                  <strong>{reserva.veiculo_modelo}</strong>
                </div>
                <div className="detail-row">
                  <span>Período:</span>
                  <strong>
                    {formatarData(reserva.data_inicio)} até {formatarData(reserva.data_fim)}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Valor:</span>
                  <strong>{formatarPreco(reserva.pagamento_valor)}</strong>
                </div>
                <div className="detail-row">
                  <span>Pagamento:</span>
                  <span className={`pagamento-badge ${getPagamentoBadgeClass(reserva.pagamento_status)}`}>
                    {reserva.pagamento_status}
                  </span>
                </div>
                {reserva.pagamento_metodo && (
                  <div className="detail-row">
                    <span>Método:</span>
                    <strong>{reserva.pagamento_metodo}</strong>
                  </div>
                )}
              </div>

              {reserva.status === 'RESERVADA' && reserva.pagamento_status === 'PENDENTE' && (
                <div className="reserva-actions">
                  <button
                    onClick={() => navigate(`/pagamento/${reserva.id}`)}
                    className="btn-primary btn-sm"
                  >
                    Pagar
                  </button>
                  <button
                    onClick={() => handleCancelar(reserva.id)}
                    className="btn-danger btn-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
