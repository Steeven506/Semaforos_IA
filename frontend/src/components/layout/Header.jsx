import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function Header({ title, subtitle }) {
  const { theme, toggleTheme, colorBlindMode, setColorBlindMode } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 flex justify-between items-center transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <select
          value={colorBlindMode}
          onChange={(e) => setColorBlindMode(e.target.value)}
          className="bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 focus:outline-none"
        >
          <option value="none">Vision Normal</option>
          <option value="deuteranopia">Deuteranopia</option>
          <option value="protanopia">Protanopia</option>
          <option value="tritanopia">Tritanopia</option>
        </select>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition text-gray-900 dark:text-white"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}

export default Header;