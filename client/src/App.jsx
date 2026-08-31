import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Week 1 Nav Redirects mapped to Dashboard */}
          <Route path="/tasks" element={<Dashboard />} />
          <Route path="/boards" element={<Dashboard />} />
          <Route path="/calendar" element={<Dashboard />} />
          <Route path="/activity" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;