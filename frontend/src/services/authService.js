import api from './api';

export const authService = {
  async cadastrar({ nome, email, senha }) {
    const response = await api.post('/runcar/usuarios', {
      nome,
      email,
      senha,
    });
    return response.data;
  },
  async login({ email, senha }) {
    const response = await api.post('/runcar/usuarios/login', {
      email,
      senha,
    });
    return response.data;
  },
  async buscarUsuario(id) {
    const response = await api.get(`/runcar/usuarios/${id}`);
    return response.data;
  },
  salvarUsuarioLocal(usuario) {
    localStorage.setItem('runcar_user', JSON.stringify(usuario));
  },
  obterUsuarioLocal() {
    const user = localStorage.getItem('runcar_user');
    return user ? JSON.parse(user) : null;
  },
  removerUsuarioLocal() {
    localStorage.removeItem('runcar_user');
  },
  estaLogado() {
    return this.obterUsuarioLocal() !== null;
  },
  ehAdmin() {
    const user = this.obterUsuarioLocal();
    return user && user.tipo === 'ADMIN';
  },
};
