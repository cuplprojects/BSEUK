import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layout/layout";
import Login from './pages/user/Login';
import Forgot from './pages/user/Forgot';
import Dashboard from './pages/Dashboard';
import Profile from './pages/user/Profile';
import ChangePassword from './pages/user/ChangePassword';
import MarksEntry from './pages/MarksEntry/MarksEntry';
import MarksEntryForm from './pages/MarksEntry/MarksEntryForm';
import Certificate from './pages/Certificate/Certificate';
import Report from './pages/Report/Report';
import { useUserStore } from './store/useUsertoken';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserStore();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated } = useUserStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes - with redirect if authenticated */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <Forgot />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
          path="/"
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
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
