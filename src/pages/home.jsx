import { useEffect, useState } from 'react';
import Header from '../components/header';
import '../style/home_page/home.css'

const urlSite = import.meta.env.VITE_URL_AEOT_SITE
const urlDatas = import.meta.env.VITE_URL_DATAS

const Home = () => {
  const [postos, setPostos] = useState()
  const [categoria, setCategoria] = useState(`postos`)

  var usuarioLogado = sessionStorage.getItem('userLogado');
  if (!usuarioLogado) {
    window.location.replace(`${urlSite}`)
  }

  const typeCategoria = {
    categoria: categoria
  }
  async function gasStation() {
    const url = `${urlDatas}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(typeCategoria)
    })
    const data = await response.json()

    console.log(data)
    setPostos(data)
  }

  function checkButton(btnClicado) {
    setCategoria(btnClicado)
  }

  useEffect(() => {
    gasStation()
  }, [categoria])

  return (
    <>
      <div className="container-home">
        <Header />

        <h2 className='title-home'>Todos os anuncios</h2>

        <div className='btns-ul'>
          <div className='btns-fuel-services'>
            <button onClick={() => { checkButton('postos') }} className={`btn-option btn-combustivel ${categoria === 'postos' ? 'checked' : ''}`} type="button">Combustivel</button>
            <button onClick={() => { checkButton('anuncios') }} className={`btn-option btn-services ${categoria === 'anuncios' ? 'checked' : ''}`} type="button">Serviços</button>
          </div>

          <ul className='ul-gas-station'>

            {categoria === 'postos' && postos && postos.map((posto) =>
              <li className='gas-station' key={posto.cod_posto}>
                <img className='img-gas-station' src="https://placehold.co/200" alt="imagem-do-posto-de-gasolina" />
                <div className='info-gas-station'>
                  <h3 className='title-gas-station'>
                    {posto.nome}
                  </h3>

                  <p className='endereco-gas-station'>
                    {posto.endereco}
                  </p>

                  <p className='combustiveis-gas-station'>
                    ETANOL: R$ {posto.preco_etanol}
                  </p>
                  <p className='combustiveis-gas-station'>
                    GASOLINA: R$ {posto.preco_gasolina}
                  </p>
                </div>
              </li>
            )}

            {categoria === 'anuncios' && postos && postos.map((anuncio) =>
              <li className='gas-station' key={anuncio.cod_anuncio}>
                <img className='img-gas-station' src="https://placehold.co/200" alt="imagem-do-posto-de-gasolina" />
                <div className='info-gas-station'>
                  <h3 className='title-gas-station'>
                    {anuncio.titulo_anuncio}
                  </h3>

                  <p className='endereco-gas-station'>
                    {anuncio.descricao}
                  </p>

                  <p className='endereco-gas-station'>
                    {anuncio.endereco}
                  </p>

                  {/* <p className='combustiveis-gas-station'>
                    ETANOL: R$ {anuncio.preco_etanol}
                  </p>
                  <p className='combustiveis-gas-station'>
                    GASOLINA: R$ {anuncio.preco_gasolina}
                  </p> */}
                </div>
              </li>
            )}
          </ul>
        </div>


      </div>
    </>
  )
}

export default Home
