import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor'

import ModalResponse from './modalResponse'
import Loading from './loading'

import '../style/modal_edit_item_component/edit_item.css'

const urlEditarItem = import.meta.env.VITE_URL_EDITAR_ITEM

const EditItem = ({ show, close, categoria, item }) => {
    const tokenUser = localStorage.getItem('token')

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    async function editarItem(e) {
        e.preventDefault()
        setLoading(true)

        let checkboxes = document.querySelectorAll("input[type='checkbox']")
        checkboxes.forEach((checkbox) => {
            checkbox.value = checkbox.checked
        })

        const myForm = document.getElementById('form-editar-item')
        const formData = new FormData(myForm)
        formData.append('categoria', categoria.categoria)
        formData.append('item_id', item.cod_posto || item.cod_anuncio)
        checkboxes.forEach((checkbox) => {
            if (!checkbox.checked) {
                formData.append(checkbox.name, checkbox.checked)
            }
        })
        const formObject = Object.fromEntries(formData)

        try {
            const response = await fetch(urlEditarItem, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            })
            const data = await response.json()

            if (response.status === 403) {
                navigate('/', { replace: true })
                return
            }
            if (!response.ok) {
                setModalMessage(data.message)
                setModalVisible(true)
                return
            }

            setModalMessage(data.message)
            setModalVisible(true)
            document.getElementById('btn-close').click()
            
        } catch (err) {
            setModalMessage(err.message)
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
                onClose={() => setModalVisible(false)}
                message={modalMessage}
            />
            <div className="container-modal-editar-item" hidden={show ? false : true}>
                <div className='container-btn-form'>
                    <div className='container-btn-close'>
                        <button id='btn-close' className='btn-close' onClick={close}>
                            <FontAwesomeIcon className='x-icon'
                                icon={faXmark} />
                        </button>

                    </div>
                    <form
                        onSubmit={(e) => editarItem(e)}
                        id='form-editar-item'
                        className="form-editar-item">

                        <textarea
                            className="editar-item-descricao"
                            name="descricao"
                            id="descricao-item"
                            defaultValue={item.descricao}
                            placeholder={item.descricao} />
                        <input
                            className="input-editar-item"
                            type="text"
                            name="endereco"
                            id="endereco-item"
                            defaultValue={item.endereco}
                            placeholder={item.endereco} />

                        {categoria.categoria === 'postos' && (
                            <>
                                <p className='text-editar-item'>
                                    Valores dos combustiveis
                                </p>
                                <div className='container-edit-combustivel'>
                                    <input
                                        onChange={(e) => checkValor(e)}
                                        className="input-editar-item"
                                        name='etanol'
                                        id='etanol'
                                        type="text"
                                        defaultValue={item.etanol}
                                        placeholder={item.etanol} />
                                </div>

                                <div className='container-edit-combustivel'>
                                    <input
                                        onChange={(e) => checkValor(e)}
                                        className="input-editar-item"
                                        name='gasolina'
                                        id='gasolina'
                                        type="text"
                                        defaultValue={item.gasolina}
                                        placeholder={item.gasolina} />
                                </div>

                                <div className='container-edit-combustivel'>
                                    <input
                                        onChange={(e) => checkValor(e)}
                                        className="input-editar-item"
                                        name='diesel'
                                        id='diesel'
                                        type="text"
                                        defaultValue={item.diesel}
                                        placeholder={item.diesel} />
                                </div>

                                <p className='text-editar-item'>
                                    Formas de Pagamento
                                </p>
                                <div className='container-formas-de-pagamento'>
                                    <div className='container-forma-de-pagamento'>
                                        <input
                                            className='forma-de-pagamento-checkbox'
                                            type="checkbox"
                                            name="dinheiro"
                                            id="dinheiro"
                                            defaultChecked={item.dinheiro} />
                                        <label className='text-forma-de-pagamento' htmlFor="dinheiro">Dinheiro</label>
                                    </div>

                                    <div className='container-forma-de-pagamento'>
                                        <input
                                            className='forma-de-pagamento-checkbox'
                                            type="checkbox"
                                            name="pix"
                                            id="pix"
                                            defaultChecked={item.pix} />
                                        <label className='text-forma-de-pagamento' htmlFor="pix">Pix</label>
                                    </div>

                                    <div className='container-forma-de-pagamento'>
                                        <input
                                            className='forma-de-pagamento-checkbox'
                                            type="checkbox"
                                            name="debito"
                                            id="debito"
                                            defaultChecked={item.debito} />
                                        <label className='text-forma-de-pagamento' htmlFor="debito">Debito</label>
                                    </div>

                                    <div className='container-forma-de-pagamento'>
                                        <input
                                            className='forma-de-pagamento-checkbox'
                                            type="checkbox"
                                            name="credito"
                                            id="credito"
                                            defaultChecked={item.credito} />
                                        <label className='text-forma-de-pagamento' htmlFor="credito">Credito</label>
                                    </div>

                                </div>
                            </>
                        )}

                        <button type="submit" className="btn-salvar">
                            Salvar
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditItem