import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faGasPump, faPen, faFlagCheckered, faClock } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from "../functions/checkValor";

import Header from "./header";
import Loading from "./loading"
import ModalResponse from "./modalResponse";

import '../style/detalhes_page/detalhes.css'

const urlEditCombustivel = import.meta.env.VITE_URL_ATUALIZAR_COMBUSTIVEL


const Detalhes = () => {
  const itens = JSON.parse(sessionStorage.getItem('detalhes'))

  const [detalhe, setDetalhe] = useState(itens[0] || {})
  const [distancia, setDistancia] = useState(itens[1] || {})
  const [local, setLocal] = useState(itens[2] || {})
  const [categoria, setCategoria] = useState(itens[3] || {})

  const [editPosto, setEditPosto] = useState(false)
  const [inputInfo, setInputInfo] = useState({})

  const [loading, setLoading] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const tokenUser = localStorage.getItem('token');
  const typeUser = localStorage.getItem('type_user')

  function modalEditPosto(value_input, type_input) {
    setEditPosto(true)
    setInputInfo({ value_input, type_input })
  }

  function abrirMaps(endereco) {
    if (!local) {
      alert('Localização atual não disponível');
      return;
    }

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${local.latitude},${local.longitude}&destination=${encodeURIComponent(endereco)}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  }

  async function editarPosto(type_input, posto) {
    const valor = document.getElementById(type_input).value
    setLoading(true)

    try {
      const response = await fetch(urlEditCombustivel, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type_input, valor, cod_posto: posto })
      })
      const data = await response.json()

      if (response.status === 403) {
        navigate('/', { replace: true })
        return
      }
      if (!response.ok) {
        setModalMessage(data.message)
        setModalVisible(true)
        return
      }

      setDetalhe(data.query)
      setModalMessage(data.message)
      setModalVisible(true)
      setEditPosto(false)

    } catch (err) {
      setModalMessage(`Ocorreu um erro inesperado. Tente novamente mais tarde.` + err.message)
      setModalVisible(true)

    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header redirectTo={'/home'} />
      <Loading loading={loading} />
      <ModalResponse
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
      />
      <div className='container-item'>
        {categoria.categoria === 'postos' && (
          <>
            <div className="container-title-foto">
              <h1 className='title-item'>{detalhe.nome}</h1>
              <img src={`https://aeotnew.s3.amazonaws.com/${detalhe.foto}`} alt="foto_item" className='foto-item' />
            </div>
            <div className="container-sobre-item">
              <p className='info-item item-descricao'>{detalhe.descricao}</p>
              {(typeUser === 'administrador' || typeUser === 'posto') && (
                  <button
                    onClick={() => { modalEditPosto(detalhe.descricao, 'descricao') }} type="button"
                    className='edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                )}
              <p className='info-item item-endereco'>{detalhe.endereco}</p>
              {(typeUser === 'administrador' || typeUser === 'posto') && (
                  <button
                    onClick={() => { modalEditPosto(detalhe.endereco, 'endereco') }} type="button"
                    className='edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                )}

              <div className='container-edit-combustivel'>
                <p id='valor-etanol' className='combustivel-posto'>
                  Etanol: R$ {detalhe.etanol}
                </p>

                {(typeUser === 'administrador' || typeUser === 'posto') && (
                  <button
                    onClick={() => { modalEditPosto(detalhe.etanol, 'etanol') }} type="button"
                    className='edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                )}
              </div>

              <div className='container-edit-combustivel'>
                <p id='valor-gasolina' className='combustivel-posto'>
                  Gasolina: R$ {detalhe.gasolina}
                </p>

                {(typeUser === 'administrador' || typeUser === 'posto') && (
                  <button
                    onClick={() => { modalEditPosto(detalhe.gasolina, 'gasolina') }} type="button"
                    className='edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                )}
              </div>

              <div className='container-edit-combustivel'>
                <p id='valor-diesel' className='combustivel-posto'>
                  Diesel: R$ {detalhe.diesel}
                </p>
                
                {(typeUser === 'administrador' || typeUser === 'posto') && (
                  <button
                    onClick={() => { modalEditPosto(detalhe.diesel, 'diesel') }} type="button"
                    className='edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                )}
              </div>
            </div>
            <div className='container-km-time-btn'>
              {distancia.id && (
                <div className='container-km-time'>
                  <p className='km km-time'>
                    <FontAwesomeIcon className="icon-km" icon={faFlagCheckered} style={{ color: "#4caf50", }} /> {distancia.distancia}
                  </p>

                  <p className='time km-time'>
                    <FontAwesomeIcon className="icon-time" icon={faClock} style={{ color: "#4caf50", }} /> {distancia.tempo}
                  </p>
                </div>
              )}
              <div className='container-btn-abrir-maps'>
                <button className='btn-abrir-maps' onClick={() => { abrirMaps(detalhe.endereco) }} type="button">Abrir no Maps?</button>
              </div>

              <div className="container-gas-pump-btn">
                <Link to={'/abastecimento'}>
                  <button className="gas-pump-btn" type="button">
                    Abastecer <FontAwesomeIcon className='icon-gas-pump' icon={faGasPump} />
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}

        {categoria.categoria === 'anuncios' && (
          <>
            <div className="container-title-foto">
              <h1 className='title-item'>{detalhe.titulo_anuncio}</h1>
              <img src={`https://aeotnew.s3.amazonaws.com/${detalhe.foto}`} alt="foto_item" className='foto-item' />
            </div>
            <div className="container-sobre-item">
              <p className='info-item item-descricao'>{detalhe.descricao}</p>
              <p className='info-item item-endereco'>{detalhe.endereco}</p>
            </div>

            <div className='container-km-time-btn'>
              {distancia.id && (
                <div className='container-km-time'>
                  <p className='km km-time'>
                    <FontAwesomeIcon className="icon-km" icon={faFlagCheckered} style={{ color: "#4caf50", }} /> {distancia.distancia}
                  </p>

                  <p className='time km-time'>
                    <FontAwesomeIcon className="icon-time" icon={faClock} style={{ color: "#4caf50", }} /> {distancia.tempo}
                  </p>
                </div>
              )}
              <div className='container-btn-abrir-maps'>
                <button className='btn-abrir-maps' onClick={() => { abrirMaps(detalhe.endereco) }} type="button">Abrir no Maps?</button>
              </div>
            </div>
          </>
        )}
      </div>

      {editPosto && (

        <div id='editar_combustivel' className='container-modal-edit-combustivel'>

          <div className='modal-edit-combustivel'>

            <div className='container-close-modal'>
              <button onClick={() => { setEditPosto(false) }} type="button" className='btn-close-modal'>
                <FontAwesomeIcon className='x-icon' icon={faXmark} />
              </button>
            </div>

            <div className='container-input-edit-combustivel'>

              <input
                className='input-edit-combustivel'
                type="text"
                name={inputInfo.type_input}
                id={inputInfo.type_input}
                placeholder={inputInfo.value_input}
                onChange={(e) => checkValor(e)} />
              <button
                className='btn-edit-combustivel'
                type="button"
                onClick={() => { editarPosto(inputInfo.type_input, detalhe.cod_posto) }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Detalhes
