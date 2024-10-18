import '../style/login_page/login.css'

const Login = () => {
  return (
    <>
      <div className="container-login">

        <form className='form-login' action="">

          <div className="logo-inputs">

            <div className='logo-title'>
              <img src="../../public/placeholder_logo.png" alt="logo-aeot" />
              <h1 className='title-login'>Entre</h1>
            </div>

            <div className="inputs-btns">
              <input className='input-login' type="email" name="email" id="" placeholder="Email" required autoComplete='off' />

              <input className='input-login' type="password" name="passaword" id="" placeholder="Senha" required/>

              <button className='btn-log btn-create'>Crie sua conta</button>
              <button className='btn-log btn-esqueceu'>Esqueceu a senha?</button>
            </div>

          </div>

          <button className='btn-log btn-login' type="submit">Login</button>

        </form >

      </div >
    </>
  )
}

export default Login
