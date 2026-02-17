import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { veiculoService } from '../services/veiculoService';
import { useAuth } from '../contexts/AuthContext';
import './Admin.css';

export function AdminVeiculoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminCredentials, logoutAdmin } = useAuth();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    modelo: '',
    categoria: '',
    preco_diaria: '',
    status: 'DISPONIVEL',
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!adminCredentials.username) {
      navigate('/admin');
      return;
    }

    if (isEdit) {
      carregarVeiculo();
    }
  }, [id, adminCredentials]);

  const carregarVeiculo = async () => {
    try {
      const veiculos = await veiculoService.listarTodos();
      const veiculo = veiculos.find((v) => v.id === Number(id));
      if (veiculo) {
        setFormData({
          modelo: veiculo.modelo,
          categoria: veiculo.categoria,
          preco_diaria: veiculo.preco_diaria,
          status: veiculo.status,
        });
      } else {
        alert('Veículo não encontrado.');
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logoutAdmin();
        navigate('/admin');
      } else {
        alert('Erro ao carregar veículo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        preco_diaria: Number(formData.preco_diaria),
      };

      if (isEdit) {
        await veiculoService.atualizar(id, data);
      } else {
        await veiculoService.criar(data);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.log(err.response?.data?.message || 'Erro ao salvar veículo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>RunCar - {isEdit ? 'Editar Veículo' : 'Novo Veículo'}</h1>
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
        <Link to="/admin/veiculos/novo" className="nav-link active">
          + Novo Veículo
        </Link>
        <Link to="/admin/multas" className="nav-link">
          Multas
        </Link>
      </nav>

      <div className="admin-content">
        <div className="form-card">

          <form onSubmit={handleSubmit} className="veiculo-form">
            <div className="form-group">
              <label htmlFor="modelo">Modelo *</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
                placeholder="Ex: Toyota Corolla 2024"
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoria *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="ECONOMICO">Econômico</option>
                <option value="INTERMEDIARIO">Intermediário</option>
                <option value="LUXO">Luxo</option>
                <option value="SUV">SUV</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preco_diaria">Preço por Dia (R$) *</label>
              <input
                type="number"
                id="preco_diaria"
                name="preco_diaria"
                value={formData.preco_diaria}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                placeholder="Ex: 150.00"
              />
            </div>

            {!isEdit && (
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <Link to="/admin/dashboard" className="btn-secondary">
                Cancelar
              </Link>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
