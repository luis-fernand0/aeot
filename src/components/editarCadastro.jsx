import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons'

import Loading from './loading'
import ModalResponse from './modalResponse'

import { validarCnpj } from '../functions/validarCnpj'
import { maskCnpj } from '../functions/maskCnpj'
import { formatarEmail } from '../functions/formatarEmail'
import { formatarCep } from '../functions/formatarCep'
import { formatarPlaca } from '../functions/formatarPlaca'
import { checkPhone } from '../functions/checkPhone'
import { validarCpf } from '../functions/validarCpf'
import { maskCpf } from '../functions/maskCpf'
import { comprimirFoto } from '../functions/comprimirFoto'

import '../style/editarCadastro_component/editarCadastro.css'

const urlAtualizarFoto = import.meta.env.VITE_URL_ATUALIZAR_FOTO_USER

const EditarCadastro = ({ showModal, close }) => {
    if (!showModal.view) {
        return
    }

    const tokenUser = localStorage.getItem('token')
    const typeUser = localStorage.getItem('type_user');

    const [cadastro, setCadastro] = useState(showModal.cadastro)
    const [imageModal, setImageModal] = useState({ view: false, image: null })
    const [alerts, setAlerts] = useState({
        cpf: true,
        cnpj: true,
        email: true,
        modelo_veiculo: true,
        placa_veiculo: true
    })

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const [editUser, setEditUser] = useState({
        tipo: cadastro.tipo,
        cod_cadastro: cadastro.cod_driver || cadastro.cod_posto || cadastro.cod_frentista,
        cod_user_cadastro: cadastro.id
    })

    function callValidation(e, tipo) {
        if (tipo === 'cnpj') {
            const cnpj = e.target.value

            if (!validarCnpj(cnpj)) {
                buscarCnpj(validarCnpj(cnpj))
                setAlerts({ ...alerts, [e.target.name]: false })
                document.getElementById('alert-cnpj').removeAttribute('hidden')
                document.getElementById('btn-salvar').setAttribute('disabled', true)
                return
            }

            setAlerts({ ...alerts, [e.target.name]: true })
            document.getElementById('alert-cnpj').setAttribute('hidden', true)
            document.getElementById('btn-salvar').removeAttribute('disabled')
            buscarCnpj(cnpj)

            return
        }

        const cpf = e.target.value
        if (!validarCpf(cpf)) {
            setAlerts({ ...alerts, [e.target.name]: false })
            document.getElementById('alert-cpf').removeAttribute('hidden')
            document.getElementById('btn-salvar').setAttribute('disabled', true)
            return
        }

        setAlerts({ ...alerts, [e.target.name]: true })
        document.getElementById('alert-cpf').setAttribute('hidden', true)
        document.getElementById('btn-salvar').removeAttribute('disabled')
        return
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

    function validateEmail(e) {
        const email = e.target.value

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(String(email).toLowerCase())) {
            setAlerts({ ...alerts, [e.target.name]: false })
            document.getElementById('btn-salvar').setAttribute('disabled', true)
            document.getElementById('alert-email').removeAttribute('hidden')
            return
        }

        setAlerts({ ...alerts, [e.target.name]: true })
        document.getElementById('btn-salvar').removeAttribute('disabled')
        document.getElementById('alert-email').setAttribute('hidden', true)
        return
    }

    async function buscarCep(e) {
        let cep = e.target
        let cepFormat = cep.value.replace(/[^0-9]/g, '')

        const response = await fetch(`https://cep.awesomeapi.com.br/json/${cepFormat}`)
        const data = await response.json()

        let inputAddress = document.getElementById('endereco')
        let city = document.getElementById('cidade')
        let uf = document.getElementById('uf')

        if (data.code === 'not_found') {
            inputAddress.value = ``
            city.value = ``
            uf.value = ``
            return
        }

        inputAddress.value = `${data.address}, ${data.district}`
        city.value = `${data.city}`
        uf.value = `${data.state}`
    }

    function validarModeloCor(wordValid) {
        if (!wordValid) {
            setAlerts({ ...alerts, modelo_veiculo: false })
            document.getElementById('btn-salvar').setAttribute('disabled', true)
            document.getElementById('alert-modelo').removeAttribute('hidden')
            return
        }

        setAlerts({ ...alerts, modelo_veiculo: true })
        document.getElementById('btn-salvar').removeAttribute('disabled')
        document.getElementById('alert-modelo').setAttribute('hidden', true)
        return
    }
    function handleChangeModeloCor(e) {
        var inputModelCor = e.target;
        const regex = /^\w+\s+\w+/;
        inputModelCor.value = inputModelCor.value.toUpperCase()

        validarModeloCor(regex.test(inputModelCor.value));
    }

    function validarPlaca(e) {
        var placa = e.target.value.replace(/[^A-Za-z0-9]/g, '')

        if (placa.length < 7) {
            setAlerts({ ...alerts, placa_veiculo: false })
            document.getElementById('alert-placa').removeAttribute('hidden')
            document.getElementById('btn-salvar').setAttribute('disabled', true)
            return
        }

        setAlerts({ ...alerts, placa_veiculo: true })
        document.getElementById('alert-placa').setAttribute('hidden', true)
        document.getElementById('btn-salvar').removeAttribute('disabled')
        return
    }

    function formatDate(data) {
        const date = new Date(data);

        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        let horaMinuto = new Date(data).toTimeString().split(':').slice(0, 2).join(':')

        let dataCompleta = `${dia}/${mes}/${ano} - ${horaMinuto}`

        return dataCompleta
    }

    async function editarCadastro() {
        setLoading(true)
        try {
            for (let [key, value] of Object.entries(alerts)) {
                if (!value) {
                    document.getElementById('btn-salvar').setAttribute('disabled', true)
                    throw new Error('Alguns dados precisam ser preenchidos');
                }
            }
            const response = await fetch('http://localhost:3000/aeot/auth/editar_cadastro', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editUser)
            })
            const data = await response.json()
            setModalMessage(data.message)
            setModalVisible(true)
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possivel alterar o cadastro. ` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    async function desativarCadastro() {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:3000/aeot/auth/desativar_cadastro', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editUser)
            })
            const data = await response.json()
            setModalMessage(data.message)
            setModalVisible(true)
            return
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possivel desativar o cadastro. ` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }
    async function ativarCadastro() {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:3000/aeot/auth/ativar_cadastro', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editUser)
            })
            const data = await response.json()
            setModalMessage(data.message)
            setModalVisible(true)
            return
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possivel ativar o cadastro. ` + err.message)
            setModalVisible(true)
        } finally {
            setLoading(false)
        }
    }

    function anexarFoto(input) { document.getElementById(input).click() }
    function checkFoto(e) {
        const foto = e.target.files[0]
        const novaFoto = document.getElementById('new-foto-user')
        if (foto) {
            const reader = new FileReader()
            reader.onload = (e) => {
                novaFoto.src = e.target.result
            }
            reader.readAsDataURL(foto)

            document.querySelector('.container-modal-alert').removeAttribute(`hidden`)

            comprimirFoto('edit_foto')
        }

        return
    }
    function cancelFoto() {
        const inputFoto = document.getElementById('edit_foto')
        inputFoto.value = ''
        document.querySelector('.container-modal-alert').setAttribute(`hidden`, true)
    }

    async function changeFoto(input) {
        setLoading(true)
        try {
            const fileInput = document.getElementById(input)
            const file = fileInput.files[0]

            const formData = new FormData()
            if (cadastro.tipo === 'driver') {
                formData.append('foto_user', file)
            } else {
                formData.append('foto_posto', file)
            }
            const response = await fetch(urlAtualizarFoto, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`,
                },
                body: formData
            })
            const data = await response.json()
            if (response.status === 401) {
                navigate('/', { replace: true })
            }

            document.querySelector('.container-modal-alert').setAttribute(`hidden`, true)
            setModalMessage(data.message)
            setModalVisible(true)
        } catch (err) {
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possível alterar a foto.` + err.message)
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
                message={modalMessage} />
            <div className="editar-cadastro-container">
                {cadastro && (
                    <div className="editar-cadastro">
                        <div className="container-btn-close-cadastro">
                            <button
                                onClick={close}
                                className='btn-close'>
                                <FontAwesomeIcon className='x-icon' icon={faXmark} />
                            </button>
                        </div>

                        <div className='container-verificado'>
                            <span className={`${cadastro.verificado ? 'text-verificado' : 'text-pendente'}`}>
                                {cadastro.verificado ? 'VERIFICADO' : 'PENDENTE'}
                            </span>
                        </div>

                        <div className='container-datas-cadastro'>
                            <div className='foto-cadastro'>
                                {cadastro.tipo != 'frentista' && (
                                    <>
                                        <img src={`https://aeotnew.s3.amazonaws.com/${cadastro.foto}`} alt="foto-perfil-cadastro" />

                                        <div className='container-btn-edit'>
                                            <input
                                                onChange={(e) => { checkFoto(e) }}
                                                type="file"
                                                name='foto'
                                                accept='image/*'
                                                className='input-edit-foto'
                                                id='edit_foto'
                                                hidden />

                                            <button className='btn-edit' onClick={() => { anexarFoto('edit_foto') }}>
                                                <FontAwesomeIcon className='pen-icon' icon={faPen} />
                                            </button>
                                        </div>
                                    </>
                                )}
                                {cadastro.tipo === 'driver' && (
                                    <>
                                        <button
                                            onClick={() => setImageModal({ view: true, image: cadastro.cnh })}>
                                            Foto CNH:
                                        </button>

                                        <button
                                            onClick={() => setImageModal({ view: true, image: cadastro.print_app })}>
                                            Print do app de mobilidade:
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className='datas-cadastro'>
                                <div className='container-input'>
                                    <label htmlFor="nome">
                                        Nome:
                                    </label>
                                    <input
                                        onChange={(e) => setEditUser({ ...editUser, [e.target.name]: e.target.value })}
                                        type="text"
                                        name='nome'
                                        id='nome'
                                        placeholder='Nome'
                                        defaultValue={cadastro.nome} />
                                </div>
                                {cadastro.tipo === 'driver' && (
                                    <div className="container-input">
                                        <label htmlFor="cpf">
                                            CPF:
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                maskCpf(e)
                                                setEditUser({ ...editUser, [e.target.name]: e.target.value })
                                            }}
                                            onBlur={(e) => callValidation(e, 'cpf')}
                                            id='cpf'
                                            type="text"
                                            name="cpf"
                                            placeholder='CPF'
                                            defaultValue={cadastro.cpf} />
                                        <span
                                            id='alert-cpf'
                                            className='alert'
                                            hidden={true}>
                                            CPF informado não é valido!
                                        </span>
                                    </div>
                                )}

                                {cadastro.tipo === 'posto' && (
                                    <div className="container-input">
                                        <label htmlFor="cnpj">
                                            CNPJ:
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                maskCnpj(e)
                                                setEditUser({ ...editUser, [e.target.name]: e.target.value })
                                            }}
                                            onBlur={(e) => callValidation(e, 'cnpj')}
                                            id='cnpj'
                                            type="text"
                                            name="cnpj"
                                            placeholder='CNPJ'
                                            defaultValue={cadastro.cnpj} />
                                        <span
                                            id='alert-cnpj'
                                            className='alert'
                                            hidden={true}>
                                            CNPJ informado não é valido!
                                        </span>
                                    </div>
                                )}

                                <div className="container-input">
                                    <label htmlFor="email">
                                        Email:
                                    </label>
                                    <input
                                        onChange={(e) => {
                                            formatarEmail(e)
                                            setEditUser({ ...editUser, [e.target.name]: e.target.value })
                                        }}
                                        onBlur={(e) => validateEmail(e)}
                                        type="text"
                                        name='email'
                                        id='email'
                                        placeholder='Email'
                                        defaultValue={cadastro.email} />
                                    <span
                                        id='alert-email'
                                        className='alert'
                                        hidden={true}>
                                        Email informado não é valido!
                                    </span>
                                </div>

                                <div className="container-input">
                                    <label htmlFor="telefone">
                                        Telefone:
                                    </label>
                                    <input
                                        onChange={(e) => {
                                            checkPhone(e)
                                            setEditUser({ ...editUser, [e.target.name]: e.target.value })
                                        }}
                                        id='telefone'
                                        type="text"
                                        name='telefone'
                                        placeholder='Telefone'
                                        defaultValue={cadastro.telefone} />
                                </div>

                                {cadastro.tipo === 'driver' && (
                                    <>
                                        <div className="container-input">
                                            <label htmlFor="modelo">
                                                Modelo:
                                            </label>
                                            <input
                                                onChange={(e) => setEditUser({ ...editUser, veiculo: { [e.target.name]: e.target.value } })}
                                                onBlur={(e) => handleChangeModeloCor(e)}
                                                id='modelo'
                                                type="text"
                                                name='modelo'
                                                placeholder='Modelo'
                                                defaultValue={cadastro.veiculo.modelo} />
                                            <span
                                                id='alert-modelo'
                                                className='alert'
                                                hidden={true}>
                                                PORFAVOR INSIRA MODELO E COR DO VEICULO EXEMPLO: ONIX PRETO*
                                            </span>
                                        </div>

                                        <div className="container-input">
                                            <label htmlFor="placa">
                                                Placa:
                                            </label>
                                            <input
                                                onChange={(e) => {
                                                    formatarPlaca(e)
                                                    setEditUser({ ...editUser, veiculo: { [e.target.name]: e.target.value } })
                                                }}
                                                onBlur={(e) => validarPlaca(e)}
                                                id='placa'
                                                type="text"
                                                name='placa'
                                                placeholder='Placa'
                                                defaultValue={cadastro.veiculo.placa} />
                                            <span
                                                id='alert-placa'
                                                className='alert'
                                                hidden={true}>
                                                Informe uma placa de veiculo valida!
                                            </span>
                                        </div>

                                        <div className="container-input">
                                            <label htmlFor="cep">
                                                CEP:
                                            </label>
                                            <input
                                                onChange={(e) => {
                                                    formatarCep(e)
                                                    setEditUser({ ...editUser, [e.target.name]: e.target.value })
                                                }}
                                                onBlur={(e) => buscarCep(e)}
                                                type="text"
                                                name="cep"
                                                id='cep'
                                                placeholder='CEP'
                                                defaultValue={cadastro.cep} />
                                        </div>
                                    </>
                                )}

                                {cadastro.tipo != 'frentista' && (
                                    <div className="container-input">
                                        <label htmlFor="endereco">
                                            Endereço:
                                        </label>
                                        <input
                                            onChange={(e) => setEditUser({ ...editUser, [e.target.name]: e.target.value })}
                                            type="text"
                                            id='endereco'
                                            name='endereco'
                                            placeholder='Endereco' defaultValue={cadastro.endereco} />
                                    </div>
                                )}

                                {cadastro.tipo === 'driver' && (
                                    <div className="container-input">
                                        <label htmlFor="numero">
                                            N°:
                                        </label>
                                        <input
                                            onChange={(e) => setEditUser({ ...editUser, [e.target.name]: e.target.value })}
                                            type="text"
                                            name="numero"
                                            placeholder='N°'
                                            defaultValue={cadastro.numero} />
                                    </div>
                                )}
                                <div className="container-input">
                                    <label htmlFor="cidade">
                                        Cidade:
                                    </label>
                                    <input
                                        onChange={(e) => setEditUser({ ...editUser, [e.target.name]: e.target.value })}
                                        type="text"
                                        name='cidade'
                                        id='cidade'
                                        placeholder='Cidade'
                                        defaultValue={cadastro.cidade} />
                                </div>

                                <div className="container-input">
                                    <label htmlFor="uf">
                                        UF:
                                    </label>
                                    <input
                                        onChange={(e) => {
                                            limitarCaracter(e)
                                            setEditUser({ ...editUser, [e.target.name]: e.target.value })
                                        }
                                        }
                                        id='uf'
                                        type="text"
                                        name='uf'
                                        placeholder='UF'
                                        defaultValue={cadastro.uf} />
                                </div>

                                <div className="container-input">
                                    <label htmlFor="created_at">
                                        Criado em:
                                    </label>
                                    <input
                                        id='created_at'
                                        type="text"
                                        name='created_at'
                                        placeholder='Criado em:'
                                        defaultValue={formatDate(cadastro.created_at)}
                                        disabled />
                                </div>
                            </div>

                            <div className='container-btns'>
                                <button
                                    onClick={() => editarCadastro()}
                                    id='btn-salvar'
                                    className='btn'>
                                    Salvar
                                </button>
                                {cadastro.ativo && (
                                    <button
                                        onClick={() => desativarCadastro()}
                                        id='btn-desativar'
                                        className='btn'>
                                        Desativar
                                    </button>
                                )}
                                {!cadastro.ativo && (
                                    <button
                                        onClick={() => ativarCadastro()}
                                        id='btn-ativar'
                                        className='btn'>
                                        Ativar
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {imageModal.view && (
                <div className="image-modal">
                    <div className="image-modal-container">
                        <div className='container-close-image-modal'>
                            <button onClick={() => setImageModal(false)}
                                className="btn-close-image-modal">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <img src={`https://aeotnew.s3.amazonaws.com/${imageModal.image}`} alt="foto-cadastro" className="image-cadastro" />
                    </div>
                </div>
            )}

            {/* MODAL PARA CONFIRMAR ALTERAÇÃO DA FOTO */}
            <div hidden className='container-modal-alert'>
                <div className='container-img-btns-text'>
                    <div className='container-alert-text'>
                        <p>Tem certeza que deseja trocar a foto?</p>
                    </div>

                    <img src="" alt="foto-user" className='foto-user' id='new-foto-user' />

                    <div className='container-btns-enviar-img'>
                        <button onClick={() => { changeFoto('edit_foto') }} className='btn-enviar-img btn-sim' type="button">Sim</button>
                        <button onClick={() => { cancelFoto() }} className='btn-enviar-img btn-nao' type="button">Não</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditarCadastro