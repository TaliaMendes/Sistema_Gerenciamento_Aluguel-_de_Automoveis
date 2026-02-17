import api from './api';

export const reservaService = {
  async criar({ usuario_id, veiculo_id, data_inicio, data_fim }) {
    const response = await api.post('/runcar/reservas', {
      usuario_id,
      veiculo_id,
      data_inicio,
      data_fim,
    });
    return response.data;
  },
  async listarPorUsuario(usuario_id, { status } = {}) {
    const params = new URLSearchParams();
    params.append('usuario_id', usuario_id);
    if (status) params.append('status', status);

    const response = await api.get(`/runcar/reservas/usuarios?${params.toString()}`);
    return response.data;
  },
  async pagar(id, { metodo }) {
    const response = await api.post(`/runcar/reservas/${id}/pagamento`, {
      metodo,
    });
    return response.data;
  },

  async cancelar(id) {
    const response = await api.post(`/runcar/reservas/${id}/cancelar`);
    return response.data;
  },
  async finalizar(id) {
    const response = await api.post(`/runcar/reservas/${id}/finalizar`);
    return response.data;
  },
  async detalhes(id, usuario_id) {
    const params = new URLSearchParams();
    if (usuario_id) params.append('usuario_id', usuario_id);

    const response = await api.get(`/runcar/reservas/${id}/detalhes?${params.toString()}`);
    return response.data;
  },
};
