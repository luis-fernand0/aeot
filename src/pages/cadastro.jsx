import * as React from 'react'
import { Link } from 'react-router-dom'

import '../style/cadastro_page/cadastro.css'

const Cadastro = () => {
  return (
    <>
        <div className="container-cadastro">
            <img src="../../public/placeholder_logo.png" alt="logo-aeot" />

            <form className="form-cadastro" action="">
                <div className='cadastro-full'>

                    <div className='title-arrow'>
                        <Link to={'/'}>
                            VOLTAR!
                        </Link>
                        <h1 className='title-cadastro'>Cadastre-se</h1>
                    </div>

                    <div className='datas-user'>
                        <input className='input-cadastro input-cadastro-nome' type="text" name="name" id="input-name" placeholder='Nome' required autoComplete='off'/>

                        <input className='input-cadastro' type="tel" name="telefone" id="input-tel" placeholder='Telefone' required autoComplete='off'/>

                        <input className='input-cadastro input-cadastro-email' type="email" name="email-cadastro" id="email-cadastro" placeholder='Email' required autoComplete='off'/>

                        <input className='input-cadastro' type="password" name="passaword-cadastro" id="passaword-cadastro" placeholder='Senha' required/>

                        <input className='input-cadastro' type="password" name="passaword-cadastro-check" id="passaword-cadastro-chek" placeholder='Confirme sua senha' required/>
                        
                        <div className='placa-modelo'>
                            <input className='input-cadastro-veiculo' type="text" name="placa-veiculo" id="placa-veiculo" placeholder='Placa' required autoComplete='off' maxLength={7}/>

                            <input className='input-cadastro-veiculo' type="text" name="modelo-veiculo" id="modelo-veiculo" placeholder='Modelo' required autoComplete='off'/>
                        </div>
                    </div>

                    <div className='container-btn-cadastro'>
                        <button className='btn-cadastro' type="button">
                            Anexar CNH
                        </button>

                        <button className='btn-cadastro'  type="button">
                            Anexar print de APP de mobilidade
                        </button>

                        <button className='btn-cadastro btn-criar-cadastro' type="submit">
                            CRIAR!
                        </button>
                    </div>
                </div>

            </form>
        </div>
    </>
  )
}

export default Cadastro
