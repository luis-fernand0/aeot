import { checkValor } from '../functions/checkValor';
import { formatLitro } from '../functions/formatLitro';

import '../style/editar_venda/editar_venda.css'

export const EditarVenda = ({ view, item, close }) => {
    if (!view) return null;

    return (
        <div className='container-shadow-bg'>
            <div className='container-edit-venda'>
                <div className='container-btn'>
                    <button onClick={close}>fechar</button>
                </div>

                <table>
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
                                        <option value="Etanol">
                                            Etanol
                                        </option>
                                        <option value="Gasolina">
                                            Gasolina
                                        </option>
                                        <option value="Diesel">
                                            Diesel
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <select name="forma_abastecimento" id="select-abastecimento" defaultValue={item.forma_abastecimento}>
                                        <option value="1">
                                            LL
                                        </option>
                                        <option value="2">
                                            ET
                                        </option>
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
                                <td>R$
                                    <input
                                        type="text"
                                        defaultValue={item.valor}
                                        onChange={(e) => checkValor(e)} />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={item.litros}
                                        onChange={(e) => formatLitro(e)} />
                                </td>
                                <td>R$ {item.valor_total}</td>
                                <td>{item.frentista}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button>
                    Salvar
                </button>
            </div>
        </div>
    )
}