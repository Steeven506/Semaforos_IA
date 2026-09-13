import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function WeeklyChart({ data }) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Total Vehículos',
        data: data.map(d => d.total || 0),
        backgroundColor: 'rgba(96, 165, 250, 0.6)',
        borderColor: '#60a5fa',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(96, 165, 250, 0.8)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
          font: {
            size: 11,
            weight: '500',
          },
          usePointStyle: true,
          pointStyle: 'rectRounded',
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
        <TrendingUp className="w-5 h-5 text-green-400" />
        <h3 className="text-gray-300 font-semibold text-sm">Tendencia Semanal</h3>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default WeeklyChart;