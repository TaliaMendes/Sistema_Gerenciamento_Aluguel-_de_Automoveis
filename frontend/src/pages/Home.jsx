import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { veiculoService } from "../services/veiculoService";
import { useAuth } from "../contexts/AuthContext";
import { resolverImagemUrl } from "../utils/imageUtils";
import "./Home.css";

export function Home() {
  const [veiculos, setVeiculos] = useState([]);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    veiculoService
      .listarDisponiveis({})
      .then((data) => setVeiculos(data.slice(0, 4)))
      .catch(() => setVeiculos([]))
      .finally(() => setLoadingVeiculos(false));
  }, []);

  const formatarPreco = (preco) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);

  const handleReservar = (veiculoId) => {
    if (isAuthenticated) {
      navigate(`/reservar/${veiculoId}`);
    } else {
      navigate("/login", { state: { from: `/reservar/${veiculoId}` } });
    }
  };

  return (
    <div className="home-container">
      <div className="home-wrapper">
        <header className="home-header">
          <div>
            <h1>RunCar</h1>
            <p>Sistema de gerenciamento e reserva de veículos</p>
          </div>
          <div className="home-actions">
            {isAuthenticated ? (
              <>
                <span className="home-greeting">Olá, <strong>{user?.nome}</strong>!</span>
                <Link to="/veiculos" className="btn-secondary">Veículos</Link>
                <Link to="/minhas-reservas" className="btn-secondary">Minhas Reservas</Link>
                <button onClick={() => { logout(); navigate('/'); }} className="btn-logout">Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Entrar</Link>
                <Link to="/cadastro" className="btn-reservar home-btn-primary">Cadastrar</Link>
              </>
            )}
          </div>
        </header>

        <main className="home-main">
          <section className="home-hero">
            <div className="home-hero-content">
              <h2>Sua jornada começa com o carro <span className="home-accent">perfeito</span></h2>
              <p>
                Alugue veículos de qualidade com a melhor experiência.
                Desde compactos econômicos até luxuosos SUVs.
              </p>
              <div className="home-hero-actions">
                <Link to="/veiculos" className="btn-reservar home-btn-primary">
                  Ver todos os veículos
                </Link>
                <Link to="/cadastro" className="btn-secondary">
                  Criar conta
                </Link>
              </div>
            </div>
            <div className="home-hero-emoji" aria-hidden="true">🚗</div>
          </section>
          <section className="home-features">
            <div className="home-feature-card">
              <div className="home-feature-icon">🛡️</div>
              <div>
                <h3>Segurança Total</h3>
                <p>Todos os veículos passam por rigorosa inspeção antes de cada locação.</p>
              </div>
            </div>
            <div className="home-feature-card">
              <div className="home-feature-icon">⚡</div>
              <div>
                <h3>Processo Rápido</h3>
                <p>Reserve online em minutos e retire seu veículo sem burocracia.</p>
              </div>
            </div>
            <div className="home-feature-card">
              <div className="home-feature-icon">⭐</div>
              <div>
                <h3>Qualidade Premium</h3>
                <p>Frota moderna e bem mantida para sua melhor experiência.</p>
              </div>
            </div>
          </section>
          <section className="home-section">
            <div className="home-section-header">
              <h3>Veículos em <span className="home-accent">Destaque</span></h3>
              <p>Confira nossa seleção disponível para locação.</p>
            </div>

            {loadingVeiculos ? (
              <div className="loading">Carregando veículos...</div>
            ) : veiculos.length === 0 ? (
              <p className="no-results">Nenhum veículo disponível no momento.</p>
            ) : (
              <div className="home-veiculos-grid">
                {veiculos.map((veiculo) => (
                  <div key={veiculo.id} className="home-veiculo-card">
                    <div className="home-veiculo-img">
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
                        className="home-veiculo-img-fallback"
                        style={{ display: veiculo.imagem_url ? 'none' : 'flex' }}
                      >
                        🚗
                      </div>
                      <span className="home-veiculo-categoria">{veiculo.categoria}</span>
                    </div>
                    <div className="home-veiculo-info">
                      <h4>{veiculo.modelo}</h4>
                    </div>
                    <div className="home-veiculo-bottom">
                      <span className="home-veiculo-preco">
                        {formatarPreco(veiculo.preco_diaria)}
                        <small>/dia</small>
                      </span>
                      <button
                        className="btn-reservar"
                        onClick={() => handleReservar(veiculo.id)}
                        disabled={veiculo.status !== "DISPONIVEL"}
                      >
                        Reservar
                      </button>
                    </div>
                    {!isAuthenticated && (
                      <p className="home-veiculo-hint">Login necessário para reservar</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="home-ver-mais">
              <Link to="/veiculos" className="btn-secondary">
                Ver todos os veículos →
              </Link>
            </div>
          </section>

          <section className="home-section home-section-alt">
            <div className="home-section-header">
              <h3>Como usar</h3>
            </div>
            <div className="home-steps">
              <div className="home-step">
                <span className="home-step-num">1</span>
                <div>
                  <strong>Entrar / Cadastrar</strong>
                  <p>Crie uma conta ou faça login para acessar todas as funcionalidades.</p>
                </div>
              </div>
              <div className="home-step">
                <span className="home-step-num">2</span>
                <div>
                  <strong>Consultar veículos</strong>
                  <p>Use os filtros de categoria e preço para encontrar a opção ideal.</p>
                </div>
              </div>
              <div className="home-step">
                <span className="home-step-num">3</span>
                <div>
                  <strong>Reservar</strong>
                  <p>Selecione um veículo disponível e finalize sua reserva em segundos.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="home-cta">
            <h3>Pronto para sua próxima aventura?</h3>
            <p>Crie sua conta e aproveite a melhor experiência de locação.</p>
            <div className="home-cta-actions">
              <Link to="/cadastro" className="btn-reservar home-btn-primary">
                Começar agora
              </Link>
              <Link to="/veiculos" className="btn-secondary">
                Explorar veículos
              </Link>
            </div>
          </section>

        </main>

        <footer className="home-footer">
          <p>© 2024 RunCar</p>
        </footer>
      </div>
    </div>
  );
}