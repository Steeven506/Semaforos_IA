import api from './api';

const semaforoService = {
  getAll: async () => {
    const response = await api.get('/semaforos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/semaforos/${id}`);
    return response.data;
  },

  getByIntersection: async (interseccion_id) => {
    const response = await api.get(`/semaforos/intersection/${interseccion_id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/semaforos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/semaforos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/semaforos/${id}`);
    return response.data;
  },
};

export default semaforoService;