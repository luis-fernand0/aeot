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

    async function editarItem(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData(document.getElementById('form-editar-item'))

            if (categoria === 'postos') {
                let inputCheckeds = document.querySelectorAll("input[name='combustiveis']:checked")

                if (inputCheckeds.length === 0) {
                    setModalMessage('Selecione pelos menos um combustivel para trabalhar!')
                    setModalVisible(true)
                    return
                }

                let combustiveis = {}

                let formCombustivel = Object.keys(configCombustiveis)
                for (let i = 0; i < formCombustivel.length; i++) {
                    //apenas tirando o combustivel desmarcado da req que vai ser enviada para o back-end, fazendo assim eu preservo as opções que o user adicionou mesmo se ele desmarcar o combustivel sem querer
                    if (inputCheckeds.item(i)?.value) {//ou seja se o input tiver desmarcado ele não vai ter um value e não vai ser adicionado na req
                        let infoCombustivelAtual = configCombustiveis[formCombustivel[i]]
                        if (infoCombustivelAtual.length == 0) {
                            throw new Error("Adicione pelo menos uma configuração para o combustivel selecionado!");
                        }
                        combustiveis[formCombustivel[i]] = {
                            combustivel: formCombustivel[i],
                            valor_formas: []
                        }

                        for (let index = 0; index < infoCombustivelAtual.length; index++) {
                            const formasValorAtual = infoCombustivelAtual[index];

                            let pagamentoAtual = formasValorAtual['forma_pagamento']
                            let abastecimentoAtual = formasValorAtual['forma_abastecimento']
                            let valor = formasValorAtual['valor']

                            if (pagamentoAtual == '') {
                                throw new Error("Selecione uma forma de pagamento para o combustivel marcado!");
                            }
                            if (abastecimentoAtual == '') {
                                throw new Error("Selecione uma forma de abastecimento para o combustivel marcado!");
                            }
                            if (valor == '' || valor == '0.00' || valor == '0' || valor == '0.0') {
                                throw new Error("Digite um valor para o combustivel marcado(deve ser maior que 0.00)");
                            }

                            let quantidadeFormas = combustiveis[formCombustivel[i]].valor_formas.length
                            for (let indice = 0; indice < quantidadeFormas; indice++) {
                                let linhaAtual = combustiveis[formCombustivel[i]].valor_formas[indice]
                                if (linhaAtual.forma_pagamento == pagamentoAtual && linhaAtual.forma_abastecimento == abastecimentoAtual) {
                                    throw new Error("Não pode existir o mesmo pagamento e o mesmo abastecimento para o mesmo combustivel!");
                                }
                            }
                            combustiveis[formCombustivel[i]].valor_formas.push(formasValorAtual)
                        }
                    }
                }
                formData.append('combustiveis', JSON.stringify(combustiveis))
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

    function mudaParaValue(tipo, string) {
        let nome = ''
        if (tipo === 'forma_pagamento') {
            Object.keys(formasPagamento).forEach((elemento, index) => {
                if (formasPagamento[index].label == string) { nome = formasPagamento[index].value }
            })
        }

        if (tipo === 'forma_abastecimento') {
            Object.keys(formasAbastecimentos).forEach((elemento, index) => {
                if (formasAbastecimentos[index].label == string) { nome = formasAbastecimentos[index].value }
            })
        }

        return nome
    }

    useEffect(() => {
        if (categoria === 'postos') {
            const optionsInitial = {};
            const configuracoesIniciais = {};

            combustiveis.forEach((combustivel) => {
                const dadosCombustivel = itemFormatado.combustiveis?.[combustivel.label];
                if (dadosCombustivel) {
                    optionsInitial[combustivel.label] = true;
                    document.getElementById(combustivel.label).checked = true

                    const formas = dadosCombustivel.formas_valor || {};

                    const configs = Object.keys(formas).map((forma) => ({
                        forma_pagamento: mudaParaValue('forma_pagamento', formas[forma].forma_pagamento),
                        forma_abastecimento: mudaParaValue('forma_abastecimento', formas[forma].forma_abastecimento),
                        valor: formas[forma].valor || ''
                    }));

                    configuracoesIniciais[combustivel.value] = configs;
                }
            });
            setShowOptions(optionsInitial);
            setConfigCombustiveis(configuracoesIniciais);
        }
    }, []);

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
                                            <div className='container-checkbox-combustivel'>
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
                                                                className='select-forma-pagamento'
                                                                value={config.forma_pagamento}
                                                                onChange={(e) =>
                                                                    atualizarConfiguracao(combustivel.value, index, 'forma_pagamento', e.target.value)}>
                                                                <option value="">Forma de pagamento</option>
                                                                {formasPagamento.map((pagamento) => (
                                                                    <option key={pagamento.value} value={pagamento.value}>
                                                                        {pagamento.label.charAt(0).toUpperCase() + pagamento.label.slice(1)}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <select
                                                                className='select-forma-abastecimento'
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
                                                                className='combustivel-valor'
                                                                type="text"
                                                                placeholder="Valor"
                                                                value={config.valor}
                                                                onChange={(e) => {
                                                                    checkValor(e)
                                                                    atualizarConfiguracao(combustivel.value, index, 'valor', e.target.value);
                                                                }} />

                                                            <button
                                                                className='btn-remover-config'
                                                                type="button"
                                                                onClick={() => removerConfiguracao(combustivel.value, index)}>
                                                                -
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <button
                                                        className='btn-add-config'
                                                        type="button"
                                                        onClick={() => adicionarConfiguracao(combustivel.value)}>
                                                        +
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