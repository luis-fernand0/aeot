import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

const Abastecimento = () => {
    return (
        <>
            <div className="container-abastecimento">
                <div className='container-icon-title'>
                    <FontAwesomeIcon className='arrow-icon' icon={faArrowLeftLong} />

                    <h1 className='title-abastecimento'>Abastecimento</h1>
                </div>

                <div className='container-abastecer'>
                    <div className='container-combustivel-pagamento'>
                        <label className="label-input">
                            <span className="text-label">
                                Qual tipo de combustivel deseja abasetcer ?
                            </span>
                            <br />
                            <select name="combustivel" id="combustivel">
                                <option value="etanol">Etanol</option>
                                <option value="gasolina">Gasolina</option>
                                <option value="diesel">Diesel</option>
                            </select>
                        </label>

                        <br />

                        <label className='label-input'>
                            <span>
                                Qual será a forma de pagamento?
                            </span>
                            <br />
                            <select name="pagamento" id="pagamento">
                                <option value="Debito">Debito</option>
                                <option value="Credito">Credito</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Pix">Pix</option>
                            </select>
                        </label>
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
                            <button type="button">Litro</button>
                            <button type="button">Preço</button>
                            <button type="button">Tanque</button>
                        </div>

                        <div className='container-text-input'>
                            <p>
                                Quantos litros deseja abastecer?
                            </p>
                            <input type="text" placeholder='Litros'/>

                            <p>
                                Qual valor deseja abastecer?
                            </p>
                            <input type="text" placeholder='Preço'/>

                            <p>
                                Enche o tanque!
                            </p>
                            <button type="button">Encher o tanque!</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Abastecimento
