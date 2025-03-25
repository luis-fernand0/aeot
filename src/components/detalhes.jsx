import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGasPump, faPen, faFlagCheckered, faClock } from '@fortawesome/free-solid-svg-icons'

import Header from "./header";
import Loading from "./loading"
import ModalResponse from "./modalResponse";
import EditItem from "./modal_edit_item";

import '../style/detalhes_page/detalhes.css'

const urlCallItem = import.meta.env.VITE_URL_CALL_ITEM

const Detalhes = () => {
  const item = JSON.parse(localStorage.getItem('dadosItem')) || {}
  const itemCategoria = JSON.parse(localStorage.getItem('categoria')) || {}
  const location = JSON.parse(localStorage.getItem('location')) || {}

  const navigate = useNavigate()

  const tokenUser = localStorage.getItem('token');
  const typeUser = localStorage.getItem('type_user')

  const [detalhe, setDetalhe] = useState(item || {})
  let formasEtanol = Object.keys(detalhe.combustivel?.etanol?.formas || {})
  let formasGasolina = Object.keys(detalhe.combustivel?.gasolina?.formas || {})
  let formasDiesel = Object.keys(detalhe.combustivel?.diesel?.formas || {})
  const [formasDePagamento, setFormasDePagamento] = useState([])

  const [distancia, setDistancia] = useState(location[0] || {})
  const [local, setLocal] = useState(location[1] || {})
  const [categoria, setCategoria] = useState(itemCategoria.categoria || {})

  const [loading, setLoading] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showEditPosto, setShowEditPosto] = useState(false)

  const [formaAbastecimento, setFormaAbastecimento] = useState({
    etanol: null,
    gasolina: null,
    diesel: null
  })
  function hundleChange(combustivel, pagamento) {
    setFormaAbastecimento((prevState) => ({
      ...prevState,
      [combustivel]: {
        forma_abastecimento: detalhe.combustivel[combustivel].formas[pagamento].forma_abastecimento,
        brinde: {
          nome_brinde: detalhe?.combustivel[combustivel]?.formas[pagamento]?.brindes?.nome_brinde,
          descricao_brinde: detalhe.combustivel[combustivel].formas[pagamento].brindes?.descricao_brinde,
          expiracao_brinde: detalhe.combustivel[combustivel].formas[pagamento].brindes?.expiracao_brinde
        }
      }
    }))
  }

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
          categoria: categoria,
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
      localStorage.setItem('dadosItem', JSON.stringify(data.query))
    } catch (err) {
      setModalMessage(`Desculpe ocorreu um erro inesperado! ${err.message}`)
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    callItem()
    if (categoria === 'postos') {
      const formasPagamento = [
        { value: '1', label: 'Dinheiro' },
        { value: '2', label: 'Pix' },
        { value: '3', label: 'Debito' },
        { value: '4', label: 'Credito' },
      ];
      let todasAsFormas = [...formasEtanol, ...formasGasolina, ...formasDiesel]
      todasAsFormas.forEach((keyForma) => {
        formasPagamento.forEach((key) => {
          if (key.value == keyForma) {
            setFormasDePagamento((prevState) => {
              if (!prevState.includes(key.label)) {
                return [...prevState, key.label]
              }
              return prevState
            })
          }
        })
      })

      let combustiveis = Object.keys(detalhe.combustivel)
      combustiveis.forEach((key) => {
        let formas = Object.keys(detalhe.combustivel[key].formas)
        hundleChange(key, formas[0])
      })
    }
  }, [])

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
              <h1 className='title-item'>{detalhe.nome || detalhe.titulo_anuncio}</h1>

              <img src={`https://aeotnew.s3.amazonaws.com/${detalhe.foto}`} alt="foto-item" className='foto-item' />
            </div>

            <div className="container-sobre-item">

              <div className="container-info-item">
                <p className='info-item item-descricao'>{detalhe.descricao}</p>
              </div>

              <div className="container-info-item">
                <p className='info-item item-endereco'>{detalhe.endereco}</p>
              </div>

              {categoria === 'postos' && (
                <>
                  <div className='container-combustivel'>
                    {detalhe.combustivel?.etanol && (
                      <>
                        <div className="container-combustivel-formas">
                          <p className="combustivel-posto">
                            Etanol: R$ {detalhe.combustivel?.etanol.valor}
                          </p>

                          <select
                            name="formas_pagamento"
                            className="metodo-pagamento"
                            id="forma_pagamento_etanol"
                            onChange={(e) => hundleChange('etanol', e.target.value)}>
                            {formasEtanol.map((key, index) => (
                              <option key={key} value={key}>
                                {detalhe.combustivel?.etanol.formas[formasEtanol[index]]?.forma_pagamento}
                              </option>
                            ))}
                          </select>

                          <p>
                            {formaAbastecimento?.etanol?.forma_abastecimento}
                          </p>
                          {formaAbastecimento?.etanol?.brinde?.nome_brinde && (
                            <div>
                              <h4>Brindes:</h4>
                              <p>
                                Nome do brinde: {formaAbastecimento?.etanol?.brinde?.nome_brinde}
                                <br />
                                Descrição: {formaAbastecimento?.etanol?.brinde?.descricao_brinde}
                                <br />
                                Valido por: {formaAbastecimento?.etanol?.brinde?.expiracao_brinde} Dias
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {detalhe.combustivel?.gasolina && (
                      <>
                        <div className="container-combustivel-formas">
                          <p className="combustivel-posto">
                            Gasolina: R$ {detalhe.combustivel?.gasolina.valor}
                          </p>

                          <select
                            className="metodo-pagamento"
                            name="formas_pagamento"
                            id="forma_pagamento_gasolina"
                            onChange={(e) => hundleChange('gasolina', e.target.value)}>
                            {formasGasolina.map((key, index) => (
                              <option key={key} value={key}>
                                {detalhe.combustivel?.gasolina.formas[formasGasolina[index]]?.forma_pagamento}
                              </option>
                            ))}
                          </select>

                          <p>
                            {formaAbastecimento?.gasolina?.forma_abastecimento}
                          </p>
                          {formaAbastecimento?.gasolina?.brinde?.nome_brinde && (
                            <div className="container-brinde">
                              <h4 className="title-brindes">Brindes:</h4>
                              <p className="text-brindes">
                                Nome do brinde: {formaAbastecimento?.gasolina?.brinde?.nome_brinde}
                                <br />
                                Descrição: {formaAbastecimento?.gasolina?.brinde?.descricao_brinde}
                                <br />
                                Valido por: {formaAbastecimento?.gasolina?.brinde?.expiracao_brinde} Dias
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {detalhe.combustivel?.diesel && (
                      <>
                        <div className="container-combustivel-formas">
                          <p className="combustivel-posto">
                            Diesel: R$ {detalhe.combustivel?.diesel.valor}
                          </p>

                          <select
                            className="metodo-pagamento"
                            name="formas_pagamento"
                            id="forma_pagamento_diesel"
                            onChange={(e) => hundleChange('diesel', e.target.value)}>
                            {formasDiesel.map((key, index) => (
                              <option key={key} value={key}>
                                {detalhe.combustivel?.diesel.formas[formasDiesel[index]]?.forma_pagamento}
                              </option>
                            ))}
                          </select>

                          <p>
                            {formaAbastecimento?.diesel?.forma_abastecimento}
                          </p>
                          {formaAbastecimento?.diesel?.brinde?.nome_brinde && (
                            <div>
                              <h4>Brindes:</h4>
                              <p>
                                Nome do brinde: {formaAbastecimento?.diesel?.brinde?.nome_brinde}
                                <br />
                                Descrição: {formaAbastecimento?.diesel?.brinde?.descricao_brinde}
                                <br />
                                Valido por: {formaAbastecimento?.diesel?.brinde?.expiracao_brinde} Dias
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="container-formas-de-pagamento">
                    <p className="title-formas-de-pagamento">Formas de pagamento</p>

                    <div className="formas-de-pagamento">
                      {formasDePagamento.map((formaPagamento) => (
                        <p key={formaPagamento} className="text-forma-de-pagamento">
                          {formaPagamento}
                        </p>
                      ))}
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

              {categoria === 'postos' && (
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
