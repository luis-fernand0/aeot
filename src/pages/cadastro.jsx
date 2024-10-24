import * as React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import '../style/cadastro_page/cadastro.css'

const Cadastro = () => {

    function checkPhone(event) {
        let input = event.target

        input.value = maskPhone(input.value)

    }
    function maskPhone(value) {
        if (!value) return ""

        value = value.replace(/\D/g, '')
        value = value.replace(/(\d{2})(\d)/, "($1) $2")
        value = value.replace(/(\d)(\d{4})$/, "$1-$2")

        return value
    }

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
        const span = document.querySelectorAll('.span')
        const pass = password[0]
        const confirmpass = password[1]

        if (pass.value === confirmpass.value) {
            pass.classList.remove('alert-pass')
            confirmpass.classList.remove('alert-pass')

            for (let i = 0; i < span.length; i++) {
                const element = span[i];
                element.classList.add('hidden-span')
            }
        } else {
            pass.classList.add('alert-pass')
            confirmpass.classList.add('alert-pass')

            for (let i = 0; i < span.length; i++) {
                const element = span[i];
                element.classList.remove('hidden-span')
            }
        }
    }

    function formatPlate(event) {
        var plate = event.target
        var plateValue = plate.value.replace(/([A-z0-9]{3})(\d[A-j0-9]\d{2})/, '$1-$2')
        plate.value = plateValue

        return plate
    }

    return (
        <>
            <div className="container-cadastro">
                <img className='logo-aeot-cadastro' src="/logo_AEOT.png" alt="logo-aeot" />

                <form className="form-cadastro" action="">
                    <div className='cadastro-full'>

                        <div className='title-arrow'>
                            <Link to={'/'}>
                                <FontAwesomeIcon className='arrow-cadastro' icon={faArrowLeftLong} />
                            </Link>
                            <h1 className='title-cadastro'>Cadastre-se</h1>
                        </div>

                        <div className='datas-user'>
                            <input className='input-cadastro input-cadastro-nome' type="text" name="name" id="input-name" placeholder='Nome' required autoComplete='off' />

                            <input onChange={(event) => { checkPhone(event) }} className='input-cadastro' type="tel" name="telefone" id="input-tel" placeholder='Telefone' required autoComplete='off' maxLength={15} />

                            <input className='input-cadastro input-cadastro-email' type="email" name="email-cadastro" id="email-cadastro" placeholder='Email' required autoComplete='off' />

                            <div className='placa-modelo'>
                                <input onChange={(event) => { formatPlate(event) }} className='input-cadastro-veiculo' type="text" name="placa-veiculo" id="placa-veiculo" placeholder='Placa' required autoComplete='off' maxLength={8} />

                                <input className='input-cadastro-veiculo' type="text" name="modelo-veiculo" id="modelo-veiculo" placeholder='Modelo/Cor' required autoComplete='off' />
                            </div>

                            <span className='span hidden-span'>AS SENHAS DEVEM SER IGUAIS*</span>
                            <div className='div-pass-cadastro'>
                                <input onBlur={() => { checkPass() }} className='input-cadastro input-cadastro-pass' type="password" name="passaword-cadastro" id="passaword-cadastro" minLength={8} placeholder='Senha' required />

                                <button onClick={() => { revealPass() }} type='button' className='pass-reveal'>
                                    <FontAwesomeIcon className='eye-icon eye-icon-hidden hidden' icon={faEyeSlash} />
                                    <FontAwesomeIcon className='eye-icon eye-icon-show' icon={faEye} />
                                </button>
                            </div>

                            <span className='span hidden-span'>AS SENHAS DEVEM SER IGUAIS*</span>
                            <div className='div-pass-cadastro' >
                                <input onBlur={() => { checkPass() }} className='input-cadastro input-cadastro-pass' type="password" name="passaword-cadastro-check" id="passaword-cadastro-chek" placeholder='Confirme sua senha' minLength={8} required />
                                <button onClick={() => { revealPass() }} type='button' className='pass-reveal'>
                                    <FontAwesomeIcon className='eye-icon eye-icon-hidden hidden' icon={faEyeSlash} />
                                    <FontAwesomeIcon className='eye-icon eye-icon-show' icon={faEye} />
                                </button>
                            </div>

                        </div>

                        <div className='container-btn-cadastro'>
                            <button className='btn-cadastro' type="button">
                                Anexar CNH
                            </button>

                            <button className='btn-cadastro' type="button">
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
