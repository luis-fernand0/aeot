import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from '../functions/checkValor';
import { formatLitro } from '../functions/formatLitro';

import { combustiveis, formasPagamento } from '../functions/contants';
import Loading from './loading';
import ModalResponse from './modalResponse';
import '../style/editar_venda/editar_venda.css'

const urlEditarVenda = import.meta.env.VITE_URL_EDITAR_VENDA

export const EditarVenda = ({ view, item, close, pesquisar }) => {
    if (!view) return null;

    const typeUser = localStorage.getItem('type_user')
    if(typeUser === 'frentista' || typeUser === 'driver') return null;

    const tokenUser = localStorage.getItem('token');

    const [valorTotal, setValorTotal] = useState(item.valor_total)

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    function changeTotal(inputValor, inputLitro) {
        let valorCombustivel = document.getElementById(inputValor).value
        let litrosAbastecido = document.getElementById(inputLitro)
        let litro = litrosAbastecido.value
        let btnSalvar = document.getElementById('salvar')

        let litroValid = () => {
            let testeRegex = /^(\d{1,3}(\,\d{1,3}|\.\d{1,3}|))$/
            let testeRegexZero = /^([0]{1,3}(\,[0]{1,3}|\.[0]{1,3}|))$/

            if (testeRegexZero.test(litro)) {
                return false
            }

            return testeRegex.test(litro)
        }
        if (!(litroValid())) {
            litrosAbastecido.classList.add('danied')
            btnSalvar.setAttribute('disabled', true)
            return
        }

        btnSalvar.removeAttribute('disabled')
        litrosAbastecido.classList.remove('danied')
        litro = litro.replace(/[^0-9]/g, '.')
        litrosAbastecido.value = Number(litro).toFixed(3)
        let total = Number(valorCombustivel).toFixed(2) * litrosAbastecido.value

        return setValorTotal(total.toFixed(2))
    }

    async function changeVenda() {
        setLoading(true)
        try {
            let combustivel = document.getElementById('select-combustivel')
            let pagamento = document.getElementById('select-pagamento')
            let abastecimento = document.getElementById('select-abastecimento')
            let litro = document.getElementById('input-litro')
            let valor = document.getElementById('input-valor')

            let dados = {
                venda_id: item.venda_id,
                abastecimento: abastecimento.value,
                litro: litro.value,
                valor: valor.value,
                valorTotal: valorTotal
            }

            let keysCombustiveis = Object.keys(combustiveis)
            keysCombustiveis.forEach((elemento, index) => {
                let combustivelAtual = combustiveis[elemento]
                if (combustivelAtual.label == combustivel.value.toLowerCase()) {
                    dados.combustivel = combustivelAtual.value
                }
            })
            let keysPagamentos = Object.keys(formasPagamento)
            keysPagamentos.forEach((elemento, index) => {
                let pagamentoAtual = formasPagamento[elemento]
                if (pagamentoAtual.label == pagamento.value) {
                    dados.pagamento = pagamentoAtual.value
                }
            })

            const response = await fetch(urlEditarVenda, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })

            if (!response.ok) {
                const data = await response.json()
                throw data;
            }

            pesquisar()
        } catch (err) {
            setModalMessage(`${err.message}... ${err.error}`)
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
                message={modalMessage} />
            <div className='container-shadow-bg'>
                <div className='container-edit-venda'>
                    <div className='container-btn'>
                        <button id='btn-close' onClick={close}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    <div className='container-table-venda'>
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
                                            <select name="forma_pagamento" id="select-pagamento" defaultValue={item.forma_pagamento}>
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
                    </div>

                    <div className='container-btn-salvar'>
                        <button id='salvar' className='btn-salvar' onClick={() => changeVenda()}>
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}