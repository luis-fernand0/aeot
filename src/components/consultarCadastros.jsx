import { Link } from 'react-router-dom';
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import '../style/consultaCadastros_component/consutarCadastros.css'

const ConsultarCadastros = () => {

    const [cadastros, setCadastros] = useState([])

    async function consultarCadastro() {
        const response = await fetch('', {
            
        })
    }

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
                        <input className='input-buscar' type="text" placeholder='Pesquise: Posto, Frenstista e Motorista' />
                        <button className='btn-pesquisar'>Pesquisar</button>
                    </div>

                    <div className='container-cadastros-list'>
                        <ul className='cadastros-list'>
                            <li className='cadastro'>
                                <div className='container-info-cadastro'>
                                    <p>Motorista</p>
                                    <p>Nome: João</p>
                                    <p>Telefone: 99 99999-9999</p>
                                </div>

                                <button className='btn-detalhes'>
                                    <span className='linha'></span>
                                    <span className='linha'></span>
                                    <span className='linha'></span>
                                </button>
                            </li>

                            <li className='cadastro'>
                                <div className='container-info-cadastro'>
                                    <p>Frentista</p>
                                    <p>Nome: Mario</p>
                                    <p>Telefone: 99 99999-9999</p>
                                </div>

                                <button className='btn-detalhes'>
                                    <span className='linha'></span>
                                    <span className='linha'></span>
                                    <span className='linha'></span>
                                </button>
                            </li>

                            <li className='cadastro'>
                                <div className='container-info-cadastro'>
                                    <p>Posto</p>
                                    <p>Nome: POSTO A</p>
                                    <p>CNPJ: 09.472.508.0001/67</p>
                                </div>

                                <button className='btn-detalhes'>
                                    <span className='linha'></span>
                                    <span className='linha'></span>
                                    <span className='linha'></span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConsultarCadastros