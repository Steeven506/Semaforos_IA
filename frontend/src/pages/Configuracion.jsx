import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/layout/Header';
import {
  Palette, Eye, Type, Moon, Sun, Monitor, User, Mail,
  Phone, Shield, Bell, Globe, Check, Info
} from 'lucide-react';

function Configuracion() {
  const { user } = useAuth();
  const { theme, setTheme, colorBlindMode, setColorBlindMode } = useTheme();
  const [fontSize, setFontSize] = useState(
    localStorage.getItem('fontSize') || 'normal'
  );
  const [notifications, setNotifications] = useState(
    localStorage.getItem('notifications') !== 'false'
  );
  const [success, setSuccess] = useState('');

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    
    if (size === 'small') {
      root.style.fontSize = '14px';
    } else if (size === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
    
    setSuccess('Tamano de fuente actualizado');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setSuccess(`Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleColorBlindChange = (mode) => {
    setColorBlindMode(mode);
    setSuccess('Modo de daltonismo actualizado');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleNotificationsChange = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notifications', newValue.toString());
    setSuccess(`Notificaciones ${newValue ? 'activadas' : 'desactivadas'}`);
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div>
      <Header 
        title="Configuracion" 
        subtitle="Personaliza tu experiencia en el sistema"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Informacion del Usuario
              </h2>
              <p className="text-sm text-gray-500">Tus datos personales</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Nombre completo</p>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.nombre} {user?.apellido || ''}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Correo electronico</p>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Rol</p>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {user?.role_id === 1 ? 'Administrador' : 
                 user?.role_id === 2 ? 'Operador' : 'Visualizador'}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Estado</p>
              </div>
              <p className="text-sm font-medium text-green-500">
                Verificado
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Palette className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Tema y Apariencia
              </h2>
              <p className="text-sm text-gray-500">Personaliza la interfaz</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Modo de Color
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <Moon className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Modo Oscuro
                    </p>
                    <p className="text-xs text-gray-500">Ideal para la noche</p>
                  </div>
                </button>

                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <Sun className="w-6 h-6 text-yellow-400" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Modo Claro
                    </p>
                    <p className="text-xs text-gray-500">Ideal para el dia</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Tamano de Fuente
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleFontSizeChange('small')}
                  className={`p-4 rounded-lg border-2 transition ${
                    fontSize === 'small'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <Type className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Pequeno</p>
                </button>

                <button
                  onClick={() => handleFontSizeChange('normal')}
                  className={`p-4 rounded-lg border-2 transition ${
                    fontSize === 'normal'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <Type className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Normal</p>
                </button>

                <button
                  onClick={() => handleFontSizeChange('large')}
                  className={`p-4 rounded-lg border-2 transition ${
                    fontSize === 'large'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <Type className="w-7 h-7 text-gray-500 mx-auto mb-2" />
                  <p className="text-base font-bold text-gray-900 dark:text-white">Grande</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Modo Daltonismo
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleColorBlindChange('none')}
                  className={`p-3 rounded-lg border-2 transition ${
                    colorBlindMode === 'none'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex gap-1 justify-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">Normal</p>
                </button>

                <button
                  onClick={() => handleColorBlindChange('deuteranopia')}
                  className={`p-3 rounded-lg border-2 transition ${
                    colorBlindMode === 'deuteranopia'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex gap-1 justify-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">Deuteranopia</p>
                </button>

                <button
                  onClick={() => handleColorBlindChange('protanopia')}
                  className={`p-3 rounded-lg border-2 transition ${
                    colorBlindMode === 'protanopia'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex gap-1 justify-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-700"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-800"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">Protanopia</p>
                </button>

                <button
                  onClick={() => handleColorBlindChange('tritanopia')}
                  className={`p-3 rounded-lg border-2 transition ${
                    colorBlindMode === 'tritanopia'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex gap-1 justify-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">Tritanopia</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <Bell className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Notificaciones
              </h2>
              <p className="text-sm text-gray-500">Configura las alertas del sistema</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Notificaciones en tiempo real
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Recibe alertas de emergencias y detecciones
              </p>
            </div>
            <button
              onClick={handleNotificationsChange}
              className={`relative w-14 h-7 rounded-full transition ${
                notifications ? 'bg-green-500' : 'bg-gray-400 dark:bg-dark-600'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                notifications ? 'left-8' : 'left-1'
              }`}></div>
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Sistema
              </h2>
              <p className="text-sm text-gray-500">Informacion del sistema</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-400">1.0.0</p>
              <p className="text-xs text-gray-500 mt-1">Version</p>
            </div>
            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-400">Ocana</p>
              <p className="text-xs text-gray-500 mt-1">Ciudad</p>
            </div>
            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-400">2026</p>
              <p className="text-xs text-gray-500 mt-1">Ano</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-400">Sistema de Trafico Inteligente</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ocana, Norte de Santander - Colombia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;