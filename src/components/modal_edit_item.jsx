import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor'

import ModalResponse from './modalResponse'
import Loading from './loading'

import '../style/modal_edit_item_component/edit_item.css'

const urlEditarItem = import.meta.env.VITE_URL_EDITAR_ITEM

const EditItem = ({ show, close, categoria, item }) => {

    let itemFormatado = JSON.parse(JSON.stringify(item)) //APENAS COPIANDO O OBJETO ITEM

    const tokenUser = localStorage.getItem('token')
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const [showOptions, setShowOptions] = useState({})
    function toggleOptions(combustivel) {
        setShowOptions((prev) => ({
            ...prev,
            [combustivel]: !prev[combustivel],
        }))
    }

    const combustiveis = [
        { value: '1', label: 'etanol' },
        { value: '2', label: 'gasolina' },
        { value: '3', label: 'diesel' }
    ];

    const formasPagamento = [
        { value: '1', label: 'dinheiro' },
        { value: '2', label: 'pix' },
        { value: '3', label: 'debito' },
        { value: '4', label: 'credito' },
    ];

    const formasAbastecimentos = [
        { value: '', label: 'Escolha a forma de abastecimento' },
        { value: '1', label: 'Litragem Livre' },
        { value: '2', label: 'Encher Tanque' },
    ];

    if (categoria.categoria === 'postos') {
        //ITERANDO SOBRE CADA COMBUSTIVEL E CADA FORMA DE PAGAMENTO PARA DAR O VALOR 1 OU 2 NA FORMA DE ABASTECIMENTO DE CADA FORMA DE PAGAMENTO 
        combustiveis.forEach((keyCombustivel) => {
            let formasArray = Object.keys(itemFormatado.combustivel[keyCombustivel.label]?.formas || {})
            formasArray.forEach((keyFormas) => {
                formasAbastecimentos.map((keyAbastecimento) => {
                    let formaAbastecimento = itemFormatado.combustivel[keyCombustivel.label].formas[keyFormas].forma_abastecimento
                    if (formaAbastecimento === keyAbastecimento.label) {
                        itemFormatado.combustivel[keyCombustivel.label].formas[keyFormas].forma_abastecimento = keyAbastecimento.value
                    }

                })
            })
        })
    }

    async function editarItem(e) {
        e.preventDefault()
        setLoading(true)        
        try {
            const formData = new FormData(document.getElementById('form-editar-item'))
    
            if (categoria.categoria === 'postos') {
                let inputCheckeds = document.querySelectorAll("input[name='combustivel']:checked")
    
                if (inputCheckeds.length === 0) {
                    setModalMessage('Selecione pelos menos um combustivel para trabalhar!')
                    setModalVisible(true)
                    return
                }
    
                let combustiveis = {}
                let lastPay = null
                let lastCombustivel = null
    
                for (let [key, value] of formData.entries()) {
                    if (key === 'combustivel') {
                        combustiveis[value] = {
                            combustivel: value,
                            valor: '',
                            formas: {}
                        }
                        lastCombustivel = value
                    }
                    if (key === 'valor' && lastCombustivel) {
                        combustiveis[lastCombustivel].valor = value
                    }
                    if (key === 'forma_pagamento' && lastCombustivel) {
                        if (!combustiveis[lastCombustivel].formas[value]) {
                            combustiveis[lastCombustivel].formas[value] = {
                                forma_pagamento: value,
                                forma_abastecimento: ''
                            }
                            lastPay = value
                        }
                    }
                    if (key === 'forma_abastecimento' && lastPay) {
                        combustiveis[lastCombustivel].formas[lastPay].forma_abastecimento = value
                        lastPay = null
                    }
                }
                formData.append('combustiveis', JSON.stringify(combustiveis))
                formData.delete('combustivel')
                formData.delete('valor')
                formData.delete('forma_pagamento')
                formData.delete('forma_abastecimento')
            }
            formData.append('item_id', item.cod_posto || item.cod_anuncio)
            formData.append('categoria', categoria.categoria)
    
            const formObject = Object.fromEntries(formData)

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

    useEffect(() => {
        if (categoria.categoria === 'postos') {
            let optionsInitial = {}

            combustiveis.forEach((combustivel) => {
                if (itemFormatado.combustivel[combustivel.label]) {
                    optionsInitial[combustivel.label] = true
                }

                setShowOptions(optionsInitial)
            })
        }
    }, [])

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
                            defaultValue={itemFormatado.descricao}
                            placeholder={itemFormatado.descricao} />
                        <input
                            className="input-editar-item"
                            type="text"
                            name="endereco"
                            id="endereco-item"
                            defaultValue={itemFormatado.endereco}
                            placeholder={itemFormatado.endereco} />

                        {categoria.categoria === 'postos' && (
                            <>
                                <div className='cadastrar-combustivel'>
                                    <p className='text-info'>
                                        Com qual combustivel deseja trabalhar?
                                    </p>

                                    {combustiveis.map((combustivel) => (
                                        <div key={combustivel.value} className="container-combustivel">
                                            <div className='container-checkbox-combustivel'>
                                                <input
                                                    defaultChecked={itemFormatado.combustivel[combustivel.label]}
                                                    className='checkbox-combustivel'
                                                    type="checkbox"
                                                    name='combustivel'
                                                    id={combustivel.label}
                                                    value={combustivel.value}
                                                    onChange={() => toggleOptions(combustivel.label)} />

                                                <label
                                                    className='text-combustivel'
                                                    htmlFor={combustivel.label}>
                                                    {combustivel.label.charAt(0).toUpperCase() + combustivel.label.slice(1)}
                                                </label>
                                            </div>
                                            {showOptions[combustivel.label] && (
                                                <div
                                                    key={combustivel.value}
                                                    className='container-valor-formas'>
                                                    <input
                                                        defaultValue={itemFormatado.combustivel[combustivel.label]?.valor}
                                                        onChange={(e) => checkValor(e)} className='combustivel-valor'
                                                        type="text" name={`valor`}
                                                        placeholder='Valor' />

                                                    {formasPagamento.map((pagamento) => (
                                                        <div
                                                            key={pagamento.value}
                                                            className="container-forma">
                                                            <div className='container-forma-pagamento'>
                                                                <input
                                                                    defaultChecked={itemFormatado.combustivel[combustivel.label]?.formas[pagamento.value]?.forma_pagamento}
                                                                    className='checkbox-combustivel'
                                                                    type="checkbox"
                                                                    name='forma_pagamento'
                                                                    value={pagamento.value}
                                                                    id={`${pagamento.label}_${combustivel.label}`} />
                                                                <label htmlFor={`${pagamento.label}_${combustivel.label}`}>
                                                                    {pagamento.label.charAt(0).toUpperCase() + pagamento.label.slice(1)}
                                                                </label>
                                                            </div>

                                                            <select key={pagamento}
                                                                name="forma_abastecimento"
                                                                id="forma_abastecimento"
                                                                defaultValue={itemFormatado.combustivel[combustivel.label]?.formas[pagamento.value]?.forma_abastecimento}>
                                                                {formasAbastecimentos.map((abastecimento) => (
                                                                    <option
                                                                        key={abastecimento.value}
                                                                        value={abastecimento.value}>
                                                                        {abastecimento.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
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