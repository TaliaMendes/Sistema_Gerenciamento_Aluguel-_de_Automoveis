import api from './api';

export const multaService = {
  async registrar({ reserva_id, descricao, valor }) {
    const response = await api.post('/runcar/admin/multas', {
      reserva_id,
      descricao,
      valor,
    });
    return response.data;
  },
  async listarPorReserva(reservaId) {
    const response = await api.get(`/runcar/multas/reserva/${reservaId}`);
    return response.data;
  },
  async listarPorUsuario(usuario_id) {
    const response = await api.get(`/runcar/multas/usuarios/${usuario_id}`);
    return response.data;
  },
  async remover(id) {
    const response = await api.delete(`/runcar/admin/multas/${id}`);
    return response.data;
  },
};
