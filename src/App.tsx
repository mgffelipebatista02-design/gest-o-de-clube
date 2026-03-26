import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Main pages
import AdminDashboard from '@/pages/dashboard/AdminDashboard'
import { HomePage } from '@/pages/home/HomePage'
import CalendarPage from '@/pages/calendar/CalendarPage'
import SquadListPage from '@/pages/squad/SquadListPage'
import { AthleteProfilePage } from '@/pages/squad/AthleteProfilePage'
import { LineupPage } from '@/pages/lineup/LineupPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { ClinicalPage } from '@/pages/clinical/ClinicalPage'
import { ConvocationPage } from '@/pages/convocation/ConvocationPage'
import { AthleteStatsPage } from '@/pages/stats/AthleteStatsPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/elenco" element={<SquadListPage />} />
          <Route path="/elenco/:id" element={<AthleteProfilePage />} />
          <Route path="/escalacao" element={<LineupPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
          <Route path="/desempenho" element={<ReportsPage />} />
          <Route path="/clinico" element={<ClinicalPage />} />
          <Route path="/convocacao" element={<ConvocationPage />} />
          <Route path="/stats" element={<AthleteStatsPage />} />
          <Route path="/treinos" element={<CalendarPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/config" element={<ProfilePage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
