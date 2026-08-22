import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthProvider.jsx'
import RequireAuth from './RequireAuth.jsx'
import AdminLayout from './AdminLayout.jsx'
import Login from './Login.jsx'
import HomepageEditor from './pages/HomepageEditor.jsx'
import AboutEditor from './pages/AboutEditor.jsx'
import ExperienceEditor from './pages/ExperienceEditor.jsx'
import ProjectsEditor from './pages/ProjectsEditor.jsx'
import SkillsEditor from './pages/SkillsEditor.jsx'
import ContactEditor from './pages/ContactEditor.jsx'
import MediaLibrary from './pages/MediaLibrary.jsx'
import './admin.css'

/** The whole /admin area. Loaded lazily so public visitors never fetch it. */
export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/homepage" replace />} />
          <Route path="homepage" element={<HomepageEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="experience" element={<ExperienceEditor />} />
          <Route path="projects" element={<ProjectsEditor />} />
          <Route path="skills" element={<SkillsEditor />} />
          <Route path="contact" element={<ContactEditor />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="*" element={<Navigate to="/admin/homepage" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
