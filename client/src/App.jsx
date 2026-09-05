import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

// Import Main Layout and all pages
import MainLayout from './components/layout/MainLayout';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Boards from './pages/Boards';
import Employees from './pages/Employees';
import CalendarPage from './pages/CalendarPage';
import ActivityPage from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';

// Role wrapper checking admin/manager status for main dashboard
const RoleBasedDashboard = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <ManagerDashboard /> : <EmployeeDashboard />;
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppProvider>
            <Routes>
              {/* Authentication pages (Full-screen without sidebar) */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* All internal pages share the MainLayout container (Sidebar + Content view) */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<RoleBasedDashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/boards" element={<Boards />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;