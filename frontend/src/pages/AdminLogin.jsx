import { useState } from 'react';
import {  useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      loginAdmin(username, password);
      const response = await fetch('http://localhost:3000/runcar/admin/veiculos', {
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        },
      });

      if (response.ok) {
        
        navigate('/admin/dashboard');
      } else if (response.status === 401 || response.status === 403) {
        alert('Credenciais de administrador inválidas. Acesso negado.');
      } else {
        alert('Erro ao acessar o painel de administração. Verifique suas credenciais.');
      }
    } catch (err) {
      console.log(err);
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>RunCar - Admin</h1>
        <p className="subtitle">Acesso restrito para administradores</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="admin123"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Entrando...' : 'Acessar Painel'}
          </button>
        </form>
        <p className="auth-link">
          <Link to="/login">Voltar para login de cliente</Link>
        </p>
      </div>
    </div>
  );
}
