import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faGasPump } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor'

import '../style/abastecimento_component/abastecimento.css'

const Abastecimento = () => {
    const [btnChecked, setBtnChecked] = useState('btn-litro')

    const callCheckValor = (e) => {
        checkValor(e)
    }

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

                            <div className="container-pagamento">
                                <label htmlFor='pagamento' className="text-label">
                                    Qual será a forma de pagamento?
                                </label>
                                <select name="pagamento" id="pagamento">
                                    <option value="Debito">Debito</option>
                                    <option value="Credito">Credito</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Pix">Pix</option>
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
                                    onClick={() => { setBtnChecked('btn-preco') }}
                                    className={`btn-preco btn-option ${btnChecked != 'btn-preco' ? '' : 'checked'}`}
                                    type="button">
                                    Preço
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
                                                className='input-option'
                                                type="text"
                                                placeholder='Litros' />
                                            <Link to={'/perfil'}>
                                                <button
                                                    className='btn-abastecer'
                                                    type="button">
                                                    Abastecer!
                                                    <FontAwesomeIcon className='gas-pump-icon' icon={faGasPump} />
                                                </button>
                                            </Link>
                                        </div>
                                    </>
                                )}

                                {btnChecked === 'btn-preco' && (
                                    <>
                                        <div className='container-option'>
                                            <p className='text-option'>
                                                Qual valor deseja abastecer?
                                            </p>
                                            <input
                                                onChange={(e) => { callCheckValor(e) }}
                                                className='input-option'
                                                type="text"
                                                placeholder='Preço' />


                                            <Link to={'/perfil'}>
                                                <button
                                                    className='btn-abastecer'
                                                    type="button">
                                                    Abastecer!
                                                    <FontAwesomeIcon className='gas-pump-icon' icon={faGasPump} />
                                                </button>
                                            </Link>
                                        </div>
                                    </>
                                )}

                                {btnChecked === 'btn-tanque' && (
                                    <>
                                        <div className="container-option">
                                            <p className='text-option'>
                                                Enche o tanque!
                                            </p>
                                            <button
                                                className='btn-abastecer btn-enche-o-tanque'
                                                type="button">
                                                Encher o tanque!
                                                <FontAwesomeIcon className='gas-pump-icon' icon={faGasPump} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Abastecimento
