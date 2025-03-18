import { useState } from 'react'
import { combustiveis, formasPagamento, formasAbastecimentos } from '../functions/contants'
import ListarBrindes from './listarBrindes'

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

    return (
        <>
            <div className='container-add-brinde'>
                <h3 className='title-add-brinde'>
                    Em qual combustível deseja adicionar o brinde?
                </h3>
                
                <form onSubmit={verDados} id='form-combustivel' className='container-combustiveis'>
                    {Object.keys(propCombustiveis).map((keyCombustivel) => {
                        const combustivel = combustiveis.find(c => c.label === keyCombustivel);
                        if (!combustivel) return null;

                        return (
                            <div key={combustivel.value} className='combustiveis'>
                                <input
                                    type='checkbox'
                                    id={combustivel.label}
                                    name='combustivel'
                                    value={combustivel.value}
                                    checked={combustiveisSelecionados.includes(combustivel.label)}
                                    onChange={() => handleCombustivelChange(combustivel.label)}
                                />
                                <label htmlFor={combustivel.label}>{combustivel.label.toUpperCase()}</label>

                                {combustiveisSelecionados.includes(combustivel.label) &&
                                    Object.keys(propCombustiveis[keyCombustivel].formas).map((keyForma) => {
                                        const forma = formasPagamento.find(f =>
                                            f.label === propCombustiveis[keyCombustivel].formas[keyForma].forma_pagamento.toLowerCase()
                                        )
                                        if (!forma) return null;

                                        return (
                                            <div key={forma.value} className='formas-pagamento'>
                                                <input
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

                    <button type='submit'>Selecionar brinde</button>
                </form>
            </div>

            {selecionarBrinde && (
                <ListarBrindes />
            )}
        </>
    )
}

export default AdicionarBrinde;
