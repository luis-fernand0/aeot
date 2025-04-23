import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const ConsultarCadastros = () => {
    return (
        <>
            <div className="container">
                <div className='container-btn-voltar'>
                    <Link to={'/adicionar_cadastros'}>
                        <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
                    </Link>
                </div>

                <div className='container-todos-os-cadastros'>
                    <h1 className='title'>Consultar Cadastros</h1>

                    <div className='container-input-buscar'>
                        <input className='input-buscar' type="text" />
                        <button className='btn-pesquisar'>Pesquisar</button>
                    </div>

                    <div className='container-cadastros-list'>
                        <ul className='cadastros-list'>
                            <li>
                                <p>Motorista</p>
                                <p>Nome: João</p>
                                <p>Carro</p>
                                <p>Placa: BRL-1234</p>
                                <p>Modelo: Gol Preto</p>
                            </li>

                            <li>
                                <p>Frentista</p>
                                <p>Nome: Mario</p>
                                <p>Posto: POSTO A</p>
                            </li>

                            <li>
                                <p>Posto</p>
                                <p>Nome: POSTO A</p>
                                <p>CNPJ: 09.472.508.0001/67</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConsultarCadastros