import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'

// CONFIGURANDO ROTAS DO REACT ROUTER
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Cadastro from './pages/cadastro.jsx'
import EsqueceuSenha from './pages/esqueceu_senha.jsx'
import Login from './pages/login.jsx'
import Home from './pages/home.jsx'
import PerfilUser from './pages/perfil_user.jsx'
import NewDrivers from './components/new_drivers.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },

  {
    path: '/cadastro',
    element: <Cadastro/>
  },

  {
    path: '/home',
    element: <Home/>
  },

  {
    path: '/perfil',
    element: <PerfilUser/>
  },

  {
    path: '/esqueceu_senha',
    element: <EsqueceuSenha/>
  },

  {
    path: '/cadastros_pendentes',
    element: <NewDrivers/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
