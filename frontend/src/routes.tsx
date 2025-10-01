import { createBrowserRouter, RouterProvider } from 'react-router'
import LayoutMain from './layout-main'
import ContratosPage from './pages/contratos-page'
import { UploadPage } from './pages/upload-page'

export default function Routes() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutMain />,
      children: [
        {
          path: '/contratos',
          element: <ContratosPage />
        },
        {
          path: '/upload',
          element: <UploadPage />
        },
        {
          path: '/calcular',
          element: <ContratosPage />
        },
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}
