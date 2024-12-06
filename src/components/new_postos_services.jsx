import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import { validarCnpj } from '../functions/validarCnpj'
import { checkPhone } from '../functions/checkPhone'
import { checkValor } from '../functions/checkValor'
import { maskCnpj } from '../functions/maskCnpj'
import { comprimirFoto } from '../functions/comprimirFoto';

import Loading from './loading'
import ModalResponse from './modalResponse';
import '../style/new_services_page/new_services.css'

const apiKey = import.meta.env.VITE_URL_API_CNPJ_KEY
const urlCadastrar = import.meta.env.VITE_URL_CADASTRAR_POSTO_ANUNCIO

const NewPostosServices = () => {
  const [categoria, setCategoria] = useState('postos')
  const [cnpjValid, setCnpjValid] = useState(false)
  const [cnpj, setCnpj] = useState()
  const [fotoValid, setFotoValid] = useState(false)

  const [loading, setLoading] = useState(false)

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const tokenUser = localStorage.getItem('token');

  const navigate = useNavigate()

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

  function addFoto(input) { document.getElementById(input).click() }
  const callVerificarFoto = async (inputId, span, btnId) => {
    const foto = await comprimirFoto(inputId)
    if (!foto) {
      document.querySelector(`.${span}`).classList.remove('hidden-span-alert')
      document.querySelector(`#${btnId}`).classList.remove('checked-foto')
      return false
    }

    setFotoValid(foto)
    document.querySelector(`.${span}`).classList.add('hidden-span-alert')
    document.querySelector(`#${btnId}`).classList.add('checked-foto')
  }

  async function buscarCnpj(cnpjValid, cnpj) {
    if (!cnpjValid) {
      addValue(false)
      return
    }

    const cnpjSemFormatacao = cnpj.replace(/[^0-9]/g, "")

    const response = await fetch(`https://open.cnpja.com/office/${cnpjSemFormatacao}`)
    const data = await response.json()
    addValue(data.address)
  }
  function addValue(infoCnpj) {
    let inputAddress = document.getElementById('endereco')

    if (!infoCnpj) {
      inputAddress.value = ''
      return
    }

    inputAddress.value = `${infoCnpj.street}, ${infoCnpj.number}, ${infoCnpj.district}, ${infoCnpj.city} - ${infoCnpj.state}`
  }

  async function hundleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    if (!fotoValid || !cnpjValid) {
      setModalMessage('É necessario preencher todos os dados!')
      setModalVisible(true)

      setLoading(false)

      return
    }
    const myForm = document.getElementById('form-cadastro')
    const formData = new FormData(myForm)
    formData.append('categoria', [categoria])

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(urlCadastrar, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`
        },
        body: formData
      })
      if (response.status === 403) {
        navigate('/', { replace: true })
      }
      const dataResponse = await response.json()
      if (response.status != 200 || response.status === 200) {
        setModalMessage(dataResponse.message)
        setModalVisible(true)
      }
    } catch (err) {
      setModalMessage(`Ocorreu um erro inesperado. Tente novamente mais tarde.` + err.message)
      setModalVisible(true)
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
      <ModalResponse
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
        buttonText="Ir para HOME!"
        redirectTo="/home"
      />
      <div className='container-form-arrow'>

        <div className='container-arrow-icon'>
          <Link to={'/adicionar_cadastros'}>
            <FontAwesomeIcon className='arrow-icon' icon={faArrowLeftLong} />
          </Link>
        </div>

        <div className='container-btns'>
          <button onClick={() => { setCategoria('postos') }}
            className={`tipo-cadastro ${categoria === 'postos' ? 'checked' : ''}`}
            type="button">
            Cadastrar Posto
          </button>
          <button onClick={() => { setCategoria('anuncios') }}
            className={`tipo-cadastro ${categoria === 'anuncios' ? 'checked' : ''}`}
            type="button">
            Cadastrar Anuncio
          </button>
        </div>

        <div className="container-forms">
          <form id='form-cadastro' onSubmit={(e) => { hundleSubmit(e) }} className="form-cadastrar-posto-anuncio">

            {categoria === 'postos' && (
              <div className='cadastrar-posto'>
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

                <span className='span-alert hidden-span-alert alert-foto-posto'>
                  *É NECESSARIO QUE ANEXE UMA FOTO DO POSTO DE GASOLINA!
                </span>
                <input
                  onChange={() => { callVerificarFoto('foto-posto', 'alert-foto-posto', 'btn-foto-posto') }}
                  id='foto-posto'
                  className='input-add-foto'
                  name="foto_posto"
                  type="file"
                  accept="image/*" />
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

            {categoria === 'anuncios' && (
              <div className='cadastrar-anuncio'>
                <input
                  name="titulo_anuncio"
                  className="input-info input-info-anuncio"
                  type="text"
                  placeholder="Nome do anuncio"
                  required />
                <span className='span-alert hidden-span-alert alert-cnpj'>
                  *CPNJ INFORMADO NÃO É VALIDO!
                </span>
                <input
                  name="cnpj"
                  className="input-info input-info-anuncio"
                  type="text"
                  placeholder="CNPJ"
                  maxLength={18}
                  onChange={(e) => { callMaskCnpj(e) }}
                  onBlur={(e) => { callValidation(e) }}
                  required />

                <textarea
                  name="descricao"
                  className="text-area-descricao"
                  type="text"
                  placeholder="Descrição" />

                <input
                  name="endereco"
                  className="input-info input-info-anuncio"
                  type="text"
                  placeholder="Endereço"
                  required />

                <input
                  name="telefone"
                  className="input-info input-info-anuncio"
                  type="tel"
                  placeholder="Telefone"
                  required
                  onChange={(e) => { callCheckPhone(e) }}
                  maxLength={15} />

                <span className='span-alert hidden-span-alert alert-foto-anuncio'>
                  *É NECESSARIO QUE ANEXE UMA FOTO DO SEU PONTO DE SERVIÇO!
                </span>
                <input
                  id='foto-anuncio'
                  className='input-add-foto'
                  name="foto_anuncio"
                  type="file"
                  accept="image/*"
                  onChange={() => { callVerificarFoto('foto-anuncio', 'alert-foto-anuncio', 'btn-foto-anuncio') }} />
                <button
                  onClick={() => { addFoto('foto-anuncio') }}
                  id='btn-foto-anuncio'
                  className="btn-foto btn-foto-anuncio"
                  type="button">
                  Foto do anuncio!
                </button>
                <button
                  className="btn-criar"
                  type="submit">
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
