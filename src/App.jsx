import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import { ContentProvider, useContent } from './content/ContentProvider.jsx'
import SiteLoading from './content/SiteLoading.jsx'
import Home from './pages/Home.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import NotFound from './pages/NotFound.jsx'

// The admin area is a separate bundle — visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

function PublicShell() {
  const { ready } = useContent()

  if (!ready) return <SiteLoading />

  return (
    <>
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function PublicLayout() {
  return (
    <ContentProvider>
      <PublicShell />
    </ContentProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<SiteLoading />}>
            <AdminApp />
          </Suspense>
        }
      />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
