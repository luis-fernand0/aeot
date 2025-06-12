import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faGasPump } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor'
import { formatLitro } from "../functions/formatLitro";
import { formasPagamento } from '../functions/contants';
import { validarLitro } from '../functions/validarLitro';

import ModalResponse from './modalResponse';

import '../style/abastecimento_component/abastecimento.css'

const Abastecimento = () => {
    const navigate = useNavigate()

    const posto = JSON.parse(localStorage.getItem('dadosPosto')) || {}

    const [formasPagamentos, setFormasPagamento] = useState([])
    const [formaAbastecimento, setFormaAbastecimento] = useState()
    const [combustivelAtual, setCombustivelAtual] = useState()
    const [btnChecked, setBtnChecked] = useState()
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [litroValid, setLitroValid] = useState(false);

    const [melhorOpcao, setMelhorOpcao] = useState({})

    let combustiveis = Object.keys(posto.combustiveis)
    function changePagamento(combustivel) {
        setBtnChecked()
        setCombustivelAtual(combustivel)

        let pagamento = posto.combustiveis[combustivel].melhor_opcao.forma_pagamento
        setMelhorOpcao({ combustivel, forma_pagamento: [pagamento] })

        let pagamentos = []
        let keysPagamento = Object.keys(posto.combustiveis[combustivel].formas_valor)
        keysPagamento.forEach((key, index) => {
            let linhaAtual = posto.combustiveis[combustivel].formas_valor[key]
            if (!pagamentos.includes(linhaAtual.forma_pagamento)) {
                pagamentos[index] = linhaAtual.forma_pagamento
            }
        })

        setFormasPagamento(pagamentos)
        changeAbastecimento(combustivel, pagamento)
    }
    function changeAbastecimento(combustivel, formaPagamento) {
        setMelhorOpcao((prev) => ({ ...prev, forma_pagamento: formaPagamento }))
        setBtnChecked()

        let keysPagamento = Object.keys(posto.combustiveis?.[combustivel].formas_valor)
        for (let key of keysPagamento) {
            let linhaAtual = posto.combustiveis?.[combustivel].formas_valor[key]
            if (linhaAtual.forma_pagamento == formaPagamento) {
                setFormaAbastecimento(linhaAtual.forma_abastecimento)
                if (linhaAtual.forma_abastecimento == 'Litragem Livre') {
                    setFormaAbastecimento(linhaAtual.forma_abastecimento)
                    break
                }
            }
        }
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

        let litro = null
        let valor = null
        let abastecimento = null

        if (document.getElementById('input-litro')) {
            abastecimento = 'Litragem Livre'
            litro = document.getElementById('input-litro').value.replace(/[^0-9]/g, '.')
            litro = Number(litro).toFixed(3)
        } else if (document.getElementById('input-valor')) {
            abastecimento = 'Litragem Livre'
            valor = document.getElementById('input-valor').value
            valor = Number(valor).toFixed(2)
        } else {
            abastecimento = 'Encher Tanque'
            litro = undefined
            valor = undefined
        }

        if (litro == 0.000 || valor == 0.00) {
            setModalMessage(`Porfavor informe a litragem/preço que vai abastecer para dar continuidade.`)
            setModalVisible(true)
            return
        }

        let metodoAbastecimento = {
            tipo_combustivel: Typecombustivel,
            metodo_pagamento: payMethod,
            forma_abastecimento: abastecimento,
            litros: litro,
            preco: valor,
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
        const combustiveisKeys = Object.keys(posto.combustiveis)
        let combustivel = combustiveisKeys[0]
        let pagamento = posto.combustiveis[combustivel].melhor_opcao.forma_pagamento

        setMelhorOpcao({ combustivel, forma_pagamento: [pagamento] })
        changePagamento(combustivel)
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
                                    Qual tipo de combustivel deseja abastecer ?
                                </label>
                                <select
                                    onChange={(e) => changePagamento(e.target.value)}
                                    name="combustivel"
                                    id="combustivel"
                                    value={melhorOpcao.combustivel}>
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
                                    onChange={(e) => changeAbastecimento(combustivelAtual, e.target.value)}
                                    name="pagamento"
                                    id="pagamento"
                                    value={melhorOpcao.forma_pagamento}>
                                    {formasPagamentos &&
                                        formasPagamentos.map((pagamento) => (
                                            <option value={pagamento} key={pagamento}>
                                                {pagamento.charAt(0).toUpperCase() + pagamento.slice(1)}
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
                                            onClick={() => { setBtnChecked('btn-valor'), setLitroValid(false) }}
                                            className={`btn-valor btn-option ${btnChecked != 'btn-valor' ? '' : 'checked'}`}
                                            type="button">
                                            Preço
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => { setBtnChecked('btn-tanque'), setLitroValid(false) }}
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
                                                    onChange={(e) => {
                                                        formatLitro(e);
                                                        setLitroValid(!validarLitro(e));
                                                    }}
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
                            type="button"
                            disabled={litroValid}>
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
