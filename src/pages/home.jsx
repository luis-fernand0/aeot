import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons'

import Header from '../components/header';
import '../style/home_page/home.css'

const urlDatas = import.meta.env.VITE_URL_DATAS

const Home = () => {
  const [postos, setPostos] = useState()
  const [categoria, setCategoria] = useState(`postos`)

  const [infoPostos, setInfoPosto] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [editCombustivel, setEditCombustivel] = useState(false)
  const [inputInfo, setInputInfo] = useState({})

  const navigate = useNavigate()

  const tokenUser = localStorage.getItem('token');

  const typeCategoria = {
    categoria: categoria
  }
  async function gasStation() {
    const response = await fetch(urlDatas, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenUser}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(typeCategoria)
    })
    const data = await response.json()
    if (response.status === 403) {
      navigate('/', { replace: true })
    }

    setPostos(data.infoGasStation)
  }

  function checkButton(btnClicado) {
    setCategoria(btnClicado)
  }

  function callModal(posto) {
    setInfoPosto(posto)
    setOpenModal(true)
  }

  function closeModal(modal) {
    if (modal === 'editar_posto') {
      setOpenModal(false)
    } else {
      setEditCombustivel(false)
    }
  }

  function modalEditCombustivel(valorCombustivel, typeCombustivel) {
    const sobreCombustivel = {
      'valor_combustivel': valorCombustivel,
      'type_combustivel': typeCombustivel
    }
    setEditCombustivel(true)
    setInputInfo(sobreCombustivel)
  }

  function checkInput(e) {
    var input = e.target
    var inputValue = input.value.replace(/^(\d+)(\d{2})$/, '$1.$2')

    if(inputValue.length === 1) {
      input.value = ''
    }

    input.value = inputValue
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

          <ul className='ul-gas-services'>

            {categoria === 'postos' && postos && postos.map((posto) =>
              <li onClick={() => { callModal(posto) }} className='gas-services' key={posto.cod_posto}>
                <img className='img-gas-services' src={`https://aeotnew.s3.amazonaws.com/${posto.foto}`} alt="imagem-do-posto-de-gasolina" />
                <div className='info-gas-services'>
                  <h3 className='title-gas-services'>
                    {posto.nome}
                  </h3>

                  <p className='endereco-gas-services'>
                    {posto.endereco}
                  </p>

                  <p className='combustiveis-gas-station'>
                    ETANOL: R$ {posto.etanol}
                  </p>
                  <p className='combustiveis-gas-station'>
                    GASOLINA: R$ {posto.gasolina}
                  </p>
                </div>
              </li>
            )}

            {categoria === 'anuncios' && postos && postos.map((anuncio) =>
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
                  <button onClick={() => { modalEditCombustivel(infoPostos.etanol, 'etanol') }} type="button" className='modal-edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                </div>
                <div className='container-edit-combustivel-modal'>
                  <p id='valor-gasolina' className='modal-combustivel-posto'>
                    Gasolina: R$ {infoPostos.gasolina}
                  </p>
                  <button onClick={() => { modalEditCombustivel() }} type="button" className='modal-edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
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
                <input type="number"
                  name={inputInfo.type_combustivel === 'etanol' ? 'etanol' : 'gasolina'}
                  id={inputInfo.type_combustivel === 'etanol' ? 'etanol' : 'gasolina'}
                  placeholder={inputInfo.valor_combustivel}
                  onChange={(e) => { checkInput(e) }} />
                <button type="button">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Home
