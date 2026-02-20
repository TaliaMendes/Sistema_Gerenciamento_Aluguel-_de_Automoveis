import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { veiculoService } from '../services/veiculoService';
import { useAuth } from '../contexts/AuthContext';
import './Admin.css';

const API_BASE = 'http://localhost:3000';

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
    imagem_url: '',
  });
  const [imagemArquivo, setImagemArquivo] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [imagemOrigem, setImagemOrigem] = useState('arquivo'); 
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

  useEffect(() => {
    return () => {
      if (imagemPreview && imagemPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagemPreview);
      }
    };
  }, [imagemPreview]);

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
          imagem_url: veiculo.imagem_url || '',
        });
        if (veiculo.imagem_url) {
          const src = veiculo.imagem_url.startsWith('/')
            ? `${API_BASE}${veiculo.imagem_url}`
            : veiculo.imagem_url;
          setImagemPreview(src);
          setImagemOrigem(veiculo.imagem_url.startsWith('/') ? 'arquivo' : 'url');
        }
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
        modelo: formData.modelo,
        categoria: formData.categoria,
        preco_diaria: Number(formData.preco_diaria),
        status: formData.status,
      };

      if (imagemOrigem === 'arquivo' && imagemArquivo) {
        data.imagem = imagemArquivo;
      } else if (imagemOrigem === 'url' && formData.imagem_url.trim()) {
        data.imagem_url = formData.imagem_url.trim();
      }

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagemArquivo(file);
    const previewUrl = URL.createObjectURL(file);
    setImagemPreview(previewUrl);
  };

  const handleRemoverImagem = () => {
    setImagemArquivo(null);
    setImagemPreview(null);
    setFormData((prev) => ({ ...prev, imagem_url: '' }));
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

            <div className="form-group">
              <label>Imagem do Veículo</label>

              <div className="imagem-origem-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${imagemOrigem === 'arquivo' ? 'active' : ''}`}
                  onClick={() => setImagemOrigem('arquivo')}
                >
                  📁 Enviar arquivo
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${imagemOrigem === 'url' ? 'active' : ''}`}
                  onClick={() => setImagemOrigem('url')}
                >
                  🔗 Colar URL
                </button>
              </div>

              {imagemOrigem === 'arquivo' ? (
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="file-input"
                />
              ) : (
                <input
                  type="url"
                  name="imagem_url"
                  value={formData.imagem_url}
                  onChange={(e) => {
                    handleChange(e);
                    setImagemPreview(e.target.value);
                  }}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              )}

              <small className="form-hint">
                Formatos aceitos: JPG, PNG, WebP, GIF (máx. 5 MB)
              </small>

              {imagemPreview && (
                <div className="imagem-preview">
                  <img
                    src={imagemPreview}
                    alt="Preview do veículo"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    onLoad={(e) => { e.target.style.display = 'block'; }}
                  />
                  <button
                    type="button"
                    className="btn-remover-imagem"
                    onClick={handleRemoverImagem}
                  >
                    ✕ Remover
                  </button>
                </div>
              )}
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
