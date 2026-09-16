import api from './api';

const iaService = {
  analizarTrafico: async (interseccion_id, horas = 24) => {
    const response = await api.get(`/ia/analisis/${interseccion_id}?horas=${horas}`);
    return response.data;
  },

  tomarDecision: async (interseccion_id, grupo_id = null) => {
    const response = await api.post('/ia/decision', { interseccion_id, grupo_id });
    return response.data;
  },

  getDecisiones: async (interseccion_id) => {
    const response = await api.get(`/ia/decisiones/${interseccion_id}`);
    return response.data;
  },

  getEstadisticas: async (interseccion_id) => {
    const response = await api.get(`/ia/estadisticas/${interseccion_id}`);
    return response.data;
  },

  cambiarEstadoSemaforo: async (semaforo_id, estado) => {
    const response = await api.post('/ia/control/semaforo', { semaforo_id, estado });
    return response.data;
  },

  cambiarEstadoGrupo: async (grupo_id, estado) => {
    const response = await api.post('/ia/control/grupo', { grupo_id, estado });
    return response.data;
  },

  getEstadosSemaforos: async (interseccion_id) => {
    const response = await api.get(`/ia/estados/${interseccion_id}`);
    return response.data;
  },

  getEstadoGrupo: async (grupo_id) => {
    const response = await api.get(`/ia/estado-grupo/${grupo_id}`);
    return response.data;
  },

  getControlReciente: async (interseccion_id) => {
    const response = await api.get(`/ia/control-reciente/${interseccion_id}`);
    return response.data;
  },

  getReporte: async (interseccion_id, fecha = null) => {
    const url = fecha
      ? `/ia/reporte/${interseccion_id}?fecha=${fecha}`
      : `/ia/reporte/${interseccion_id}`;
    const response = await api.get(url);
    return response.data;
  },

  getReporteSemanal: async (interseccion_id) => {
    const response = await api.get(`/ia/reporte-semanal/${interseccion_id}`);
    return response.data;
  },

  getPrediccion: async (interseccion_id) => {
    const response = await api.get(`/ia/prediccion/${interseccion_id}`);
    return response.data;
  },

  getSugerencias: async (interseccion_id) => {
    const response = await api.get(`/ia/sugerencias/${interseccion_id}`);
    return response.data;
  },
};

export default iaService;