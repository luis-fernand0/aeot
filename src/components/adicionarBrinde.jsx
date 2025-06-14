import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { combustiveis, formasPagamento, formasAbastecimentos } from '../functions/contants'

import ListarBrindes from './listarBrindes'
import Loading from './loading'
import ModalResponse from './modalResponse';

import '../style/adicionarBrinde_component/adicionarBrinde.css'

const urlAddBrinde = import.meta.env.VITE_URL_ADICIONAR_BRINDE

const AdicionarBrinde = ({ propCodPosto, propCombustiveis }) => {
    const tokenUser = localStorage.getItem('token');
    const navigate = useNavigate()

    const [selecionarBrinde, setSelecionarBrinde] = useState(false)
    const [combustiveisSelecionados, setCombustiveisSelecionados] = useState([]);
    const [formasSelecionadas, setFormasSelecionadas] = useState({});
    const [showOptions, setShowOptions] = useState({})
    const [showFormaAbastecimento, setShowFormaAbastecimento] = useState({})

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    function toggleOptions(combustivel) {
        setShowOptions((prev) => ({
            ...prev,
            [combustivel]: !prev[combustivel],
        }))
    }

    const verDados = (e) => {
        e.preventDefault();
        setLoading(true)
        let combustiveisCheckeds = document.querySelectorAll("input[name='combustivel']:checked")
        let pagamentosCheckeds = document.querySelectorAll("input[name='forma_pagamento']:checked")

        if (combustiveisCheckeds.length === 0 || pagamentosCheckeds.length === 0) {
            setModalMessage('Selecione pelo menos um combustível e uma forma de pagamento!')
            setModalVisible(true)
            setLoading(false)
            return
        }
        setLoading(false)
        setSelecionarBrinde(true)
    }

    async function cadastrarBrinde(brinde) {
        setLoading(true)
        try {
            let combustiveisSelecionados = {}
            let lastPay = null
            let lastCombustivel = null

            let formCombustivel = new FormData(document.getElementById('form-combustivel'))
            for (let [key, value] of formCombustivel.entries()) {
                if (key === 'combustivel') {
                    combustiveis.forEach((combustivel) => {
                        if(combustivel.label == value) {
                            value = combustivel.value
                        }
                    })
                    combustiveisSelecionados[value] = {
                        combustivel: value,
                        brinde: brinde.cod_brinde,
                        formas: {}
                    }
                    lastCombustivel = value
                }
                if (key === 'forma_pagamento' && lastCombustivel) {
                    formasPagamento.forEach((pagamento) => {
                        if(pagamento.label == value) {
                            value = pagamento.value
                        }
                    })
                    if (!combustiveisSelecionados[lastCombustivel].formas[value]) {
                        combustiveisSelecionados[lastCombustivel].formas[value] = {
                            forma_pagamento: value,
                            forma_abastecimento: ''
                        }
                        lastPay = value
                    }
                }
                if (key === 'forma_abastecimento' && lastPay) {
                    formasAbastecimentos.forEach((abastecimento) => {
                        if(abastecimento.label == value) {
                            value = abastecimento.value
                        }
                    })
                    combustiveisSelecionados[lastCombustivel].formas[lastPay].forma_abastecimento = value
                    lastPay = null
                }
            }            

            const response = await fetch(urlAddBrinde, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ combustiveis: combustiveisSelecionados, cod_posto: propCodPosto })
            })
            const data = await response.json()

            if (response.status === 401) {
                navigate('/', { replace: true })
            }

            setModalMessage(data.message)
            setModalVisible(true)
            setSelecionarBrinde(false)
            if (response.ok) {
                setCombustiveisSelecionados([])
                setFormasSelecionadas({})
            }
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. ` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    const CardFormasPagamento = ({ combustivel, showFormaAbastecimento, setShowFormaAbastecimento }) => {
        function toggleOptions(combustivel, forma_pagamento) {
            setShowFormaAbastecimento((prev) => ({
                ...prev,
                [`${combustivel}_${forma_pagamento}`]: !prev[`${combustivel}_${forma_pagamento}`],
            }))
        }

        let pagamentos = []
        let keysFormas = Object.keys(propCombustiveis[combustivel].formas_valor)
        keysFormas.forEach((elemento) => {
            let linhaAtual = propCombustiveis[combustivel].formas_valor[elemento]
            if (!pagamentos.includes(linhaAtual.forma_pagamento)) {
                pagamentos.push(linhaAtual.forma_pagamento)
            }
        })
        return (
            <div>
                {pagamentos.map((pagamento) => (
                    <div className='forma-pagamento-container'>
                        <input
                            className='forma_pagamento'
                            type='checkbox'
                            value={pagamento}
                            id={`${combustivel}-${pagamento}`}
                            name='forma_pagamento'
                            checked={formasSelecionadas[combustivel]?.includes(pagamento) || false}
                            onChange={(e) => {
                                const atual = formasSelecionadas[combustivel] || []
                                let novo
                                if (e.target.checked) {
                                    novo = [...atual, pagamento]
                                } else {
                                    novo = atual.filter(p => p !== pagamento)
                                }
                                setFormasSelecionadas(prev => ({
                                    ...prev,
                                    [combustivel]: novo
                                }))
                                toggleOptions(combustivel, pagamento)
                            }}
                        />
                        <label htmlFor={`${combustivel}-${pagamento}`}>
                            {pagamento}
                        </label>

                        {showFormaAbastecimento[`${combustivel}_${pagamento}`] && (
                            <CardFormaAbastecimento
                                combustivel={combustivel}
                                formaPagamento={pagamento} />
                        )}
                    </div>
                ))}
            </div>
        )
    }

    const CardFormaAbastecimento = ({ combustivel, formaPagamento }) => {
        let formaAbastecimento = []
        let keysFormas = Object.keys(propCombustiveis[combustivel].formas_valor)
        for (let key of keysFormas) {
            let linhaAtual = propCombustiveis[combustivel].formas_valor[key]
            if (linhaAtual.forma_pagamento == formaPagamento) {
                if (linhaAtual.forma_abastecimento == 'Litragem Livre') {
                    formaAbastecimento.pop()
                    formaAbastecimento.push(linhaAtual.forma_abastecimento)
                    break
                }
                formaAbastecimento.push(linhaAtual.forma_abastecimento)
            }
        }

        return (
            <div>
                <select name="forma_abastecimento">
                    <option value={formaAbastecimento}>
                        {formaAbastecimento}
                    </option>
                    {formaAbastecimento == 'Litragem Livre' && (
                        <option value='Encher Tanque'>
                            Encher Tanque
                        </option>
                    )}
                </select>
            </div>
        )
    }

    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}
            />
            <div className='container-add-brinde'>
                <h3 className='title-add-brinde'>
                    Em qual combustível deseja adicionar o brinde?
                </h3>

                <form onSubmit={verDados} id='form-combustivel' className='form-combustivel'>
                    {Object.keys(propCombustiveis).map((keyCombustivel) => (
                        <div>
                            <input
                                className='combustivel'
                                type='checkbox'
                                id={keyCombustivel}
                                value={keyCombustivel}
                                name='combustivel'
                                checked={combustiveisSelecionados.includes(keyCombustivel)}
                                onChange={(e) => {
                                    const selected = [...combustiveisSelecionados]
                                    if (e.target.checked) {
                                        selected.push(keyCombustivel)
                                    } else {
                                        const index = selected.indexOf(keyCombustivel)
                                        if (index > -1) selected.splice(index, 1)
                                    }
                                    setCombustiveisSelecionados(selected)
                                    toggleOptions(keyCombustivel)
                                }}
                            />
                            <label className='text-combustivel' htmlFor={keyCombustivel}>
                                {keyCombustivel.charAt(0).toUpperCase() + keyCombustivel.slice(1)}
                            </label>


                            {showOptions[keyCombustivel] && (
                                <CardFormasPagamento
                                    combustivel={keyCombustivel}
                                    showFormaAbastecimento={showFormaAbastecimento}
                                    setShowFormaAbastecimento={setShowFormaAbastecimento} />
                            )}
                        </div>
                    ))}

                    <button className='btn-selecionar-brinde' type='submit'>
                        Selecionar brinde
                    </button>
                </form>

                {selecionarBrinde && (
                    <div className='container-component-brindes'>
                        <ListarBrindes
                            showBtns={false}
                            clickBrinde={cadastrarBrinde}
                            closeModal={setSelecionarBrinde} />
                    </div>
                )}
            </div>
        </>
    )
}

export default AdicionarBrinde;
