import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import Loading from './loading'
import ModalResponse from './modalResponse';
import EditarCadastro from './editarCadastro'

import '../style/consultarCadastros_component/consultarCadastros.css'

const urlBuscarFrentista = import.meta.env.VITE_URL_BUSCAR_FRENTISTA
const urlBuscarCadastro = import.meta.env.VITE_URL_BUSCAR_CADASTROS
const urlBuscarUsers = import.meta.env.VITE_URL_BUSCAR_USERS

const ConsultarCadastros = () => {
    const tokenUser = localStorage.getItem('token')
    const typeUser = localStorage.getItem('type_user')

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const [filtro, setFiltro] = useState({})
    const [users, setUsers] = useState()
    const [cadastros, setCadastros] = useState([])
    const [showModal, setShowModal] = useState({ view: false, cadastro: null })
    const [showAutocomplete, setShowAutocomplete] = useState(false)
    const inputRef = useRef(null)
    const autocompleteRef = useRef(null)

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const limit = 15

    const handleChange = (e) => {
        let input = e.target.value;
        setFiltro({ nome: input })
    }

    async function consultarCadastro(p = page) {
        setLoading(true)
        try {
            const query = new URLSearchParams({
                page: p,
                limit,
                nome: filtro?.nome || '',
                user_id: filtro?.user_id || '',
                tipo: filtro?.tipo || ''
            }).toString()
            const response = await fetch(`${urlBuscarCadastro}?${query}`, {
                headers: {
                    'Authorization': `Bearer ${tokenUser}`
                }
            })

            const data = await response.json()
            if (response.status === 401) {
                navigate('/', { replace: true })
            }
            setCadastros(data.cadastros)
            setTotal(data.total)
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possivel consultar os cadastros.` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    async function buscarUsers(nome) {
        const response = await fetch(`${urlBuscarUsers}?nome=${nome}`, {
            headers: {
                'Authorization': `Bearer ${tokenUser}`
            }
        })
        const data = await response.json()
        setUsers(data.cadastros)
        setShowAutocomplete(true)
    }
    async function buscarFrentista(nome) {
        const response = await fetch(`${urlBuscarFrentista}?nome=${nome}`, {
            headers: {
                'Authorization': `Bearer ${tokenUser}`
            }
        })
        const data = await response.json()
        setUsers(data.frentistas)
        setShowAutocomplete(true)
    }

    useEffect(() => {
        consultarCadastro()
    }, [page])

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                autocompleteRef.current &&
                !autocompleteRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setShowAutocomplete(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


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
                message={modalMessage} />

            <div className="container">
                <div className='container-btn-voltar'>
                    <Link to={'/adicionar_cadastros'}>
                        <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
                    </Link>
                </div>

                <div className='container-todos-os-cadastros'>
                    <h1 className='title'>Consultar Cadastros</h1>

                    <div className='container-input-buscar'>
                        <div className='container-input-filtro'>
                            <input
                                ref={inputRef}
                                onChange={(e) => {
                                    {typeUser === 'posto' && (buscarFrentista(e.target.value))}
                                    {typeUser === 'administrador' && (buscarUsers(e.target.value))}
                                    handleChange(e)
                                }}
                            className='input-buscar'
                            type="text"
                            id='input-filtro'
                                placeholder='Pesquise: Posto, Frentista e Motorista' />
                            <div
                                ref={autocompleteRef}
                                hidden={!showAutocomplete}
                                id='container-autocomplete'
                                className='container-ul-autocomplete'>
                                <ul className='ul-autocomplete'>
                                    {users && users.map((user) =>
                                        <li
                                            onClick={() => {
                                                document.getElementById(`input-filtro`).value = user.nome.toUpperCase()
                                                setFiltro({ nome: user.nome, user_id: user.user_id, tipo: user.tipo })
                                                setUsers([])
                                                setShowAutocomplete(false)
                                            }}
                                            key={user.user_id}>
                                            <p>
                                                {user.tipo === `driver` ? `MOTORISTA` : user.tipo.toUpperCase()}
                                            </p>
                                            <p>
                                                {user.nome.toUpperCase()}
                                            </p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
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