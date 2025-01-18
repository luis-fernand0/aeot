import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faGasPump, faPen, faFlagCheckered, faClock } from '@fortawesome/free-solid-svg-icons'

import Header from "./header";
import Loading from "./loading"
import ModalResponse from "./modalResponse";
import EditItem from "./modal_edit_item";

import '../style/detalhes_page/detalhes.css'

const urlCallItem = import.meta.env.VITE_URL_CALL_ITEM

const Detalhes = () => {
  const itens = JSON.parse(localStorage.getItem('detalhes'))

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

  async function callItem() {
    setShowEditPosto(false)
    setLoading(true)

    try {
      const response = await fetch(urlCallItem, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoria: categoria.categoria,
          item_id: detalhe.cod_posto || detalhe.cod_anuncio
        })
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
    } catch (err) {
      setModalMessage(`Desculpe ocorreu um erro inesperado! ${err.message}`)
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
      <EditItem
        show={showEditPosto}
        close={() => callItem()}
        item={detalhe}
        categoria={categoria} />

      <div className='container-item'>
        {categoria && (
          <>
            <div className="container-title-foto">
              <h1 className='title-item'>{detalhe.nome}</h1>

              <img src={`https://aeotnew.s3.amazonaws.com/${detalhe.foto}`} alt="foto-item" className='foto-item' />
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

            {(typeUser === 'administrador' || typeUser === 'posto') && (
              <button
                onClick={() => setShowEditPosto(true)} type="button"
                className='btn-edit-item'>
                <FontAwesomeIcon className='pen-icon' icon={faPen} />
              </button>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Detalhes
