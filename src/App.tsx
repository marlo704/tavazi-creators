import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AcceptInvitePage from './pages/AcceptInvitePage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import ContentPage from './pages/dashboard/ContentPage';
import RevenuePage from './pages/dashboard/RevenuePage';
import TrendPage from './pages/dashboard/TrendPage';
import AdminPage from './pages/dashboard/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/accept-invite" element={<AcceptInvitePage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="revenue" element={<RevenuePage />} />
        <Route path="trend" element={<TrendPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
