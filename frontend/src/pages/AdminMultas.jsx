import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { multaService } from '../services/multaService';
import { reservaService } from '../services/reservaService';
import { useAuth } from '../contexts/AuthContext';
import './Admin.css';

export function AdminMultas() {
  const navigate = useNavigate();
  const { adminCredentials, logoutAdmin } = useAuth();
  const [multas, setMultas] = useState([]);
  const [reservaId, setReservaId] = useState('');
  const [reservaBusca, setReservaBusca] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [novaMulta, setNovaMulta] = useState({ descricao: '', valor: '' });

  useEffect(() => {
    if (!adminCredentials.username) {
      navigate('/admin');
    }
  }, [adminCredentials]);

  const buscarReserva = async () => {
    if (!reservaId) {
      alert('Informe o ID da reserva.');
      return;
    }

    try {
      setLoading(true);
      const detalhes = await reservaService.detalhes(reservaId);
      setReservaBusca(detalhes);
      
      // Buscar multas da reserva
      const multasData = await multaService.listarPorReserva(reservaId);
      setMultas(multasData);
    } catch (err) {
      console.log(err);
      setReservaBusca(null);
      setMultas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarMulta = async (e) => {
    e.preventDefault();

    try {
      await multaService.registrar({
        reserva_id: Number(reservaId),
        descricao: novaMulta.descricao,
        valor: Number(novaMulta.valor),
      });
      
      // Recarregar multas
      const multasData = await multaService.listarPorReserva(reservaId);
      setMultas(multasData);
      
      // Limpar formulário
      setNovaMulta({ descricao: '', valor: '' });
      setShowForm(false);
    } catch (err) {
      console.log(err.response?.data?.message || 'Erro ao registrar multa.');
    }
  };

  const handleRemoverMulta = async (multaId) => {
    if (!window.confirm('Tem certeza que deseja remover esta multa?')) {
      return;
    }

    try {
      await multaService.remover(multaId);
      const multasData = await multaService.listarPorReserva(reservaId);
      setMultas(multasData);
    } catch (err) {
      console.log(err.response?.data?.message || 'Erro ao remover multa.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
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

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>RunCar - Gerenciar Multas</h1>
        <div className="header-actions">
          <span className="admin-badge">👤 {adminCredentials.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <Link to="/admin/dashboard" className="nav-link">
          Veículos
        </Link>
        <Link to="/admin/veiculos/novo" className="nav-link">
          + Novo Veículo
        </Link>
        <Link to="/admin/multas" className="nav-link active">
          Multas
        </Link>
      </nav>

      <div className="admin-content">

        <div className="search-section">
          <h2>Buscar Reserva</h2>
          <div className="search-form">
            <input
              type="number"
              placeholder="ID da Reserva"
              value={reservaId}
              onChange={(e) => setReservaId(e.target.value)}
            />
            <button onClick={buscarReserva} className="btn-primary">
              Buscar
            </button>
          </div>
        </div>

        {loading && <div className="loading">Carregando...</div>}

        {reservaBusca && (
          <div className="reserva-info-card">
            <h3>Detalhes da Reserva #{reservaBusca.reserva.id}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span>Cliente:</span>
                <strong>ID {reservaBusca.reserva.usuario_id}</strong>
              </div>
              <div className="info-item">
                <span>Veículo:</span>
                <strong>{reservaBusca.veiculo.modelo}</strong>
              </div>
              <div className="info-item">
                <span>Período:</span>
                <strong>
                  {formatarData(reservaBusca.reserva.data_inicio)} até{' '}
                  {formatarData(reservaBusca.reserva.data_fim)}
                </strong>
              </div>
              <div className="info-item">
                <span>Status:</span>
                <strong>{reservaBusca.reserva.status}</strong>
              </div>
              <div className="info-item">
                <span>Valor:</span>
                <strong>{formatarPreco(reservaBusca.resumo.valor_reserva)}</strong>
              </div>
              <div className="info-item">
                <span>Total Multas:</span>
                <strong>{formatarPreco(reservaBusca.resumo.total_multas)}</strong>
              </div>
            </div>

            <div className="multas-section">
              <div className="section-header">
                <h4>Multas Registradas</h4>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="btn-primary btn-sm"
                >
                  {showForm ? 'Cancelar' : '+ Nova Multa'}
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleRegistrarMulta} className="multa-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="descricao">Descrição *</label>
                      <input
                        type="text"
                        id="descricao"
                        value={novaMulta.descricao}
                        onChange={(e) =>
                          setNovaMulta({ ...novaMulta, descricao: e.target.value })
                        }
                        required
                        placeholder="Ex: Atraso na devolução"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="valor">Valor (R$) *</label>
                      <input
                        type="number"
                        id="valor"
                        value={novaMulta.valor}
                        onChange={(e) =>
                          setNovaMulta({ ...novaMulta, valor: e.target.value })
                        }
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="Ex: 100.00"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary btn-sm">
                    Registrar Multa
                  </button>
                </form>
              )}

              {multas.length === 0 ? (
                <p className="no-results">Nenhuma multa registrada para esta reserva.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multas.map((multa) => (
                      <tr key={multa.id}>
                        <td>{multa.id}</td>
                        <td>{multa.descricao}</td>
                        <td>{formatarPreco(multa.valor)}</td>
                        <td>{formatarData(multa.created_at)}</td>
                        <td>
                          <button
                            onClick={() => handleRemoverMulta(multa.id)}
                            className="btn-action btn-delete"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
