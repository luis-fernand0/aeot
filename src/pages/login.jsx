import * as React from 'react'
import { Link } from 'react-router-dom'

import '../style/login_page/login.css'

const Login = () => {
  return (
    <>
      <div className="container-login">

        <form className='form-login' action="">

          <div className="logo-inputs">

            <div className='logo-title'>
              <img className='logo-aeot-login' src="../../public/logo_AEOT.png" alt="logo-aeot" />
              <h1 className='title-login'>Entre</h1>
            </div>

            <div className="inputs-btns">
              <input className='input-login input-login-email' type="email" name="email-login" id="email-login" placeholder="Email" required autoComplete='off' />

              <input className='input-login' type="password" name="passaword-login" id="passaword-login" placeholder="Senha" required/>
              
              <Link to={'/cadastro'}>
                <button type='button' className='btn-log btn-create'>Crie sua conta</button>
              </Link>
              
              <button type='button' className='btn-log btn-esqueceu'>Esqueceu a senha?</button>
            </div>

          </div>

          <Link to={'/home'}>
            <button className='btn-log btn-login' type="submit">Login</button>
          </Link>

        </form >

      </div >
    </>
  )
}

export default Login
