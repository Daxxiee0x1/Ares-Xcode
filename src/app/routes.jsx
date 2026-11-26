import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
// All page routes use pure JSX modules.
import ShellLayout from '../components/ShellLayout.jsx'
import BerandaPage from '../pages/BerandaPage.jsx'
import UkuranPage from '../pages/UkuranPage.jsx'
import TugasPage from '../pages/TugasPage.jsx'
import RiwayatPage from '../pages/RiwayatPage.jsx'
import RiwayatDetailPage from '../pages/RiwayatDetailPage.jsx'
import BantuanPage from '../pages/BantuanPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

const EditorPageLazy = lazy(() => import('../pages/EditorPage.jsx'))

function EditorRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-3 p-6" aria-busy="true" aria-live="polite">
          <p className="text-sm font-medium text-muted">Memuat editor CodeMirror...</p>
          <div className="skeleton-bar h-10 max-w-md" />
          <div className="skeleton-bar flex-1" />
        </div>
      }
    >
      <EditorPageLazy />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: ShellLayout,
    children: [
      { index: true, Component: BerandaPage },
      { path: 'editor', Component: EditorRoute },
      { path: 'ukuran', Component: UkuranPage },
      { path: 'tugas', Component: TugasPage },
      { path: 'riwayat', Component: RiwayatPage },
      { path: 'riwayat/:id', Component: RiwayatDetailPage },
      { path: 'bantuan', Component: BantuanPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
