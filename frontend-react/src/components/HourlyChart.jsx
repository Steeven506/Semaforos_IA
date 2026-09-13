import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function HourlyChart({ data }) {
  const chartData = {
    labels: data.map(d => d.hour),
    datasets: [
      {
        label: 'Carros',
        data: data.map(d => d.carros || 0),
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4ade80',
        pointBorderColor: '#4ade80',
        pointRadius: 3,
      },
      {
        label: 'Motos',
        data: data.map(d => d.motos || 0),
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fbbf24',
        pointBorderColor: '#fbbf24',
        pointRadius: 3,
      },
      {
        label: 'Total',
        data: data.map(d => d.total || 0),
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#60a5fa',
        pointRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
          font: {
            size: 11,
            weight: '500',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        borderColor: '#2d2d4a',
        borderWidth: 1,
        padding: 12,
        titleColor: '#e0e0e0',
        bodyColor: '#9ca3af',
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#6b7280',
          font: { size: 10 }
        },
        grid: { 
          color: 'rgba(45, 45, 74, 0.3)',
          drawBorder: false,
        },
      },
      y: {
        ticks: { 
          color: '#6b7280',
          font: { size: 10 }
        },
        grid: { 
          color: 'rgba(45, 45, 74, 0.3)',
          drawBorder: false,
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="chart-container glass-card rounded-2xl p-6 border border-[#2d2d4a] bg-[#1a1a2e]/50">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-400" />
        <h3 className="text-gray-300 font-semibold text-sm">Flujo de Tráfico por Hora</h3>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default HourlyChart;