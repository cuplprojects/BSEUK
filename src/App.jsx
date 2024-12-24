import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from "./layout/layout";
import Login from './pages/user/Login';
import Forgot from './pages/user/Forgot';
import Dashboard from './pages/Dashboard';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import ChangePassword from './pages/user/ChangePassword';
import MarksEntry from './pages/MarksEntry/MarksEntry';
import MarksEntryForm from './pages/MarksEntry/MarksEntryForm';
import Certificate from './pages/Certificate/Certificate';
import Report from './pages/Report/Report';


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
          
          {/* Pages Routes */}
          <Route path="marks-entry" element={<MarksEntry />} />
          <Route path="marks-entry/MarksEntryForm/:studentId" element={<MarksEntryForm />} title="Marks Entry" />
          <Route path="certificate-generation" element={<Certificate />} />
          <Route path="report" element={<Report />} />

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
