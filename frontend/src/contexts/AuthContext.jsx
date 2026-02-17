import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });

  useEffect(() => {
    const storedUser = authService.obterUsuarioLocal();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const usuario = await authService.login({ email, senha });
    authService.salvarUsuarioLocal(usuario);
    setUser(usuario);
    return usuario;
  };

  const cadastrar = async (nome, email, senha) => {
    const usuario = await authService.cadastrar({ nome, email, senha });
    authService.salvarUsuarioLocal(usuario);
    setUser(usuario);
    return usuario;
  };

  const logout = () => {
    authService.removerUsuarioLocal();
    api.removerAuthAdmin();
    setUser(null);
    setAdminCredentials({ username: '', password: '' });
  };

  const loginAdmin = (username, password) => {
    api.interceptarAdmin(username, password);
    setAdminCredentials({ username, password });
  };

  const logoutAdmin = () => {
    api.removerAuthAdmin();
    setAdminCredentials({ username: '', password: '' });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.tipo === 'ADMIN',
    isAdminLogged: !!adminCredentials.username,
    login,
    cadastrar,
    logout,
    loginAdmin,
    logoutAdmin,
    adminCredentials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
