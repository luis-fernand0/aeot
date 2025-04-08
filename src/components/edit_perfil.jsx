import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import CriarBrinde from '../components/criarBrinde';
import AdicionarBrinde from './adicionarBrinde';

import { comprimirFoto } from '../functions/comprimirFoto';

import '../style/edit_perfil_page/edit_perfil.css'
import adicionarBrinde from './adicionarBrinde';

const urlData = import.meta.env.VITE_URL_DATAS_USER
const urlAtualizarFoto = import.meta.env.VITE_URL_ATUALIZAR_FOTO_USER

const EditPerfil = () => {
    const [user, setUser] = useState()
    const [newFoto, setNewFoto] = useState()
    const [options, setOptions] = useState()
    const [optionsBrinde, setOptionsBrinde] = useState()

    const navigate = useNavigate()

    const tokenUser = localStorage.getItem('token');

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
        const fileInput = document.getElementById(input)
        const file = fileInput.files[0]

        const formData = new FormData()
        formData.append('foto_user', file)

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
        document.querySelector('.modal-confirm').classList.add('modal-confirm-hidden')
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

            document.querySelector('.modal-confirm').classList.remove('modal-confirm-hidden')

            comprimirFoto('edit_foto')
        }

        return
    }
    function cancelFoto() {
        const inputFoto = document.getElementById('edit_foto')
        inputFoto.value = ''
        document.querySelector('.modal-confirm').classList.add('modal-confirm-hidden')
    }

    useEffect(() => {
        callUser()
    }, [newFoto])
    return (
        <>
            {/* <div className='container-datas-user'>
                <div className='container-icon'>
                    <Link to={'/home'}>
                        <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
                    </Link>
                </div>
                <div className='modal-confirm modal-confirm-hidden'>
                    <div className='container-imgs-btns-text'>
                        <div className='container-text'>
                            <p>Tem certeza que deseja trocar sua foto de perfil?</p>
                        </div>
                        <img src="" alt="foto-user" className='foto-user' id='new-foto-user' />

                        <div className='container-btns-enviar-img'>
                            <button onClick={() => { changeFoto('edit_foto') }} className='btn-enviar-img btn-sim' type="button">Sim</button>
                            <button onClick={() => { cancelFoto() }} className='btn-enviar-img btn-nao' type="button">Não</button>
                        </div>
                    </div>
                </div>
                {user && (
                    <>
                        <div className='container-div-foto-btn'>
                            <div className='container-foto-btn'>
                                <img src={`https://aeotnew.s3.amazonaws.com/${user.foto}`} alt="foto-user" className='foto-user' />

                                <div className='container-btn-edit-foto'>
                                    <input onChange={(e) => { checkFoto(e) }} type="file" className='input-edit-foto' id='edit_foto' name='foto' accept='image/*' />
                                    <button onClick={() => { anexarFoto('edit_foto') }} type="button" className='btn-edit-foto'>
                                        <FontAwesomeIcon className='pen-icon' icon={faPen} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div> */}

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
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default EditPerfil
