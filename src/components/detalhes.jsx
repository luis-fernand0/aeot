import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faPen, faFlagCheckered, faClock } from '@fortawesome/free-solid-svg-icons';

import Header from "./header";
import Loading from "./loading";
import ModalResponse from "./modalResponse";
import EditItem from "./modal_edit_item";

import '../style/detalhes_page/detalhes.css';

const urlCallItem = import.meta.env.VITE_URL_CALL_ITEM;

const CombustivelCard = ({ tipo, data, formaAbastecimento, onChange }) => {
  const formas = data.formas_valor || [];

  return (
    <div className="container-combustivel-formas">
      <p className="combustivel-posto">
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}: R$ {formaAbastecimento?.valor || data.melhor_opcao?.valor}
      </p>

      <select
        className="metodo-pagamento"
        onChange={(e) => onChange(tipo, e.target.value)}>
        {formas.map((forma, index) => (
          <option key={index} value={index}>
            {forma.forma_pagamento.charAt(0).toUpperCase() + forma.forma_pagamento.slice(1)} - {forma.forma_abastecimento}
          </option>
        ))}
      </select>

      {formaAbastecimento?.brinde?.nome_brinde && (
        <div className="container-brinde">
          <h4 className="title-brindes">Brindes:</h4>
          <p className="container-text-brindes">
            <span className="text-brinde">Nome: {formaAbastecimento.brinde.nome_brinde}</span><br />
            <span className="text-brinde">Descrição: {formaAbastecimento.brinde.descricao_brinde}</span><br />
            <span className="text-brinde">Válido por: {formaAbastecimento.brinde.expiracao_brinde} dia(s)</span><br />
            <span className="text-brinde">Mínimo: {formaAbastecimento.brinde.abastecimento_minimo} vez(es)</span>
          </p>
        </div>
      )}
    </div>
  );
};

const Detalhes = () => {
  const item = JSON.parse(localStorage.getItem('dadosItem')) || {};
  const itemCategoria = JSON.parse(localStorage.getItem('categoria')) || {};
  const location = JSON.parse(localStorage.getItem('location')) || [];

  const navigate = useNavigate();

  const tokenUser = localStorage.getItem('token');
  const typeUser = localStorage.getItem('type_user');

  const [detalhe, setDetalhe] = useState(item);
  console.log(detalhe)
  const [distancia, setDistancia] = useState(location[0] || {});
  const [local, setLocal] = useState(location[1] || {});
  const [categoria, setCategoria] = useState(itemCategoria);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showEditPosto, setShowEditPosto] = useState(false);

  const [formaAbastecimento, setFormaAbastecimento] = useState({});

  const hundleChange = (combustivel, index) => {
    const formaSelecionada = detalhe.combustiveis[combustivel].formas_valor[index];
    setFormaAbastecimento((prev) => ({
      ...prev,
      [combustivel]: {
        valor: formaSelecionada.valor,
        forma_pagamento: formaSelecionada.forma_pagamento,
        forma_abastecimento: formaSelecionada.forma_abastecimento,
        brinde: {
          nome_brinde: formaSelecionada.nome_brinde,
          descricao_brinde: formaSelecionada.descricao_brinde,
          expiracao_brinde: formaSelecionada.expiracao,
          abastecimento_minimo: formaSelecionada.abastecimentos_minimos
        }
      }
    }));
  };

  const abrirMaps = (endereco) => {
    if (!local) {
      alert('Localização atual não disponível');
      return;
    }

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${local.latitude},${local.longitude}&destination=${encodeURIComponent(endereco)}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  const callItem = async () => {
    setShowEditPosto(false);
    setLoading(true);

    try {
      const response = await fetch(urlCallItem, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoria,
          item_id: detalhe.cod_posto || detalhe.cod_anuncio,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        navigate('/', { replace: true });
        return;
      }

      if (!response.ok) {
        setModalMessage(data.message);
        setModalVisible(true);
        return;
      }
      console.log(data.query[0])
      setDetalhe(data.query[0]);
      localStorage.setItem('dadosItem', JSON.stringify(data.query));
    } catch (err) {
      setModalMessage(`Desculpe ocorreu um erro inesperado! ${err.message}`);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  function redirectAbastecimento(posto) {
    localStorage.setItem('dadosPosto', JSON.stringify(posto))
    navigate('/abastecimento');
    return;
  }

  useEffect(() => {
    if (categoria === 'postos' && detalhe.combustiveis) {
      const novoEstado = {};
      for (let tipo in detalhe.combustiveis) {
        const melhor = detalhe.combustiveis[tipo].melhor_opcao;
        if (melhor) {
          novoEstado[tipo] = {
            valor: melhor.valor,
            forma_pagamento: melhor.forma_pagamento,
            forma_abastecimento: melhor.forma_abastecimento,
            brinde: {
              nome_brinde: melhor.nome_brinde,
              descricao_brinde: melhor.descricao_brinde,
              expiracao_brinde: melhor.expiracao,
              abastecimento_minimo: melhor.abastecimentos_minimos
            }
          };
        }
      }
      setFormaAbastecimento(novoEstado);
    }
  }, [detalhe]);

  return (
    <>
      <Header redirectTo="/home" />
      <Loading loading={loading} />
      <ModalResponse
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)} message={modalMessage} />
      <EditItem
        show={showEditPosto}
        close={() => callItem()} item={detalhe} categoria={categoria} />

      <div className="container-item">
        {categoria && (
          <>
            <div className="container-title-foto">
              <h1 className="title-item">{detalhe.nome || detalhe.titulo_anuncio}</h1>
              <img src={`https://aeotnew.s3.amazonaws.com/${detalhe.foto}`} alt="foto-item" className="foto-item" />
            </div>

            <div className="container-sobre-item">
              <div className="container-info-item">
                <p className="info-item item-descricao">{detalhe.descricao}</p>
              </div>

              <div className="container-info-item">
                <p className="info-item item-endereco">{detalhe.endereco}</p>
              </div>

              {categoria === 'postos' && (
                <div className="container-combustivel">
                  {detalhe.combustiveis?.etanol && (
                    <CombustivelCard
                      tipo="etanol"
                      data={detalhe.combustiveis.etanol}
                      formaAbastecimento={formaAbastecimento.etanol}
                      onChange={hundleChange}
                    />
                  )}

                  {detalhe.combustiveis?.gasolina && (
                    <CombustivelCard
                      tipo="gasolina"
                      data={detalhe.combustiveis.gasolina}
                      formaAbastecimento={formaAbastecimento.gasolina}
                      onChange={hundleChange}
                    />
                  )}

                  {detalhe.combustiveis?.diesel && (
                    <CombustivelCard
                      tipo="diesel"
                      data={detalhe.combustiveis.diesel}
                      formaAbastecimento={formaAbastecimento.diesel}
                      onChange={hundleChange}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="container-km-time-btn">
              {distancia.id && (
                <div className="container-km-time">
                  <p className="km km-time">
                    <FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#4caf50" }} /> {distancia.distancia}
                  </p>
                  <p className="time km-time">
                    <FontAwesomeIcon icon={faClock} style={{ color: "#4caf50" }} /> {distancia.tempo}
                  </p>
                </div>
              )}
              <div className="container-btn-abrir-maps">
                <button className="btn-abrir-maps"
                  onClick={() => abrirMaps(detalhe.endereco)}>
                  Abrir no Maps?
                </button>
              </div>

              {(categoria === 'postos') && (typeUser === 'driver' || typeUser === 'administrador') && (
                <div className="container-gas-pump-btn">
                  <button className="gas-pump-btn" type="button" onClick={() => redirectAbastecimento(detalhe)}>
                    Abastecer <FontAwesomeIcon icon={faGasPump} />
                  </button>
                </div>
              )}
            </div>

            {(typeUser === 'administrador' || typeUser === 'posto') && (
              <button
                className="btn-edit-item"
                onClick={() => setShowEditPosto(true)}>
                <FontAwesomeIcon icon={faPen} />
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Detalhes;
