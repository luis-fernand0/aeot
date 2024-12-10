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
import EditPerfil from './components/edit_perfil.jsx'
import AdicionarCadastros from './components/add_cadastros.jsx'
import NewPostosServices from './components/new_postos_services.jsx'
import Detalhes from './components/detalhes.jsx'

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
  },

  {
    path: '/editar_perfil',
    element: <EditPerfil/>
  },

  {
    path: '/adicionar_cadastros',
    element: <AdicionarCadastros/>
  },

  {
    path: '/adicionar_postos_services',
    element: <NewPostosServices/>
  },

  {
    path: '/detalhes',
    element: <Detalhes/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
