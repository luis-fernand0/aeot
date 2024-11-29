import * as React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import '../style/login_page/login.css'

const urlLogin = import.meta.env.VITE_URL_LOGIN;

const Login = () => {

  const navigate = useNavigate()

  function enviarForm() {hundleSubmit()}
  async function hundleSubmit() {

    const myForm = document.getElementById('myFormLogin')
    const formData = new FormData(myForm)
    const data = Object.fromEntries(formData)

    const response = await fetch(urlLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const dataResponse = await response.json()
    if (response.status != 200) {
      if (response.status === 403) {
        const spanElement = document.querySelector('.span-login')
        spanElement.classList.remove('span-login-hidden')
        spanElement.innerHTML = response.statusText || response.message
        return
      }
      const spanElement = document.querySelector('.span-login')
      spanElement.classList.remove('span-login-hidden')
      spanElement.innerHTML = response.statusText || response.message
    } else {
      document.querySelector('.span-login').classList.add('span-login-hidden')
      localStorage.setItem('token', dataResponse.token_user)
      localStorage.setItem('type_user', dataResponse.datas_user.type_user)
      navigate(`/home`)
    }
  }

  return (
    <>
      <div className="container-login">

        <form id='myFormLogin' className='form-login'>

          <div className="logo-inputs">

            <div className='logo-title'>
              <img className='logo-aeot-login' src="/logo_AEOT.png" alt="logo-aeot" />
              <h1 className='title-login'>Entre</h1>
            </div>

            <span className='span-login span-login-hidden'></span>
            <div className="inputs-btns">
              <input className='input-login input-login-email' type="email" name="email_login" id="email-login" placeholder="Email" required autoComplete='off' />

              <input className='input-login' type="password" name="password_login" id="password-login" placeholder="Senha" required />

              <Link to={'/cadastro'}>
                <button type='button' className='btn-log btn-create'>Crie sua conta</button>
              </Link>

              <Link to={'/esqueceu_senha'}>
                <button type='button' className='btn-log btn-esqueceu'>Esqueceu a senha?</button>
              </Link>
            </div>

          </div>

          <button onClick={() => { enviarForm() }} className='btn-log btn-login' type="button">Login</button>
          <p className='text-version'>1.0.0</p>

        </form >

      </div >
    </>
  )
}

export default Login
