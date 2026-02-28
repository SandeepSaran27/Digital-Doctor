/*import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "@/store/slices/authSlice";

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import ChatbotWidget from '@/components/ChatbotWidget';

// Pages
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import PatientsPage from '@/pages/PatientsPage';
import PatientDetailPage from '@/pages/PatientDetailPage';
import NewPatientPage from '@/pages/NewPatientPage';
import AppointmentsPage from '@/pages/AppointmentsPage';
import BookAppointmentPage from '@/pages/BookAppointmentPage';
import QueuePage from '@/pages/QueuePage';
import ChatbotPage from '@/pages/ChatbotPage';
import SymptomsPage from '@/pages/SymptomsPage';
import EmergencyPage from '@/pages/EmergencyPage';
import PrescriptionPage from '@/pages/PrescriptionPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import AdminPage from '@/pages/AdminPage';
import QRCheckinPage from '@/pages/QRCheckinPage';
import DoctorCalendarPage from '@/pages/DoctorCalendarPage';
import NotFoundPage from '@/pages/NotFoundPage';

const ROLES = {
  all: ['admin', 'doctor', 'receptionist', 'patient'],
  staff: ['admin', 'doctor', 'receptionist'],
  doctorAdmin: ['admin', 'doctor'],
  adminOnly: ['admin'],
  receptionistAdmin: ['admin', 'receptionist'],
  doctorReception: ['admin', 'doctor', 'receptionist'],
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Always check if the cookie is valid on startup — no localStorage needed
    dispatch(getMe());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<ProtectedRoute roles={ROLES.all}><DashboardPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute roles={ROLES.all}><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/appointments/book" element={<ProtectedRoute roles={ROLES.all}><BookAppointmentPage /></ProtectedRoute>} />
        <Route path="/queue" element={<ProtectedRoute roles={ROLES.all}><QueuePage /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute roles={ROLES.all}><ChatbotPage /></ProtectedRoute>} />
        <Route path="/symptoms" element={<ProtectedRoute roles={ROLES.all}><SymptomsPage /></ProtectedRoute>} />

        <Route path="/patients" element={<ProtectedRoute roles={ROLES.staff}><PatientsPage /></ProtectedRoute>} />
        <Route path="/patients/new" element={<ProtectedRoute roles={ROLES.receptionistAdmin}><NewPatientPage /></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute roles={ROLES.staff}><PatientDetailPage /></ProtectedRoute>} />

        <Route path="/emergency" element={<ProtectedRoute roles={ROLES.doctorReception}><EmergencyPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute roles={ROLES.doctorAdmin}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/doctor/calendar" element={<ProtectedRoute roles={ROLES.doctorAdmin}><DoctorCalendarPage /></ProtectedRoute>} />

        <Route path="/prescriptions/:id" element={<ProtectedRoute roles={ROLES.all}><PrescriptionPage /></ProtectedRoute>} />

        <Route path="/qr-checkin" element={<ProtectedRoute roles={ROLES.receptionistAdmin}><QRCheckinPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute roles={ROLES.adminOnly}><AdminPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ChatbotWidget />

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
*/

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "@/store/slices/authSlice";

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import ChatbotWidget from '@/components/ChatbotWidget';

// Pages
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import PatientsPage from '@/pages/PatientsPage';
import PatientDetailPage from '@/pages/PatientDetailPage';
import NewPatientPage from '@/pages/NewPatientPage';
import AppointmentsPage from '@/pages/AppointmentsPage';
import BookAppointmentPage from '@/pages/BookAppointmentPage';
import QueuePage from '@/pages/QueuePage';
import ChatbotPage from '@/pages/ChatbotPage';
import SymptomsPage from '@/pages/SymptomsPage';
import EmergencyPage from '@/pages/EmergencyPage';
import PrescriptionPage from '@/pages/PrescriptionPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import AdminPage from '@/pages/AdminPage';
import QRCheckinPage from '@/pages/QRCheckinPage';
import DoctorCalendarPage from '@/pages/DoctorCalendarPage';
import NotFoundPage from '@/pages/NotFoundPage';

const ROLES = {
  all: ['admin', 'doctor', 'receptionist', 'patient'],
  staff: ['admin', 'doctor', 'receptionist'],
  doctorAdmin: ['admin', 'doctor'],
  adminOnly: ['admin'],
  receptionistAdmin: ['admin', 'receptionist'],
  doctorReception: ['admin', 'doctor', 'receptionist'],
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Always check if the cookie is valid on startup — no localStorage needed
    dispatch(getMe());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Home />} />

        {/* Protected — all roles */}
        <Route path="/dashboard" element={<ProtectedRoute roles={ROLES.all}><DashboardPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute roles={ROLES.all}><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/appointments/book" element={<ProtectedRoute roles={ROLES.all}><BookAppointmentPage /></ProtectedRoute>} />
        <Route path="/queue" element={<ProtectedRoute roles={ROLES.all}><QueuePage /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute roles={ROLES.all}><ChatbotPage /></ProtectedRoute>} />
        <Route path="/symptoms" element={<ProtectedRoute roles={ROLES.all}><SymptomsPage /></ProtectedRoute>} />

        {/* Patients */}
        <Route path="/patients/me" element={<ProtectedRoute roles={['patient']}><PatientDetailPage /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute roles={ROLES.staff}><PatientsPage /></ProtectedRoute>} />
        <Route path="/patients/new" element={<ProtectedRoute roles={ROLES.receptionistAdmin}><NewPatientPage /></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute roles={ROLES.staff}><PatientDetailPage /></ProtectedRoute>} />

        {/* Doctor & Admin */}
        <Route path="/emergency" element={<ProtectedRoute roles={ROLES.doctorReception}><EmergencyPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute roles={ROLES.doctorAdmin}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/doctor/calendar" element={<ProtectedRoute roles={ROLES.doctorAdmin}><DoctorCalendarPage /></ProtectedRoute>} />

        {/* Prescriptions */}
        <Route path="/prescriptions/:id" element={<ProtectedRoute roles={ROLES.all}><PrescriptionPage /></ProtectedRoute>} />

        {/* Receptionist */}
        <Route path="/qr-checkin" element={<ProtectedRoute roles={ROLES.receptionistAdmin}><QRCheckinPage /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<ProtectedRoute roles={ROLES.adminOnly}><AdminPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global floating widgets */}
      <ChatbotWidget />

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
