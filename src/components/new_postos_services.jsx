import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons'

import { validarCnpj } from '../functions/validarCnpj'
import { checkPhone } from '../functions/checkPhone'
import { checkValor } from '../functions/checkValor'
import { maskCnpj } from '../functions/maskCnpj'
import { comprimirFoto } from '../functions/comprimirFoto';
import { formatarEmail } from '../functions/formatarEmail';
import { revealPass } from '../functions/revealPass';
import { checkPass } from '../functions/checkPass';
import { combustiveis, formasPagamento, formasAbastecimentos } from '../functions/contants';

import Loading from './loading'
import ModalResponse from './modalResponse';

import '../style/new_services_page/new_services.css'

const urlCadastrar = import.meta.env.VITE_URL_CADASTRAR_POSTO_ANUNCIO

const NewPostosServices = () => {
  const tokenUser = localStorage.getItem('token');

  const navigate = useNavigate()

  const [categoria, setCategoria] = useState('postos')
  const [fotoValid, setFotoValid] = useState(false)

  const [loading, setLoading] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [formCombustivel, setFormCombustivel] = useState(true)
  const [showOptions, setShowOptions] = useState({})

  const [configCombustiveis, setConfigCombustiveis] = useState({});
  function adicionarConfiguracao(combustivel) {
    setConfigCombustiveis((prev) => ({
      ...prev,
      [combustivel]: [...(prev[combustivel] || []), {
        forma_pagamento: '',
        forma_abastecimento: '',
        valor: ''
      }]
    }));
  };

  function removerConfiguracao(combustivel, index) {
    setConfigCombustiveis((prev) => ({
      ...prev,
      [combustivel]: prev[combustivel].filter((elemento, i) => i !== index)
    }));
  };

  function atualizarConfiguracao(combustivel, index, campo, valor) {
    setConfigCombustiveis((prev) => {
      const novoArray = [...prev[combustivel]];
      novoArray[index][campo] = valor;
      return {
        ...prev,
        [combustivel]: novoArray
      };
    });
  };

  function toggleOptions(combustivel) {
    setShowOptions((prev) => ({
      ...prev,
      [combustivel]: !prev[combustivel],
    }))
  }

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

  function limitarCaracter(e) {
    let uf = e.target
    let ufValue = uf.value.replace(/[^a-zA-Z]/g, '')

    if (ufValue.length > 2) {
      ufValue = ufValue.slice(0, 2)
    }

    ufValue = ufValue.toUpperCase()

    return uf.value = ufValue
  }

  function nextStep(e) {
    e.preventDefault()

    let cnpj = document.getElementById('cnpj')
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

    if (categoria != 'postos') {
      sendForms(e)
      return
    }

    setFormCombustivel(true)
  }

  async function sendForms(e) {
    e.preventDefault()
    setLoading(true)

    try {
      let form = new FormData(document.getElementById('form-cadastro'))
      
      if (categoria === 'postos') {
        let inputCheckeds = document.querySelectorAll("input[name='combustiveis']:checked")

        if (inputCheckeds.length === 0) {
          setModalMessage('Selecione pelos menos um combustivel para trabalhar!')
          setModalVisible(true)
          return
        }

        let combustiveis = {}
        let lastPagamento = null
        let lastAbastecimento = null

        let formCombustivel = Object.keys(configCombustiveis)
        for (let i = 0; i < formCombustivel.length; i++) {
          let infoCombustivelAtual = configCombustiveis[formCombustivel[i]]
          combustiveis[formCombustivel[i]] = {
            combustivel: formCombustivel[i],
            valor_formas: []
          }

          for (let index = 0; index < infoCombustivelAtual.length; index++) {
            const formasValorAtual = infoCombustivelAtual[index];

            let pagamentoAtual = formasValorAtual['forma_pagamento']
            let abastecimentoAtual = formasValorAtual['forma_abastecimento']
            if (pagamentoAtual == lastPagamento && abastecimentoAtual == lastAbastecimento) {
              throw new Error("Não pode existir o mesmo pagamento e o mesmo abastecimento para o mesmo combus tivel!");
            }

            combustiveis[formCombustivel[i]].valor_formas.push(formasValorAtual)
            lastPagamento = pagamentoAtual
            lastAbastecimento = abastecimentoAtual
          }
          lastPagamento = null
          lastAbastecimento = null
        }
        form.append('combustiveis', JSON.stringify(combustiveis))
      }

      form.append('categoria', [categoria])

      const response = await fetch(urlCadastrar, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUser}`
        },
        body: form
      })
      const dataResponse = await response.json()

      if (response.status === 401) {
        navigate('/', { replace: true })
      }

      setModalMessage(dataResponse.message)
      setModalVisible(true)
    } catch (err) {
      setModalMessage(`Ocorreu um erro inesperado. Tente novamente mais tarde. ` + err.message)
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
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
          <form id='form-cadastro' onSubmit={(e) => nextStep(e)} className="form-cadastrar-posto-anuncio">

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
                  PROXIMA ETAPA
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
        {formCombustivel && (
          <div className='container-form-combustivel'>
            <form id='form-combustivel' onSubmit={(e) => sendForms(e)}>
              <div className='container-close-btn'>
                <button
                  className='close-btn'
                  onClick={() => {
                    setFormCombustivel(false);
                    setShowOptions({});
                  }}>
                  <FontAwesomeIcon className='x-icon' icon={faXmark} />
                </button>
              </div>

              <div className='cadastrar-combustivel'>
                <p className='text-info'>
                  Com qual combustivel deseja trabalhar?
                </p>

                {combustiveis.map((combustivel) => (
                  <div key={combustivel.value} className="container-combustivel">
                    <div className='conatiner-checkbox-combustivel'>
                      <input
                        className='checkbox-combustivel'
                        type="checkbox"
                        name='combustiveis'
                        id={combustivel.label}
                        value={combustivel.value}
                        onChange={() => toggleOptions(combustivel.label)} />

                      <label className='text-combustivel' htmlFor={combustivel.label}>
                        {combustivel.label.charAt(0).toUpperCase() + combustivel.label.slice(1)}
                      </label>
                    </div>

                    {showOptions[combustivel.label] && (
                      <div className='container-valor-formas'>
                        {(configCombustiveis[combustivel.value] || []).map((config, index) => (
                          <div key={index} className='grupo-config'>
                            <select
                              value={config.forma_pagamento}
                              onChange={(e) =>
                                atualizarConfiguracao(combustivel.value, index, 'forma_pagamento', e.target.value)}>
                              <option value="">Forma de pagamento</option>
                              {formasPagamento.map((pagamento) => (
                                <option key={pagamento.value} value={pagamento.value}>
                                  {pagamento.label}
                                </option>
                              ))}
                            </select>

                            <select
                              value={config.forma_abastecimento}
                              onChange={(e) =>
                                atualizarConfiguracao(combustivel.value, index, 'forma_abastecimento', e.target.value)}>
                              <option value="">Forma de abastecimento</option>
                              {formasAbastecimentos.map((abastecimento) => (
                                <option key={abastecimento.value} value={abastecimento.value}>
                                  {abastecimento.label}
                                </option>
                              ))}
                            </select>

                            <input
                              type="text"
                              placeholder="Valor"
                              value={config.valor}
                              onChange={(e) => {
                                checkValor(e)
                                atualizarConfiguracao(combustivel.value, index, 'valor', e.target.value);
                              }} />

                            <button
                              type="button"
                              onClick={() => removerConfiguracao(combustivel.value, index)}>
                              Remover
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => adicionarConfiguracao(combustivel.value)}>
                          + Adicionar configuração
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className='btn-criar' type='submit'>Criar</button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default NewPostosServices;
