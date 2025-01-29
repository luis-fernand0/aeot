import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { validarCnpj } from '../functions/validarCnpj'
import { checkPhone } from '../functions/checkPhone'
import { checkValor } from '../functions/checkValor'
import { maskCnpj } from '../functions/maskCnpj'
import { comprimirFoto } from '../functions/comprimirFoto';
import { formatarEmail } from '../functions/formatarEmail';
import { revealPass } from '../functions/revealPass';
import { checkPass } from '../functions/checkPass';

import Loading from './loading'
import ModalResponse from './modalResponse';

import '../style/new_services_page/new_services.css'

const urlCadastrar = import.meta.env.VITE_URL_CADASTRAR_POSTO_ANUNCIO

const NewPostosServices = () => {
  const [categoria, setCategoria] = useState('postos')
  const [fotoValid, setFotoValid] = useState(false)

  const [loading, setLoading] = useState(false)

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const combustiveis = ['etanol', 'gasolina', 'diesel'];
  const metodosPagamento = ['dinheiro', 'pix', 'debito', 'credito'];
  const abastecimentos = [
    { value: '', label: 'Escolha a forma de abastecimento' },
    { value: 'Litragem Livre', label: 'Litragem Livre' },
    { value: 'Encher Tanque', label: 'Encher Tanque' },
  ];

  const tokenUser = localStorage.getItem('token');

  const navigate = useNavigate()

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

  function callValidation(e) {
    const cnpj = e.target.value

    if (!validarCnpj(cnpj)) {
      buscarCnpj(validarCnpj(cnpj))
      document.querySelector('.alert-cnpj').classList.remove('hidden-span-alert')
      return
    }

    buscarCnpj(validarCnpj(cnpj))

    document.querySelector('.alert-cnpj').classList.add('hidden-span-alert')
  }
  async function buscarCnpj(cnpjValid) {
    if (!cnpjValid) {
      addValue(false)
      return
    }

    let cnpj = document.getElementById('cnpj')
    const cnpjSemFormatacao = cnpj.value.replace(/[^0-9]/g, "")

    const response = await fetch(`https://open.cnpja.com/office/${cnpjSemFormatacao}`)
    const data = await response.json()
    addValue(data.address)
  }
  function addValue(infoCnpj) {
    let address = document.getElementById('endereco')
    let city = document.getElementById('cidade')
    let uf = document.getElementById('uf')

    if (!infoCnpj) {
      address.value = ''
      city.value = ''
      uf.value = ''
      return
    }

    address.value = `${infoCnpj.street}, ${infoCnpj.number}, ${infoCnpj.district}`
    city.value = `${infoCnpj.city}`
    uf.value = `${infoCnpj.state}`
  }

  async function hundleSubmit(e) {
    e.preventDefault()
    // setLoading(true)

    let cnpj = document.getElementById('cnpj')
    let checkboxes = document.querySelectorAll("input[type='checkbox']")
    checkboxes.forEach((box) => {
      console.log(box)
    })

    if (!fotoValid || !validarCnpj(cnpj.value)) {
      setModalMessage('É necessario preencher todos os dados!')
      setModalVisible(true)

      setLoading(false)

      return
    }

    if (categoria === 'postos' && !checkPass('pass', 'confirm-pass', 'pass-alert')) {
      setModalMessage('É necessario que as senhas sejam iguais! Corrija sua senha!')
      setModalVisible(true)

      setLoading(false)

      return
    }
    const myForm = document.getElementById('form-cadastro')
    const formData = new FormData(myForm)
    formData.append('categoria', [categoria])

    checkboxes.forEach((checkbox) => {
      checkbox.value = checkbox.checked
      if (!checkbox.checked) {
        formData.append(checkbox.name, checkbox.checked)
      }
    })

    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }

    try {
      const response = await fetch(urlCadastrar, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`
        },
        body: formData
      })
      const dataResponse = await response.json()

      if (response.status === 403) {
        navigate('/', { replace: true })
      }

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

  function limitarCaracter(e) {
    let uf = e.target
    let ufValue = uf.value.replace(/[^a-zA-Z]/g, '')

    if (ufValue.length > 2) {
      ufValue = ufValue.slice(0, 2)
    }

    ufValue = ufValue.toUpperCase()

    return uf.value = ufValue
  }

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
          <button onClick={() => setCategoria('postos')}
            className={`tipo-cadastro ${categoria === 'postos' ? 'checked' : ''}`}
            type="button">
            Cadastrar Posto
          </button>
          <button onClick={() => setCategoria('anuncios')}
            className={`tipo-cadastro ${categoria === 'anuncios' ? 'checked' : ''}`}
            type="button">
            Cadastrar Anuncio
          </button>
        </div>

        <div className="container-forms">
          <form id='form-cadastro' onSubmit={(e) => hundleSubmit(e)} className="form-cadastrar-posto-anuncio">

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
                  onChange={(e) => maskCnpj(e)}
                  onBlur={(e) => callValidation(e)}
                  id='cnpj'
                  name="cnpj"
                  className="input-info input-info-posto"
                  type="text"
                  placeholder="CNPJ"
                  required
                  maxLength={18} />

                <input
                  onChange={(e) => formatarEmail(e)}
                  id='email'
                  name="email"
                  className="input-info input-info-posto"
                  type="email"
                  placeholder="Email"
                  required />

                <span className='span-alert hidden-span-alert pass-alert'>AS SENHAS DEVEM SER IGUAIS*</span>
                <div className='container-pass' >
                  <input
                    onBlur={() => checkPass('pass', 'confirm-pass', 'pass-alert')}
                    id="pass"
                    className='input-info input-info-posto input-info-pass'
                    type="password"
                    name="pass"
                    placeholder='Senha'
                    minLength={6}
                    required />
                  <button onClick={() => revealPass('input-info-pass')} type='button' className='pass-reveal'>
                    <FontAwesomeIcon className='eye-icon eye-icon-hidden hidden' icon={faEyeSlash} />
                    <FontAwesomeIcon className='eye-icon eye-icon-show' icon={faEye} />
                  </button>
                </div>

                <span className='span-alert hidden-span-alert pass-alert'>AS SENHAS DEVEM SER IGUAIS*</span>
                <div className='container-pass' >
                  <input
                    onBlur={() => checkPass('pass', 'confirm-pass', 'pass-alert')}
                    id="confirm-pass"
                    className='input-info input-info-posto input-info-pass'
                    type="password"
                    name="confirm_pass"
                    placeholder='Confirme sua senha'
                    minLength={6}
                    required />
                  <button onClick={() => revealPass('input-info-pass')} type='button' className='pass-reveal'>
                    <FontAwesomeIcon className='eye-icon eye-icon-hidden hidden' icon={faEyeSlash} />
                    <FontAwesomeIcon className='eye-icon eye-icon-show' icon={faEye} />
                  </button>
                </div>

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
                  id='cidade'
                  name="cidade"
                  className="input-info input-info-posto"
                  type="text"
                  placeholder="Cidade"
                  required />

                <input
                  onChange={(e) => limitarCaracter(e)}
                  id='uf'
                  name="uf"
                  className="input-info input-info-posto"
                  type="text"
                  placeholder="UF"
                  required />

                <input
                  id='telefone'
                  name="telefone"
                  className="input-info input-info-posto"
                  type="tel"
                  placeholder="Telefone"
                  required
                  onChange={(e) => checkPhone(e)}
                  maxLength={15} />

                <p className='text-info'>Formas de pagamento</p>
                <div className='container-forma-de-pagamento'>
                  <div className='forma-de-pagamento'>
                    <input className='input-checkbox' type="checkbox" name="dinheiro" id="dinheiro" />
                    <label className='text-checkbox' htmlFor="dinheiro">Dinheiro</label>
                  </div>

                  <div className="forma-de-pagamento">
                    <input className='input-checkbox' type="checkbox" name="pix" id="pix" />
                    <label className='text-checkbox' htmlFor="pix">Pix</label>
                  </div>

                  <div className="forma-de-pagamento">
                    <input className='input-checkbox' type="checkbox" name="debito" id="debito" />
                    <label className='text-checkbox' htmlFor="debito">Debito</label>
                  </div>

                  <div className="forma-de-pagamento">
                    <input className='input-checkbox' type="checkbox" name="credito" id="credito" />
                    <label className='text-checkbox' htmlFor="credito">Credito</label>
                  </div>
                </div>

                <p className='text-info'>Valores dos combustivel que deseja trabalhar</p>
                <div className='container-inputs-combutiveis'>

                  {combustiveis.map(combustivel => (
                    <div key={combustivel} className="combustivel-container">
                      <input
                        onChange={(e) => checkValor(e)}
                        id={combustivel}
                        className='input-add-combustivel input-info'
                        name={combustivel}
                        type="text"
                        placeholder={combustivel.charAt(0).toUpperCase() + combustivel.slice(1)}
                      />

                      {metodosPagamento.map(metodo => (
                        <div key={`${combustivel}-${metodo}`} className="metodo-container">

                          <input
                            className='input-checkbox'
                            type="checkbox"
                            id={`${combustivel}-${metodo}`}
                            name={`${combustivel}_${metodo}`} />
                          <label
                            className='text-checkbox'
                            htmlFor={`${combustivel}-${metodo}`}>
                            {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
                          </label>

                          <select
                            name={`${combustivel}_${metodo}_abastecimento`}
                            id={`${combustivel}-${metodo}-abastecimento`}>

                            {abastecimentos.map(opcao => (
                              <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* <input
                    onChange={(e) => checkValor(e)}
                    id='etanol'
                    className='input-add-combustivel input-info'
                    name="etanol"
                    type="text"
                    placeholder="Etanol" />

                  <input
                    onChange={(e) => checkValor(e)}
                    id='gasolina'
                    className='input-add-combustivel input-info'
                    name="gasolina"
                    type="text"
                    placeholder="Gasolina" />

                  <input
                    onChange={(e) => checkValor(e)}
                    id='diesel'
                    className='input-add-combustivel input-info'
                    name="diesel"
                    type="text"
                    placeholder="Diesel" /> */}
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
                  onClick={() => addFoto('foto-posto')}
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
                  name="nome"
                  className="input-info input-info-anuncio"
                  type="text"
                  placeholder="Nome do anuncio"
                  required />
                <span className='span-alert hidden-span-alert alert-cnpj'>
                  *CPNJ INFORMADO NÃO É VALIDO!
                </span>
                <input
                  onChange={(e) => maskCnpj(e)}
                  onBlur={(e) => callValidation(e)}
                  name="cnpj"
                  id='cnpj'
                  className="input-info input-info-anuncio"
                  type="text"
                  placeholder="CNPJ"
                  maxLength={18}
                  required />

                <textarea
                  name="descricao"
                  className="text-area-descricao"
                  type="text"
                  placeholder="Descrição" />

                <input
                  id='endereco'
                  name="endereco"
                  className="input-info input-info-anuncio"
                  type="text"
                  placeholder="Endereço"
                  required />

                <input
                  id='cidade'
                  name="cidade"
                  className="input-info input-info-anuncio"
                  type="text"
                  placeholder="Cidade"
                  required />

                <input
                  id='uf'
                  name="uf"
                  className="input-info input-info-anuncio"
                  type="text"
                  placeholder="UF"
                  required />

                <input
                  name="telefone"
                  className="input-info input-info-anuncio"
                  type="tel"
                  placeholder="Telefone"
                  required
                  onChange={(e) => checkPhone(e)}
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
                  onClick={() => addFoto('foto-anuncio')}
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
