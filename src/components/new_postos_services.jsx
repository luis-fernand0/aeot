import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import { validarCnpj } from '../functions/validarCnpj';
import '../style/new_services_page/new_services.css'

const apiKey = import.meta.env.VITE_URL_API_CNPJ_KEY

const NewPostosServices = () => {
  const [categoria, setCategoria] = useState('postos')
  const [infoCnpj, setInfoCnpj] = useState()
  const [cnpjValid, setCnpjValid] = useState(false)
  const [cnpj, setCnpj] = useState()

  function callValidation(e) {
    const cnpj = e.target.value
    setCnpj(cnpj)
    setCnpjValid(validarCnpj(cnpj))
  }
  function maskCnpj(e) {
    var cnpj = e.target
    var cnpjValue = cnpj.value.replace(/[^0-9]/g, '')
    if (cnpjValue.length > 2) {
      cnpjValue = cnpjValue.slice(0, 2) + '.' + cnpjValue.slice(2);
    }
    if (cnpjValue.length > 6) {
      cnpjValue = cnpjValue.slice(0, 6) + '.' + cnpjValue.slice(6);
    }
    if (cnpjValue.length > 10) {
      cnpjValue = cnpjValue.slice(0, 10) + '/' + cnpjValue.slice(10); // Barra
    }
    if (cnpjValue.length > 15) {
      cnpjValue = cnpjValue.slice(0, 15) + '-' + cnpjValue.slice(15); // Hífen
    }
    if (cnpjValue.length > 18) {
      cnpjValue = cnpjValue.slice(0, 18)
    }
    cnpj.value = cnpjValue

    return cnpj
  }

  function checkPhone(e) {
    let input = e.target
    let inputValue = input.value

    if (inputValue.length > 15) {
      inputValue = inputValue.slice(0, 15)
    }
    input.value = inputValue

    input.value = maskPhone(input.value)
    return input


  }
  function maskPhone(value) {
    if (!value) return ""

    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{2})(\d)/, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")

    return value
  }

  function addFoto(input) {
    document.getElementById(input).click()
  }
  function verificarFoto(e, inputId, btnId) {
    if (e.target.value === '') {
      document.querySelector(`.${inputId}`).classList.remove('hidden-span-alert')
      document.querySelector(`#${btnId}`).classList.remove('checked-foto')
    } else {
      document.querySelector(`.${inputId}`).classList.add('hidden-span-alert')
      document.querySelector(`#${btnId}`).classList.add('checked-foto')
    }
  }

  async function buscarCnpj(cnpjValid, cnpj) {
    if (!cnpjValid) {
      addValue(false)
      return
    }

    const cnpjSemFormatacao = cnpj.replace(/[^0-9]/g, "")

    const response = await fetch(`https://api.cnpja.com/office/${cnpjSemFormatacao}`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey
      }
    })
    const data = await response.json()
    setInfoCnpj(data.address)
    addValue(data.address)
  }

  function addValue(infoCnpj) {
    let inputAddress = document.getElementById('endereco')

    if (!infoCnpj) {
      inputAddress.value = ''
      return
    }

    inputAddress.value = `${infoCnpj.street}, ${infoCnpj.number}, ${infoCnpj.district}`
  }
  
  useEffect(() => {
    buscarCnpj(cnpjValid, cnpj)
  }, [cnpjValid, cnpj])

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
                  required />

                <span>*CPNJ INFORMADO NÃO É VALIDO!</span>
                <input
                  id='cnpj'
                  name="cnpj"
                  className="input-info input-info-posto"
                  type="text"
                  placeholder="CNPJ"
                  required
                  maxLength={18}
                  onChange={(e) => { maskCnpj(e) }}
                  onBlur={(e) => { callValidation(e) }} />

                <textarea
                  id='descricao'
                  name="descricao"
                  className="text-area-descricao"
                  type="text"
                  placeholder="Descrição" />

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
                  required
                  onChange={(e) => { checkPhone(e) }}
                  maxLength={15} />

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

                <span className='span-alert hidden-span-alert alert-foto'>
                  *É NECESSARIO QUE ANEXE UMA FOTO DO POSTO DE GASOLINA!
                </span>
                <input
                  onChange={(e) => { verificarFoto(e, 'alert-foto', 'btn-foto-posto') }}
                  id='foto-posto'
                  className='input-add-foto'
                  name="foto"
                  type="file"
                  accept="image/*"
                  required />
                <button
                  onClick={() => { addFoto('foto-posto') }}
                  id='btn-foto-posto'
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
