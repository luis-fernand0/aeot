const NewPostosServices = () => {
  return (
    <>
      <p>voltar</p>
      <div>
        <div>
          <button type="button">Cadastrar Posto</button>
          <button type="button">Cadastrar Serviço</button>
        </div>

        <div>
          <form action="">
            <input type="text" placeholder="Nome do Posto"/>
            <input type="number" placeholder="CNPJ"/>
            <input type="text" placeholder="Descrição"/>
            <input type="text" placeholder="Endereço"/>
            <input type="tel" placeholder="Telefone"/>
            
            <p>Tipo de combustivel que deseja trabalhar</p>
            <div>
              <input type="checkbox" id="etanol" />
              <label htmlFor="etanol">Etanol</label>
              <input type="number" placeholder="Etanol" />
            </div>

            <div>
              <input type="checkbox" id="gasolina" />
              <label htmlFor="gasolina">Gasolina</label>
              <input type="number" placeholder="Gasolina" />
            </div>

            <div>
              <input type="checkbox" id="diesel" />
              <label htmlFor="diesel">Diesel</label>
              <input type="number" placeholder="Diesel" />
            </div>

            <input type="number" placeholder=""/>
            <input type="file" accept="image/*" />
          </form>
        </div>
      </div>
    </>
  )
}

export default NewPostosServices;
