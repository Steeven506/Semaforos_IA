import React from 'react';
import { Car, Users, Clock, TrendingUp } from 'lucide-react';

function StatsCards({ stats }) {
  const cards = [
    { 
      id: 1, 
      icon: Car, 
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      label: 'Total Vehículos Hoy', 
      value: stats?.total_vehiculos || 0,
      subtitle: 'vehículos registrados'
    },
    { 
      id: 2, 
      icon: Users, 
      iconColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      label: 'Total Personas Hoy', 
      value: stats?.total_personas || 0,
      subtitle: 'personas detectadas'
    },
    { 
      id: 3, 
      icon: Clock, 
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      label: 'Total Registros', 
      value: stats?.total_registros || 0,
      subtitle: 'minutos registrados'
    },
    { 
      id: 4, 
      icon: TrendingUp, 
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      label: 'Máximo por Minuto', 
      value: stats?.maximo_por_minuto || 0,
      subtitle: 'vehículos en un minuto'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div 
            key={card.id} 
            className="stat-card glass-card rounded-2xl p-6 border border-[#2d2d4a] bg-[#1a1a2e]/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">{card.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;