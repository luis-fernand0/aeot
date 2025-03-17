import { useState } from 'react';

const AdicionarBrinde = ({ combustiveis }) => {
    const [combustiveisSelecionados, setCombustiveisSelecionados] = useState([]);
    const [pagamentosSelecionados, setPagamentosSelecionados] = useState({});
    const [abastecimentosSelecionados, setAbastecimentosSelecionados] = useState({});

    const toggleCombustivel = (combustivel) => {
        setCombustiveisSelecionados((prev) =>
            prev.includes(combustivel)
                ? prev.filter((item) => item !== combustivel)
                : [...prev, combustivel]
        );
        setPagamentosSelecionados((prev) => ({ ...prev, [combustivel]: [] }));
        setAbastecimentosSelecionados((prev) => ({ ...prev, [combustivel]: {} }));
    };

    const togglePagamento = (combustivel, formaPagamento) => {
        setPagamentosSelecionados((prev) => {
            const pagamentosAtuais = prev[combustivel] || [];
            return {
                ...prev,
                [combustivel]: pagamentosAtuais.includes(formaPagamento)
                    ? pagamentosAtuais.filter((pag) => pag !== formaPagamento)
                    : [...pagamentosAtuais, formaPagamento],
            };
        });
    };

    const selecionarAbastecimento = (combustivel, formaPagamento, formaAbastecimento) => {
        setAbastecimentosSelecionados((prev) => ({
            ...prev,
            [combustivel]: {
                ...prev[combustivel],
                [formaPagamento]: formaAbastecimento,
            },
        }));
    };

    const verDados = (e) => {
        e.preventDefault();
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

        let request = {}
        let lastPay = null
        let lastCombustivel = null
        
        console.log(abastecimentosSelecionados)
    };

    return (
        <div className='container-add-brinde'>
            <h3 className='title-add-brinde'>
                Em qual combustível deseja adicionar o brinde?
            </h3>

            <form onSubmit={verDados} id='form-combustivel' className='container-combustiveis'>
                {Object.keys(combustiveis).map((combustivel) => (
                    <div key={combustivel}>
                        <input
                            type='checkbox'
                            id={combustivel}
                            checked={combustiveisSelecionados.includes(combustivel)}
                            onChange={() => toggleCombustivel(combustivel)}
                        />
                        <label htmlFor={combustivel}>{combustivel.toUpperCase()}</label>

                        {combustiveisSelecionados.includes(combustivel) && (
                            <div className='formas-pagamento'>
                                {Object.values(combustiveis[combustivel].formas).map((forma) => (
                                    <div key={forma.forma_pagamento}>
                                        <input
                                            type='checkbox'
                                            id={`${combustivel}-${forma.forma_pagamento}`}
                                            checked={pagamentosSelecionados[combustivel]?.includes(forma.forma_pagamento)}
                                            onChange={() => togglePagamento(combustivel, forma.forma_pagamento)}
                                        />
                                        <label htmlFor={`${combustivel}-${forma.forma_pagamento}`}>{forma.forma_pagamento}</label>

                                        {pagamentosSelecionados[combustivel]?.includes(forma.forma_pagamento) && (
                                            <div className='formas-abastecimento'>
                                                <label htmlFor={`${combustivel}-${forma.forma_pagamento}-abastecimento`}>Forma de Abastecimento:</label>
                                                <select
                                                    id={`${combustivel}-${forma.forma_pagamento}-abastecimento`}
                                                    value={abastecimentosSelecionados[combustivel]?.[forma.forma_pagamento] || ''}
                                                    onChange={(e) => selecionarAbastecimento(combustivel, forma.forma_pagamento, e.target.value)}>
                                                    <option value=''>Selecione</option>
                                                    <option value={forma.forma_abastecimento}>{forma.forma_abastecimento}</option>
                                                    {forma.forma_abastecimento === 'Litragem Livre' && (
                                                        <option value='Encher Tanque'>Encher Tanque</option>
                                                    )}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button type='submit'>
                    Selecionar brinde
                </button>
            </form>
        </div>
    );
};

export default AdicionarBrinde;
