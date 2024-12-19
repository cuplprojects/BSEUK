import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from "./layout/layout";
import Login from './pages/user/login';
import Forgot from './pages/user/Forgot';
import Dashboard from './pages/Dashboard';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import ChangePassword from './pages/user/ChangePassword';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes - with redirect if authenticated */}
        <Route path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={() => setIsAuthenticated(true)} />} 
        />
        <Route path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Forgot />} 
        />

        {/* Protected Routes */}
        <Route
          element={!isAuthenticated ? <Navigate to="/login" replace /> : <Layout />}
          path="/"
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="change-password" element={<ChangePassword />} />
          
          {/* Masters Routes */}
          <Route path="masters" element={<Navigate to="/masters/employee/view" replace />} />
          <Route path="masters/employee" element={<Navigate to="/masters/employee/view" replace />} />
 

          {/* Catch all route for authenticated users */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch all route for non-authenticated users */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
