import React, { useState } from 'react';
import axios from 'axios';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function ExportButton() {
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState('diario');

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: `${API_URL}/export/excel`,
        method: 'GET',
        params: { tipo: tipo },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${tipo}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setLoading(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error al exportar los datos');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select 
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="bg-[#1a1a2e] text-white text-sm px-3 py-2 rounded-lg border border-[#2d2d4a] focus:outline-none focus:border-blue-500 appearance-none pr-8"
        >
          <option value="diario">📅 Diario</option>
          <option value="semanal">📊 Semanal</option>
          <option value="mensual">📈 Mensual</option>
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <button
        onClick={handleExport}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
          ${loading 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/25'
          }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        {loading ? 'Exportando...' : 'Exportar Excel'}
      </button>
    </div>
  );
}

export default ExportButton;