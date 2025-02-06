import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import '../style/new_driver_page/new_driver.css'

const url = import.meta.env.VITE_URL_DATAS_USER_PENDENTES
const urlAtualizar = import.meta.env.VITE_URL_APROVAR_USER

const NewDrivers = () => {
    const [infoDrivers, setInfoDrivers] = useState()
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [driverDetails, setDriverDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const navigate = useNavigate()

    const tokenUser = localStorage.getItem('token');

    const handleOpenModal = (driver) => {
        setDriverDetails(driver);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
    };

    async function callUsers() {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenUser}`,
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 403) {
            navigate('/home', { replace: true })
        }
        const data = await response.json()
        setInfoDrivers(data)
    }

    async function aprovarCadastro(aprovado, email) {
        const response = await fetch(urlAtualizar, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'aprovado': aprovado, 'email': email })
        })
        callUsers()
        handleCloseModal()
    }

    useEffect(() => {
        callUsers()
    }, [])

    return (
        <div className="container-cadastros">
            <div className='container-arrow-icon'>
                <Link to={'/adicionar_cadastros'}>
                    <FontAwesomeIcon className='arrow-icon' icon={faChevronLeft} />
                </Link>
            </div>

            <h1 className="title-cadastro-pendentes">Cadastros Pendentes</h1>

            <div className="container-ul-cadastros">
                <ul className="new-drivers-list">
                    {infoDrivers && infoDrivers.map(driver => (
                        <li key={driver.cod_driver} className="new-driver">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p>Nome</p>
                                            <p>{driver.nome}</p>
                                        </td>
                                        <td>
                                            <p>Email</p>
                                            <p>{driver.email}</p>
                                        </td>
                                        <td>
                                            <p>Telefone</p>
                                            <p>{driver.telefone}</p>
                                        </td>
                                        <td>
                                            <p>Carro</p>
                                            <p>{driver.modelo}</p>
                                        </td>
                                        <td>
                                            <p>Placa</p>
                                            <p>{driver.placa}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button onClick={() => handleOpenModal(driver)} type="button">Ver mais detalhes!</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal de Detalhes do Motorista */}
            {showModal && (
                <div className="container-response-newdriver">
                    <div className="container-info-newdriver">
                        <div className="div-close-modal-response-newdriver">
                            <button onClick={handleCloseModal} className="btn-close-modal-response-newdriver">
                                X
                            </button>
                        </div>
                        <div className="container-text-newdriver">
                            <p className="response-text-newdriver">
                                <strong>Nome:</strong> {driverDetails.nome}<br />
                                <strong>Email:</strong> {driverDetails.email}<br />
                                <strong>Telefone:</strong> {driverDetails.telefone}<br />
                                <strong>Carro:</strong> {driverDetails.modelo}<br />
                                <strong>Placa:</strong> {driverDetails.placa}
                            </p>

                            {/* Exibindo as imagens com clique para ampliar */}
                            <div className="driver-images">
                                <h3>Imagens:</h3>
                                <div className="driver-image">
                                    <button onClick={() => handleImageClick(driverDetails.foto)}>
                                        Foto do Motorista:
                                    </button>
                                </div>
                                <div className="driver-image">
                                    <button onClick={() => handleImageClick(driverDetails.cnh)}>
                                        Foto da CNH:
                                    </button>
                                </div>
                                <div className="driver-image">
                                    <button onClick={() => handleImageClick(driverDetails.print_app)}>
                                        Print do APP:
                                    </button>
                                </div>
                            </div>

                            <div className='div-btn-newdriver'>
                                <button onClick={() => { aprovarCadastro(true, driverDetails.email) }} className="btn-response-newdriver btn-response-newdriver-yes">
                                    Aprovado!
                                </button>
                                <button onClick={() => { aprovarCadastro(false, driverDetails.email) }} className="btn-response-newdriver btn-response-newdriver-no">
                                    Negado!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Visualização Ampliada da Imagem */}
            {showImageModal && (
                <div className="container-image-modal">
                    <div className="image-modal-content">
                        <button onClick={handleCloseImageModal} className="btn-close-image-modal">X</button>
                        <img src={`https://aeotnew.s3.amazonaws.com/${selectedImage}`} alt="Imagem ampliada" className="image-modal-view" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewDrivers;