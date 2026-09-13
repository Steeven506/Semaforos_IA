import api from './api';

const iaService = {
  getSugerencias: async (interseccion_id) => {
    const response = await api.get(`/ia/sugerencias/${interseccion_id}`);
    return response.data;
  },

  getReporte: async (interseccion_id, fecha = null) => {
    const url = fecha
      ? `/ia/reporte/${interseccion_id}?fecha=${fecha}`
      : `/ia/reporte/${interseccion_id}`;
    const response = await api.get(url);
    return response.data;
  },

  getPrediccion: async (interseccion_id) => {
    const response = await api.get(`/ia/prediccion/${interseccion_id}`);
    return response.data;
  },

  getDecisiones: async (interseccion_id) => {
    const response = await api.get(`/ia/decisiones/${interseccion_id}`);
    return response.data;
  },

  getReporteSemanal: async (interseccion_id) => {
    const response = await api.get(`/ia/reporte-semanal/${interseccion_id}`);
    return response.data;
  },

  createDecision: async (data) => {
    const response = await api.post('/ia/decision', data);
    return response.data;
  },
};

export default iaService;