import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faGasPump } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor'
import { formatLitro } from "../functions/formatLitro";
import { formasPagamento } from '../functions/contants';

import ModalResponse from './modalResponse';

import '../style/abastecimento_component/abastecimento.css'

const Abastecimento = () => {
    const navigate = useNavigate()

    const posto = JSON.parse(localStorage.getItem('dadosItem'))

    const [formasPagamentos, setFormasPagamento] = useState([])
    const [formaAbastecimento, setFormaAbastecimento] = useState()
    const [combustivelAtual, setCombustivelAtual] = useState()
    const [btnChecked, setBtnChecked] = useState()
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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
        formasPagamento.forEach((pagamento) => {
            if (pagamento.label === formaAbastecimento) {
                setFormaAbastecimento(posto.combustivel[combustivelAtual].formas[pagamento.value].forma_abastecimento)
            }
        })
    }

    function enviarDados() {
        const Typecombustivel = document.getElementById('combustivel').value
        const payMethod = document.getElementById('pagamento').value
        if (Typecombustivel === '') {
            setModalMessage(`Porfavor escolha um combustivel para dar continuidade.`)
            setModalVisible(true)
            return
        }
        if (payMethod === '') {
            setModalMessage(`Porfavor marque um metodo de pagamento para dar continuidade.`)
            setModalVisible(true)
            return
        }

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
        if (valor === '') {
            setModalMessage(`Porfavor informe a litragem/preço que vai abastecer para dar continuidade.`)
            setModalVisible(true)
            return
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
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage} />
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
                                    {formasPagamentos &&
                                        formasPagamentos.map((pagamento) => (
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
