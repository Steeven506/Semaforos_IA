import api from './api';

const intersectionService = {
  getAll: async () => {
    const response = await api.get('/intersections');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/intersections/${id}`);
    return response.data;
  },

  getMyIntersections: async () => {
    const response = await api.get('/intersections/my');
    return response.data;
  },

  getStats: async (id) => {
    const response = await api.get(`/intersections/${id}/stats`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/intersections', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/intersections/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/intersections/${id}`);
    return response.data;
  },
};

export default intersectionService;