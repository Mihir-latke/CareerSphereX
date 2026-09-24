import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Dashboard from '../pages/dashboard/Dashboard'
import Profile from '../pages/profile/Profile'
import Skills from '../pages/skills/Skills'
import Careers from '../pages/careers/Careers'
import Roadmap from '../pages/roadmap/Roadmap'
import Resume from '../pages/resume/Resume'
import Jobs from '../pages/jobs/Jobs'
import JobDetail from '../pages/jobs/JobDetail'
import Applications from '../pages/applications/Applications'
import Interview from '../pages/interview/Interview'
import PostJob from '../pages/recruiter/PostJob'
import RecruiterJobs from '../pages/recruiter/RecruiterJobs'
import Applicants from '../pages/recruiter/Applicants'
import DashboardLayout from '../components/layout/DashboardLayout'
import NotFound from '../pages/errors/NotFound'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* General */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/skills" element={<Skills />} />

        {/* Career planning */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/resume" element={<Resume />} />

        {/* Job board */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Candidate */}
        <Route path="/applications" element={<Applications />} />
        <Route path="/interview" element={<Interview />} />

        {/* Recruiter */}
        <Route path="/jobs/post" element={<PostJob />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/jobs/:jobId/applicants" element={<Applicants />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
