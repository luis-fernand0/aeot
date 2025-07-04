import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CriarBrinde from './criarBrinde'
import AdicionarBrinde from './adicionarBrinde'
import ListarBrindes from './listarBrindes'

import '../style/homePosto_component/homePosto.css'

const HomePosto = ({ posto, categoria }) => {
    const navigate = useNavigate()
    const typeUser = localStorage.getItem('type_user')

    const [exibir, setExibir] = useState('meu_anuncio')
    const [gerenciarBrinde, setGerenciarBrinde] = useState('')

    function detalhes(posto, categoria) {
        localStorage.setItem('dadosItem', JSON.stringify(posto))
        localStorage.setItem('categoria', JSON.stringify(categoria.categoria))
        navigate('/detalhes')
    }
    return (
        <>
            <div className="container-home">
                <h2 className='title-home'>Seu anuncio</h2>
                <div className="container-anuncio-brinde">
                    <div className='container-btns'>
                        <button
                            onClick={() => setExibir('meu_anuncio')}
                            className={`btn-option 
                            ${exibir === 'meu_anuncio' ? 'checked' : ''}`} type="button">
                            Meu anuncio
                        </button>

                        {typeUser === 'posto' && (
                            <button onClick={() => setExibir('brindes')}
                                className={`btn-option ${exibir === 'brindes' ? 'checked' : ''}`} type="button">
                                Brindes
                            </button>
                        )}
                    </div>
                    {exibir === 'meu_anuncio' && (
                        <div className='container-anuncio'>
                            {posto && posto.map((posto) =>
                                <div onClick={() => { detalhes(posto, categoria) }}
                                    className='gas-services'
                                    key={posto.cod_posto}>

                                    <div className='container-img-title'>
                                        <div className='container-img'>
                                            <img className='img-gas-services' src={`https://aeotnew.s3.amazonaws.com/${posto.foto}`} alt="imagem-do-posto-de-gasolina" />
                                        </div>

                                        <div className='container-title-endereco'>
                                            <h3 className='title-gas-services'>
                                                {posto.nome}
                                            </h3>

                                            <p className='endereco-gas-services'>
                                                {posto.endereco}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='info-gas-services'>
                                        {posto.combustiveis?.etanol && (
                                            <p className='combustiveis-gas-station'>
                                                ETANOL: R$ {posto.combustiveis?.etanol?.melhor_opcao?.valor}
                                            </p>
                                        )}

                                        {posto.combustiveis?.gasolina && (
                                            <p className='combustiveis-gas-station'>
                                                GASOLINA: R$ {posto.combustiveis?.gasolina?.melhor_opcao?.valor}
                                            </p>
                                        )}

                                        {posto.combustiveis?.diesel && (
                                            <p className='combustiveis-gas-station'>
                                                DIESEL: R$ {posto.combustiveis?.diesel?.melhor_opcao?.valor}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {exibir === 'brindes' && (
                        <div className='container-brinde-btns'>
                            <div className='container-btn-brinde'>
                                <button onClick={() => setGerenciarBrinde('meus_brindes')} className={`option-brinde ${gerenciarBrinde === 'meus_brindes' ? 'checked' : ''}`}>
                                    Meus brindes
                                </button>

                                <button onClick={() => setGerenciarBrinde('criar_brinde')} className={`option-brinde ${gerenciarBrinde === 'criar_brinde' ? 'checked' : ''}`}>
                                    Criar brinde
                                </button>

                                <button onClick={() => setGerenciarBrinde('add_brinde')} className={`option-brinde ${gerenciarBrinde === 'add_brinde' ? 'checked' : ''}`}>
                                    Adicionar brinde
                                </button>
                            </div>

                            {gerenciarBrinde === 'meus_brindes' && (
                                <ListarBrindes />
                            )}

                            {gerenciarBrinde === 'criar_brinde' && (
                                <CriarBrinde user={posto} />
                            )}

                            {gerenciarBrinde === 'add_brinde' && (
                                <AdicionarBrinde
                                    propCodPosto={posto[0].cod_posto}
                                    propCombustiveis={posto[0].combustiveis} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default HomePosto