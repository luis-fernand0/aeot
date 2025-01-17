import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faGasPump, faPen, faFlagCheckered, faClock } from '@fortawesome/free-solid-svg-icons'

import { checkValor } from "../functions/checkValor";
import { comprimirFoto } from "../functions/comprimirFoto";

import Header from "./header";
import Loading from "./loading"
import ModalResponse from "./modalResponse";
import EditItem from "./modal_edit_item";

import '../style/detalhes_page/detalhes.css'

const urlAtualizarFoto = import.meta.env.VITE_URL_ATUALIZAR_FOTO_USER


const Detalhes = () => {
  const itens = JSON.parse(sessionStorage.getItem('detalhes'))

  const [detalhe, setDetalhe] = useState(itens[0] || {})
  const [distancia, setDistancia] = useState(itens[1] || {})
  const [local, setLocal] = useState(itens[2] || {})
  const [categoria, setCategoria] = useState(itens[3] || {})

  const [loading, setLoading] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [showEditPosto, setShowEditPosto] = useState(false)

  const tokenUser = localStorage.getItem('token');
  const typeUser = localStorage.getItem('type_user')

  function abrirMaps(endereco) {
    if (!local) {
      alert('Localização atual não disponível');
      return;
    }

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${local.latitude},${local.longitude}&destination=${encodeURIComponent(endereco)}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
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

  async function changeFoto(input, categoria, cod) {
    setLoading(true)

    const fileInput = document.getElementById(input)
    const file = fileInput.files[0]

    const formData = new FormData()
    formData.append('foto_posto', file)
    formData.append('categoria', categoria)
    formData.append('cod_posto', cod)

    try {
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

      setDetalhe(data.query)
      setModalMessage(data.message)
      setModalVisible(true)
      document.querySelector('.modal-confirm').classList.add('modal-confirm-hidden')
    } catch (error) {
      setModalMessage(`Ocorreu um erro inesperado. Tente novamente mais tarde.` + err.message)
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
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
      <EditItem
        show={showEditPosto}
        close={() => setShowEditPosto(false)}
        item={detalhe}
        categoria={categoria} />

      <div className='container-item'>
        {categoria && (
          <>
            <div className="container-title-foto">
              <h1 className='title-item'>{detalhe.nome}</h1>
              <button
                onClick={() => setShowEditPosto(true)} type="button"
                className='edit-combustivel'>
                <FontAwesomeIcon className='pen-icon' icon={faPen} />
              </button>

              <div className='container-div-foto-btn'>
                <div className='container-foto-btn'>
                  <img src={`https://aeotnew.s3.amazonaws.com/${detalhe.foto}`} alt="foto-item" className='foto-item' />

                  {typeUser === 'posto' && (
                    <div className='container-btn-edit-foto'>
                      <input onChange={(e) => { checkFoto(e) }} type="file" className='input-edit-foto' id='edit_foto' name='foto' accept='image/*' />
                      <button onClick={() => { anexarFoto('edit_foto') }} type="button" className='btn-edit-foto'>
                        <FontAwesomeIcon className='pen-icon' icon={faPen} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="container-sobre-item">

              <div className="container-info-item">
                <p className='info-item item-descricao'>{detalhe.descricao}</p>
              </div>

              <div className="container-info-item">
                <p className='info-item item-endereco'>{detalhe.endereco}</p>
              </div>

              {categoria.categoria === 'postos' && (
                <>
                  <div className='container-edit-combustivel'>
                    <p id='valor-etanol' className='combustivel-posto'>
                      Etanol: R$ {detalhe.etanol}
                    </p>
                  </div>

                  <div className='container-edit-combustivel'>
                    <p id='valor-gasolina' className='combustivel-posto'>
                      Gasolina: R$ {detalhe.gasolina}
                    </p>
                  </div>

                  <div className='container-edit-combustivel'>
                    <p id='valor-diesel' className='combustivel-posto'>
                      Diesel: R$ {detalhe.diesel}
                    </p>
                  </div>

                  <div className="container-formas-de-pagamento">
                    <p className="title-formas-de-pagamento">Formas de pagamento</p>

                    <div className="formas-de-pagamento">
                      <p className="text-forma-de-pagamento">
                        Dinheiro: {detalhe.dinheiro === true ? 'Sim' : 'Não'}
                      </p>

                      <p className="text-forma-de-pagamento">
                        Pix: {detalhe.pix === true ? 'Sim' : 'Não'}
                      </p>

                      <p className="text-forma-de-pagamento">
                        Debito: {detalhe.debito === true ? 'Sim' : 'Não'}
                      </p>

                      <p className="text-forma-de-pagamento">
                        Credito: {detalhe.credito === true ? 'Sim' : 'Não'}
                      </p>
                    </div>
                  </div>
                </>
              )}
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

              {categoria.categoria === 'postos' && (
                <div className="container-gas-pump-btn">
                  {(typeUser === 'driver' || typeUser === 'administrador') && (
                    <Link to={'/abastecimento'}>
                      <button className="gas-pump-btn" type="button">
                        Abastecer <FontAwesomeIcon className='icon-gas-pump' icon={faGasPump} />
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* <div className='modal-confirm modal-confirm-hidden'>
        <div className='container-imgs-btns-text'>
          <div className='container-text'>
            <p>Tem certeza que deseja trocar sua foto de perfil?</p>
          </div>
          <img src="" alt="foto-posto" className='foto-posto' id='new-foto-posto' />

          <div className='container-btns-enviar-img'>
            <button onClick={() => changeFoto('edit_foto', 'postos', detalhe.cod_posto || detalhe.cod_anuncio)} className='btn-enviar-img btn-sim' type="button">Sim</button>
            <button onClick={() => cancelFoto()} className='btn-enviar-img btn-nao' type="button">Não</button>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default Detalhes
