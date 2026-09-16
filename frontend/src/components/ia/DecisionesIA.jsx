import React from 'react';
import { Brain, CheckCircle, Clock, Zap } from 'lucide-react';

function DecisionesIA({ decisiones, estadisticas }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Decisiones de la IA
        </h2>
        <span className="ml-auto text-xs text-gray-500">
          {decisiones.length} decisiones
        </span>
      </div>

      {estadisticas && estadisticas.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {estadisticas.map((stat, i) => (
            <div key={i} className="p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-gray-900 dark:text-white capitalize">
                  {stat.algoritmo}
                </span>
              </div>
              <p className="text-lg font-bold text-purple-400">{stat.total}</p>
              <p className="text-xs text-gray-500">
                Promedio: {Math.round(parseFloat(stat.avg_verde) || 0)}s
              </p>
            </div>
          ))}
        </div>
      )}

      {decisiones.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {decisiones.map((d, i) => (
            <div key={i} className="p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {d.accion}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-purple-400">
                    {d.tiempo_verde}s
                  </span>
                  {d.aplicada ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {d.justificacion || 'Sin justificacion'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="capitalize">{d.algoritmo}</span>
                <span>•</span>
                <span>{new Date(d.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          Sin decisiones registradas. Toma una decision para comenzar.
        </p>
      )}
    </div>
  );
}

export default DecisionesIA;