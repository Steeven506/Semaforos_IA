import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Intersections from './pages/Intersections';
import Grupos from './pages/Grupos';
import Semaforos from './pages/Semaforos';
import Fases from './pages/Fases';
import Camaras from './pages/Camaras';
import Emergencias from './pages/Emergencias';
import Detecciones from './pages/Detecciones';
import Mapa from './pages/Mapa';
import Configuracion from './pages/Configuracion';
import IA from './pages/IA';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-light-900 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-light-900 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="mapa" element={<Mapa />} />
              <Route path="intersecciones" element={<Intersections />} />
              <Route path="grupos" element={<Grupos />} />
              <Route path="semaforos" element={<Semaforos />} />
              <Route path="fases" element={<Fases />} />
              <Route path="camaras" element={<Camaras />} />
              <Route path="emergencias" element={<Emergencias />} />
              <Route path="detecciones" element={<Detecciones />} />
              <Route path="ia" element={<IA />} />
              <Route path="configuracion" element={<Configuracion />} />
	      
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;