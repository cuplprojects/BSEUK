import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from "./layout/layout";
import Login from './pages/user/login';
import Forgot from './pages/user/Forgot';
import Dashboard from './pages/Dashboard';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import ChangePassword from './pages/user/ChangePassword';
import AllEmployee from './pages/Masters/Employee/AllEmployee';
import AddEmployee from './pages/Masters/Employee/AddEmployee';
import Roles from './pages/Masters/Roles/Roles';
import Department from './pages/Masters/Department/Department';
import Location from './pages/Masters/Location/Location';
import Designation from './pages/Masters/Designation/Designation';
import Banks from './pages/Masters/Banks/Banks';
import UpdateEmployee from './pages/Masters/Employee/UpdateEmployee';
import ImportEmployee from './pages/Masters/Employee/ImportEmployee';
import Payrolls from './pages/Payrolls/Payrolls';
import LoansAndAdvances from './pages/LoansAndAdvances/LoansAndAdvances';
import Attendance from './pages/Attendance/Attendance';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

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
          <Route path="masters/employee/view" element={<AllEmployee />} />
          <Route path="masters/employee/add" element={<AddEmployee />} />
          <Route path="masters/employee/import" element={<ImportEmployee />} />
          <Route path="masters/departments" element={<Department />} />
          <Route path="masters/locations" element={<Location />} />
          <Route path="masters/designations" element={<Designation />} />
          <Route path="masters/banks" element={<Banks />} />
          <Route path="masters/employee/update/:id" element={<UpdateEmployee />} />
          <Route path="masters/roles" element={<Roles />} />
          <Route path="payrolls" element={<Payrolls />} />
          <Route path="loans-and-advances" element={<LoansAndAdvances />} />
          <Route path="attendance" element={<Attendance />} />

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
