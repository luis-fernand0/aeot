import { useState } from "react"
import "../style/relatorio_component/relatorio.css"

const Relatorio = () => {
  const tokenUser = localStorage.getItem('token');

  const [filtros, setFiltros] = useState({
    dataInicial: "",
    dataFinal: "",
    frentista: "",
  })

  const [dados, setDados] = useState([])

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

  return (
    <div className="container-relatorio">
      <h2 className="title-relatorio">Relatório de Vendas de Combustível</h2>

      <div className="container-filtros">
        <div className="filtro">
          <label>Data Inicial:</label>
          <input type="date" name="dataInicial" value={filtros.dataInicial} onChange={handleChange} />
        </div>

        <div className="filtro">
          <label>Data Final:</label>
          <input type="date" name="dataFinal" value={filtros.dataFinal} onChange={handleChange} />
        </div>

        <div className="filtro">
          <label>Frentista:</label>
          <input type="text" name="frentista" value={filtros.frentista} onChange={handleChange} />
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