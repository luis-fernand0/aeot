import { useState } from 'react'
import { combustiveis, formasPagamento, formasAbastecimentos } from '../functions/contants'
import ListarBrindes from './listarBrindes'

import '../style/adicionarBrinde_component/adicionarBrinde.css'

const AdicionarBrinde = ({ propCombustiveis }) => {
    const [combustiveisSelecionados, setCombustiveisSelecionados] = useState([])
    const [formasSelecionadas, setFormasSelecionadas] = useState({})
    const [selecionarBrinde, setSelecionarBrinde] = useState(false)

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
        setSelecionarBrinde(true)

        let formData = new FormData(e.target)
        for (let [key, value] of formData.entries()) {
            console.log(key, value)
        }
    }

    async function cadastrarBrinde(brinde) {
        console.log(brinde.cod_posto)
    }

    return (
        <>
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
                                        name='combustivel'
                                        value={combustivel.value}
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
                                                        name='forma_pagamento'
                                                        value={forma.value}
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
                                                                <option value={abastecimento.value}>{abastecimento.label}</option>
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

                    <button className='btn-selecionar-brinde' type='submit'>Selecionar brinde</button>
                </form>

                {selecionarBrinde && (
                    <>
                        <div className='container-component-brindes'>
                            <ListarBrindes
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
