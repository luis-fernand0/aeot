import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import '../style/editarCadastro_component/editarCadastro.css'
import { useState } from 'react'

const EditarCadastro = ({ showModal, close }) => {
    if (!showModal.view) {
        return
    }

    const [cadastro, setCadastro] = useState(showModal.cadastro)
    const [imageModal, setImageModal] = useState({ view: false, image: null })
    function formatDate(data) {
        const date = new Date(data);

        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        let horaMinuto = new Date(data).toTimeString().split(':').slice(0, 2).join(':')

        let dataCompleta = `${dia}/${mes}/${ano} - ${horaMinuto}`

        return dataCompleta
    }

    formatDate(cadastro.created_at)

    return (
        <>
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
                                            id='cpf'
                                            type="text"
                                            name="cpf"
                                            placeholder='CPF'
                                            defaultValue={cadastro.cpf} />
                                    </div>
                                )}

                                <div className="container-input">
                                    <label htmlFor="email">
                                        Email:
                                    </label>
                                    <input
                                        type="text"
                                        name='email'
                                        id='email'
                                        placeholder='Email'
                                        defaultValue={cadastro.email} />
                                </div>

                                <div className="container-input">
                                    <label htmlFor="senha">
                                        Senha:
                                    </label>
                                    <input
                                        id='senha'
                                        type="password"
                                        name='pass'
                                        placeholder='Senha' />
                                </div>

                                <div className="container-input">
                                    <label htmlFor="telefone">
                                        Telefone:
                                    </label>
                                    <input
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
                                        <input type="text"
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