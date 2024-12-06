import * as React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import Loading from '../components/loading'
import ModalResponse from '../components/modalResponse'
import { checkPhone } from '../functions/checkPhone';
import { verificarFoto } from '../functions/verificarFoto'

import '../style/cadastro_page/cadastro.css'

const urlCadastro = import.meta.env.VITE_URL_CADASTRO;

const Cadastro = () => {

    const [erroModeloCor, setErroModeloCor] = useState(false);
    const [fotoValid, setFotoValid] = useState(false)

    const [loading, setLoading] = useState(false)

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Função para validar se o input contém pelo menos duas palavras
    function validarModeloCor(wordValid) {
        if (!wordValid) {
            document.getElementById('span-modelo').classList.remove('hidden-span-modelo')
            setErroModeloCor(wordValid);

            return
        }
        console.log(wordValid)
        document.getElementById('span-modelo').classList.add('hidden-span-modelo')
        setErroModeloCor(wordValid);

        return
    }
    function handleChangeModeloCor(event) {
        var inputModelCor = event.target;
        const regex = /^\w+\s+\w+/;
        inputModelCor.value = inputModelCor.value.toUpperCase()

        validarModeloCor(regex.test(inputModelCor.value));
    }

    const callCheckPhone = (e) => checkPhone(e)

    function revealPass() {
        const element = document.querySelectorAll(`.eye-icon`)

        for (let i = 0; i < element.length; i++) {
            const btn = element[i];
            btn.classList.toggle('hidden')
        }

        const input = document.querySelectorAll('.input-cadastro-pass')
        for (let i = 0; i < input.length; i++) {
            const element = input[i];
            if (element.type === 'password') {
                element.type = 'text'
            } else {
                element.type = 'password'
            }

        }
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
    function formatEmail(e) {
        var inputEmail = e.target
        inputEmail.value = inputEmail.value.toLowerCase()

        return inputEmail
    }

    function formatPlate(event) {
        var plate = event.target
        // Remove todos os caracteres que não são letras ou números
        var plateValue = plate.value.replace(/[^A-Za-z0-9]/g, '');
        if (plateValue.length > 3) {
            plateValue = plateValue.slice(0, 3) + '-' + plateValue.slice(3);
        }
        if (plateValue.length > 8) {
            plateValue = plateValue.slice(0, 8);
        }

        plate.value = plateValue.toUpperCase()

        return plate
    }

    function anexarFoto(nomeFoto) { document.getElementById(nomeFoto).click() }
    async function callVerificarFoto(inputId, span, btnId) {
        // setFotoValid(verificarFoto(inputId, span, btnId))
        const foto = await verificarFoto(inputId, span, btnId)
        console.log(foto)
        if (!foto) {
            document.querySelector(`.${span}`).classList.remove('hidden-span-alert')
            document.querySelector(`#${btnId}`).classList.remove('checked-foto')
            return false
        }
        
        setFotoValid(foto)
        document.querySelector(`.${span}`).classList.add('hidden-span-alert')
        document.querySelector(`#${btnId}`).classList.add('checked-foto')
    }

    async function hundleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            if (!erroModeloCor || !fotoValid || !checkPass()) {
                setModalMessage('É necessario preencher todos os dados!')
                setModalVisible(true)

                setLoading(false)

                return
            }

            const myForm = document.getElementById('myFormCadastro')
            const formData = new FormData(myForm)

            const response = await fetch(`${urlCadastro}`, {
                method: 'POST',
                body: formData
            })
            const dataResponse = await response.json()
            if (response.status != 200 || response.status === 200) {
                setModalMessage(dataResponse.message)
                setModalVisible(true)
            }
        } catch (err) {
            setModalMessage(`Ocorreu um erro inesperado. Tente novamente mais tarde.` + err.message)
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
            <div className="container-cadastro">
                <img className='logo-aeot-cadastro' src="/logo_AEOT.png" alt="logo-aeot" />

                <form onSubmit={(e) => { hundleSubmit(e) }} id='myFormCadastro' className="form-cadastro">
                    <div className='cadastro-full'>

                        <div className='title-arrow'>
                            <Link to={'/'}>
                                <FontAwesomeIcon className='arrow-cadastro' icon={faArrowLeftLong} />
                            </Link>
                            <h1 className='title-cadastro'>Cadastre-se</h1>
                        </div>

                        <div className='datas-user'>
                            <input className='input-cadastro input-cadastro-nome' type="text" name="name" id="input-name" placeholder='Nome' required autoComplete='off' />

                            <input
                                onChange={(e) => { callCheckPhone(e) }} className='input-cadastro' type="tel" name="telefone" id="input-tel" placeholder='Telefone' required autoComplete='off' maxLength={15} />

                            <input className='input-cadastro input-cadastro-email' type="email" name="email_cadastro" id="email-cadastro" placeholder='Email' required autoComplete='off' onChange={(e) => { formatEmail(e) }} />

                            <div className='placa-modelo'>
                                <input onChange={(event) => { formatPlate(event) }} className='input-cadastro-veiculo' type="text" name="placa_veiculo" id="placa-veiculo" placeholder='Placa' required autoComplete='off' maxLength={8} />

                                <span id='span-modelo' className='span hidden-span-modelo'>PORFAVOR INSIRA MODELO E COR DO VEICULO EXEMPLO: ONIX PRETO*</span>
                                <input onBlur={(e) => { handleChangeModeloCor(e) }} className='input-cadastro-veiculo' type="text" name="modelo_veiculo" id="modelo-veiculo" placeholder='Modelo/Cor' required autoComplete='off' />
                            </div>

                            <span className='span span-pass hidden-span'>AS SENHAS DEVEM SER IGUAIS*</span>
                            <div className='div-pass-cadastro'>
                                <input onBlur={() => { checkPass() }} className='input-cadastro input-cadastro-pass' type="password" name="password_cadastro" id="password-cadastro" minLength={6} placeholder='Senha' required />

                                <button onClick={() => { revealPass() }} type='button' className='pass-reveal'>
                                    <FontAwesomeIcon className='eye-icon eye-icon-hidden hidden' icon={faEyeSlash} />
                                    <FontAwesomeIcon className='eye-icon eye-icon-show' icon={faEye} />
                                </button>
                            </div>

                            <span className='span span-pass hidden-span'>AS SENHAS DEVEM SER IGUAIS*</span>
                            <div className='div-pass-cadastro' >
                                <input onBlur={() => { checkPass() }} className='input-cadastro input-cadastro-pass' type="password" name="password_cadastro_check" id="password-cadastro-chek" placeholder='Confirme sua senha' minLength={6} required />
                                <button onClick={() => { revealPass() }} type='button' className='pass-reveal'>
                                    <FontAwesomeIcon className='eye-icon eye-icon-hidden hidden' icon={faEyeSlash} />
                                    <FontAwesomeIcon className='eye-icon eye-icon-show' icon={faEye} />
                                </button>
                            </div>

                        </div>

                        <div className='container-btn-cadastro'>
                            <span className='span-alert hidden-span-alert alert-foto'>
                                *É NECESSARIO ADICIONAR UMA FOTO DE PERFIL!
                            </span>
                            <input
                                onChange={() => { callVerificarFoto('foto_user', 'alert-foto', 'btn-foto-user') }}
                                type="file"
                                className='input-foto-print'
                                name="foto_user"
                                id="foto_user"
                                accept='image/*' />
                            <button
                                onClick={() => { anexarFoto('foto_user') }}
                                id='btn-foto-user'
                                className='btn-cadastro foto_user'
                                type="button">
                                Anexar Foto de Perfil
                            </button>


                            <span className='span-alert hidden-span-alert alert-cnh'>
                                *É NECESSARIO ADICIONAR UMA FOTO DA CNH!
                            </span>
                            <input
                                onChange={() => { callVerificarFoto('foto_cnh', 'alert-cnh', 'btn-foto-cnh') }} type="file"
                                className='input-foto-print'
                                name="foto_cnh" id="foto_cnh"
                                accept='image/*' />
                            <button
                                onClick={() => { anexarFoto('foto_cnh') }}
                                id='btn-foto-cnh'
                                className='btn-cadastro foto_cnh'
                                type="button">
                                Anexar CNH
                            </button>

                            <span className='span-alert hidden-span-alert alert-print-app'>
                                *É NECESSARIO ADICIONAR UM PRINT DO APP DE MOBILIDADE!
                            </span>
                            <input
                                onChange={() => { callVerificarFoto('print_app', 'alert-print-app', 'btn-print-app') }} type="file"
                                className='input-foto-print'
                                name="print_app"
                                id="print_app"
                                accept='image/*' />
                            <button
                                onClick={() => { anexarFoto('print_app') }}
                                id='btn-print-app'
                                className='btn-cadastro print_app'
                                type="button">
                                Anexar print do APP de mobilidade
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
