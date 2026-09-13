import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import iaService from '../services/iaService';
import intersectionService from '../services/intersectionService';
import Header from '../components/layout/Header';
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb,
  BarChart3, Clock, Target, Zap, RefreshCw, Activity
} from 'lucide-react';

function IA() {
  const { isAdmin } = useAuth();
  const [intersections, setIntersections] = useState([]);
  const [selectedIntersection, setSelectedIntersection] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
  const [prediccion, setPrediccion] = useState([]);
  const [reporte, setReporte] = useState(null);
  const [decisiones, setDecisiones] = useState([]);
  const [reporteSemanal, setReporteSemanal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadIntersections();
  }, []);

  useEffect(() => {
    if (selectedIntersection) {
      loadData();
    }
  }, [selectedIntersection]);

  const loadIntersections = async () => {
    try {
      const data = await intersectionService.getAll();
      setIntersections(data);
      if (data.length > 0) {
        setSelectedIntersection(data[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sugRes, predRes, repRes, decRes, semRes] = await Promise.all([
        iaService.getSugerencias(selectedIntersection).catch(() => []),
        iaService.getPrediccion(selectedIntersection).catch(() => []),
        iaService.getReporte(selectedIntersection).catch(() => null),
        iaService.getDecisiones(selectedIntersection).catch(() => []),
        iaService.getReporteSemanal(selectedIntersection).catch(() => null)
      ]);

      setSugerencias(sugRes);
      setPrediccion(predRes);
      setReporte(repRes);
      setDecisiones(decRes);
      setReporteSemanal(semRes);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading && !selectedIntersection) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Inteligencia Artificial"
        subtitle="Decisiones y sugerencias basadas en datos"
      />

      <div className="p-6 space-y-6">
        <div className="glass-card p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-500">Interseccion:</span>
          </div>
          <select
            value={selectedIntersection || ''}
            onChange={(e) => setSelectedIntersection(parseInt(e.target.value))}
            className="input-field flex-1 min-w-[250px]"
          >
            {intersections.map((i) => (
              <option key={i.id} value={i.id}>{i.nombre}</option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`btn-primary flex items-center gap-2 ${refreshing ? 'opacity-50' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Sugerencias de Optimizacion
          </h2>
          {sugerencias.length > 0 ? (
            <div className="space-y-3">
              {sugerencias.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{s.mensaje}</p>
                    <p className="text-sm text-gray-500 mt-1">Accion: {s.accion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Sin sugerencias por ahora</p>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Prediccion de Flujo por Hora
          </h2>
          {prediccion.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {prediccion.map((p, i) => (
                <div key={i} className="p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">{p.hora}:00</p>
                  <p className="text-lg font-bold text-blue-400">{p.flujo_predicho}</p>
                  <p className={`text-xs mt-1 ${
                    p.recomendacion === 'Aumentar verde' ? 'text-green-500' :
                    p.recomendacion === 'Reducir verde' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {p.recomendacion}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Sin datos de prediccion</p>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
            <Brain className="w-5 h-5 text-purple-400" />
            Decisiones Recientes de la IA
          </h2>
          {decisiones.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {decisiones.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{d.accion}</p>
                    <p className="text-xs text-gray-500">
                      {d.algoritmo} - {new Date(d.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-400">{d.tiempo_verde}s</p>
                    <p className="text-xs text-gray-500">verde</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Sin decisiones registradas</p>
          )}
        </div>

        {reporte && reporte.resumen && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Reporte del Dia
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-400">{reporte.resumen.total_carros || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Carros</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-400">{reporte.resumen.total_motos || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Motos</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-400">{reporte.resumen.total_buses || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Buses</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-cyan-400">{reporte.resumen.total_camiones || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Camiones</p>
              </div>
            </div>

            {reporte.analisis && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-400">{reporte.analisis}</p>
              </div>
            )}

            {reporte.horas_pico && reporte.horas_pico.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                <p className="text-sm font-medium text-gray-500 mb-2">Horas pico:</p>
                <div className="flex gap-2 flex-wrap">
                  {reporte.horas_pico.map((h, i) => (
                    <div key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-sm">
                      <span className="font-bold text-red-400">{h.hora}:00</span>
                      <span className="text-gray-500 ml-2">{h.total} veh</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {reporteSemanal && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
              <Activity className="w-5 h-5 text-cyan-400" />
              Reporte Semanal
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-400">{reporteSemanal.totales?.total_vehiculos || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Vehiculos (7d)</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-400">{reporteSemanal.totales?.total_personas || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Personas (7d)</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-400">{reporteSemanal.totales?.total_carros || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Carros (7d)</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {reporteSemanal.decisiones_por_algoritmo?.length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Algoritmos usados</p>
              </div>
            </div>

            {reporteSemanal.sugerencias && reporteSemanal.sugerencias.length > 0 && (
              <div className="mt-4 space-y-2">
                {reporteSemanal.sugerencias.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-900 dark:text-white">{s}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default IA;