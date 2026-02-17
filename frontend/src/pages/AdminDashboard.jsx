import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { veiculoService } from '../services/veiculoService';
import { useAuth } from '../contexts/AuthContext';
import './Admin.css';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logoutAdmin, adminCredentials } = useAuth();
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ categoria: '', status: '' });

  useEffect(() => {
    if (!adminCredentials.username) {
      navigate('/admin');
      return;
    }
    carregarVeiculos();
  }, [filtros, adminCredentials]);

  const carregarVeiculos = async () => {
    try {
      setLoading(true);
      const data = await veiculoService.listarTodos(filtros);
      setVeiculos(data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Sessão expirada. Faça login novamente.');
        logoutAdmin();
        navigate('/admin');
      } else {
        alert('Erro ao carregar veículos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInativar = async (id) => {
    if (!window.confirm('Tem certeza que deseja inativar este veículo?')) {
      return;
    }

    try {
      await veiculoService.inativar(id);
      carregarVeiculos();
    } catch (err) {
      console.log(err.response?.data?.message || 'Erro ao inativar veículo.');
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'status-disponivel';
      case 'LOCADO':
        return 'status-locado';
      case 'INATIVO':
        return 'status-inativo';
      default:
        return '';
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>RunCar - Painel Administrativo</h1>
        <div className="header-actions">
          <span className="admin-badge">👤 {adminCredentials.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <Link to="/admin/dashboard" className="nav-link active">
          Veículos
        </Link>
        <Link to="/admin/veiculos/novo" className="nav-link">
          + Novo Veículo
        </Link>
        <Link to="/admin/multas" className="nav-link">
          Multas
        </Link>
      </nav>

      <div className="admin-content">
        <div className="filtros-section">
          <div className="filtros-form">
            <div className="filtro-group">
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                value={filtros.categoria}
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              >
                <option value="">Todas</option>
                <option value="ECONOMICO">Econômico</option>
                <option value="INTERMEDIARIO">Intermediário</option>
                <option value="LUXO">Luxo</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
            <div className="filtro-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={filtros.status}
                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="DISPONIVEL">Disponível</option>
                <option value="LOCADO">Locado</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Modelo</th>
                  <th>Categoria</th>
                  <th>Preço/Dia</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-results">
                      Nenhum veículo encontrado.
                    </td>
                  </tr>
                ) : (
                  veiculos.map((veiculo) => (
                    <tr key={veiculo.id}>
                      <td>{veiculo.id}</td>
                      <td>{veiculo.modelo}</td>
                      <td>{veiculo.categoria}</td>
                      <td>{formatarPreco(veiculo.preco_diaria)}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(veiculo.status)}`}>
                          {veiculo.status}
                        </span>
                      </td>
                      <td className="actions">
                        <Link
                          to={`/admin/veiculos/editar/${veiculo.id}`}
                          className="btn-action btn-edit"
                        >
                          Editar
                        </Link>
                        {veiculo.status !== 'INATIVO' && veiculo.status !== 'LOCADO' && (
                          <button
                            onClick={() => handleInativar(veiculo.id)}
                            className="btn-action btn-disable"
                          >
                            Inativar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
