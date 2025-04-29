import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import EditarCadastro from './editarCadastro'

import '../style/consultaCadastros_component/consutarCadastros.css'

const ConsultarCadastros = () => {
    const tokenUser = localStorage.getItem('token')

    const [cadastros, setCadastros] = useState([])

    async function consultarCadastro() {
        const response = await fetch('http://localhost:3000/aeot/auth/buscar_cadastros', {
            headers: {
                'Authorization': `Bearer ${tokenUser}`
            }
        })

        const data = await response.json()
        setCadastros(data.cadastros)
    }

    return (
        <>
            <EditarCadastro/>
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
                        <button
                            onClick={() => consultarCadastro()}
                            className='btn-pesquisar'>
                            Pesquisar
                        </button>
                    </div>

                    <div className='container-cadastros-list'>
                        <ul className='cadastros-list'>
                            {cadastros && cadastros.map((cadastro) =>
                                <li
                                    key={cadastro.user_id}
                                    className='cadastro'>
                                    <div className='container-info-cadastro'>
                                        <p>
                                            {
                                                cadastro.tipo === 'driver' ?
                                                'MOTORISTA' :
                                                cadastro.tipo.toUpperCase()
                                            }
                                        </p>
                                        <p>Nome: {cadastro.nome}</p>
                                        {
                                            cadastro.tipo === 'driver' ||
                                                cadastro.tipo === 'frentista' ?
                                                <p>Telefone: {cadastro.telefone}</p> :
                                                <p>CNPJ: {cadastro.cnpj}</p>
                                        }
                                    </div>

                                    <button className='btn-detalhes'>
                                        <span className='linha'></span>
                                        <span className='linha'></span>
                                        <span className='linha'></span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConsultarCadastros