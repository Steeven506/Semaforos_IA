import api from './api';

const grupoService = {
  getAll: async () => {
    const response = await api.get('/grupos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/grupos/${id}`);
    return response.data;
  },

  getByIntersection: async (interseccion_id) => {
    const response = await api.get(`/grupos/interseccion/${interseccion_id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/grupos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/grupos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/grupos/${id}`);
    return response.data;
  },

  cambiarEstado: async (id, estado) => {
    const response = await api.post(`/grupos/${id}/estado`, { estado });
    return response.data;
  },

  activarModoAutomatico: async (id) => {
    const response = await api.post(`/grupos/${id}/automatico`);
    return response.data;
  },

  actualizarTiempos: async (id, tiempos) => {
    const response = await api.put(`/grupos/${id}/tiempos`, tiempos);
    return response.data;
  },
};

export default grupoService;