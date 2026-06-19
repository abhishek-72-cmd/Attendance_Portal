import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import EmployeeDashboard from "../Dashbord/EmployeeDashboard";
import ManagerDashboard from "../Dashbord/ManagerDashboard";
import HRDashboard from "../Dashbord/HRDashboard";

import CheckInOut from "../pages/CheckInOut";
import Timesheet from "../pages/Timesheet";
import ApplyLeave from "../Leave/ApplyLeave";
import LeaveApproval from "../Leave/LeaveApproval";
import UserManagement from "../pages/UserManagement";
import LeaveConfig from "../Leave/LeaveConfig";

import ProtectedRoute from "../components/ProtectedRoute";
import OAuthSuccess from "../Pages/OAuthSuccess"
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-success" element={<OAuthSuccess/>}/>
        {/* Dashboards */}
   <Route path="/manager" element={
  <ProtectedRoute role="MANAGER">
    <ManagerDashboard />
  </ProtectedRoute>
} />

<Route path="/hr" element={
  <ProtectedRoute role="HR">
    <HRDashboard />
  </ProtectedRoute>
} />

<Route path="/employee" element={
  <ProtectedRoute role="EMPLOYEE">
    <EmployeeDashboard />
  </ProtectedRoute>
} />

        {/* Common */}
        <Route path="/checkin" element={<ProtectedRoute><CheckInOut /></ProtectedRoute>} />
        <Route path="/timesheet" element={<ProtectedRoute><Timesheet /></ProtectedRoute>} />
        <Route path="/leave" element={<ProtectedRoute><ApplyLeave /></ProtectedRoute>} />

        {/* Manager */}
        <Route path="/leave-approval" element={<ProtectedRoute><LeaveApproval /></ProtectedRoute>} />

        {/* HR */}
        <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/leave-config" element={<ProtectedRoute><LeaveConfig /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;