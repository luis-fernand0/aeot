import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor'
import { combustiveis, formasPagamento, formasAbastecimentos } from '../functions/contants';


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

    const [configCombustiveis, setConfigCombustiveis] = useState({});
    const [showOptions, setShowOptions] = useState({})
    function toggleOptions(combustivel) {
        setShowOptions((prev) => ({
            ...prev,
            [combustivel]: !prev[combustivel],
        }))
    }

    function adicionarConfiguracao(combustivel) {
        setConfigCombustiveis((prev) => ({
            ...prev,
            [combustivel]: [...(prev[combustivel] || []), {
                forma_pagamento: '',
                forma_abastecimento: '',
                valor: ''
            }]
        }));
    };

    function removerConfiguracao(combustivel, index) {
        setConfigCombustiveis((prev) => ({
            ...prev,
            [combustivel]: prev[combustivel].filter((elemento, i) => i !== index)
        }));
    };

    function atualizarConfiguracao(combustivel, index, campo, valor) {
        setConfigCombustiveis((prev) => {
            const novoArray = [...prev[combustivel]];
            novoArray[index][campo] = valor;
            return {
                ...prev,
                [combustivel]: novoArray
            };
        });
    };

    function toggleOptions(combustivel) {
        setShowOptions((prev) => ({
            ...prev,
            [combustivel]: !prev[combustivel],
        }))
    }

    // if (categoria === 'postos') {
    //     //ITERANDO SOBRE CADA COMBUSTIVEL E CADA FORMA DE PAGAMENTO PARA DAR O VALOR 1 OU 2 NA FORMA DE ABASTECIMENTO DE CADA FORMA DE PAGAMENTO 
    //     combustiveis.forEach((keyCombustivel) => {
    //         let formasArray = Object.keys(itemFormatado.combustivel[keyCombustivel.label]?.formas || {})
    //         formasArray.forEach((keyFormas) => {
    //             formasAbastecimentos.map((keyAbastecimento) => {
    //                 let formaAbastecimento = itemFormatado.combustivel[keyCombustivel.label].formas[keyFormas].forma_abastecimento
    //                 if (formaAbastecimento === keyAbastecimento.label) {
    //                     itemFormatado.combustivel[keyCombustivel.label].formas[keyFormas].forma_abastecimento = keyAbastecimento.value
    //                 }

    //             })
    //         })
    //     })
    // }

    async function editarItem(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData(document.getElementById('form-editar-item'))

            if (categoria === 'postos') {
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
            formData.append('categoria', categoria)

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

            if (response.status === 401) {
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

    // useEffect(() => {
    //     if (categoria === 'postos') {
    //         let optionsInitial = {}

    //         combustiveis.forEach((combustivel) => {
    //             if (itemFormatado.combustivel[combustivel.label]) {
    //                 optionsInitial[combustivel.label] = true
    //             }

    //             setShowOptions(optionsInitial)
    //         })
    //     }
    // }, [])

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

                        {categoria === 'postos' && (
                            <>
                                <div className='cadastrar-combustivel'>
                                    <p className='text-info'>
                                        Com qual combustivel deseja trabalhar?
                                    </p>

                                    {combustiveis.map((combustivel) => (
                                        <div key={combustivel.value} className="container-combustivel">
                                            <div className='conatiner-checkbox-combustivel'>
                                                <input
                                                    className='checkbox-combustivel'
                                                    type="checkbox"
                                                    name='combustiveis'
                                                    id={combustivel.label}
                                                    value={combustivel.value}
                                                    onChange={() => toggleOptions(combustivel.label)} />

                                                <label className='text-combustivel' htmlFor={combustivel.label}>
                                                    {combustivel.label.charAt(0).toUpperCase() + combustivel.label.slice(1)}
                                                </label>
                                            </div>

                                            {showOptions[combustivel.label] && (
                                                <div className='container-valor-formas'>
                                                    {(configCombustiveis[combustivel.value] || []).map((config, index) => (
                                                        <div key={index} className='grupo-config'>
                                                            <select
                                                                value={config.forma_pagamento}
                                                                onChange={(e) =>
                                                                    atualizarConfiguracao(combustivel.value, index, 'forma_pagamento', e.target.value)}>
                                                                <option value="">Forma de pagamento</option>
                                                                {formasPagamento.map((pagamento) => (
                                                                    <option key={pagamento.value} value={pagamento.value}>
                                                                        {pagamento.label}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <select
                                                                value={config.forma_abastecimento}
                                                                onChange={(e) =>
                                                                    atualizarConfiguracao(combustivel.value, index, 'forma_abastecimento', e.target.value)}>
                                                                <option value="">Forma de abastecimento</option>
                                                                {formasAbastecimentos.map((abastecimento) => (
                                                                    <option key={abastecimento.value} value={abastecimento.value}>
                                                                        {abastecimento.label}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <input
                                                                type="text"
                                                                placeholder="Valor"
                                                                value={config.valor}
                                                                onChange={(e) => {
                                                                    checkValor(e)
                                                                    atualizarConfiguracao(combustivel.value, index, 'valor', e.target.value);
                                                                }} />

                                                            <button
                                                                type="button"
                                                                onClick={() => removerConfiguracao(combustivel.value, index)}>
                                                                Remover
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={() => adicionarConfiguracao(combustivel.value)}>
                                                        + Adicionar configuração
                                                    </button>
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