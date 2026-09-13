import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatsCards from './components/StatsCards';
import HourlyChart from './components/HourlyChart';
import WeeklyChart from './components/WeeklyChart';
import LatestTable from './components/LatestTable';
import ExportButton from './components/ExportButton';
import { RefreshCw, Database, Activity, BarChart3 } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function App() {
  const [stats, setStats] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, hourlyRes, weeklyRes, latestRes] = await Promise.all([
        axios.get(`${API_URL}/stats/today`),
        axios.get(`${API_URL}/stats/hourly`),
        axios.get(`${API_URL}/stats/weekly`),
        axios.get(`${API_URL}/stats/latest`)
      ]);

      setStats(statsRes.data);
      setHourlyData(hourlyRes.data);
      setWeeklyData(weeklyRes.data);
      setLatestData(latestRes.data);
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#12122a] to-[#0a0a1a] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="glass-card rounded-2xl p-6 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Traffic Intelligence Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Sistema de monitoreo en tiempo real</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <ExportButton />
            
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#1a1a2e] px-3 py-2 rounded-lg border border-[#2d2d4a]">
              <Database className="w-4 h-4" />
              <span>Última actualización: {lastUpdate}</span>
            </div>
            
            <button 
              onClick={fetchData}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
                ${refreshing 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/25'
                }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </header>

        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <HourlyChart data={hourlyData} />
          <WeeklyChart data={weeklyData} />
        </div>

        <LatestTable data={latestData} />
      </div>
    </div>
  );
}

export default App;