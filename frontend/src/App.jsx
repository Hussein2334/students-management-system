import { Routes, Route } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  BarChart3, Settings as SettingsIcon, CreditCard, Activity,
  Clock, Award
} from 'lucide-react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/dashboard/DashboardLayout'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageStudents from './pages/admin/ManageStudents'
import ManageTeachers from './pages/admin/ManageTeachers'
import ManageCourses from './pages/admin/ManageCourses'
import ManagePayments from './pages/admin/ManagePayments'
import SystemLogs from './pages/admin/SystemLogs'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherCourses from './pages/teacher/TeacherCourses'
import TeacherStudents from './pages/teacher/TeacherStudents'
import TeacherAttendance from './pages/teacher/TeacherAttendance'
import TeacherResults from './pages/teacher/TeacherResults'
import TeacherSettings from './pages/teacher/TeacherSettings'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import StudentCourses from './pages/student/StudentCourses'
import StudentResults from './pages/student/StudentResults'
import StudentPayments from './pages/student/StudentPayments'

// 404
import NotFound from './pages/NotFound'

// ============ ADMIN MENU ============
const adminMenuSections = [
  {
    title: 'General',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', end: true },
      { icon: Users, label: 'Watumiaji', path: '/admin/users' },
      { icon: GraduationCap, label: 'Wanafunzi', path: '/admin/students' },
      { icon: BookOpen, label: 'Walimu', path: '/admin/teachers' },
      { icon: BookOpen, label: 'Kozi', path: '/admin/courses' },
      { icon: CreditCard, label: 'Malipo', path: '/admin/payments' },
    ],
  },
  {
    title: 'Informative',
    items: [
      { icon: BarChart3, label: 'Ripoti', path: '/admin/reports' },
      { icon: Activity, label: 'System Logs', path: '/admin/logs' },
      { icon: SettingsIcon, label: 'Mipangilio', path: '/admin/settings' },
    ],
  },
]

// ============ TEACHER MENU ============
const teacherMenuSections = [
  {
    title: 'General',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', end: true },
      { icon: BookOpen, label: 'Kozi Zangu', path: '/teacher/courses' },
      { icon: GraduationCap, label: 'Wanafunzi', path: '/teacher/students' },
    ],
  },
  {
    title: 'Informative',
    items: [
      { icon: Clock, label: 'Mahudhurio', path: '/teacher/attendance' },
      { icon: Award, label: 'Matokeo', path: '/teacher/results' },
      { icon: SettingsIcon, label: 'Mipangilio', path: '/teacher/settings' },
    ],
  },
]

// ============ STUDENT MENU ============
const studentMenuSections = [
  {
    title: 'General',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard', end: true },
      { icon: BookOpen, label: 'Kozi', path: '/student/courses' },
      { icon: Award, label: 'Matokeo Yangu', path: '/student/results' },
      { icon: CreditCard, label: 'Malipo Yangu', path: '/student/payments' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: Users, label: 'Wasifu Wangu', path: '/profile' },
    ],
  },
]

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

export default function App() {
  return (
    <Routes>
      {/* ============ PUBLIC ROUTES ============ */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
      <Route
        path="/reset-password/:uid/:token"
        element={<PublicLayout><ResetPassword /></PublicLayout>}
      />

      {/* ============ PROFILE (any role) ============ */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ============ ADMIN DASHBOARD ============ */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="Dashboard"
              subtitle="Muhtasari wa mfumo wako"
              menuSections={adminMenuSections}
            >
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="Usimamizi wa Watumiaji"
              subtitle="Ongeza, hariri, au futa watumiaji wote"
              menuSections={adminMenuSections}
            >
              <ManageUsers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="Usimamizi wa Wanafunzi"
              subtitle="Ongeza, hariri, au futa wanafunzi"
              menuSections={adminMenuSections}
            >
              <ManageStudents />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="Usimamizi wa Walimu"
              subtitle="Ongeza, hariri, au futa walimu"
              menuSections={adminMenuSections}
            >
              <ManageTeachers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="Usimamizi wa Kozi"
              subtitle="Ongeza, hariri, au futa kozi"
              menuSections={adminMenuSections}
            >
              <ManageCourses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="Usimamizi wa Malipo"
              subtitle="Fuatilia malipo ya wanafunzi"
              menuSections={adminMenuSections}
            >
              <ManagePayments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="System Logs"
              subtitle="Kumbukumbu ya shughuli zote kwenye mfumo"
              menuSections={adminMenuSections}
            >
              <SystemLogs />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="Ripoti na Takwimu"
              subtitle="Muhtasari wa mfumo kwa ujumla"
              menuSections={adminMenuSections}
            >
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout
              title="Mipangilio"
              subtitle="Sanidi mfumo wako"
              menuSections={adminMenuSections}
            >
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ============ TEACHER DASHBOARD ============ */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout
              title="Dashboard ya Mwalimu"
              subtitle="Muhtasari wa kozi zako"
              menuSections={teacherMenuSections}
            >
              <TeacherDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/courses"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout
              title="Kozi Zangu"
              subtitle="Ongeza, hariri, au futa kozi zako"
              menuSections={teacherMenuSections}
            >
              <TeacherCourses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout
              title="Wanafunzi"
              subtitle="Wanafunzi wote"
              menuSections={teacherMenuSections}
            >
              <TeacherStudents />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout
              title="Mahudhurio"
              subtitle="Simamia mahudhurio ya wanafunzi"
              menuSections={teacherMenuSections}
            >
              <TeacherAttendance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/results"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout
              title="Matokeo"
              subtitle="Simamia matokeo ya wanafunzi"
              menuSections={teacherMenuSections}
            >
              <TeacherResults />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/settings"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout
              title="Mipangilio"
              subtitle="Sanidi mipangilio yako ya kufundisha"
              menuSections={teacherMenuSections}
            >
              <TeacherSettings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ============ STUDENT DASHBOARD ============ */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout
              title="Dashboard ya Mwanafunzi"
              subtitle="Muhtasari wa masomo yako"
              menuSections={studentMenuSections}
            >
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/courses"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout
              title="Kozi Zinazopatikana"
              subtitle="Kozi zote hai"
              menuSections={studentMenuSections}
            >
              <StudentCourses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/results"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout
              title="Matokeo Yangu"
              subtitle="Matokeo ya mitihani"
              menuSections={studentMenuSections}
            >
              <StudentResults />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/payments"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout
              title="Malipo Yangu"
              subtitle="Historia ya malipo"
              menuSections={studentMenuSections}
            >
              <StudentPayments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ============ 404 ============ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}