import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

import Loading from '../components/loading'
import ModalResponse from '../components/modalResponse'
import Header from '../components/header'
import HomePosto from '../components/homePosto'
import HomeDriver from '../components/homeDriver'

const urlDatas = import.meta.env.VITE_URL_DATAS
const urlDataGoogleMaps = import.meta.env.VITE_URL_QUERY_GOOGLE_MAPS

const Home = () => {
  const tokenUser = localStorage.getItem('token')
  const typerUser = localStorage.getItem('type_user')

  const [postos, setPostos] = useState({})
  const [categoria, setCategoria] = useState({ categoria: 'postos' })

  const [local, setLocal] = useState(null)
  const [distancia, setDistancia] = useState({})

  const [loading, setLoading] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const navigate = useNavigate()

  function detalhes(posto, distancia, local, categoria) {
    localStorage.setItem('dadosItem', JSON.stringify(posto))
    localStorage.setItem('categoria', JSON.stringify(categoria.categoria))
    localStorage.setItem('location', JSON.stringify([distancia, local]))
    navigate('/detalhes')
  }

  async function gasStation() {
    setLoading(true)
    try {
      const response = await fetch(urlDatas, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
      })
      const data = await response.json()
      if (response.status === 401) {
        navigate('/', { replace: true })
      }
      await obterLocation()
      setPostos(data)
    } catch (err) {
      setModalMessage(err.message)
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  async function obterLocation() {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador')
      return
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          return setLocal({ latitude, longitude })
        }, (err) => {
          alert(`Não foi possivel obter sua localização: ${err.message}`)
          throw new Error(err.message)
        })
    } catch (err) {
      console.error(err)
    }
  }
  async function obterDistancia(endereco, cod) {
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

        return { distancia, tempo, destino, id: cod };
      }

      throw new Error('Localização não disponível');
    } catch (error) {
      console.error(`Erro ao calcular distância para o item ${cod}: ${error.message}, ${endereco}`);
      return { distancia: 'Não foi possível calcular', tempo: 'N/A', id: cod };
    }
  }

  useEffect(() => {
    gasStation()
  }, [categoria])

  useEffect(() => {
    if (postos) {

      Object.keys(postos).forEach(async (posto) => {
        if (!postos[posto].cod_posto) {
          const distance = await obterDistancia(postos[posto].endereco, postos[posto].cod_anuncio);
          if (distance) {
            setDistancia((prev) => ({
              ...prev,
              [postos[posto].cod_anuncio]: distance,
            }))
          }
          return
        }
        const distance = await obterDistancia(postos[posto].endereco, postos[posto].cod_posto);
        if (distance) {
          setDistancia((prev) => ({
            ...prev,
            [postos[posto].cod_posto]: distance,
          }))
        }

      })
    }
  }, [local, categoria, postos])

  return (
    <>
      <Loading loading={loading} />
      <ModalResponse
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
      />
      <div className="container-home">
        <Header redirectTo={'/'} />

        {(typerUser === 'administrador' || typerUser === 'driver') && (
          <HomeDriver
            categoria={categoria}
            setCategoria={setCategoria}
            postos={postos}
            detalhes={detalhes}
            distancia={distancia}
            local={local} />
        )}

        {(typerUser === 'posto' || typerUser === 'frentista') && (
          <HomePosto
            posto={postos}
            categoria={categoria} />
        )}
      </div>
    </>
  )
}

export default Home
