import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPen, faFlagCheckered, faClock } from '@fortawesome/free-solid-svg-icons'

import Header from '../components/header';
import { checkValor } from '../functions/checkValor';

import '../style/home_page/home.css'

const urlDatas = import.meta.env.VITE_URL_DATAS
const urlDataGoogleMaps = import.meta.env.VITE_URL_QUERY_GOOGLE_MAPS

const Home = () => {
  const [postos, setPostos] = useState()
  const [categoria, setCategoria] = useState({ categoria: 'postos' })

  const [local, setLocal] = useState(null)
  const [distancia, setDistancia] = useState({})

  const navigate = useNavigate()

  const tokenUser = localStorage.getItem('token');
  
  async function gasStation() {
    const response = await fetch(urlDatas, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenUser}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoria)
    })
    const data = await response.json()
    if (response.status === 403) {
      navigate('/', { replace: true })
    }
    obterLocation()
    setPostos(data.infoGasStation)
  }

  function obterLocation() {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador')
      return
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocal({ latitude, longitude })
        }, (err) => {
          alert(`Não foi possivel obter sua localização: ${err.message}`)
        })
    } catch (err) {
      alert(`Não foi possivel obter sua localização: ${err.message}`)
    }
  }

  async function obterDistancia(endereco, cod_posto) {
    try {
      if (local && local.latitude && local.longitude) {
        const response = await fetch(
          `${urlDataGoogleMaps}?origemlat=${local.latitude}&origemlong=${local.longitude}&address=${endereco}`
        )
        if (!response.ok) {
          throw new Error('Erro ao obter os dados do Google Maps');
        }

        const data = await response.json();
        const distancia = data.rows[0].elements[0].distance.text;
        const tempo = data.rows[0].elements[0].duration.text;
        const destino = data.destination_addresses;

        return { distancia, tempo, destino, id: cod_posto };
      }
      throw new Error('Localização não disponível');
    } catch (error) {
      console.error(`Erro ao calcular distância para o posto ${cod_posto}: ${error.message}`);
      return { distancia: 'Não foi possível calcular', tempo: 'N/A', id: cod_posto };
    }
  }

  async function detalhes(posto, distancia, local) {
    navigate('/detalhes', { state: [posto, distancia, local] })
  }

  useEffect(() => {
    gasStation()
  }, [categoria])

  useEffect(() => {
    if (postos) {
      postos.forEach(async (posto) => {
        const queryLocal = await obterDistancia(posto.endereco, posto.cod_posto);
        if (queryLocal) {
          setDistancia((prev) => ({
            ...prev,
            [posto.cod_posto]: queryLocal,
          }))
        }
      })
    }
  }, [local])

  return (
    <>
      <div className="container-home">
        <Header redirectTo={'/'} />

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
              <li onClick={() => { detalhes(posto, distancia[posto.cod_posto], local) }}
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
                  <p className='combustiveis-gas-station'>
                    ETANOL: R$ {posto.etanol}
                  </p>
                  <p className='combustiveis-gas-station'>
                    GASOLINA: R$ {posto.gasolina}
                  </p>
                  <p className='combustiveis-gas-station'>
                    DIESEL: R$ {posto.diesel}
                  </p>
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
              <li className='gas-services' key={anuncio.cod_anuncio}>
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
