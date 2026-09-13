import api from './api';

const cameraService = {
  getAll: async () => {
    const response = await api.get('/cameras');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cameras/${id}`);
    return response.data;
  },

  getByIntersection: async (interseccion_id) => {
    const response = await api.get(`/cameras/interseccion/${interseccion_id}`);
    return response.data;
  },

  getBySensor: async (sensor_id) => {
    const response = await api.get(`/cameras/sensor/${sensor_id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/cameras', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/cameras/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cameras/${id}`);
    return response.data;
  },
};

export default cameraService;