import React, { useState, useEffect } from 'react';

import '../style/new_driver_page/new_driver.css'

const url = import.meta.env.VITE_URL_DATAS_USER_PENDENTES
const urlAtualizar = import.meta.env.VITE_URL_APROVAR_USER

const NewDrivers = () => {
    const [infoDrivers, setInfoDrivers] = useState()
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [driverDetails, setDriverDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

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

    async function callUser() {
        const response = await fetch(url)
        const data = await response.json()
        setInfoDrivers(data)
        setCont(infoDrivers.length)
    }

    async function aprovarCadastro(aprovado, email) {
        const response = await fetch(urlAtualizar, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'aprovado': aprovado, 'email': email})
        })
    }

    useEffect(() => {
        callUser()
    }, [])

    return (
        <div className="container-cadastros">
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
                                            <p>{driver.full_name}</p>
                                        </td>
                                        <td>
                                            <p>Email</p>
                                            <p>{driver.email}</p>
                                        </td>
                                        <td>
                                            <p>Telefone</p>
                                            <p>{driver.phone}</p>
                                        </td>
                                        <td>
                                            <p>Carro</p>
                                            <p>{driver.car_model}</p>
                                        </td>
                                        <td>
                                            <p>Placa</p>
                                            <p>{driver.car_plate}</p>
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
                                <strong>Nome:</strong> {driverDetails.full_name}<br />
                                <strong>Email:</strong> {driverDetails.email}<br />
                                <strong>Telefone:</strong> {driverDetails.phone}<br />
                                <strong>Carro:</strong> {driverDetails.car_model}<br />
                                <strong>Placa:</strong> {driverDetails.car_plate}
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
                                    <button onClick={() => handleImageClick(driverDetails.fotocnh)}>
                                        Foto da CNH:
                                    </button>
                                </div>
                                <div className="driver-image">
                                    <button onClick={() => handleImageClick(driverDetails.printappmobi)}>
                                        Print do APP:
                                    </button>
                                </div>
                            </div>

                            <div className='div-btn-newdriver'>
                                <button onClick={ () => {aprovarCadastro(true, driverDetails.email)} } className="btn-response-newdriver btn-response-newdriver-yes">
                                    Aprovado!
                                </button>
                                <button onClick={ () => {aprovarCadastro(false)} } className="btn-response-newdriver btn-response-newdriver-no">
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
                        <img src={selectedImage} alt="Imagem ampliada" className="image-modal-view" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewDrivers;