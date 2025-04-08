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

    const [combustiveisSelecionados, setCombustiveisSelecionados] = useState([])
    const [formasSelecionadas, setFormasSelecionadas] = useState({})
    const [selecionarBrinde, setSelecionarBrinde] = useState(false)

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleCombustivelChange = (combustivelLabel) => {
        setCombustiveisSelecionados((prev) =>
            prev.includes(combustivelLabel)
                ? prev.filter((item) => item !== combustivelLabel)
                : [...prev, combustivelLabel]
        )
    }

    const handleFormaPagamentoChange = (combustivel, formaLabel) => {
        setFormasSelecionadas((prev) => {
            const novasFormas = { ...prev }

            if (!novasFormas[combustivel]) {
                novasFormas[combustivel] = []
            }

            novasFormas[combustivel] = novasFormas[combustivel].includes(formaLabel)
                ? novasFormas[combustivel].filter((item) => item !== formaLabel)
                : [...novasFormas[combustivel], formaLabel]

            return novasFormas
        })
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
            let combustiveis = {}
            let lastPay = null
            let lastCombustivel = null

            let formCombustivel = new FormData(document.getElementById('form-combustivel'))
            for (let [key, value] of formCombustivel.entries()) {
                if (key === 'combustivel') {
                    combustiveis[value] = {
                        combustivel: value,
                        brinde: brinde.cod_brinde,
                        formas: {}
                    }
                    lastCombustivel = value
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

            const response = await fetch(urlAddBrinde, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ combustiveis: combustiveis, cod_posto: propCodPosto })
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
                    {Object.keys(propCombustiveis).map((keyCombustivel) => {
                        const combustivel = combustiveis.find(c => c.label === keyCombustivel);
                        if (!combustivel) return null;

                        return (
                            <div key={combustivel.value} className='combustiveis'>
                                <div className='combustivel-container'>
                                    <input
                                        className='combustivel'
                                        type='checkbox'
                                        id={combustivel.label}
                                        value={combustivel.value}
                                        name='combustivel'
                                        checked={combustiveisSelecionados.includes(combustivel.label)}
                                        onChange={() => handleCombustivelChange(combustivel.label)}
                                    />
                                    <label className='text-combustivel' htmlFor={combustivel.label}>
                                        {combustivel.label.toUpperCase()}
                                    </label>
                                </div>

                                {combustiveisSelecionados.includes(combustivel.label) &&
                                    Object.keys(propCombustiveis[keyCombustivel].formas).map((keyForma) => {
                                        const forma = formasPagamento.find(f =>
                                            f.label === propCombustiveis[keyCombustivel].formas[keyForma].forma_pagamento.toLowerCase()
                                        )
                                        if (!forma) return null;

                                        return (
                                            <div key={forma.value} className='formas-pagamento'>
                                                <div className='forma-pagamento-container'>
                                                    <input
                                                        className='forma_pagamento'
                                                        type='checkbox'
                                                        id={`${combustivel.label}-${forma.label}`}
                                                        value={forma.value}
                                                        name='forma_pagamento'
                                                        checked={formasSelecionadas[combustivel.label]?.includes(forma.label)}
                                                        onChange={() => handleFormaPagamentoChange(combustivel.label, forma.label)}
                                                    />
                                                    <label htmlFor={`${combustivel.label}-${forma.label}`}>
                                                        {forma.label.toUpperCase()}
                                                    </label>
                                                </div>

                                                {formasSelecionadas[combustivel.label]?.includes(forma.label) &&
                                                    formasAbastecimentos.map((abastecimento) => {
                                                        if (propCombustiveis[keyCombustivel].formas[keyForma].forma_abastecimento !== abastecimento.label) {
                                                            return null;
                                                        }

                                                        return (
                                                            <select key={abastecimento.value} name="forma_abastecimento">
                                                                <option value={abastecimento.value}>
                                                                    {abastecimento.label}
                                                                </option>
                                                                {abastecimento.label === 'Litragem Livre' && (
                                                                    <option value='2'>
                                                                        Encher Tanque
                                                                    </option>
                                                                )}
                                                            </select>
                                                        )
                                                    })}
                                            </div>
                                        )
                                    })}
                            </div>
                        )
                    })}

                    <button className='btn-selecionar-brinde' type='submit'>
                        Selecionar brinde
                    </button>
                </form>

                {selecionarBrinde && (
                    <>
                        <div className='container-component-brindes'>
                            <ListarBrindes
                                showBtns={false}
                                clickBrinde={cadastrarBrinde}
                                closeModal={setSelecionarBrinde} />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default AdicionarBrinde;
