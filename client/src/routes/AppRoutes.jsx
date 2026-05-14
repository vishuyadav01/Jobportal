import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BrowseJobs from '../pages/BrowseJobs';
import JobDetails from '../pages/JobDetails';
import Profile from '../pages/Profile';
import MyApplications from '../pages/MyApplications';
import RecruiterDashboard from '../pages/RecruiterDashboard';
import CreateJob from '../pages/CreateJob';
import ManageApplicants from '../pages/ManageApplicants';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<BrowseJobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      {/* Candidate Routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-applications" 
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <MyApplications />
          </ProtectedRoute>
        } 
      />

      {/* Recruiter Routes */}
      <Route 
        path="/recruiter/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter/create-job" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <CreateJob />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter/edit-job/:id" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <CreateJob />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter/my-jobs" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter/applicants/:jobId" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <ManageApplicants />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
