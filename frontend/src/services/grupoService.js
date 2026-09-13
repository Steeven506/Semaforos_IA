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

  getSincronizacion: async (interseccion_id) => {
    const response = await api.get(`/grupos/sincronizacion/${interseccion_id}`);
    return response.data;
  },

  createSincronizacion: async (data) => {
    const response = await api.post('/grupos/sincronizacion', data);
    return response.data;
  },

  deleteSincronizacion: async (id) => {
    const response = await api.delete(`/grupos/sincronizacion/${id}`);
    return response.data;
  },
};

export default grupoService;