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

  function anexarFoto(input) { document.getElementById(input).click() }
  function checkFoto(e) {
    const foto = e.target.files[0]
    const novaFoto = document.getElementById('new-foto-posto')
    if (foto) {
      const reader = new FileReader()
      reader.onload = (e) => {
        novaFoto.src = e.target.result
      }
      reader.readAsDataURL(foto)

      document.querySelector('.modal-confirm').classList.remove('modal-confirm-hidden')

      comprimirFoto('edit_foto')
    }

    return
  }

  async function changeFoto(input) {
    const fileInput = document.getElementById(input)
    const file = fileInput.files[0]

    const formData = new FormData()
    formData.append('foto_posto', file)

    const response = await fetch(urlAtualizarFoto, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenUser}`,
      },
      body: formData
    })
    const data = await response.json()
    if (response.status === 403) {
      navigate('/', { replace: true })
    }

    setNewFoto(file)
    document.querySelector('.modal-confirm').classList.add('modal-confirm-hidden')
  }

  function cancelFoto() {
    const inputFoto = document.getElementById('edit_foto')
    inputFoto.value = ''
    document.querySelector('.modal-confirm').classList.add('modal-confirm-hidden')
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

              <div className='container-div-foto-btn'>
                <div className='container-foto-btn'>
                  <img src={`https://aeotnew.s3.amazonaws.com/${detalhe.foto}`} alt="foto-item" className='foto-item' />

                  <div className='container-btn-edit-foto'>
                    <input onChange={(e) => { checkFoto(e) }} type="file" className='input-edit-foto' id='edit_foto' name='foto' accept='image/*' />
                    <button onClick={() => { anexarFoto('edit_foto') }} type="button" className='btn-edit-foto'>
                      <FontAwesomeIcon className='pen-icon' icon={faPen} />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="container-sobre-item">

              <div className="container-info-item">
                <p className='info-item item-descricao'>{detalhe.descricao}</p>

                {(typeUser === 'administrador' || typeUser === 'posto') && (
                  <button
                    onClick={() => { modalEditPosto(detalhe.descricao, 'descricao') }} type="button"
                    className='edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                )}
              </div>

              <div className="container-info-item">
                <p className='info-item item-endereco'>{detalhe.endereco}</p>

                {(typeUser === 'administrador' || typeUser === 'posto') && (
                  <button
                    onClick={() => { modalEditPosto(detalhe.endereco, 'endereco') }} type="button"
                    className='edit-combustivel'>
                    <FontAwesomeIcon className='pen-icon' icon={faPen} />
                  </button>
                )}
              </div>

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

      <div className='modal-confirm modal-confirm-hidden'>
        <div className='container-imgs-btns-text'>
          <div className='container-text'>
            <p>Tem certeza que deseja trocar sua foto de perfil?</p>
          </div>
          <img src="" alt="foto-posto" className='foto-posto' id='new-foto-posto' />

          <div className='container-btns-enviar-img'>
            <button onClick={() => { changeFoto('edit_foto') }} className='btn-enviar-img btn-sim' type="button">Sim</button>
            <button onClick={() => { cancelFoto() }} className='btn-enviar-img btn-nao' type="button">Não</button>
          </div>
        </div>
      </div>

      {editPosto && (

        <div id='editar_posto' className='container-modal-edit-posto'>

          <div className='modal-edit-posto'>

            <div className='container-close-modal'>
              <button onClick={() => { setEditPosto(false) }} type="button" className='btn-close-modal'>
                <FontAwesomeIcon className='x-icon' icon={faXmark} />
              </button>
            </div>

            <div className='container-input-edit-posto'>

              <input
                className='input-edit-posto'
                type="text"
                name={inputInfo.type_input}
                id={inputInfo.type_input}
                placeholder={inputInfo.value_input}
                onChange={(e) => checkValor(e)} />
              <button
                className='btn-edit-posto'
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
