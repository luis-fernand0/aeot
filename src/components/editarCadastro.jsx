import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Loading from './loading'
import ModalResponse from './modalResponse'

import { validarCnpj } from '../functions/validarCnpj'
import { maskCnpj } from '../functions/maskCnpj'
import { formatarEmail } from '../functions/formatarEmail'


import '../style/editarCadastro_component/editarCadastro.css'

const EditarCadastro = ({ showModal, close }) => {
    if (!showModal.view) {
        return
    }

    const tokenUser = localStorage.getItem('token')

    const [cadastro, setCadastro] = useState(showModal.cadastro)
    const [imageModal, setImageModal] = useState({ view: false, image: null })

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const [editUser, setEditUser] = useState({
        tipo: cadastro.tipo,
        cod_cadastro: cadastro.cod_driver || cadastro.cod_posto || cadastro.cod_frentista,
        cod_user_cadastro: cadastro.id
    })

    const [cnpjValid, setCnpjValid] = useState()
    function callValidation(e) {
        const cnpj = e.target.value

        if (!validarCnpj(cnpj)) {
            buscarCnpj(validarCnpj(cnpj))
            document.querySelector('.alert-cnpj').removeAttribute('hidden')
            return
        }

        document.querySelector('.alert-cnpj').setAttribute('hidden', true)
        setCnpjValid(true)
        buscarCnpj(cnpj)
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

    const [emailValid, setEmailValid] = useState()
    function validateEmail(e) {
        const email = e.target.value

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(String(email).toLowerCase())) {
            setEmailValid(false)
            document.querySelector('.alert-email').removeAttribute('hidden')
            return
        }

        setEmailValid(true)
        document.querySelector('.alert-email').setAttribute('hidden', true)

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
            setModalMessage(`Desculpe! Ocorreu um erro inesperado. Não foi possivel alterar o cadastro.` + err.message)
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

                        <div className='container-datas-cadastro'>
                            <div className='foto-cadastro'>
                                {cadastro.tipo != 'frentista' && (
                                    <img src={`https://aeotnew.s3.amazonaws.com/${cadastro.foto}`} alt="foto-perfil-cadastro" />
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
                                            onChange={(e) => setEditUser({ ...editUser, [e.target.name]: e.target.value })}
                                            id='cpf'
                                            type="text"
                                            name="cpf"
                                            placeholder='CPF'
                                            defaultValue={cadastro.cpf} />
                                    </div>
                                )}

                                {cadastro.tipo === 'posto' && (
                                    <div className="container-input">
                                        <label htmlFor="cnpj">
                                            CNPJ:
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                setEditUser({ ...editUser, [e.target.name]: e.target.value })
                                                maskCnpj(e)
                                            }
                                            }
                                            onBlur={(e) => callValidation(e)}
                                            id='cnpj'
                                            type="text"
                                            name="cnpj"
                                            placeholder='CNPJ'
                                            defaultValue={cadastro.cnpj} />
                                        <span className='alert alert-cnpj' hidden={true}>
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
                                        }
                                        }
                                        onBlur={(e) => validateEmail(e)}
                                        type="text"
                                        name='email'
                                        id='email'
                                        placeholder='Email'
                                        defaultValue={cadastro.email} />
                                    <span className='alert alert-email' hidden>
                                        Email informado não é valido!
                                    </span>
                                </div>

                                <div className="container-input">
                                    <label htmlFor="telefone">
                                        Telefone:
                                    </label>
                                    <input
                                        onChange={(e) => setEditUser({ ...editUser, [e.target.name]: e.target.value })}
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
                                                id='modelo'
                                                type="text"
                                                name='modelo'
                                                placeholder='Modelo'
                                                defaultValue={cadastro.veiculo.modelo} />
                                        </div>

                                        <div className="container-input">
                                            <label htmlFor="placa">
                                                Placa:
                                            </label>
                                            <input
                                                onChange={(e) => setEditUser({ ...editUser, veiculo: { [e.target.name]: e.target.value } })}
                                                id='placa'
                                                type="text"
                                                name='placa'
                                                placeholder='Placa'
                                                defaultValue={cadastro.veiculo.placa} />
                                        </div>

                                        <div className="container-input">
                                            <label htmlFor="cep">
                                                CEP:
                                            </label>
                                            <input
                                                onChange={(e) => setEditUser({ ...editUser, [e.target.name]: e.target.value })}
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
                                    className='btn btn-salvar'>
                                    Salvar
                                </button>

                                <button className='btn btn-desativar'>
                                    Desativar
                                </button>
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
        </>
    )
}

export default EditarCadastro