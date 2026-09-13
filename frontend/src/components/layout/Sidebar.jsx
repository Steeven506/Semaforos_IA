import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Map,
  MapPin,
  TrafficCone,
  Clock,
  Camera,
  AlertTriangle,
  Activity,
  LogOut,
  Settings,
  Layers
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [1, 2, 3] },
    { path: '/mapa', label: 'Mapa', icon: Map, roles: [1, 2, 3] },
    { path: '/intersecciones', label: 'Intersecciones', icon: MapPin, roles: [1, 2, 3] },
    { path: '/grupos', label: 'Grupos', icon: Layers, roles: [1, 2, 3] },
    { path: '/semaforos', label: 'Semaforos', icon: TrafficCone, roles: [1, 2, 3] },
    { path: '/fases', label: 'Fases', icon: Clock, roles: [1, 2] },
    { path: '/camaras', label: 'Camaras', icon: Camera, roles: [1, 2, 3] },
    { path: '/emergencias', label: 'Emergencias', icon: AlertTriangle, roles: [1, 2, 3] },
    { path: '/detecciones', label: 'Detecciones', icon: Activity, roles: [1, 2, 3] },
    { path: '/configuracion', label: 'Configuracion', icon: Settings, roles: [1, 2, 3] },
  ];

  const filteredItems = menuItems.filter(item =>
    item.roles.includes(user?.role_id)
  );

  return (
    <aside className="w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 min-h-screen flex flex-col transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <h1 className="text-xl font-bold gradient-text">Traffic System</h1>
        <p className="text-xs text-gray-500 mt-1">Ocana, Norte de Santander</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-dark-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesion
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;