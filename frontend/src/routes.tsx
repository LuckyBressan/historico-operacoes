import { createBrowserRouter, RouterProvider } from 'react-router'
import LayoutMain from './layout-main'
import ContratosPage from './pages/contratos-page'
import ContratosUploadPage from './pages/contratos-upload-page'
import { ContratosAnalisePage } from './pages/contratos-analise-page'

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
          element: <ContratosUploadPage />
        },
        {
          path: '/calcular',
          element: <ContratosAnalisePage />
        },
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}
