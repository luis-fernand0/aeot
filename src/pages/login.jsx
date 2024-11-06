import * as React from 'react'
import { Link, replace } from 'react-router-dom'
import { Navigate, useNavigate } from 'react-router-dom'

import '../style/login_page/login.css'

const urlLogin = import.meta.env.VITE_URL_LOGIN;

const Login = () => {

  const navigate = useNavigate()

  async function hundleSubmit (event) {
    event.preventDefault()

    const myForm = document.getElementById('myFormLogin')
    const formData = new FormData(myForm)
    const data = Object.fromEntries(formData)

    const response = await fetch (`${urlLogin}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const dataResponse = await response.json()
    console.log(dataResponse)
    if(response.status != 200) {
      if (response.status === 403) {
        document.querySelectorAll('.span-login')[1].classList.remove('span-login-hidden-aprovado')
        return
      }
      document.querySelector('.span-login').classList.remove('span-login-hidden')
    } else {
      document.querySelector('.span-login').classList.add('span-login-hidden')
      sessionStorage.setItem('userLogado', true)
      navigate(`/home/${dataResponse.cod_driver}`, {replace: true})
    }
  }

  return (
    <>
      <div className="container-login">

        <form id='myFormLogin' onSubmit={(event) => {hundleSubmit(event)}} className='form-login' action={urlLogin} method='POST'>

          <div className="logo-inputs">

            <div className='logo-title'>
              <img className='logo-aeot-login' src="/logo_AEOT.png" alt="logo-aeot" />
              <h1 className='title-login'>Entre</h1>
            </div>

            <span className='span-login span-login-hidden'>EMAIL OU SENHA INCORRETOS!</span>
            <span className='span-login span-login-hidden-aprovado'>O SEU CADASTRO AINDA NÃO FOI APROVADO</span>
            <div className="inputs-btns">
              <input className='input-login input-login-email' type="email" name="email_login" id="email-login" placeholder="Email" required autoComplete='off' />

              <input className='input-login' type="password" name="password_login" id="password-login" placeholder="Senha" required/>
              
              <Link to={'/cadastro'}>
                <button type='button' className='btn-log btn-create'>Crie sua conta</button>
              </Link>
              
              <button type='button' className='btn-log btn-esqueceu'>Esqueceu a senha?</button>
            </div>

          </div>

          <button className='btn-log btn-login' type="submit">Login</button>        

        </form >

      </div >
    </>
  )
}

export default Login
