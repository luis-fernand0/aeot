import { useNavigate } from 'react-router-dom'

const HomePosto = ({ postos, categoria }) => {
    const navigate = useNavigate()
    console.log(categoria)

    function detalhes(posto, categoria) {
        localStorage.setItem('dadosItem', JSON.stringify(posto))
        localStorage.setItem('categoria', JSON.stringify(categoria.categoria))
        navigate('/detalhes')
    }
    return (
        <>
            <div className="container-home">
                <h2 className='title-home'>Seu anuncio</h2>
                <div className="btns-ul">
                    <div className='btns-fuel-services'>
                        <button
                            onClick={() => { setCategoria({ categoria: 'postos' }) }}
                            className={`btn-option btn-combustivel 
                            ${categoria.categoria === 'postos' ? 'checked' : ''}`} type="button">
                            Meu anuncio
                        </button>

                        <button onClick={() => { setCategoria({ categoria: 'anuncios' }) }}
                            className={`btn-option btn-services ${categoria.categoria === 'anuncios' ? 'checked' : ''}`} type="button">
                            Serviços
                        </button>
                    </div>
                    <div className='ul-gas-services'>
                        {postos && postos.map((posto) =>
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
                                    {posto.combustivel?.etanol && (
                                        <p className='combustiveis-gas-station'>
                                            ETANOL: R$ {posto.combustivel?.etanol.valor}
                                        </p>
                                    )}

                                    {posto.combustivel?.gasolina && (
                                        <p className='combustiveis-gas-station'>
                                            GASOLINA: R$ {posto.combustivel?.gasolina.valor}
                                        </p>
                                    )}

                                    {posto.combustivel?.diesel && (
                                        <p className='combustiveis-gas-station'>
                                            DIESEL: R$ {posto.combustivel?.diesel.valor}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePosto