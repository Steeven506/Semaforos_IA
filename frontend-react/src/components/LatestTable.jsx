import React from 'react';
import { Table, Clock } from 'lucide-react';

function LatestTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-[#2d2d4a] bg-[#1a1a2e]/50">
        <div className="flex items-center gap-2 mb-4">
          <Table className="w-5 h-5 text-purple-400" />
          <h3 className="text-gray-300 font-semibold text-sm">Últimas Detecciones</h3>
        </div>
        <div className="text-gray-500 text-center py-8">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-[#2d2d4a] bg-[#1a1a2e]/50">
      <div className="flex items-center gap-2 mb-4">
        <Table className="w-5 h-5 text-purple-400" />
        <h3 className="text-gray-300 font-semibold text-sm">Últimas Detecciones</h3>
        <span className="ml-auto text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {data.length} registros
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2d2d4a]">
              <th className="text-left py-3 px-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Timestamp</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Personas</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Carros</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Motos</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Buses</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Camiones</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium text-xs uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 15).map((row, index) => (
              <tr key={index} className="border-b border-[#2d2d4a]/50 hover:bg-white/5 transition-colors">
                <td className="py-2.5 px-3 text-gray-300 font-mono text-xs">{row.timestamp}</td>
                <td className="py-2.5 px-3 text-gray-300 text-center">{row.personas || 0}</td>
                <td className="py-2.5 px-3 text-gray-300 text-center">{row.carros || 0}</td>
                <td className="py-2.5 px-3 text-gray-300 text-center">{row.motos || 0}</td>
                <td className="py-2.5 px-3 text-gray-300 text-center">{row.buses || 0}</td>
                <td className="py-2.5 px-3 text-gray-300 text-center">{row.camiones || 0}</td>
                <td className="py-2.5 px-3 text-white font-semibold text-center">{row.total || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LatestTable;