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

  async criar({ modelo, categoria, preco_diaria, status = 'DISPONIVEL', imagem_url = null, imagem = null }) {
    const formData = new FormData();
    formData.append('modelo', modelo);
    formData.append('categoria', categoria);
    formData.append('preco_diaria', preco_diaria);
    formData.append('status', status);

    if (imagem) {
      formData.append('imagem', imagem); // arquivo
    } else if (imagem_url) {
      formData.append('imagem_url', imagem_url); // URL externa
    }

    const response = await api.post('/runcar/admin/veiculos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async atualizar(id, { modelo, categoria, preco_diaria, imagem_url, imagem }) {
    const formData = new FormData();
    if (modelo) formData.append('modelo', modelo);
    if (categoria) formData.append('categoria', categoria);
    if (preco_diaria) formData.append('preco_diaria', preco_diaria);

    if (imagem) {
      formData.append('imagem', imagem);
    } else if (imagem_url !== undefined) {
      formData.append('imagem_url', imagem_url || '');
    }

    const response = await api.put(`/runcar/admin/veiculos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async inativar(id) {
    const response = await api.patch(`/runcar/admin/veiculos/${id}`);
    return response.data;
  },
};