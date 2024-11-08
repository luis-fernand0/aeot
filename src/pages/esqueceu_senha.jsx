import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import '../style/esqueceu_senha_page/esqueceu_senha.css'

const urlEsqueceuSenha = import.meta.env.VITE_URL_ESQUECEU_SENHA

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

    function closeWindowResponse(btnClose) {
        document.querySelector(`.${btnClose}`).classList.add('container-response-esqueceu-senha-hidden')
    }

    async function submitForm(event) {
        event.preventDefault()

        const myForm = document.getElementById('myFormEsqueceuSenha')
        const formData = new FormData(myForm)
        const data = Object.fromEntries(formData)

        const response = await fetch(urlEsqueceuSenha, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const dataResponse = await response.json()
        if (response.status != 200 || response.status === 200) {
            const element = document.querySelector('.container-response-esqueceu-senha')
            element.classList.remove('container-response-esqueceu-senha-hidden')

            const textResponse = document.querySelector('.response-text-esqueceu-senha')
            console.log(dataResponse.message)
            textResponse.innerHTML = dataResponse.message
        }
    }

    return (
        <>
            <div className='container-esqueceu-senha'>
                <div className='container-response-esqueceu-senha container-response-esqueceu-senha-hidden'>
                    <div className='container-info-response-esqueceu-senha'>
                        <div className='div-close-alert-response-esqueceu-senha'>
                            <button onClick={() => { closeWindowResponse('container-response-esqueceu-senha') }} className='btn-close-alert-response-esqueceu-senha'>
                                X
                            </button>
                        </div>
                        <div className='container-text-esqueceu-senha'>
                            <p className='response-text-esqueceu-senha'></p>

                            <Link to={'/'}>
                                <button className='btn-response-esqueceu-senha'>
                                    Retornar para a pagina de login!
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <form id='myFormEsqueceuSenha' className='form-esqueceu-senha' onSubmit={(event) => { submitForm(event) }}>
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
            </div>
        </>
    )
}

export default EsqueceuSenha