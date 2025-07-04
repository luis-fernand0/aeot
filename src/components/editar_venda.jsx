import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor';
import { formatLitro } from '../functions/formatLitro';

import '../style/editar_venda/editar_venda.css'

export const EditarVenda = ({ view, item, close }) => {
    if (!view) return null;

    const [valorTotal, setValorTotal] = useState(item.valor_total)

    function changeTotal(inputValor, inputLitro) {
        let valorCombustivel = document.getElementById(inputValor).value
        let litro = document.getElementById(inputLitro).value

        let litroValid = () => {
            let testeRegex = /^(\d{1,3}(\,\d{1,3}|))$/

            return testeRegex.test(litro)
        }
        if (!(litroValid())) {
            return
        }

        litro = litro.replace(/[^0-9]/g, '.')
        let total = Number(valorCombustivel).toFixed(2) * Number(litro).toFixed(3)

        return setValorTotal(total.toFixed(2))
    }

    return (
        <div className='container-shadow-bg'>
            <div className='container-edit-venda'>
                <div className='container-btn'>
                    <button onClick={close}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <table className='table-venda'>
                    <thead>
                        <tr>
                            <th>Posto</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Motorista</th>
                            <th>Combustível</th>
                            <th>FA</th>
                            <th>FP</th>
                            <th>Valor</th>
                            <th>Litros</th>
                            <th>Total</th>
                            <th>Frentista</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item && (
                            <tr>
                                <td>{item.posto}</td>
                                <td>{item.data_venda}</td>
                                <td>{item.hora_venda}</td>
                                <td>{item.motorista}</td>
                                <td>
                                    <select name="combustivel" id="select-combustivel" defaultValue={item.combustivel}>
                                        <option value="Etanol">Etanol</option>
                                        <option value="Gasolina">Gasolina</option>
                                        <option value="Diesel">Diesel</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="forma_abastecimento" id="select-abastecimento" defaultValue={item.forma_abastecimento}>
                                        <option value="1">LL</option>
                                        <option value="2">ET</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="forma_pagamento" id="select-pagamento" defaultValue={item.pagamento}>
                                        <option value="dinheiro">Dinheiro</option>
                                        <option value="pix">Pix</option>
                                        <option value="debito">Debito</option>
                                        <option value="credito">Credito</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id='input-valor'
                                        defaultValue={item.valor}
                                        onChange={(e) => checkValor(e)}
                                        onBlur={() => { changeTotal('input-valor', 'input-litro') }} />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id='input-litro'
                                        defaultValue={item.litros}
                                        onChange={(e) => formatLitro(e)}
                                        onBlur={() => changeTotal('input-valor', 'input-litro')} />
                                </td>
                                <td>R$ {valorTotal}</td>
                                <td>{item.frentista}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className='container-btn-salvar'>
                    <button>
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    )
}