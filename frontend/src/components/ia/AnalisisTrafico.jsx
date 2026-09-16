import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Clock, Car } from 'lucide-react';

function AnalisisTrafico({ analisis }) {
  if (!analisis || !analisis.resumen) {
    return (
      <div className="glass-card p-6">
        <p className="text-gray-500 text-center py-4">Sin datos de analisis</p>
      </div>
    );
  }

  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'creciente':
        return <TrendingUp className="w-5 h-5 text-red-400" />;
      case 'decreciente':
        return <TrendingDown className="w-5 h-5 text-green-400" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTendenciaColor = (tendencia) => {
    switch (tendencia) {
      case 'creciente':
        return 'text-red-400';
      case 'decreciente':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Analisis de Trafico
        </h2>
        <span className="ml-auto text-xs text-gray-500">
          Ultimas {analisis.periodo_horas} horas
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
          <Car className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {analisis.resumen.total_vehiculos}
          </p>
          <p className="text-xs text-gray-500 mt-1">Vehiculos</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
          <Activity className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {analisis.resumen.total_personas}
          </p>
          <p className="text-xs text-gray-500 mt-1">Personas</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
          <Clock className="w-5 h-5 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {analisis.resumen.hora_pico || '-'}:00
          </p>
          <p className="text-xs text-gray-500 mt-1">Hora Pico</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg text-center">
          <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {analisis.resumen.hora_valle || '-'}:00
          </p>
          <p className="text-xs text-gray-500 mt-1">Hora Valle</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
        <span className="text-sm text-gray-600 dark:text-gray-400">Tendencia</span>
        <div className="flex items-center gap-2">
          {getTendenciaIcon(analisis.resumen.tendencia)}
          <span className={`font-bold capitalize ${getTendenciaColor(analisis.resumen.tendencia)}`}>
            {analisis.resumen.tendencia}
          </span>
        </div>
      </div>

      {analisis.datos_por_hora && analisis.datos_por_hora.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Flujo por hora
          </p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {analisis.datos_por_hora.map((d, i) => (
              <div key={i} className="text-center p-2 bg-gray-100 dark:bg-dark-700/50 rounded">
                <p className="text-xs text-gray-500">{d.hora}:00</p>
                <p className="text-sm font-bold text-blue-400">{d.total}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalisisTrafico;