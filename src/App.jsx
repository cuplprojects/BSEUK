import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layout/layout";
import Login from './pages/user/Login';
import Forgot from './pages/user/Forgot';
import Dashboard from './pages/Dashboard';
import Profile from './pages/user/Profile';
import ChangePassword from './pages/user/ChangePassword';
import MarksEntry from './pages/MarksEntry/MarksEntry';
import Certificate from './pages/Certificate/Certificate';
import AddCandidate from './pages/Masters/Candidate/AddCandidate';
import BulkCandidates from './pages/Masters/Candidate/bulkCandidates';
import Groups from './pages/Masters/Groups/Groups';
import { useUserStore } from './store/useUsertoken';
import AddSession from './pages/Masters/Session/AddSession';
import Institution from './pages/Masters/Institution/Institution';
import Category from './pages/Masters/Category/Category';
import AddUsers from './pages/Masters/Users/Tabs/AddUsers';
import Roles from './pages/Masters/Roles/Roles';
import Users from './pages/Masters/Users/Users';
import AllUsers from './pages/Masters/Users/Tabs/AllUsers';
import EditCandidate from './pages/Masters/Candidate/EditCandidate';
import { useEffect, useState } from 'react';
import isAdminAccess from './services/isAdminAccess';
import Papers from './pages/Masters/Papers/Papers';
import TabulationReport from './pages/TabulationReport/TabulationReport';
import Marksheet from './pages/Marksheet/Marksheet';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdminAccess();
      setIsAdmin(adminStatus);
    };
    
    if (isAuthenticated) {
      checkAdmin();
    }
  }, [isAuthenticated]);

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

          {/* Basic User Routes */}
          <Route path="marks-entry" element={<MarksEntry />} />
          <Route path="certificate-generation" element={<Certificate />} />
          <Route path="marksheet-generation" element={<Marksheet />} />
          <Route path="papers" element={<Papers/>} />
          <Route path="tabulation-report" element={<TabulationReport/>} />

          {/* Admin Only Routes - Only shown if isAdmin is true */}
          {isAdmin && (
            <>
              <Route path="add-candidate" element={<AddCandidate />} />
              <Route path="add-bulkcandidates" element={<BulkCandidates />} />
              <Route path="edit-candidate" element={<EditCandidate />} />
              <Route path="add-groups" element={<Groups />} />
              <Route path="add-session" element={<AddSession />} />
              <Route path="add-institution" element={<Institution />} />
              {/* <Route path="add-roles" element={<Roles />} /> */}
              <Route path="add-category" element={<Category />} />
              <Route path="users">
                <Route index element={<Navigate to="add" replace />} />
                <Route path="add" element={<Users />} />
                <Route path="all" element={<Users />} />
                <Route path="access" element={<Users />} />
              </Route>
            </>
          )}

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
