import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import '../style/new_services_page/new_services.css'

const NewPostosServices = () => {
  const [categoria, setCategoria] = useState('postos')

  function maskCnpj(e) {
    var cnpj = e.target
    var cnpjValue = cnpj.value
  }

  return (
    <>
      <div className='container-form-arrow'>
        <div className='container-arrow-icon'>
          <FontAwesomeIcon className='arrow-icon' icon={faArrowLeftLong} />
        </div>

        <div className='container-btns'>
          <button onClick={() => { setCategoria('postos') }}
            className={`tipo-cadastro ${categoria === 'postos' ? 'checked' : ''}`}
            type="button">
            Cadastrar Posto
          </button>
          <button onClick={() => { setCategoria('servico') }}
            className={`tipo-cadastro ${categoria === 'servico' ? 'checked' : ''}`}
            type="button">
            Cadastrar Serviço
          </button>
        </div>

        <div className="container-forms">
          <form className="form-cadastrar-posto-servico">

            {categoria === 'postos' && (
              <div className='cadastrar-posto'>
                <input
                  id='nome'
                  name="nome"
                  className="input-info input-info-posto"
                  type="text"
                  placeholder="Nome do Posto"
                  required/>

                <input
                  id='cnpj'
                  name="cnpj"
                  className="input-info input-info-posto"
                  type="number"
                  placeholder="CNPJ"
                  required
                  onChange={(e) => { maskCnpj(e) }}/>

                <textarea
                  id='descricao'
                  name="descricao"
                  className="text-area-descricao"
                  type="text"
                  placeholder="Descrição"/>

                <input
                  id='endereco'
                  name="endereco"
                  className="input-info input-info-posto"
                  type="text"
                  placeholder="Endereço"
                  required/>

                <input
                  id='telefone'
                  name="telefone"
                  className="input-info input-info-posto"
                  type="tel"
                  placeholder="Telefone"
                  required/>

                <p className='text-info'>Tipo de combustivel que deseja trabalhar</p>
                <div className='container-inputs-combutiveis'>

                  <input
                    id='etanol'
                    className='input-add-combustivel input-info'
                    name="etanol"
                    type="number"
                    placeholder="Etanol" />

                  <input
                    id='gasolina'
                    className='input-add-combustivel input-info'
                    name="gasolina"
                    type="number"
                    placeholder="Gasolina" />

                  <input
                    id='diesel'
                    className='input-add-combustivel input-info'
                    name="diesel"
                    type="number"
                    placeholder="Diesel" />
                </div>

                <input
                  id='foto-posto'
                  className='input-add-foto'
                  name="foto"
                  type="file"
                  accept="image/*" 
                  required/>
                <button
                  className="btn-foto btn-foto-posto"
                  type="button">
                  Foto do posto de gasolina!
                </button>
                <button
                  className="btn-criar"
                  type="button">
                  CRIAR
                </button>
              </div>
            )}

            {categoria === 'servico' && (
              <div className='cadastrar-servico'>
                <input
                  name="titulo_anuncio"
                  className="input-info input-info-servico"
                  type="text"
                  placeholder="Nome do serviço" />

                <input
                  name="cnpj"
                  className="input-info input-info-servico"
                  type="number"
                  placeholder="CNPJ" />

                <textarea
                  name="descricao"
                  className="text-area-descricao"
                  type="text"
                  placeholder="Descrição" />

                <input
                  name="endereco"
                  className="input-info input-info-servico"
                  type="text"
                  placeholder="Endereço" />

                <input
                  name="telefone"
                  className="input-info input-info-servico"
                  type="tel"
                  placeholder="Telefone" />

                <p className='text-info'>Tipo de combustivel que deseja trabalhar</p>
                <div className='container-inputs-combutiveis'>

                  <input
                    id='etanol'
                    className='input-add-combustivel input-info'
                    name="etanol"
                    type="number"
                    placeholder="Etanol" />

                  <input
                    id='gasolina'
                    className='input-add-combustivel input-info'
                    name="gasolina"
                    type="number"
                    placeholder="Gasolina" />

                  <input
                    id='diesel'
                    className='input-add-combustivel input-info'
                    name="diesel"
                    type="number"
                    placeholder="Diesel" />
                </div>

                <input
                  id='foto-posto'
                  className='input-add-foto'
                  name="foto"
                  type="file"
                  accept="image/*" />
                <button
                  className="btn-foto btn-foto-serviço"
                  type="button">
                  Foto do seu ponto de serviço!
                </button>
                <button
                  className="btn-criar"
                  type="button">
                  CRIAR
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  )
}

export default NewPostosServices;
