import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faGasPump } from '@fortawesome/free-solid-svg-icons'

import '../style/abastecimento_component/abastecimento.css'

const Abastecimento = () => {
    const navigate = useNavigate()

    const posto = JSON.parse(localStorage.getItem('detalhes'))

    const [btnChecked, setBtnChecked] = useState('btn-litro')

    function formatLitro(e) {
        let input = e.target
        let inputValue = input.value.replace(/[^0-9]/g, '')

        if (inputValue.length > 1) {
            inputValue = inputValue.slice(0, 1) + '.' + inputValue.slice(1);
        }
        if (inputValue.length > 4) {
            inputValue = input.value.replace(/[^0-9]/g, '')
            inputValue = inputValue.slice(0, 2) + '.' + inputValue.slice(2);
        }

        if (inputValue.length > 5) {
            inputValue = inputValue.slice(0, 5)
        }

        input.value = inputValue
    }

    function enviarDados() {
        const Typecombustivel = document.getElementById('combustivel').value
        const payMethod = document.getElementById('pagamento').value

        let valor = null
        let abastecimento = null

        if (document.getElementById('input-litro')) {
            abastecimento = 'litro'
            valor = document.getElementById('input-litro').value
        } else {
            abastecimento = 'encher-tanque'
            valor = document.getElementById('input-tanque').value
        }

        let metodoAbastecimento = {
            tipo_combustivel: Typecombustivel,
            metodo_pagamento: payMethod,
            forma_abastecimento: abastecimento,
            litros: valor,
            posto
        }
        localStorage.setItem('dadosAbastecimento', JSON.stringify(metodoAbastecimento))
        navigate('/gerar_qrcode')
    }

    useEffect(() => {
        if (posto === null) {
            navigate('/home', { replace: true })
            return
        }
    }, [])

    return (
        <>
            <div className="container-abastecimento-title">
                <div className='container-icon-title'>
                    <Link to={'/home'}>
                        <FontAwesomeIcon className='arrow-icon' icon={faArrowLeftLong} />
                    </Link>

                    <h1 className='title-abastecimento'>Abastecimento</h1>
                </div>

                <div className='container-abastecimento'>
                    <div className='container-abastecer'>
                        <div className='container-combustivel-pagamento'>
                            <div className='container-combustivel'>
                                <label htmlFor='combustivel' className="text-label">
                                    Qual tipo de combustivel deseja abasetcer ?
                                </label>
                                <select name="combustivel" id="combustivel">
                                    <option value="etanol">Etanol</option>
                                    <option value="gasolina">Gasolina</option>
                                    <option value="diesel">Diesel</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='container-abastecer'>
                        <div className='container-combustivel-pagamento'>
                            <div className="container-pagamento">
                                <label htmlFor='pagamento' className="text-label">
                                    Qual será a forma de pagamento?
                                </label>
                                <select name="pagamento" id="pagamento">
                                    <option value="debito">Debito</option>
                                    <option value="credito">Credito</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="pix">Pix</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='container-forma-de-abastecimento'>
                        <div className='container-text'>
                            <p className='text-abastecimento'>
                                Agora escolha a forma de abastecimento
                            </p>
                        </div>

                        <div className='container-btns-input'>
                            <div className='container-btns'>
                                <button
                                    onClick={() => { setBtnChecked('btn-litro') }}
                                    className={`btn-litro btn-option ${btnChecked != 'btn-litro' ? '' : 'checked'}`}
                                    type="button">
                                    Litro
                                </button>

                                <button
                                    onClick={() => { setBtnChecked('btn-tanque') }}
                                    className={`btn-tanque btn-option ${btnChecked != 'btn-tanque' ? '' : 'checked'}`}
                                    type="button">
                                    Tanque
                                </button>
                            </div>

                            <div className='container-text-input'>
                                {btnChecked === 'btn-litro' && (
                                    <>
                                        <div className='container-option'>
                                            <p className='text-option'>
                                                Quantos litros deseja abastecer?
                                            </p>
                                            <input
                                                onChange={(e) => formatLitro(e)}
                                                id='input-litro'
                                                className='input-option'
                                                type="text"
                                                placeholder='Litros' />
                                        </div>
                                    </>
                                )}

                                {btnChecked === 'btn-tanque' && (
                                    <>
                                        <div className="container-option">
                                            <p className='text-option'>
                                                Enche o tanque!
                                            </p>
                                            <input
                                                onChange={(e) => formatLitro(e)}
                                                id='input-tanque'
                                                className='input-option'
                                                type="text"
                                                placeholder='Litros do Tanque' />
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>

                    <button
                        onClick={() => enviarDados()}
                        className='btn-abastecer btn-enche-o-tanque'
                        type="button">
                        Abastecer!
                        <FontAwesomeIcon className='gas-pump-icon' icon={faGasPump} />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Abastecimento
