import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from "qrcode.react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'


import Header from "../components/header"
import '../style/perfil_user_page/perfil_user.css'

const urlData = import.meta.env.VITE_URL_DATAS_USER

const PerfilUser = () => {
    const abastecimento = JSON.parse(sessionStorage.getItem('dadosAbastecimento'))

    const [dataUser, setDataUser] = useState()

    const [dataPosto, setDataPosto] = useState(abastecimento.posto || {})
    const [dataAbastecimento, setDataAbastecimento] = useState(abastecimento || {})

    const [showQRCode, setShowQRCode] = useState(false) // Para exibir ou ocultar o QRCode
    const [qrCodeValue, setQrCodeValue] = useState("") // Valor do QRCode

    const navigate = useNavigate()

    const tokenUser = localStorage.getItem('token');

    async function callInfoUser() {
        const response = await fetch(`${urlData}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenUser}`,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (response.status === 403) {
            navigate('/', { replace: true })
        }

        setDataUser(data)
    }

    const generateQRCode = () => {
        // Criar um valor baseado nos dados do abastecimento
        const qrData = JSON.stringify({
            usuario: dataUser.full_name || "Desconhecido",
            veiculo: {
                modelo: dataUser.car_model,
                placa: dataUser.car_plate
            },
            posto: dataPosto[0].nome || "Desconhecido",
            tipo_combustivel: dataAbastecimento.tipo_combustivel || "Desconhecido",
            metodo_pagamento: dataAbastecimento.metodo_pagamento || "Desconhecido",
            forma_abastecimento: dataAbastecimento.forma_abastecimento,
            quantidade: dataAbastecimento.preco_ou_litro || "Desconhecido"
        });

        setQrCodeValue(qrData); // Define o valor do QR Code
        setShowQRCode(true); // Exibe o QR Code
    };

    useEffect(() => {
        callInfoUser()
        console.log(dataAbastecimento)
        console.log(abastecimento.posto)
    }, [])
    return (
        <>
            <div className="container-perfil">
                <Header redirectTo={'/home'} />

                {dataUser && (
                    <>
                        <div className="container-logo-title">
                            <div className="container-logo">
                                <img className="logo-aeot-perfil" src="/logo_AEOT.png" alt="aeot-logo" />
                            </div>
                        </div>
                        <div className="foto-user-datas">
                            <div className="foto-user-container">
                                <img className="foto-user" src={`https://aeotnew.s3.amazonaws.com/${dataUser.foto}`} alt="foto_user" />
                            </div>

                            <div className="data-user-perfil">
                                <p className="data-user">Nome:
                                    <span className="data-user-span"> {dataUser.full_name}</span>
                                </p>

                                <p className="data-user">Veiculo:
                                    <span className="data-user-span"> {dataUser.car_model}</span>
                                </p>

                                <p className="data-user">Placa:
                                    <span className="data-user-span"> {dataUser.car_plate}</span>
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {dataAbastecimento && (
                    <>
                        <div className="container-dados-abastecimento">
                            <div className="container-dados">

                                <h1 className="title-dados-abastecimento">
                                    Confirme os dados do abastecimento
                                </h1>

                                <div className="container-posto">
                                    <h2 className="title-container title-dados-posto">
                                        Dados do posto de combustivel
                                    </h2>

                                    <p className="text-container dado-posto-nome">
                                        {dataPosto[0].nome}
                                    </p>

                                    <div className="container-img-posto">
                                        <img
                                            className="img-posto"
                                            src={`https://aeotnew.s3.amazonaws.com/${dataPosto[0].foto}`}
                                            alt="foto_posto" />
                                    </div>

                                    <p className="text-container dado-posto-endereco">
                                        {dataPosto[0].endereco}
                                    </p>

                                    <p className="text-container dado-posto-combustivel">
                                        {dataAbastecimento.tipo_combustivel}:
                                        R$ {dataPosto[0][dataAbastecimento.tipo_combustivel]}
                                    </p>
                                </div>

                                <div className="container-abastecimento">
                                    <h2 className="title-container title-abastecimento">
                                        Abastecimento
                                    </h2>

                                    <div className="container-sobre-abastecimento">
                                        <p className="text-container abastecimento-tipo-combustivel">
                                            Tipo de combustivel: {dataAbastecimento.tipo_combustivel}
                                        </p>

                                        <p className="text-container abastecimento-forma-abastecimento">
                                            Vai abastecer por: {dataAbastecimento.forma_abastecimento}
                                        </p>

                                        <p className="text-container abastecimento-metodo-pagamento">
                                            Metodo de Pagamento: {dataAbastecimento.metodo_pagamento}
                                        </p>

                                        <p className="text-container abastecimento-preco-ou-litro">
                                            Quantidade que vai abastecer:
                                            {dataAbastecimento.forma_abastecimento != 'preco' ?
                                                ` ${dataAbastecimento.preco_ou_litro} Litros` :
                                                ` R$ ${dataAbastecimento.preco_ou_litro}`}
                                        </p>
                                    </div>
                                </div>

                                <button className="btn-criar-qrcode" onClick={() => { generateQRCode() }}>
                                    Gerar QRCode de Abastecimento!
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {showQRCode && (
                    <div className="qrcode-container">
                        <div className="qrcode-btn-close-container">
                            <div className="container-btn-close">
                                <button
                                    onClick={() => { setShowQRCode(false) }}
                                    className="btn-close">
                                    <FontAwesomeIcon className="x-icon" icon={faXmark} />
                                </button>
                            </div>
                            <div className="qrcode">
                                <QRCodeCanvas value={qrCodeValue} size={256} />
                                <p>
                                    <span>*Mostre o QRCode para o frentista*</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default PerfilUser
