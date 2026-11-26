import { RouterProvider } from 'react-router'
import { WorkspaceProvider } from './context/WorkspaceContext.jsx'
import { router } from './app/routes.jsx'

export default function App() {
  return (
    <WorkspaceProvider>
      <RouterProvider router={router} />
    </WorkspaceProvider>
  )
}
