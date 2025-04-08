import { useState, useRef, useEffect } from "react"
import "../style/relatorio_component/relatorio.css"

const Relatorio = () => {
  const tokenUser = localStorage.getItem('token');
  const typeUser = localStorage.getItem('type_user')

  const [filtros, setFiltros] = useState({
    dataInicial: "",
    dataFinal: "",
    frentista: "",
  })
  const [dados, setDados] = useState([])
  const [frentistas, setFrentistas] = useState([])
  const autoCompleteRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  async function filtrarDados() {
    console.log(filtros)
    try {
      const response = await fetch('http://localhost:3000/aeot/auth/relatorio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtros)
      })

      const data = await response.json()

      setDados(data.relatorio)
    } catch (err) {

    }
  }

  async function buscarFrentista(nome) {
    const response = await fetch(`http://localhost:3000/aeot/auth/buscar_frentista?nome=${nome}`, {
      headers: {
        'Authorization': `Bearer ${tokenUser}`
      }
    })
    const data = await response.json()
    setFrentistas(data.frentistas)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target)) {
        setFrentistas([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container-relatorio">
      <h2 className="title-relatorio">Relatório de Vendas de Combustível</h2>

      <div className="container-filtros">
        <div className="filtro">
          <label htmlFor="dataInicial">Data Inicial:</label>
          <input type="date" id="dataInicial" name="dataInicial" value={filtros.dataInicial} onChange={handleChange} />
        </div>

        <div className="filtro">
          <label htmlFor="dataFinal">Data Final:</label>
          <input type="date" id="dataFinal" name="dataFinal" value={filtros.dataFinal} onChange={handleChange} />
        </div>

        {typeUser === 'administrador' && (
          <div className="filtro">
            <label htmlFor="posto">Posto:</label>
            <input type="text" id="posto" name="posto" />
          </div>
        )}

        <div className="filtro filtro-frentista">
          <label htmlFor="frentista">Frentista:</label>
          <div className="container-input-ul" ref={autoCompleteRef}>
            <input className="input-frentista" id="frentista" type="text" name="frentista"
              onChange={(e) => {
                buscarFrentista(e.target.value)
              }}/>
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
                      {frentista.nome.toUpperCase()}
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
        <button className="btn-filtrar">
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
            {dados.map((item, index) => (
              <tr key={index}>
                <td>{item.posto}</td>
                <td>{item.data_venda}</td>
                <td>{item.hora_venda}</td>
                <td>{item.motorista}</td>
                <td>{item.combustivel}</td>
                <td>{item.valor}</td>
                <td>{item.litros}</td>
                <td>R$ {item.valor_total}</td>
                <td>{item.frentista}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Relatorio