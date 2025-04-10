import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'

import Loading from './loading'
import ModalResponse from './modalResponse';
import EditarBrinde from './editarBrinde'

import '../style/listarBrindes_component/listarBrindes.css'

const urlListarBrindes = import.meta.env.VITE_URL_LISTAR_BRINDES
const urlRemoveBrinde = import.meta.env.VITE_URL_REMOVE_BRINDE

const ListarBrindes = ({ clickBrinde, closeModal, driverBrinde, showBtns = true }) => {
    const tokenUser = localStorage.getItem('token');
    const navigate = useNavigate()

    const [brindes, setBrindes] = useState(null)
    const [showModal, setShowModal] = useState({ view: false, brinde: null })
    const [modalConfirm, setModalConfirm] = useState({ view: false, brinde: null })

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    async function listandoBrindes() {
        setLoading(true)
        try {
            const response = await fetch(urlListarBrindes, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`
                }
            })
            const data = await response.json()

            if (response.status === 403) {
                navigate('/', { replace: true })
            }

            if (response.status === 404) {
                setModalMessage(data.message)
                setModalVisible(true)
                setBrindes(null)
                return
            }
            setBrindes(data)
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possível listar os brinde.` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    async function removeBrinde(brinde) {
        setLoading(true)
        try {
            const response = await fetch(urlRemoveBrinde, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(brinde)
            })
            const data = await response.json()

            setModalMessage(data.message)
            setModalVisible(true)
            setModalConfirm({ view: false, brinde: null })
            listandoBrindes()
        } catch {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possível excluir o brinde.` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    function getStatusBrinde(brinde) {
        if (brinde.resgatado) {
            return { texto: 'Resgatado', classe: 'status-resgatado' }
        }
        if (brinde.expirado) {
            return { texto: 'Expirado', classe: 'status-expirado' }
        }

        const createdAt = new Date(brinde.created_at)
        const expiresAt = new Date(createdAt)
        expiresAt.setDate(createdAt.getDate() + brinde.expiracao)

        const hoje = new Date()
        const diffTime = expiresAt.getTime() - hoje.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
            texto: `Expira em ${diffDays} ${diffDays > 1 ? 'dias' : 'dia'}`,
            classe: 'status-pendente'
        }
    }


    useEffect(() => {
        listandoBrindes()
    }, [])

    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}
            />
            <div className="container-brindes">
                {closeModal && (
                    <div className='container-close-listar-brindes'>
                        <button
                            className='btn-close-listar-brindes'
                            onClick={() => { closeModal(false) }}>
                            <FontAwesomeIcon className='x-icon' icon={faXmark} />
                        </button>
                    </div>
                )}
                {brindes && (
                    <ul className="lista-brindes">
                        {brindes && brindes.map((brinde, index) => {
                            const statusBrinde = getStatusBrinde(brinde);
                            return (
                                <li
                                    key={index}
                                    onClick={() => clickBrinde && clickBrinde(brinde)}
                                    className="brinde">
                                    {driverBrinde && (
                                        <>
                                            <p>
                                                Posto: {brinde?.nome_posto}
                                            </p>

                                            <p>
                                                Endereço: {brinde?.endereco_posto}
                                            </p>
                                        </>
                                    )}
                                    <p className='nome-brinde'>
                                        Nome do brinde: {brinde?.nome_brinde?.toUpperCase()}
                                    </p>

                                    <p className='brinde-descricao'>
                                        {brinde?.descricao_brinde?.toUpperCase()}
                                    </p>

                                    <p className='brinde-abastecimento'>
                                        Abastecer no minimo: {brinde?.abastecimentos_minimos} {brinde?.abastecimentos_minimos > 1 ? 'Vezes' : 'Vez'}
                                    </p>

                                    <p className='brinde-expiracao'>
                                        Brinde valido por: {brinde.expiracao} {brinde.expiracao > 1 ? 'Dias' : 'Dia'}
                                    </p>

                                    <p className={`status-brinde ${statusBrinde.classe}`}>
                                        {statusBrinde.texto}
                                    </p>

                                    {showBtns && (
                                        <div className='container-btn-control'>
                                            <button
                                                onClick={() => { setShowModal({ view: true, brinde: brinde }) }}
                                                className='btn-control btn-edit'>
                                                <FontAwesomeIcon className='pen-icon' icon={faPen} />
                                            </button>

                                            <button
                                                className='btn-control btn-remove'
                                                onClick={() => setModalConfirm({ view: true, brinde: brinde })}>
                                                <FontAwesomeIcon className='trash-icon' icon={faTrash} />
                                            </button>
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {modalConfirm.view && (
                <div className='container-modal-confirm'>
                    <div className='modal-confirm'>
                        <div className='container-modal-confirm-text'>
                            <p className='modal-confirm-text'>
                                Tem certeza que deseja excluir o brinde?
                                <span className='modal-confirm-text-span'>
                                    *Ao excluir um brinde, ele será removido de todos os combustíveis, mas motoristas que já receberam ainda poderão resgatá-lo até o vencimento!*
                                </span>
                            </p>
                        </div>

                        <div className="container-modal-confirm-btn">
                            <button
                                onClick={() => removeBrinde(modalConfirm.brinde)}
                                className='btn-modal-confirm btn-excluir'>
                                Excluir
                            </button>

                            <button
                                onClick={() => setModalConfirm({ view: false, brinde: null })}
                                className='btn-modal-confirm btn-cancelar'>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal.view && (
                <EditarBrinde
                    closeModal={(state) => {
                        setShowModal(state)
                        listandoBrindes()
                    }}
                    brinde={showModal.brinde} />
            )}
        </>
    )
}

export default ListarBrindes