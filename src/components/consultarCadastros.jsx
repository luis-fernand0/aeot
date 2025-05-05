import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import Loading from './loading'
import ModalResponse from './modalResponse';
import EditarCadastro from './editarCadastro'

import '../style/consultarCadastros_component/consultarCadastros.css'

const ConsultarCadastros = () => {
    const tokenUser = localStorage.getItem('token')

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const [cadastros, setCadastros] = useState([])
    const [showModal, setShowModal] = useState({ view: false, cadastro: null })

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const limit = 15

    async function consultarCadastro(p = page) {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:3000/aeot/auth/buscar_cadastros?page=${p}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${tokenUser}`
                }
            })

            const data = await response.json()
            setCadastros(data.cadastros)
            setTotal(data.total)
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possivel consultar os cadastros.` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        consultarCadastro()
    }, [page])

    const totalPages = Math.ceil(total / limit)

    return (
        <>
            <EditarCadastro
                showModal={showModal}
                close={() => setShowModal({ view: false, cadastro: null })} />
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}/>

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
                                    onClick={() => setShowModal({ view: true, cadastro: cadastro })}
                                    key={cadastro.id}
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

                                    <button
                                        className='btn-detalhes'>
                                        <span className='linha'></span>
                                        <span className='linha'></span>
                                        <span className='linha'></span>
                                    </button>
                                </li>
                            )}
                        </ul>

                        <div className="paginacao">
                            <button
                                disabled={page <= 1}
                                onClick={() => {
                                    setPage(1)
                                }}>
                                Primeira
                            </button>
                            <button
                                disabled={page <= 1}
                                onClick={() => {
                                    setPage(page - 1)
                                }}>
                                Anterior
                            </button>

                            <span>Página {page} de {totalPages}</span>

                            <button
                                disabled={page >= totalPages}
                                onClick={() => {
                                    setPage(page + 1)
                                }}>
                                Próxima
                            </button>

                            <button
                                disabled={page >= totalPages}
                                onClick={() => {
                                    setPage(totalPages)
                                }}>
                                Ultima
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConsultarCadastros