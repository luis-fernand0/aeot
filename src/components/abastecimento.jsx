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
                    <div>
                        <label className="label-input">
                            <span className="text-label">
                                Qual tipo de combustivel deseja abasetcer ?
                            </span>
                            <br />
                            <select name="combustivel_pagamento" id="combustivel_pagamento">
                                <option value="etanol">Etanol</option>
                                <option value="gasolina">Gasolina</option>
                                <option value="diesel">Diesel</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Abastecimento
