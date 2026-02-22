import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { veiculoService } from '../services/veiculoService';
import { useAuth } from '../contexts/AuthContext';
import { resolverImagemUrl } from '../utils/imageUtils';
import './Veiculos.css';

export function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ categoria: '', precoMax: '' });
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    try {
      setLoading(true);
      const data = await veiculoService.listarDisponiveis(filtros);
      setVeiculos(data);
    } catch (err) {
      console.log('Erro ao carregar veículos.', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    carregarVeiculos();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReservar = (veiculoId) => {
    if (isAuthenticated) {
      navigate(`/reservar/${veiculoId}`);
    } else {
      navigate('/login', { state: { from: `/reservar/${veiculoId}` } });
    }
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  return (
    <div className="veiculos-container">
      <div className="content-wrapper">
        <header className="veiculos-header">
          <h1><Link to="/" className="home-link">RunCar</Link> - Veículos Disponíveis</h1>
          <div className="user-info">
            {isAuthenticated ? (
              <>
                <span>Olá, {user?.nome}!</span>
                <Link to="/minhas-reservas" className="btn-secondary">
                  Minhas Reservas
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Entrar</Link>
                <Link to="/cadastro" className="btn-reservar">Cadastrar</Link>
              </>
            )}
          </div>
        </header>

        <div className="filtros-section">
          <form onSubmit={handleFiltrar} className="filtros-form">
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
              <label htmlFor="precoMax">Preço Máximo (R$)</label>
              <input
                type="number"
                id="precoMax"
                value={filtros.precoMax}
                onChange={(e) => setFiltros({ ...filtros, precoMax: e.target.value })}
                placeholder="Ex: 500"
                min="0"
              />
            </div>
            <button type="submit" className="btn-primary">
              Filtrar
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading">Carregando veículos...</div>
        ) : (
          <div className="veiculos-grid">
            {veiculos.length === 0 ? (
              <p className="no-results">Nenhum veículo disponível.</p>
            ) : (
              veiculos.map((veiculo) => (
                <div key={veiculo.id} className="veiculo-card">
                  <div className="veiculo-img">
                    {veiculo.imagem_url ? (
                      <img
                        src={resolverImagemUrl(veiculo.imagem_url)}
                        alt={veiculo.modelo}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="veiculo-img-fallback"
                      style={{ display: veiculo.imagem_url ? 'none' : 'flex' }}
                    >
                      🚗
                    </div>
                  </div>
                  <h3>{veiculo.modelo}</h3>
                  <p className="categoria">{veiculo.categoria}</p>
                  <p className="preco">{formatarPreco(veiculo.preco_diaria)}/dia</p>
                  <span className={`status-badge ${veiculo.status.toLowerCase()}`}>
                    {veiculo.status}
                  </span>
                  <button
                    onClick={() => handleReservar(veiculo.id)}
                    className="btn-reservar"
                    disabled={veiculo.status !== 'DISPONIVEL'}
                  >
                    Reservar
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}