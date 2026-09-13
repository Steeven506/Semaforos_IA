import api from './api';

const detectionService = {
  getAll: async (limit = 100) => {
    const response = await api.get(`/detections?limit=${limit}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/detections/${id}`);
    return response.data;
  },

  getByCamera: async (camera_id, limit = 100) => {
    const response = await api.get(`/detections/camera/${camera_id}?limit=${limit}`);
    return response.data;
  },

  getByIntersection: async (interseccion_id, limit = 100) => {
    const response = await api.get(`/detections/interseccion/${interseccion_id}?limit=${limit}`);
    return response.data;
  },

  getByDateRange: async (start, end) => {
    const response = await api.get(`/detections/range?start=${start}&end=${end}`);
    return response.data;
  },

  getTodayStats: async (interseccion_id = null) => {
    const url = interseccion_id 
      ? `/detections/stats/today?interseccion_id=${interseccion_id}`
      : '/detections/stats/today';
    const response = await api.get(url);
    return response.data;
  },

  getHourlyStats: async (interseccion_id = null) => {
    const url = interseccion_id 
      ? `/detections/stats/hourly?interseccion_id=${interseccion_id}`
      : '/detections/stats/hourly';
    const response = await api.get(url);
    return response.data;
  },

  getSummary: async (interseccion_id = null) => {
    const url = interseccion_id 
      ? `/detections/stats/summary?interseccion_id=${interseccion_id}`
      : '/detections/stats/summary';
    const response = await api.get(url);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/detections', data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/detections/${id}`);
    return response.data;
  },

  deleteOld: async (days = 30) => {
    const response = await api.delete(`/detections/old?days=${days}`);
    return response.data;
  },
};

export default detectionService;