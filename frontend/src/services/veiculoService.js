import api from './api';

export const veiculoService = {
  async listarDisponiveis({ categoria, precoMax } = {}) {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (precoMax) params.append('precoMax', precoMax);

    const response = await api.get(`/runcar/veiculos?${params.toString()}`);
    return response.data;
  },

  async listarTodos({ categoria, precoMax, status } = {}) {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (precoMax) params.append('precoMax', precoMax);
    if (status) params.append('status', status);

    const response = await api.get(`/runcar/admin/veiculos?${params.toString()}`);
    return response.data;
  },

  async criar({ modelo, categoria, preco_diaria, status = 'DISPONIVEL' }) {
    const response = await api.post('/runcar/admin/veiculos', {
      modelo,
      categoria,
      preco_diaria,
      status,
    });
    return response.data;
  },
  async atualizar(id, { modelo, categoria, preco_diaria }) {
    const response = await api.put(`/runcar/admin/veiculos/${id}`, {
      modelo,
      categoria,
      preco_diaria,
    });
    return response.data;
  },
  async inativar(id) {
    const response = await api.patch(`/runcar/admin/veiculos/${id}`);
    return response.data;
  },
};
