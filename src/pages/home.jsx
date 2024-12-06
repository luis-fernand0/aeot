import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPen, faFlagCheckered, faClock } from '@fortawesome/free-solid-svg-icons'

import Header from '../components/header';
import { checkValor } from '../functions/checkValor';

import '../style/home_page/home.css'

const urlDatas = import.meta.env.VITE_URL_DATAS
const urlEditCombustivel = import.meta.env.VITE_URL_ATUALIZAR_COMBUSTIVEL
const urlDataGoogleMaps = import.meta.env.VITE_URL_QUERY_GOOGLE_MAPS

const Home = () => {
  const [postos, setPostos] = useState()
  const [categoria, setCategoria] = useState({ categoria: 'postos' })

  const [infoPostos, setInfoPosto] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [editCombustivel, setEditCombustivel] = useState(false)
  const [combustivelInfo, setCombustivelInfo] = useState({})

  const [local, setLocal] = useState(null)
  const [distancia, setDistancia] = useState({})

  const navigate = useNavigate()

  const tokenUser = localStorage.getItem('token');
  const typeUser = localStorage.getItem('type_user')

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

  async function callModal(posto) {
    setInfoPosto(posto)
    setOpenModal(true)
  }

  function closeModal(modal) {
    if (modal === 'editar_combustivel') {
      setEditCombustivel(false)
      return
    }
    setEditCombustivel(false)
    setOpenModal(false)
  }

  function modalEditCombustivel(valor_combustivel, type_combustivel) {
    setEditCombustivel(true)
    setCombustivelInfo({ valor_combustivel, type_combustivel })
  }

  const callCheckValor = (e) => checkValor(e)

  async function editarCombustivel(combustivel, posto) {
    const valor = document.getElementById(combustivel).value

    const response = await fetch(urlEditCombustivel, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenUser}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ combustivel, valor, cod_posto: posto })
    })
    const data = await response.json()
    if (response.status === 403) {
      navigate('/', { replace: true })
    }
    gasStation()
    closeModal()
  }

  function abrirMaps(endereco) {
    if (!local) {
      alert('Localização atual não disponível');
      return;
    }

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${local.latitude},${local.longitude}&destination=${encodeURIComponent(endereco)}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
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
        <Header />

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
              <li onClick={() => { callModal(posto) }} className='gas-services' key={posto.cod_posto}>
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
                <img className='img-gas-services' src={`https://aeotnew.s3.amazonaws.com/${anuncio.foto}`} alt="imagem-do-anuncio/serviço" />
                <div className='info-gas-services'>
                  <h3 className='title-gas-services'>
                    {anuncio.titulo_anuncio}
                  </h3>

                  <p className='descricao-services'>
                    {anuncio.descricao}
                  </p>

                  <p className='endereco-gas-services'>
                    {anuncio.endereco}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>

        {openModal && (
          <div id='editar_posto' className='container-modal-edit-posto'>

            <div className='modal-edit-posto'>

              <div className='container-close-modal'>
                <button onClick={() => { closeModal('editar_posto') }} type="button" className='btn-close-modal'>
                  <FontAwesomeIcon className='x-icon' icon={faXmark} />
                </button>
              </div>

              <div className="container-title-foto">
                <h1 className='title-modal-posto'>{infoPostos.nome}</h1>
                <img src={`https://aeotnew.s3.amazonaws.com/${infoPostos.foto}`} alt="foto_posto de gasolina" className='foto-modal-posto' />
              </div>
              <div className="container-sobre-posto">
                <p className='info-posto posto-descricao'>{infoPostos.descricao}</p>
                <p className='info-posto posto-endereco'>{infoPostos.endereco}</p>

                <div className='container-edit-combustivel-modal'>
                  <p id='valor-etanol' className='modal-combustivel-posto'>
                    Etanol: R$ {infoPostos.etanol}
                  </p>
                  <button
                    onClick={() => { modalEditCombustivel(infoPostos.etanol, 'etanol') }}
                    type="button"
                    className={`${typeUser === 'user' ? 'modal-edit-combustivel-hidden' : 'modal-edit-combustivel'}`}>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                </div>

                <div className='container-edit-combustivel-modal'>
                  <p id='valor-gasolina' className='modal-combustivel-posto'>
                    Gasolina: R$ {infoPostos.gasolina}
                  </p>
                  <button
                    onClick={() => { modalEditCombustivel(infoPostos.gasolina, 'gasolina') }} type="button"
                    className={`${typeUser === 'user' ? 'modal-edit-combustivel-hidden' : 'modal-edit-combustivel'}`}>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                </div>

                <div className='container-edit-combustivel-modal'>
                  <p id='valor-diesel' className='modal-combustivel-posto'>
                    Diesel: R$ {infoPostos.diesel}
                  </p>
                  <button
                    onClick={() => { modalEditCombustivel(infoPostos.diesel, 'diesel') }} type="button"
                    className={`${typeUser === 'user' ? 'modal-edit-combustivel-hidden' : 'modal-edit-combustivel'}`}>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                </div>
              </div>
              <div className='container-km-time-btn'>
                {distancia[infoPostos.cod_posto] && (
                  <div className='container-km-time'>
                    <p className='km km-time'>
                      <FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#4caf50", }} /> {distancia[infoPostos.cod_posto].distancia}
                    </p>

                    <p className='time km-time'>
                      <FontAwesomeIcon icon={faClock} style={{ color: "#4caf50", }} /> {distancia[infoPostos.cod_posto].tempo}
                    </p>
                  </div>
                )}
                <div className='container-btn-abrir-maps'>
                  <button className='btn-abrir-maps' onClick={() => { abrirMaps(infoPostos.endereco) }} type="button">Abrir no Maps?</button>
                </div>

              </div>
            </div>
          </div>
        )}

        {editCombustivel && (
          <div id='editar_combustivel' className='container-modal-edit-combustivel'>
            <div className='modal-edit-combustivel'>
              <div className='container-close-modal'>
                <button onClick={() => { closeModal('editar_combustivel') }} type="button" className='btn-close-modal'>
                  <FontAwesomeIcon className='x-icon' icon={faXmark} />
                </button>
              </div>
              <div className='container-input-edit-combustivel'>
                <input
                  className='input-edit-combustivel'
                  type="text"
                  name={combustivelInfo.type_combustivel}
                  id={combustivelInfo.type_combustivel}
                  placeholder={combustivelInfo.valor_combustivel}
                  onChange={(e) => { callCheckValor(e) }} />
                <button
                  className='btn-edit-combustivel'
                  type="button"
                  onClick={() => { editarCombustivel(combustivelInfo.type_combustivel, infoPostos.cod_posto) }}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Home
