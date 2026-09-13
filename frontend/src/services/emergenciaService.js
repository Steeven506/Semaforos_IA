import api from './api';

const emergenciaService = {
  getAll: async () => {
    const response = await api.get('/emergencias');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/emergencias/${id}`);
    return response.data;
  },

  getActivas: async () => {
    const response = await api.get('/emergencias/activas');
    return response.data;
  },

  getByIntersection: async (interseccion_id) => {
    const response = await api.get(`/emergencias/interseccion/${interseccion_id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/emergencias', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/emergencias/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/emergencias/${id}`);
    return response.data;
  },
};

export default emergenciaService;