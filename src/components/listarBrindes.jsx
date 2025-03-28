import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Loading from './loading'
import ModalResponse from './modalResponse';

import '../style/listarBrindes_component/listarBrindes.css'

const urlListarBrindes = import.meta.env.VITE_URL_LISTAR_BRINDES

const ListarBrindes = ({ clickBrinde, closeModal, driverBrinde }) => {
    const tokenUser = localStorage.getItem('token');
    const navigate = useNavigate()

    const [brindes, setBrindes] = useState(null)

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    async function listarBrindes() {
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

    useEffect(() => {
        listarBrindes()
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
                        {brindes && brindes.map((brinde, index) =>
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

                                <p className='brinde-expiracao'>
                                    Brinde valido por: {brinde.expiracao} {brinde.expiracao > 1 ? 'Dias' : 'Dia'}
                                </p>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </>
    )
}

export default ListarBrindes