import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faGasPump } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor'

import '../style/abastecimento_component/abastecimento.css'
import { use } from 'react';

const Abastecimento = () => {
    const navigate = useNavigate()

    const posto = JSON.parse(localStorage.getItem('dadosItem'))

    const [formasPagamento, setFormasPagamento] = useState([])
    const [formaAbastecimento, setFormaAbastecimento] = useState()
    const [combustivelAtual, setCombustivelAtual] = useState()
    const [btnChecked, setBtnChecked] = useState()

    let combustiveis = Object.keys(posto.combustivel)
    let pagamentos = []
    function changePagamento(combustivel) {
        setBtnChecked()
        setCombustivelAtual(combustivel)
        let keyPagamento = Object.keys(posto.combustivel[combustivel].formas)
        keyPagamento.forEach((key, index) => {
            pagamentos[index] = posto.combustivel[combustivel].formas[key].forma_pagamento
        })
        setFormasPagamento(pagamentos)
    }
    function changeAbastecimento(formaAbastecimento) {
        setBtnChecked()
        const formasPagamento = [
            { value: '1', label: 'dinheiro' },
            { value: '2', label: 'pix' },
            { value: '3', label: 'debito' },
            { value: '4', label: 'credito' },
        ];
        formasPagamento.forEach((pagamento) => {
            if (pagamento.label === formaAbastecimento) {
                console.log(formaAbastecimento)
                setFormaAbastecimento(posto.combustivel[combustivelAtual].formas[pagamento.value].forma_abastecimento)
                console.log(posto.combustivel[combustivelAtual].formas[pagamento.value].forma_abastecimento)
            }
        })
    }
    function formatLitro(e) {
        let input = e.target
        let inputValue = input.value.replace(/[^0-9]/g, '')

        if (inputValue.length > 2) {
            inputValue = inputValue.slice(0, 2) + '.' + inputValue.slice(2);
        }
        if (inputValue.length > 5) {
            inputValue = input.value.replace(/[^0-9]/g, '')
            inputValue = inputValue.slice(0, 3) + '.' + inputValue.slice(3);
        }

        if (inputValue.length > 6) {
            inputValue = inputValue.slice(0, 6)
        }

        input.value = inputValue
    }

    function enviarDados() {
        const Typecombustivel = document.getElementById('combustivel').value
        const payMethod = document.getElementById('pagamento').value
        console.log(payMethod, Typecombustivel)

        let valor = null
        let abastecimento = null

        if (document.getElementById('input-litro')) {
            abastecimento = 'litro'
            valor = document.getElementById('input-litro').value
        } else if (document.getElementById('input-valor')) {
            abastecimento = 'valor'
            valor = document.getElementById('input-valor').value
        } else {
            abastecimento = 'encher-tanque'
            valor = undefined
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
        combustiveis.forEach((combustivel) => {
            changePagamento(combustivel)
        })
    }, [])

    return (
        <>
            <div className="container-abastecimento-title">
                <div className='container-icon-title'>
                    <Link to={'/home'}>
                        <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
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
                                <select
                                    onChange={(e) => changePagamento(e.target.value)}
                                    name="combustivel"
                                    id="combustivel"
                                    defaultValue={''}>
                                    <option value=''>Combustivel que deseja abastecer</option>
                                    {combustiveis.map((keyCombustivel) => (
                                        <option key={keyCombustivel} value={keyCombustivel}>
                                            {keyCombustivel.charAt(0).toUpperCase() + keyCombustivel.slice(1)}
                                        </option>
                                    ))}
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
                                <select
                                    onChange={(e) => changeAbastecimento(e.target.value)}
                                    name="pagamento"
                                    id="pagamento"
                                    defaultValue={''}>
                                    <option value=''>Escolha o metodo de pagamento</option>
                                    {formasPagamento &&
                                        formasPagamento.map((pagamento) => (
                                            <option
                                                value={pagamento.charAt(0).toLowerCase() + pagamento.slice(1)}
                                                key={pagamento}>
                                                {pagamento}
                                            </option>
                                        ))}
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
                                {formaAbastecimento === 'Litragem Livre' && (
                                    <>
                                        <button
                                            onClick={() => { setBtnChecked('btn-litro') }}
                                            className={`btn-litro btn-option ${btnChecked != 'btn-litro' ? '' : 'checked'}`}
                                            type="button">
                                            Litro
                                        </button>

                                        <button
                                            onClick={() => { setBtnChecked('btn-valor') }}
                                            className={`btn-valor btn-option ${btnChecked != 'btn-valor' ? '' : 'checked'}`}
                                            type="button">
                                            Preço
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => { setBtnChecked('btn-tanque') }}
                                    className={`btn-tanque btn-option ${btnChecked != 'btn-tanque' ? '' : 'checked'}`}
                                    type="button">
                                    Tanque
                                </button>
                            </div>

                            <div className='container-text-input'>
                                {formaAbastecimento === 'Litragem Livre' && (
                                    <>
                                        {btnChecked === 'btn-litro' && (
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
                                        )}

                                        {btnChecked === 'btn-valor' && (
                                            <div className='container-option'>
                                                <p className='text-option'>
                                                    Qual valor deseja abastecer?
                                                </p>
                                                <input
                                                    onChange={(e) => checkValor(e)}
                                                    id='input-valor'
                                                    className='input-option'
                                                    type="text"
                                                    placeholder='Valor' />
                                            </div>
                                        )}
                                    </>
                                )}

                                {btnChecked === 'btn-tanque' && (
                                    <div className="container-option">
                                        <p className='text-option'>
                                            Enche o tanque!
                                        </p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {btnChecked && (
                        <button
                            onClick={() => enviarDados()}
                            className='btn-abastecer btn-enche-o-tanque'
                            type="button">
                            Abastecer!
                            <FontAwesomeIcon className='gas-pump-icon' icon={faGasPump} />
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default Abastecimento
