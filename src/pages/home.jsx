import { useEffect, useState } from 'react';
import Header from '../components/header';
import '../style/home_page/home.css'

const urlSite = import.meta.env.VITE_URL_AEOT_SITE
const urlDatas = import.meta.env.VITE_URL_DATAS

const Home = () => {
  const [postos, setPostos] = useState()

  var usuarioLogado = sessionStorage.getItem('userLogado');
  if (!usuarioLogado) {
    window.location.replace(`${urlSite}`)
  }

  async function gasStation() {
    const url = `${urlDatas}`
    const response = await fetch(url)
    const data = await response.json()

    setPostos(data)
  }

  function checkButton(event, nomeBtn) {
    if (event.target.classList.contains('checked')) {
      console.log(event.target.classList.contains('checked'))
    }
  }

  useEffect(() => {
    gasStation()
  }, [])

  return (
    <>
      <div className="container-home">
        <Header />

        <h2 className='title-home'>Todos os anuncios</h2>

        <div className='btns-ul'>
          <div className='btns-fuel-services'>
            <button onClick={(event) => {checkButton(event, 'btn-combustivel')}} className='btn-option btn-combustivel checked' type="button">Combustivel</button>
            <button onClick={(event) => {checkButton(event, 'btn-services')}} className='btn-option btn-services' type="button">Serviços</button>
          </div>

          <ul className='ul-gas-station'>

            {postos && postos.map((posto) =>
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
          </ul>
        </div>


      </div>
    </>
  )
}

export default Home
