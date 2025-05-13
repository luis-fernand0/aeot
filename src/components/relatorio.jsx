import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { jsPDF } from "jspdf"
import { autoTable } from "jspdf-autotable"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import ModalResponse from './modalResponse'
import Loading from './loading'

import "../style/relatorio_component/relatorio.css"
const urlRelatorio = import.meta.env.VITE_URL_RELATORIO
const urlBuscarFrentista = import.meta.env.VITE_URL_BUSCAR_FRENTISTA
const urlBuscarPosto = import.meta.env.VITE_URL_BUSCAR_POSTO
const urlRelatorioCompleto = import.meta.env.VITE_URL_RELATORIO_COMPLETO

const Relatorio = () => {
  const tokenUser = localStorage.getItem('token');
  const typeUser = localStorage.getItem('type_user')

  const [filtros, setFiltros] = useState({
    dataInicial: "",
    dataFinal: "",
    frentista: "",
    posto: ""
  })
  const [dados, setDados] = useState([])
  const [frentistas, setFrentistas] = useState([])
  const [postos, setPostos] = useState([])

  const [loading, setLoading] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [limitePorPagina, setLimitePorPagina] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const refFrentista = useRef(null)
  const refPosto = useRef(null)
  let totalVendas = 0

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  async function filtrarDados() {
    setLoading(true)
    try {
      const response = await fetch(urlRelatorio, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...filtros,
          page: paginaAtual,
          limit: limitePorPagina
        })
      })

      const data = await response.json()

      setDados(data.relatorio)
      setDados(data.relatorio)
      setTotalPaginas(data.totalPaginas || 1)
    } catch (err) {
      setModalMessage(err.message)
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  async function buscarFrentista(nome) {
    const response = await fetch(`${urlBuscarFrentista}?nome=${nome}`, {
      headers: {
        'Authorization': `Bearer ${tokenUser}`
      }
    })
    const data = await response.json()
    setFrentistas(data.frentistas)
  }

  async function buscarPostos(nome) {
    const response = await fetch(`${urlBuscarPosto}?nome=${nome}`, {
      headers: {
        'Authorization': `Bearer ${tokenUser}`
      }
    })
    const data = await response.json()
    setPostos(data.postos)
  }

  async function relatorioCompleto() {
    try {
      const response = await fetch(urlRelatorioCompleto, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filtros })
      })

      const data = await response.json()
      return data.relatorio
    } catch (err) {
      setModalMessage(err.message)
      setModalVisible(true)
    }
  }

  async function gerarPdf() {
    setLoading(true)
    let relatorio = await relatorioCompleto()
    try {
      let doc = new jsPDF()

      doc.setFillColor(255, 242, 18);
      doc.rect(0, 10, 210, 10, 'F');

      let img = '/logo_AEOT.png';
      doc.addImage(img, 'PNG', 15, 6, 35, 20);

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Relatório de Vendas de Combustível", 70, 17);

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const dataAtual = new Date().toLocaleDateString();
      doc.text(`Emitido em: ${dataAtual}`, 14, 36);
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Total de vendas: R$ ${totalVendas}`, 14, 43);

      const head = [[
        "Posto", "Data", "Hora", "Motorista",
        "Combustível", "Valor (R$)", "Litros", "Total (R$)", "Frentista"
      ]];

      const body = relatorio.map(item => ([
        item.posto,
        item.data_venda,
        item.hora_venda,
        item.motorista,
        item.combustivel,
        item.valor,
        item.litros,
        item.valor_total,
        item.frentista.toUpperCase()
      ]))

      autoTable(doc, {
        head: head,
        body: body,
        startY: 45,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [253, 216, 53], textColor: [255, 255, 255] },
        margin: { top: 10 }
      });

      doc.save("relatorio.pdf")
    } catch (err) {
      setModalMessage(err.message)
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refFrentista.current && !refFrentista.current.contains(event.target)
      ) {
        setFrentistas([]);
      }

      if (
        refPosto.current && !refPosto.current.contains(event.target)
      ) {
        setPostos([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    filtrarDados();
  }, [paginaAtual]);

  return (
    <>
      <Loading loading={loading} />
      <ModalResponse
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
      />
      <div className="container-relatorio">
        <div className="continer-btn-voltar">
          <Link to={'/home'}>
            <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
          </Link>
        </div>
        <h2 className="title-relatorio">Relatório de Vendas de Combustível</h2>

        <div className="container-filtros">
          <div className="filtro">
            <label htmlFor="dataInicial">Data Inicial:</label>
            <input type="date" id="dataInicial" name="dataInicial" value={filtros.dataInicial}
              onChange={handleChange} />
          </div>

          <div className="filtro">
            <label htmlFor="dataFinal">Data Final:</label>
            <input type="date" id="dataFinal" name="dataFinal" value={filtros.dataFinal}
              onChange={handleChange} />
          </div>

          {typeUser === 'administrador' && (
            <div className="filtro filtro-posto">
              <label htmlFor="posto">Posto:</label>
              <div className="container-input-ul">
                <input type="text" id="posto" name="posto"
                  onChange={(e) => {
                    buscarPostos(e.target.value);
                    handleChange(e);
                  }} />

                <div className="container-ul-autocomplete" ref={refPosto}>
                  {postos.length > 0 && (
                    <ul className="autocomplete-list">
                      {postos.map((posto) => (
                        <li
                          key={posto.posto_user_id}
                          onClick={() => {
                            document.getElementById('posto').value = posto.nome_posto.toUpperCase();
                            setFiltros((prev) => ({ ...prev, posto: posto.posto_user_id }));
                            setPostos([]);
                          }}>
                          Posto: {posto.nome_posto.toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="filtro filtro-frentista">
            <label htmlFor="frentista">Frentista:</label>
            <div className="container-input-ul" ref={refFrentista}>
              <input className="input-frentista" id="frentista" type="text" name="frentista"
                onChange={(e) => {
                  buscarFrentista(e.target.value);
                  handleChange(e);
                }} />
              <div className="container-ul-autocomplete">
                {frentistas.length > 0 && (
                  <ul className="autocomplete-list">
                    {frentistas.map((frentista) => (
                      <li
                        key={frentista.user_id}
                        onClick={() => {
                          document.getElementById('frentista').value = frentista.nome.toUpperCase();
                          setFiltros((prev) => ({ ...prev, frentista: frentista.user_id }));
                          setFrentistas([]);
                        }}>
                        Nome: {frentista.nome.toUpperCase()}
                        <br />
                        Posto: {frentista.nome_posto.toUpperCase()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <button className="btn-filtrar" onClick={filtrarDados}>
            Pesquisar
          </button>
          <button
            onClick={() => gerarPdf()}
            className="btn-filtrar">
            Gerar relatorio
          </button>
        </div>

        <div className="container-tabela">
          <table>
            <thead>
              <tr>
                <th>Posto</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Motorista</th>
                <th>Combustível</th>
                <th>Valor</th>
                <th>Litros</th>
                <th>Total</th>
                <th>Frentista</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item, index) => {
                totalVendas += Number(item.valor_total)
                return (
                  <tr key={index}>
                    <td>{item.posto}</td>
                    <td>{item.data_venda}</td>
                    <td>{item.hora_venda}</td>
                    <td>{item.motorista}</td>
                    <td>{item.combustivel}</td>
                    <td>R$ {item.valor}</td>
                    <td>{item.litros}</td>
                    <td>R$ {item.valor_total}</td>
                    <td>{item.frentista.toUpperCase()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="container-total-vendas">
          <p className="text-total-vendas">
            Total de vendas da pagina atual:
          </p>
          <p className="text-total-vendas">
            R$ {totalVendas}
          </p>
        </div>

        <div className="paginacao">
          <button
            disabled={paginaAtual <= 1}
            onClick={() => {
              setPaginaAtual(1)
            }}>
            Primeira
          </button>
          <button
            disabled={paginaAtual <= 1}
            onClick={() => {
              setPaginaAtual(paginaAtual - 1)
            }}>
            Anterior
          </button>

          <span>Página {paginaAtual} de {totalPaginas}</span>

          <button
            disabled={paginaAtual >= totalPaginas}
            onClick={() => {
              setPaginaAtual(paginaAtual + 1)
            }}>
            Próxima
          </button>

          <button
            disabled={paginaAtual >= totalPaginas}
            onClick={() => {
              setPaginaAtual(totalPaginas)
            }}>
            Ultima
          </button>
        </div>
      </div >
    </>
  )
}

export default Relatorio