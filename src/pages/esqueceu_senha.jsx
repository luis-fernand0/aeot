import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import '../style/esqueceu_senha_page/esqueceu_senha.css'

const EsqueceuSenha = () => {
    const [viewPass, setViewPass] = useState({
        'senha-atual': false,
        'esqueceu-senha-pass': false
    })

    const revealPass = (inputId) => {
        setViewPass((prevState) => ({
            ...prevState,
            [inputId]: !prevState[inputId]
        }))
    }

    function checkPass() {
        const password = document.querySelectorAll('.input-esqueceu-senha-pass-new')
        const span = document.querySelectorAll('.span-esqueceu-senha')
        const pass = password[0]
        const confirmpass = password[1]
        console.log(pass)
        console.log(confirmpass)

        if (pass.value === confirmpass.value) {
            pass.classList.remove('alert-pass-esqueceu-senha')
            confirmpass.classList.remove('alert-pass-esqueceu-senha')

            for (let i = 0; i < span.length; i++) {
                const element = span[i];
                element.classList.add('hidden-span-esqueceu-senha')
            }
        } else {
            pass.classList.add('alert-pass-esqueceu-senha')
            confirmpass.classList.add('alert-pass-esqueceu-senha')

            for (let i = 0; i < span.length; i++) {
                const element = span[i];
                element.classList.remove('hidden-span-esqueceu-senha')
            }
        }
    }

    return (
        <>
            <form className='form-esqueceu-senha' action="">
                <div className='div-email-pass-esqueceu-senha'>
                    <Link to={'/'}>
                        <FontAwesomeIcon className='arrow-esqueceu-senha' icon={faArrowLeftLong} />
                    </Link>

                    <input
                        type="email"
                        name="email_esqueceu_senha"
                        id="email-esqueceu-senha"
                        className='input-esqueceu-senha input-esqueceu-senha-email'
                        placeholder='Email'
                        required />

                    <div className='div-pass-esqueceu-senha'>
                        <input
                            type={viewPass['senha-atual'] ? 'text' : 'password'}
                            name="senha_atual"
                            id="senha-atual"
                            className='input-esqueceu-senha input-esqueceu-senha-pass'
                            placeholder='Senha atual'
                            minLength={6}
                            required />
                        <button onClick={() => { revealPass('senha-atual') }} type="button" className='pass-reveal-esqueceu-senha'>
                            <FontAwesomeIcon className='eye-icon eye-icon-hidden' icon={viewPass['senha-atual'] ? faEye : faEyeSlash} />
                        </button>
                    </div>

                    <div className='div-pass-esqueceu-senha'>
                        <span className='span-esqueceu-senha hidden-span-esqueceu-senha'>AS SENHAS DEVEM SER IGUAIS*</span>
                        <input
                            onBlur={() => { checkPass() }}
                            type={viewPass['esqueceu-senha-pass'] ? 'text' : 'password'}
                            name="new_senha"
                            id="esqueceu-senha-pass"
                            className='input-esqueceu-senha input-esqueceu-senha-pass
                            input-esqueceu-senha-pass-new'
                            placeholder='Nova Senha'
                            minLength={6}
                            required />
                        <button onClick={() => { revealPass('esqueceu-senha-pass') }} type="button" className='pass-reveal-esqueceu-senha'>
                            <FontAwesomeIcon className='eye-icon eye-icon-hidden' icon={viewPass['esqueceu-senha-pass'] ? faEye : faEyeSlash} />
                        </button>
                    </div>

                    <div className='div-pass-esqueceu-senha'>
                        <span className='span-esqueceu-senha hidden-span-esqueceu-senha'>AS SENHAS DEVEM SER IGUAIS*</span>
                        <input
                            onBlur={() => { checkPass() }}
                            type={viewPass['esqueceu-senha-pass'] ? 'text' : 'password'}
                            name="check_new_senha"
                            id="esqueceu-senha-pass-check"
                            className='input-esqueceu-senha input-esqueceu-senha-pass input-esqueceu-senha-pass-new'
                            placeholder='Confirme sua Senha'
                            minLength={6}
                            required />
                        <button onClick={() => { revealPass('esqueceu-senha-pass') }} type="button" className='pass-reveal-esqueceu-senha'>
                            <FontAwesomeIcon className='eye-icon eye-icon-hidden' icon={viewPass['esqueceu-senha-pass'] ? faEye : faEyeSlash} />
                        </button>
                    </div>

                    <button className='btn-trocar-senha' type="submit">TROCAR SENHA!</button>
                </div>
            </form>
        </>
    )
}

export default EsqueceuSenha