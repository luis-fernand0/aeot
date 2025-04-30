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
                                <input
                                    type="text"
                                    name='nome'
                                    placeholder='Nome'
                                    defaultValue={cadastro.nome} />
                                {cadastro.tipo === 'driver' && (
                                    <input
                                        type="text"
                                        name="cpf"
                                        placeholder='CPF'
                                        defaultValue={cadastro.cpf} />
                                )}

                                <input
                                    type="text"
                                    name='email'
                                    placeholder='Email'
                                    defaultValue={cadastro.email} />

                                <input
                                    type="password"
                                    name='pass'
                                    placeholder='Senha' />

                                <input
                                    type="text"
                                    name='telefone'
                                    placeholder='Telefone'
                                    defaultValue={cadastro.telefone} />

                                {cadastro.tipo === 'driver' && (
                                    <>
                                        <input
                                            type="text"
                                            name='modelo'
                                            placeholder='Modelo'
                                            defaultValue={cadastro.veiculo.modelo} />

                                        <input
                                            type="text"
                                            name='placa'
                                            placeholder='Placa'
                                            defaultValue={cadastro.veiculo.placa} />

                                        <input
                                            type="text"
                                            name="cep"
                                            placeholder='CEP'
                                            defaultValue={cadastro.cep} />
                                    </>
                                )}

                                {cadastro.tipo != 'frentista' && (
                                    <input
                                        type="text"
                                        name='endereco'
                                        placeholder='Endereco' defaultValue={cadastro.endereco} />
                                )}

                                {cadastro.tipo === 'driver' && (
                                    <input type="text"
                                        name="numero"
                                        placeholder='N°'
                                        defaultValue={cadastro.numero} />
                                )}

                                <input
                                    type="text"
                                    name='cidade'
                                    placeholder='Cidade'
                                    defaultValue={cadastro.cidade} />

                                <input
                                    type="text"
                                    name='uf'
                                    placeholder='UF'
                                    defaultValue={cadastro.uf} />

                                <input
                                    type="text"
                                    name='created_at'
                                    placeholder='Criado em:'
                                    defaultValue={cadastro.created_at} />
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