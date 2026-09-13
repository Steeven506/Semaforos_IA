import api from './api';

const faseService = {
  getAll: async () => {
    const response = await api.get('/fases');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/fases/${id}`);
    return response.data;
  },

  getBySemaforo: async (semaforo_id) => {
    const response = await api.get(`/fases/semaforo/${semaforo_id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/fases', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/fases/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/fases/${id}`);
    return response.data;
  },

  deleteBySemaforo: async (semaforo_id) => {
    const response = await api.delete(`/fases/semaforo/${semaforo_id}`);
    return response.data;
  },
};

export default faseService;