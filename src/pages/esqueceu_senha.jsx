import { useState } from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import { formatarEmail } from '../functions/formatarEmail'

import Loading from '../components/loading'
import ModalResponse from '../components/modalResponse'

import '../style/esqueceu_senha_page/esqueceu_senha.css'

const urlEsqueceuSenha = import.meta.env.VITE_URL_ESQUECEU_SENHA

const EsqueceuSenha = () => {
    const [viewPass, setViewPass] = useState({
        'senha-atual': false,
        'esqueceu-senha-pass': false
    })

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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

    async function submitForm(e) {
        e.preventDefault()
        setLoading(true)

        const myForm = document.getElementById('myFormEsqueceuSenha')
        const formData = new FormData(myForm)
        const data = Object.fromEntries(formData)

        try {
            const response = await fetch(urlEsqueceuSenha, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const dataResponse = await response.json()
            
            if (response.status != 200) {
                throw new Error(dataResponse.message)
            }

            setModalMessage(dataResponse.message)
            setModalVisible(true)
        } catch (err) {
            setModalMessage(err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }

    }

    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}
                buttonText="Retornar para a página de login"
                redirectTo="/"
            />
            <div className='container-esqueceu-senha'>
                <form id='myFormEsqueceuSenha' className='form-esqueceu-senha' onSubmit={(e) => submitForm(e)}>
                    <div className='div-email-pass-esqueceu-senha'>
                        <Link to={'/'}>
                            <FontAwesomeIcon className='arrow-esqueceu-senha' icon={faArrowLeftLong} />
                        </Link>

                        <input
                            onChange={(e) => formatarEmail(e)}
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