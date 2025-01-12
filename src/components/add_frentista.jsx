import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import { checkPhone } from '../functions/checkPhone'
import { formatarEmail } from '../functions/formatarEmail'
import { revealPass } from '../functions/revealPass'

import Loading from '../components/loading'
import ModalResponse from '../components/modalResponse'

const urlCadastro = import.meta.env.VITE_URL_CADASTRAR_FRENTISTA

const CadastrarFrentista = () => {
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const tokenUser = localStorage.getItem('token');
    const typeUser = localStorage.getItem('type_user')

    const navigate = useNavigate()

    if (typeUser === 'driver' || typeUser === 'frentista') {
        return navigate('/', { replace: true })
    }

    async function hundleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        if (!checkPass()) {
            setModalMessage('É necessario preencher todos os dados!')
            setModalVisible(true)

            setLoading(false)

            return
        }

        const myForm = document.getElementById('myFormCadastro')
        const formData = new FormData(myForm)
        const data = Object.fromEntries(formData)

        try {
            const response = await fetch(urlCadastro, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const dataResponse = await response.json()

            if (response.status === 403) {
                return navigate('/', { replace: true })
            }

            setModalMessage(dataResponse.message)
            setModalVisible(true)
        } catch (err) {
            setModalMessage(`Ocorreu um erro inesperado. Tente novamente mais tarde.` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }

    }

    function limitarCaracter(e) {
        let uf = e.target
        let ufValue = uf.value.replace(/[^a-zA-Z]/g, '')

        if (ufValue.length > 2) {
            ufValue = ufValue.slice(0, 2)
        }

        ufValue = ufValue.toUpperCase()

        return uf.value = ufValue
    }

    function checkPass() {
        const password = document.querySelectorAll('.input-cadastro-pass')
        const span = document.querySelectorAll('.span-pass')
        const pass = password[0]
        const confirmpass = password[1]

        if (pass.value != confirmpass.value) {
            pass.classList.add('alert-pass')
            confirmpass.classList.add('alert-pass')

            for (let i = 0; i < span.length; i++) {
                const element = span[i];
                element.classList.remove('hidden-span')
            }

            return false
        }
        pass.classList.remove('alert-pass')
        confirmpass.classList.remove('alert-pass')

        for (let i = 0; i < span.length; i++) {
            const element = span[i];
            element.classList.add('hidden-span')
        }

        return true
    }

    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}
            />
            <div className="container-cadastro">
                <form onSubmit={(e) => hundleSubmit(e)} id='myFormCadastro' className="form-cadastro">
                    <div className='cadastro-full'>

                        <div className='title-arrow'>
                            <Link to={'/adicionar_cadastros'}>
                                <FontAwesomeIcon className='arrow-cadastro' icon={faArrowLeftLong} />
                            </Link>
                        </div>

                        <div className='datas-user'>
                            <input
                                className='input-cadastro input-cadastro-nome'
                                type="text"
                                name="name"
                                id="input-name"
                                placeholder='Nome'
                                required autoComplete='off' />

                            <input
                                onChange={(e) => checkPhone(e)}
                                className='input-cadastro'
                                type="tel" name="telefone"
                                id="input-tel"
                                placeholder='Telefone'
                                required autoComplete='off'
                                maxLength={15} />

                            <input
                                onChange={(e) => formatarEmail(e)}
                                className='input-cadastro input-cadastro-email'
                                type="email"
                                name="email_cadastro"
                                id="email-cadastro"
                                placeholder='Email'
                                required autoComplete='off' />

                            <input
                                className='input-cadastro'
                                type="text"
                                name="cid_cadastro"
                                id="cid-cadastro"
                                placeholder='Cidade'
                                autoComplete='off' />

                            <input
                                onChange={(e) => limitarCaracter(e)}
                                className='input-cadastro'
                                type="text"
                                name="uf_cadastro"
                                id="uf-cadastro"
                                placeholder='UF'
                                autoComplete='off' />

                            <span className='span span-pass hidden-span'>AS SENHAS DEVEM SER IGUAIS*</span>
                            <div className='div-pass-cadastro'>
                                <input onBlur={() => checkPass()} className='input-cadastro input-cadastro-pass' type="password" name="password_cadastro" id="password-cadastro" minLength={6} placeholder='Senha' required />

                                <button onClick={() => revealPass('input-cadastro-pass')} type='button' className='pass-reveal'>
                                    <FontAwesomeIcon className='eye-icon eye-icon-hidden hidden' icon={faEyeSlash} />
                                    <FontAwesomeIcon className='eye-icon eye-icon-show' icon={faEye} />
                                </button>
                            </div>

                            <span className='span span-pass hidden-span'>AS SENHAS DEVEM SER IGUAIS*</span>
                            <div className='div-pass-cadastro' >
                                <input onBlur={() => checkPass()} className='input-cadastro input-cadastro-pass' type="password" name="password_cadastro_check" id="password-cadastro-chek" placeholder='Confirme sua senha' minLength={6} required />
                                <button onClick={() => revealPass('input-cadastro-pass')} type='button' className='pass-reveal'>
                                    <FontAwesomeIcon className='eye-icon eye-icon-hidden hidden' icon={faEyeSlash} />
                                    <FontAwesomeIcon className='eye-icon eye-icon-show' icon={faEye} />
                                </button>
                            </div>

                        </div>

                        <div className='container-btn-cadastro'>
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

export default CadastrarFrentista