import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Loading from './loading'
import ModalResponse from './modalResponse'

import '../style/editarBrinde_component/editarBrinde.css'

const EditarBrinde = ({ brinde, closeModal }) => {
    const tokenUser = localStorage.getItem('token');
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    function formatarInput(e) {
        let input = e.target
        var inputValue = input.value.replace(/[^0-9]/g, '')

        return input.value = inputValue
    }

    async function editarBrinde(e) {
        e.preventDefault()
        setLoading(true)

        try {
            const myForm = new FormData(document.getElementById('form-editar-brinde'))
            myForm.append('cod_brinde', brinde.cod_brinde)
            const formData = Object.fromEntries(myForm)

            const response = await fetch('http://localhost:3000/aeot/auth/editar_brinde', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.status === 403) {
                navigate('/', { replace: true })
            }

            setModalMessage(data.message)
            setModalVisible(true)
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possível listar os brinde.` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => {
                    setModalVisible(false)
                    closeModal({view: false, brinde: null})
                }}
                message={modalMessage}
            />
            <div className="container-form-edit-brinde">
                <form onSubmit={(e) => editarBrinde(e)}
                    id='form-editar-brinde'
                    className='form-editar-brinde'>
                    <div className='container-close-modal-editar-brindes'>
                        <button
                            id='btn-close-editar-brindes'
                            className='btn-close-editar-brindes'
                            onClick={() => closeModal({ view: false, brinde: null })}>
                            <FontAwesomeIcon className='x-icon' icon={faXmark} />
                        </button>
                    </div>

                    <div className='container-inputs'>
                        <label className='text-input' htmlFor="nome-brinde">
                            Nome brinde
                        </label>
                        <input
                            defaultValue={brinde?.nome_brinde?.toUpperCase()}
                            className='input-info'
                            id='nome-brinde'
                            name='nome_brinde'
                            type="text"
                            placeholder='Nome do brinde'
                            required />
                    </div>

                    <div className='container-inputs'>
                        <label className='text-input' htmlFor="descricao">
                            Descrição
                        </label>
                        <textarea
                            defaultValue={brinde?.descricao_brinde?.toUpperCase()}
                            className='textarea'
                            name="descricao"
                            id="descricao"
                            placeholder='Descrição do brinde'
                            required />
                    </div>

                    <div className='container-inputs'>
                        <label className='text-input' htmlFor="expiracao">
                            Abastecimento minimo
                        </label>
                        <input
                            defaultValue={brinde?.abastecimentos_minimos}
                            onChange={(e) => formatarInput(e)}
                            className='input-info'
                            name='abastecimento_minimo'
                            id='abastecimento_minimo'
                            type="text"
                            placeholder='Quantidade minima de abastecimento'
                            required />
                    </div>

                    <div className='container-inputs'>
                        <label className='text-input' htmlFor="expiracao">
                            Tempo de expiração
                        </label>
                        <input
                            defaultValue={brinde.expiracao}
                            onChange={(e) => formatarInput(e)}
                            className='input-info'
                            name='expiracao'
                            id='expiracao'
                            type="text"
                            placeholder='Tempo em dias'
                            required />
                    </div>

                    <button type='submit' className='btn-editar'>
                        Editar
                    </button>
                </form>
            </div>
        </>
    )
}

export default EditarBrinde