import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import { comprimirFoto } from '../functions/comprimirFoto'

import Loading from './loading'
import ModalResponse from './modalResponse'

import '../style/edit_perfil_page/edit_perfil.css'

const urlData = import.meta.env.VITE_URL_DATAS_USER
const urlAtualizarFoto = import.meta.env.VITE_URL_ATUALIZAR_FOTO_USER

const EditPerfil = () => {
    const navigate = useNavigate()

    const tokenUser = localStorage.getItem('token');
    const typeUser = localStorage.getItem('type_user');

    const [user, setUser] = useState()
    const [newFoto, setNewFoto] = useState()

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    async function callUser() {
        const response = await fetch(urlData, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenUser}`,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (response.status === 401) {
            navigate('/', { replace: true })
        }
        setUser(data)
    }

    async function changeFoto(input) {
        setLoading(true)
        try {
            const fileInput = document.getElementById(input)
            const file = fileInput.files[0]

            const formData = new FormData()
            if (typeUser === 'driver' || typeUser === 'administrador') {
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

            setNewFoto(file)
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

    useEffect(() => {
        callUser()
    }, [newFoto])
    return (
        <>
            <Loading loading={loading} />
            <ModalResponse
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}/>
            <div className='container-datas'>
                <div className='container-btn-voltar'>
                    <Link to={'/home'}>
                        <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
                    </Link>
                </div>

                <div className='container-datas-user'>
                    {user && (
                        <>
                            <div className='container-foto-user'>
                                <img src={`https://aeotnew.s3.amazonaws.com/${user.foto}`} alt="foto-user" className='foto-user' />

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
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* MODAL PARA CONFIRMAR ALTERAÇÃO DA FOTO */}
            <div hidden className='container-modal-alert'>
                <div className='container-img-btns-text'>
                    <div className='container-alert-text'>
                        <p>Tem certeza que deseja trocar sua foto de perfil?</p>
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

export default EditPerfil
