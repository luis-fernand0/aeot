import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import { validarCnpj } from '../functions/validarCnpj'
import { checkPhone } from '../functions/checkPhone'
import { checkValor } from '../functions/checkValor'
import { maskCnpj } from '../functions/maskCnpj';

import Loading from './loading'
import '../style/new_services_page/new_services.css'

const apiKey = import.meta.env.VITE_URL_API_CNPJ_KEY

const NewPostosServices = () => {
  const [categoria, setCategoria] = useState('postos')
  // const [infoCnpj, setInfoCnpj] = useState()
  const [cnpjValid, setCnpjValid] = useState(false)
  const [cnpj, setCnpj] = useState()

  const [loading, setLoading] = useState(false)

  function callValidation(e) {
    const cnpj = e.target.value

    setCnpj(cnpj)
    setCnpjValid(validarCnpj(cnpj))

    if (!validarCnpj(cnpj)) {
      document.querySelector('.alert-cnpj').classList.remove('hidden-span-alert')
    } else {
      document.querySelector('.alert-cnpj').classList.add('hidden-span-alert')
    }
  }

  const callMaskCnpj = (e) => maskCnpj(e)

  const callCheckPhone = (e) => checkPhone(e)

  const callCheckValor = (e) => checkValor(e)

  function addFoto(input) {document.getElementById(input).click()}
  function verificarFoto(inputId, span, btnId) {
    const inputFoto = document.getElementById(inputId).value
    if (inputFoto === '') {
      document.querySelector(`.${span}`).classList.remove('hidden-span-alert')
      document.querySelector(`#${btnId}`).classList.remove('checked-foto')
      return false
    } else {
      document.querySelector(`.${span}`).classList.add('hidden-span-alert')
      document.querySelector(`#${btnId}`).classList.add('checked-foto')
      return true
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
    // setInfoCnpj(data.address)
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

  async function hundleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    if (!verificarFoto('foto-posto', 'alert-foto', 'btn-foto-posto') ||
        !cnpjValid) {
      setLoading(false)
      return console.log('É necessario preencher todos os campos')
    }

    try {
      console.log(e.target)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    buscarCnpj(cnpjValid, cnpj)
  }, [cnpjValid, cnpj])

  return (
    <>
      <Loading loading={loading} />
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
          <form onSubmit={(e) => { hundleSubmit(e) }} className="form-cadastrar-posto-servico">

            {categoria === 'postos' && (
              <div id='form-cadastro-posto' className='cadastrar-posto'>
                <input
                  id='nome'
                  name="nome"
                  className="input-info input-info-posto"
                  type="text"
                  placeholder="Nome do Posto"
                  required />

                <span className='span-alert hidden-span-alert alert-cnpj'>
                  *CPNJ INFORMADO NÃO É VALIDO!
                </span>
                <input
                  id='cnpj'
                  name="cnpj"
                  className="input-info input-info-posto"
                  type="text"
                  placeholder="CNPJ"
                  required
                  maxLength={18}
                  onChange={(e) => { callMaskCnpj(e) }}
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
                  required />

                <input
                  id='telefone'
                  name="telefone"
                  className="input-info input-info-posto"
                  type="tel"
                  placeholder="Telefone"
                  required
                  onChange={(e) => { callCheckPhone(e) }}
                  maxLength={15} />

                <p className='text-info'>Tipo de combustivel que deseja trabalhar</p>
                <div className='container-inputs-combutiveis'>

                  <input
                    onChange={(e) => { callCheckValor(e) }}
                    id='etanol'
                    className='input-add-combustivel input-info'
                    name="etanol"
                    type="text"
                    placeholder="Etanol" />

                  <input
                    onChange={(e) => { callCheckValor(e) }}
                    id='gasolina'
                    className='input-add-combustivel input-info'
                    name="gasolina"
                    type="text"
                    placeholder="Gasolina" />

                  <input
                    onChange={(e) => { callCheckValor(e) }}
                    id='diesel'
                    className='input-add-combustivel input-info'
                    name="diesel"
                    type="text"
                    placeholder="Diesel" />
                </div>

                <span className='span-alert hidden-span-alert alert-foto'>
                  *É NECESSARIO QUE ANEXE UMA FOTO DO POSTO DE GASOLINA!
                </span>
                <input
                  onChange={() => { verificarFoto('foto-posto', 'alert-foto', 'btn-foto-posto') }}
                  id='foto-posto'
                  className='input-add-foto'
                  name="foto"
                  type="file"
                  accept="image/*"/>
                <button
                  onClick={() => { addFoto('foto-posto') }}
                  id='btn-foto-posto'
                  className="btn-foto btn-foto-posto"
                  type="button">
                  Foto do posto de gasolina!
                </button>
                <button
                  className="btn-criar"
                  type="submit">
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
