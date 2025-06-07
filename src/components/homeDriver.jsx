import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlagCheckered, faClock } from '@fortawesome/free-solid-svg-icons'

import '../style/homeDriver_component/homeDriver.css'

const HomeDriver = ({ categoria, setCategoria, postos, detalhes, distancia, local }) => {    
    return (
        <>
            <h2 className='title-home'>Todos os anuncios</h2>
            <div className='btns-ul'>
                <div className='btns-fuel-services'>
                    <button onClick={() => { setCategoria({ categoria: 'postos' }) }}
                        className={`btn-option btn-combustivel ${categoria.categoria === 'postos' ? 'checked' : ''}`} type="button">
                        Postos de Combustiveis
                    </button>

                    <button onClick={() => { setCategoria({ categoria: 'anuncios' }) }}
                        className={`btn-option btn-services ${categoria.categoria === 'anuncios' ? 'checked' : ''}`} type="button">
                        Serviços
                    </button>
                </div>
                <ul className='ul-gas-services'>
                    {categoria.categoria === 'postos' && postos && postos.map((posto) =>
                        <li onClick={() => { detalhes(posto, distancia[posto.cod_posto], local, categoria) }}
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
                                        ETANOL: R$ {posto.combustiveis?.etanol.melhor_opcao.valor}
                                    </p>
                                )}

                                {posto.combustiveis?.gasolina && (
                                    <p className='combustiveis-gas-station'>
                                        GASOLINA: R$ {posto.combustiveis?.gasolina.melhor_opcao.valor}
                                    </p>
                                )}

                                {posto.combustiveis?.diesel && (
                                    <p className='combustiveis-gas-station'>
                                        DIESEL: R$ {posto.combustiveis?.diesel.melhor_opcao.valor}
                                    </p>
                                )}

                                {distancia[posto.cod_posto] && (
                                    <div className='container-km-time'>
                                        <p className='km km-time'>
                                            <FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#4caf50", }} /> {distancia[posto.cod_posto].distancia}
                                        </p>

                                        <p className='time km-time'>
                                            <FontAwesomeIcon icon={faClock} style={{ color: "#4caf50", }} /> {distancia[posto.cod_posto].tempo}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </li>
                    )}
                    {categoria.categoria === 'anuncios' && postos && postos.map((anuncio) =>
                        <li
                            onClick={() => { detalhes(anuncio, distancia[anuncio.cod_anuncio], local, categoria) }} className='gas-services'
                            key={anuncio.cod_anuncio}>
                            <div className='container-img-title'>
                                <div className='container-img'>
                                    <img className='img-gas-services' src={`https://aeotnew.s3.amazonaws.com/${anuncio.foto}`} alt="imagem-do-posto-de-gasolina" />
                                </div>

                                <div className='container-title-endereco'>
                                    <h3 className='title-gas-services'>
                                        {anuncio.titulo_anuncio}
                                    </h3>

                                    <p className='endereco-gas-services'>
                                        {anuncio.endereco}
                                    </p>
                                </div>
                            </div>
                            <div className='info-gas-services'>
                                <p className='descricao-services'>
                                    {anuncio.descricao}
                                </p>

                                {distancia[anuncio.cod_anuncio] && (
                                    <div className='container-km-time'>
                                        <p className='km km-time'>
                                            <FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#4caf50", }} /> {distancia[anuncio.cod_anuncio].distancia}
                                        </p>

                                        <p className='time km-time'>
                                            <FontAwesomeIcon icon={faClock} style={{ color: "#4caf50", }} /> {distancia[anuncio.cod_anuncio].tempo}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}

export default HomeDriver